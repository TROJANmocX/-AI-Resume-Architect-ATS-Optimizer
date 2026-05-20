import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import puppeteer from 'puppeteer';
import Stripe from 'stripe';
import dbConnect from './database/mongodb';
import Resume from './database/models/Resume';
import User from './database/models/User';
import Template from './database/models/Template';
const { PDFParse } = require('pdf-parse');
import { analyzeJobDescriptionWithGemini, rewriteBulletWithGemini, importResumeWithGemini, analyzeATSWithGemini, rewriteBulletWithGeminiAdvanced, tailorResumeWithGemini, extractResumeWithGemini, generateOutreachWithGemini } from './lib/gemini';
import { analyzeJobDescription as analyzeWithOpenAI, rewriteResumeBullet as rewriteWithOpenAI } from './lib/openai';
import { isDbConnected, fallbackRegister, fallbackLogin, fallbackGetUser, fallbackSaveResume, fallbackGetTemplates, fallbackRegisterTemplate } from './database/fallbackDb';

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// ── Stripe initialisation ────────────────────────────────────────────────────
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-01-27.acacia' as any,
});
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// ── Raw-body parser MUST come before express.json() for Stripe webhooks ──────
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB
dbConnect().catch(err => console.error('Failed to connect to MongoDB:', err));

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Extract and verify the JWT from an Authorization header. Returns the decoded payload or null. */
function verifyToken(req: express.Request): { userId: string; email: string } | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  try {
    const token = authHeader.split(' ')[1];
    return jwt.verify(token, JWT_SECRET) as any;
  } catch {
    return null;
  }
}

// ── Auth Routes ───────────────────────────────────────────────────────────────

// Register a new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if database is connected. If not, use fallback JSON DB.
    if (!isDbConnected()) {
      console.warn('[Fallback DB] MongoDB not connected. Registering user via local JSON fallback...');
      try {
        const data = await fallbackRegister(req.body);
        return res.status(201).json({
          success: true,
          ...data
        });
      } catch (err: any) {
        return res.status(400).json({ error: err.message || 'Registration failed' });
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const user = await User.create({ name, email, password });
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, subscriptionStatus: user.subscriptionStatus },
    });
  } catch (error: any) {
    console.error('Register error:', error);
    return res.status(500).json({ error: error.message || 'Registration failed' });
  }
});

// Login an existing user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if database is connected. If not, use fallback JSON DB.
    if (!isDbConnected()) {
      console.warn('[Fallback DB] MongoDB not connected. Authenticating user via local JSON fallback...');
      try {
        const data = await fallbackLogin(req.body);
        return res.json({
          success: true,
          ...data
        });
      } catch (err: any) {
        return res.status(401).json({ error: err.message || 'Invalid email or password' });
      }
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, subscriptionStatus: user.subscriptionStatus },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ error: error.message || 'Login failed' });
  }
});

// Get current user from token
app.get('/api/auth/me', async (req, res) => {
  try {
    const decoded = verifyToken(req);
    if (!decoded) return res.status(401).json({ error: 'Not authenticated' });

    // Check if database is connected. If not, use fallback JSON DB.
    if (!isDbConnected()) {
      try {
        const user = await fallbackGetUser(decoded.userId);
        return res.json({ user });
      } catch {
        return res.status(404).json({ error: 'User not found' });
      }
    }

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscriptionStatus: user.subscriptionStatus,
      },
    });
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

// ── Stripe Routes ─────────────────────────────────────────────────────────────

/**
 * POST /api/stripe/create-checkout-session
 * Creates a Stripe Checkout session for the given priceId and returns the hosted URL.
 * Requires a valid JWT Bearer token.
 */
app.post('/api/stripe/create-checkout-session', async (req, res) => {
  try {
    const decoded = verifyToken(req);
    if (!decoded) return res.status(401).json({ error: 'Not authenticated' });

    const { priceId } = req.body;
    if (!priceId) return res.status(400).json({ error: 'priceId is required' });

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Create or reuse a Stripe Customer record
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: String(user._id) },
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    // Build the Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${APP_URL}/checkout/status?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/checkout/status?canceled=true`,
      metadata: { userId: String(user._id) },
      subscription_data: { metadata: { userId: String(user._id) } },
    });

    return res.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout session error:', error);
    return res.status(500).json({ error: error.message || 'Failed to create checkout session' });
  }
});

/**
 * POST /api/stripe/webhook
 * Stripe sends signed events here after payment actions.
 * express.raw() is applied to this route (above) so the body is kept as a Buffer
 * for signature verification.
 */
app.post('/api/stripe/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;

  let event: any;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {

      // Checkout completed → subscription just created
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const userId = session.metadata?.userId;
        if (!userId || !session.subscription) break;

        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        await User.findByIdAndUpdate(userId, {
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0].price.id,
          subscriptionStatus: subscription.status,
        });
        console.log(`[Webhook] checkout.session.completed — userId=${userId}, status=${subscription.status}`);
        break;
      }

      // Subscription renewed / plan changed / payment failed
      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        const userId = subscription.metadata?.userId;
        if (!userId) break;

        await User.findByIdAndUpdate(userId, {
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0].price.id,
          subscriptionStatus: subscription.status,
        });
        console.log(`[Webhook] customer.subscription.updated — userId=${userId}, status=${subscription.status}`);
        break;
      }

      // Subscription cancelled
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        const userId = subscription.metadata?.userId;
        if (!userId) break;

        await User.findByIdAndUpdate(userId, {
          subscriptionStatus: 'canceled',
          stripeSubscriptionId: null,
          stripePriceId: null,
        });
        console.log(`[Webhook] customer.subscription.deleted — userId=${userId}`);
        break;
      }

      // Invoice payment failed
      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        const customerId = invoice.customer as string;
        const user = await User.findOne({ stripeCustomerId: customerId });
        if (!user) break;
        await User.findByIdAndUpdate(user._id, { subscriptionStatus: 'past_due' });
        console.log(`[Webhook] invoice.payment_failed — customerId=${customerId}`);
        break;
      }

      default:
        break; // All other events → 200 OK, no action
    }

    return res.json({ received: true });
  } catch (error: any) {
    console.error('Webhook handler error:', error);
    return res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// ── AI / Resume Routes ────────────────────────────────────────────────────────

// 1. Analyze Job Description
app.post('/api/analyze', async (req, res) => {
  try {
    const { jdText } = req.body;
    if (!jdText) return res.status(400).json({ error: 'Job description text is required' });

    if (process.env.GEMINI_API_KEY) {
      return res.json(await analyzeJobDescriptionWithGemini(jdText));
    } else if (process.env.OPENAI_API_KEY) {
      return res.json(await analyzeWithOpenAI(jdText));
    } else {
      return res.status(500).json({ error: 'No AI API keys configured' });
    }
  } catch (error) {
    console.error('JD Analysis error:', error);
    return res.status(500).json({ error: 'Failed to analyze job description' });
  }
});

// 2. Rewrite Bullet Point
app.post('/api/rewrite', async (req, res) => {
  try {
    const { bulletPoint, targetKeywords } = req.body;
    if (!bulletPoint || !targetKeywords) {
      return res.status(400).json({ error: 'Bullet point and target keywords are required' });
    }

    if (process.env.GEMINI_API_KEY) {
      return res.json(await rewriteBulletWithGemini(bulletPoint, targetKeywords));
    } else if (process.env.OPENAI_API_KEY) {
      return res.json(await rewriteWithOpenAI(bulletPoint, targetKeywords));
    } else {
      return res.status(500).json({ error: 'No AI API keys configured' });
    }
  } catch (error) {
    console.error('Rewrite error:', error);
    return res.status(500).json({ error: 'Failed to rewrite resume bullet' });
  }
});

// ── NEW AI STRATEGY ROUTERS ──────────────────────────────────────────────────

// 1. ATS Score & Keyword Gap Analysis
app.post('/api/ai/ats-analyze', async (req, res) => {
  try {
    const { resume_text, job_description } = req.body;
    if (!resume_text || !job_description) {
      return res.status(400).json({ error: 'Both resume_text and job_description are required' });
    }
    const analysis = await analyzeATSWithGemini(resume_text, job_description);
    return res.json(analysis);
  } catch (error: any) {
    console.error('ATS Analysis error:', error);
    return res.status(500).json({ error: error.message || 'Failed to analyze ATS alignment' });
  }
});

// 2. AI Resume Bullet Rewriter
app.post('/api/ai/bullet-rewrite', async (req, res) => {
  try {
    const { original_bullet, target_role, target_industry, missing_keywords } = req.body;
    if (!original_bullet) {
      return res.status(400).json({ error: 'original_bullet is required' });
    }
    const result = await rewriteBulletWithGeminiAdvanced(original_bullet, target_role || '', target_industry || '', missing_keywords || []);
    return res.json(result);
  } catch (error: any) {
    console.error('Bullet rewrite error:', error);
    return res.status(500).json({ error: error.message || 'Failed to rewrite bullet point' });
  }
});

// 3. Resume Tailoring Engine (A/B Resume Manager)
app.post('/api/ai/tailor', async (req, res) => {
  try {
    const { master_resume, job_description, version_label } = req.body;
    if (!master_resume || !job_description) {
      return res.status(400).json({ error: 'Both master_resume and job_description are required' });
    }
    const tailored = await tailorResumeWithGemini(master_resume, job_description, version_label || 'Tailored Version');
    return res.json(tailored);
  } catch (error: any) {
    console.error('Tailor error:', error);
    return res.status(500).json({ error: error.message || 'Failed to tailor resume' });
  }
});

// 4. PDF / LinkedIn Resume Extractor
app.post('/api/ai/extract', async (req, res) => {
  try {
    const { raw_text, source_type } = req.body;
    if (!raw_text) {
      return res.status(400).json({ error: 'raw_text is required' });
    }
    const extracted = await extractResumeWithGemini(raw_text, source_type || 'pdf');
    return res.json(extracted);
  } catch (error: any) {
    console.error('Extraction error:', error);
    return res.status(500).json({ error: error.message || 'Failed to extract resume data' });
  }
});

// 5. Cover Letter & LinkedIn Outreach Generator
app.post('/api/ai/outreach', async (req, res) => {
  try {
    const { resume_summary, key_achievements, job_description, company_name, role_title, hiring_manager_name, tone } = req.body;
    if (!resume_summary || !job_description) {
      return res.status(400).json({ error: 'Both resume_summary and job_description are required' });
    }
    const result = await generateOutreachWithGemini(
      resume_summary,
      key_achievements || [],
      job_description,
      company_name || '',
      role_title || '',
      hiring_manager_name || '',
      tone || 'professional'
    );
    return res.json(result);
  } catch (error: any) {
    console.error('Outreach generation error:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate outreach materials' });
  }
});

// Helper builders for PDF layout rendering
const getSkillsLine = (data: any) => {
  const tech = (data?.skills || []).map((s: any) => typeof s === 'string' ? s : (s?.name || '')).filter(Boolean).join(', ');
  const lang = (data?.languages || []).map((s: any) => typeof s === 'string' ? s : (s?.name || '')).filter(Boolean).join(', ');
  return [tech, lang].filter(Boolean).join(' • ');
};

const getSkillsPillsHtml = (data: any) => {
  const all = [
    ...(data?.skills || []).map((s: any) => typeof s === 'string' ? s : (s?.name || '')),
    ...(data?.languages || []).map((s: any) => typeof s === 'string' ? s : (s?.name || ''))
  ].filter(Boolean);
  return all.map(s => `<span class="skill-pill">${s}</span>`).join('');
};

const getContactLine = (data: any) => {
  return [data?.basic?.email, data?.basic?.phone, data?.basic?.location].filter(Boolean).join(' | ');
};

function getTemplateHtml(data: any, templateId: number) {
  const skillsLine = getSkillsLine(data);
  const contactLine = getContactLine(data);
  const skillsPills = getSkillsPillsHtml(data);

  const formatBullets = (bullets: string[]) => {
    if (!bullets || !bullets.length) return '';
    return bullets.map(b => `<li>${b}</li>`).join('');
  };

  const experienceHtml = (data.experience || []).map((exp: any) => `
    <div style="margin-bottom: 8px;">
      <div style="display: flex; justify-content: space-between; align-items: baseline;">
        <span class="entry-title-r" style="font-weight: 700;">${exp.title || ''}${exp.company ? ', ' + exp.company : ''}</span>
        <span class="entry-sub">${exp.date || ''}</span>
      </div>
      <ul>${formatBullets(exp.bullets)}</ul>
    </div>
  `).join('');

  const academicsHtml = (data.academics || []).map((edu: any) => `
    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
      <div>
        <span class="entry-title-r" style="font-weight: 700;">${edu.degree || edu.detail || ''}</span>
        <br />
        <span class="entry-sub">${edu.school || edu.name || ''}</span>
      </div>
      <span class="entry-sub">${edu.year || edu.date || ''}</span>
    </div>
  `).join('');

  const projectsHtml = (data.projects || []).map((p: any) => `
    <div style="margin-bottom: 6px;">
      <div style="display: flex; justify-content: space-between; align-items: baseline;">
        <span class="entry-title-r" style="font-weight: 700;">${p.name}</span>
        <span class="entry-sub">${p.date || ''}</span>
      </div>
      <div class="entry-sub" style="font-size: 10.5px;">${p.detail || p.description || ''}</div>
    </div>
  `).join('');

  if (templateId === 0) {
    return `
      <div class="resume-t1">
        <div class="rh">
          <h1>${data.basic?.name || 'Your Name'}</h1>
          <div class="contact">
            ${data.experience?.[0]?.title || 'Job Title'} &nbsp;|&nbsp; ${contactLine}
          </div>
        </div>
        <div class="rs">
          ${data.basic?.summary ? `<h2>Professional Summary</h2><p>${data.basic.summary}</p>` : ''}
          ${data.experience?.length ? `<h2>Experience</h2>${experienceHtml}` : ''}
          ${data.academics?.length ? `<h2>Education</h2>${academicsHtml}` : ''}
          ${skillsLine ? `<h2>Skills</h2><p>${skillsLine}</p>` : ''}
          ${data.projects?.length ? `<h2>Projects</h2>${projectsHtml}` : ''}
        </div>
      </div>
    `;
  } else if (templateId === 1) {
    return `
      <div class="resume-t2">
        <div class="rh">
          <h1>${data.basic?.name || 'Your Name'}</h1>
          <div class="contact">
            ${data.experience?.[0]?.title || 'Job Title'} &nbsp;&middot;&nbsp; ${contactLine}
          </div>
        </div>
        <div class="rs">
          ${data.basic?.summary ? `<h2>Summary</h2><p style="font-size: 11px;">${data.basic.summary}</p>` : ''}
          ${data.experience?.length ? `<h2>Experience</h2>${experienceHtml}` : ''}
          ${data.academics?.length ? `<h2>Education</h2>${academicsHtml}` : ''}
          ${skillsLine ? `<h2>Core Skills</h2><p style="font-size: 11px;">${skillsLine}</p>` : ''}
          ${data.projects?.length ? `<h2>Projects</h2>${projectsHtml}` : ''}
        </div>
      </div>
    `;
  } else if (templateId === 2) {
    const sidebarHtml = `
      <div class="r-left">
        <div style="margin-bottom: 12px;">
          <div style="font-size: 18px; font-weight: 700; line-height: 1.2;">${data.basic?.name || 'Your Name'}</div>
          <div style="font-size: 10.5px; color: #555; margin-top: 3px;">${data.experience?.[0]?.title || 'Job Title'}</div>
        </div>
        <div class="sl-h">Contact</div>
        <div style="font-size: 9.5px; color: #555; line-height: 1.6;">
          ${data.basic?.email ? `<div>${data.basic.email}</div>` : ''}
          ${data.basic?.phone ? `<div>${data.basic.phone}</div>` : ''}
          ${data.basic?.location ? `<div>${data.basic.location}</div>` : ''}
        </div>
        ${skillsPills ? `<div class="sl-h">Skills</div><div>${skillsPills}</div>` : ''}
        ${data.basic?.summary ? `<div class="sl-h">Summary</div><div style="font-size: 9.5px; color: #444; line-height: 1.5;">${data.basic.summary}</div>` : ''}
      </div>
    `;

    return `
      <div class="resume-t3">
        ${sidebarHtml}
        <div class="r-right">
          <div class="rs">
            ${data.experience?.length ? `<h2>Experience</h2>${experienceHtml}` : ''}
            ${data.academics?.length ? `<h2>Education</h2>${academicsHtml}` : ''}
            ${data.projects?.length ? `<h2>Projects</h2>${projectsHtml}` : ''}
          </div>
        </div>
      </div>
    `;
  } else if (templateId === 3) {
    const expEdHtml = (data.experience || []).map((exp: any) => `
      <div class="entry">
        <div class="entry-header">
          <span class="entry-title">${exp.title || ''}${exp.company ? `<span class="company-name"> | ${exp.company}</span>` : ''}</span>
          <span class="entry-date">${exp.date || ''}</span>
        </div>
        ${exp.location ? `<div class="entry-location">${exp.location}</div>` : ''}
        <ul>${formatBullets(exp.bullets)}</ul>
      </div>
    `).join('');

    const eduEdHtml = (data.academics || []).map((edu: any) => `
      <div class="entry education-entry">
        <div class="entry-header">
          <span class="entry-title">${edu.school || edu.name || ''}</span>
          <span class="entry-date">${edu.year || edu.date || ''}</span>
        </div>
        <div class="degree-info">
          ${edu.degree || edu.detail || ''} ${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}
        </div>
      </div>
    `).join('');

    const projEdHtml = (data.projects || []).map((p: any) => `
      <div class="entry">
        <div class="entry-header">
          <span class="entry-title">${p.name}</span>
          <span class="entry-date">${p.date || ''}</span>
        </div>
        <div class="project-detail">${p.detail || p.description || ''}</div>
      </div>
    `).join('');

    return `
      <div class="resume-t4">
        <div class="rh">
          <h1>${data.basic?.name || 'Your Name'}</h1>
          <div class="contact">${contactLine}</div>
        </div>
        <div class="rs">
          ${data.basic?.summary ? `
            <div class="section-title">
              <h2>Professional Summary</h2>
              <div class="title-line"></div>
            </div>
            <p class="summary-text">${data.basic.summary}</p>
          ` : ''}
          
          ${data.experience?.length ? `
            <div class="section-title">
              <h2>Experience</h2>
              <div class="title-line"></div>
            </div>
            ${expEdHtml}
          ` : ''}

          ${data.academics?.length ? `
            <div class="section-title">
              <h2>Education</h2>
              <div class="title-line"></div>
            </div>
            ${eduEdHtml}
          ` : ''}

          ${skillsLine ? `
            <div class="section-title">
              <h2>Core Competencies</h2>
              <div class="title-line"></div>
            </div>
            <p class="skills-text">${skillsLine}</p>
          ` : ''}

          ${data.projects?.length ? `
            <div class="section-title">
              <h2>Selected Projects</h2>
              <div class="title-line"></div>
            </div>
            ${projEdHtml}
          ` : ''}
        </div>
      </div>
    `;
  }
  return '';
}

// 3. Generate PDF
app.post('/api/pdf', async (req, res) => {
  try {
    const { resume, templateId } = req.body;
    // Adapt to cases where client sends resume directly as request body root
    const data = resume || req.body;
    const activeTemplate = typeof templateId === 'number' ? templateId : 0;

    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    const page = await browser.newPage();

    const resumeContent = getTemplateHtml(data, activeTemplate);

    await page.setContent(`
      <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              background: #ffffff;
              color: #111111;
              font-size: 11px;
              line-height: 1.45;
              width: 794px;
              height: 1123px;
              position: relative;
              overflow: hidden;
            }
            
            .a4-container {
              width: 794px;
              height: 1123px;
              padding: ${activeTemplate === 2 ? '0px' : '56px 64px'};
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              overflow: hidden;
            }

            /* Template 1: Classic Pro */
            .resume-t1 { font-family: 'Georgia', serif; }
            .resume-t1 .rh { border-bottom: 2px solid #111; padding-bottom: 6px; margin-bottom: 10px; text-align: center; }
            .resume-t1 .rh h1 { font-size: 22px; font-weight: 700; letter-spacing: -0.5px; margin: 0; text-transform: uppercase; }
            .resume-t1 .rh .contact { font-size: 10.5px; margin-top: 4px; color: #444; }
            .resume-t1 .rs h2 { font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #bbb; padding-bottom: 2px; margin: 12px 0 5px; }
            .resume-t1 .rs .entry-title-r { font-weight: 700; }
            .resume-t1 .rs .entry-sub { color: #555; font-size: 10.5px; }
            .resume-t1 .rs ul { padding-left: 14px; margin-top: 3px; }
            .resume-t1 .rs ul li { margin-bottom: 1px; }

            /* Template 2: Modern Executive */
            .resume-t2 { font-family: 'Inter', sans-serif; }
            .resume-t2 .rh { background: #1a2e3d; color: #fff; padding: 20px 24px; margin: -56px -64px 15px; }
            .resume-t2 .rh h1 { font-size: 20px; font-weight: 700; margin: 0; color: #fff !important; text-transform: uppercase; letter-spacing: 0.5px; }
            .resume-t2 .rh .contact { font-size: 10.5px; margin-top: 4px; color: #9bb5c8; }
            .resume-t2 .rs h2 { font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #1a2e3d; border-left: 3px solid #1a2e3d; padding-left: 8px; margin: 12px 0 5px; }
            .resume-t2 .rs .entry-title-r { font-weight: 700; font-size: 11px; }
            .resume-t2 .rs .entry-sub { color: #555; font-size: 10px; }
            .resume-t2 .rs ul { padding-left: 14px; margin-top: 3px; }
            .resume-t2 .rs ul li { margin-bottom: 1px; }

            /* Template 3: Two Column Clean */
            .resume-t3 { display: grid; grid-template-columns: 200px minmax(0, 1fr); gap: 0; height: 1123px; width: 794px; font-family: 'Inter', sans-serif; }
            .resume-t3 .r-left { background: #f5f5f3; padding: 20px 16px; height: 100%; box-sizing: border-box; }
            .resume-t3 .r-right { padding: 20px 24px; height: 100%; box-sizing: border-box; }
            .resume-t3 .sl-h { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #555; margin: 14px 0 6px; }
            .resume-t3 .skill-pill { display: inline-block; background: #e8e8e5; padding: 3px 8px; border-radius: 4px; font-size: 10px; margin: 2px 4px 4px 0; }
            .resume-t3 .rs h2 { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin: 12px 0 8px; color: #333; }
            .resume-t3 .rs .entry-title-r { font-weight: 700; font-size: 12px; }
            .resume-t3 .rs .entry-sub { color: #555; font-size: 10px; }
            .resume-t3 .rs ul { padding-left: 14px; margin-top: 4px; font-size: 11px; }
            .resume-t3 .rs ul li { margin-bottom: 3px; }

            /* Template 4: Editorial Premium */
            .resume-t4 { font-family: 'Playfair Display', serif; color: #2A2A2A; }
            .resume-t4 .rh { text-align: center; margin-bottom: 15px; }
            .resume-t4 .rh h1 { font-size: 24px; font-weight: 400; text-transform: uppercase; letter-spacing: 3px; color: #1a1a1a; margin-bottom: 4px; }
            .resume-t4 .rh .contact { font-size: 10px; color: #555; letter-spacing: 1px; font-family: 'Inter', sans-serif; text-transform: uppercase; }
            .resume-t4 .rs .section-title { display: flex; align-items: center; gap: 10px; margin: 14px 0 6px; }
            .resume-t4 .rs h2 { font-size: 11.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: #8C7345; margin: 0; white-space: nowrap; }
            .resume-t4 .rs .title-line { flex-grow: 1; height: 1px; background: #e0dcd3; }
            .resume-t4 .rs .summary-text { font-size: 11px; line-height: 1.5; color: #333; text-align: justify; margin-bottom: 10px; }
            .resume-t4 .rs .entry { margin-bottom: 8px; }
            .resume-t4 .rs .entry-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1px; }
            .resume-t4 .rs .entry-title { font-size: 11.5px; font-weight: 600; color: #1a1a1a; }
            .resume-t4 .rs .company-name { font-weight: 400; font-style: italic; color: #444; }
            .resume-t4 .rs .entry-date { font-size: 10px; font-family: 'Inter', sans-serif; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
            .resume-t4 .rs .entry-location { font-size: 10px; font-style: italic; color: #666; margin-bottom: 2px; }
            .resume-t4 .rs ul { padding-left: 14px; margin-top: 3px; }
            .resume-t4 .rs ul li { margin-bottom: 2px; line-height: 1.4; font-size: 11px; color: #333; font-family: 'Inter', sans-serif; }
            .resume-t4 .rs .education-entry { margin-bottom: 6px; }
            .resume-t4 .rs .degree-info { font-size: 11px; color: #444; font-style: italic; font-family: 'Inter', sans-serif; }
            .resume-t4 .rs .skills-text { font-size: 11px; line-height: 1.5; color: #333; font-family: 'Inter', sans-serif; }
            .resume-t4 .rs .project-detail { font-size: 11px; line-height: 1.4; color: #333; margin-top: 2px; font-family: 'Inter', sans-serif; }
          </style>
        </head>
        <body>
          <div class="a4-container">
            ${resumeContent}
          </div>
        </body>
      </html>
    `);

    const pdfBuffer = await page.pdf({
      width: '794px',
      height: '1123px',
      printBackground: true,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=ATS_Optimized_Resume.pdf');
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error('PDF generation error:', error);
    return res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// 4. Save Resume to MongoDB
app.post('/api/save', async (req, res) => {
  try {
    const { userId, resumeData, jdText, analysis } = req.body;
    if (!userId) return res.status(400).json({ error: 'User ID is required' });

    // Check if database is connected. If not, use fallback JSON DB.
    if (!isDbConnected()) {
      console.warn('[Fallback DB] MongoDB not connected. Saving resume via local JSON fallback...');
      const updatedResume = await fallbackSaveResume(req.body);
      return res.json({ success: true, data: updatedResume });
    }

    const updatedResume = await Resume.findOneAndUpdate(
      { userId },
      { resumeData, jdText, analysis, lastModified: new Date() },
      { upsert: true, new: true }
    );

    return res.json({ success: true, data: updatedResume });
  } catch (error: any) {
    console.error('Database Error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// 5. AI Resume Importer (supports raw text copy-paste or base64 PDF/TXT)
app.post('/api/import', async (req, res) => {
  try {
    const { text, fileBase64, fileType } = req.body;
    let resumeText = '';

    if (text) {
      resumeText = text;
    } else if (fileBase64) {
      const buffer = Buffer.from(fileBase64, 'base64');
      if (fileType === 'pdf') {
        const parser = new PDFParse(new Uint8Array(buffer));
        const parsedPdf = await parser.getText();
        resumeText = parsedPdf.text;
      } else {
        // Plain text file
        resumeText = buffer.toString('utf-8');
      }
    } else {
      return res.status(400).json({ error: 'Either text or fileBase64 must be provided' });
    }

    if (!resumeText.trim()) {
      return res.status(400).json({ error: 'Extracted resume text is empty' });
    }

    const structuredData = await importResumeWithGemini(resumeText);
    return res.json(structuredData);
  } catch (error: any) {
    console.error('Import error:', error);
    return res.status(500).json({ error: error.message || 'Failed to parse resume' });
  }
});

// 6. Template Sharing - Register custom layout as public template
app.post('/api/templates', async (req, res) => {
  try {
    const { name, description, resumeData } = req.body;
    if (!name || !description || !resumeData) {
      return res.status(400).json({ error: 'Name, description, and resumeData are required' });
    }

    if (!isDbConnected()) {
      console.warn('[Fallback DB] MongoDB not connected. Registering template via local JSON fallback...');
      const template = await fallbackRegisterTemplate(req.body);
      return res.status(201).json({ success: true, data: template });
    }

    const template = await Template.create({ name, description, resumeData });
    return res.status(201).json({ success: true, data: template });
  } catch (error: any) {
    console.error('Register template error:', error);
    return res.status(500).json({ error: error.message || 'Failed to register template' });
  }
});

// 7. Template Sharing - Fetch all registered templates
app.get('/api/templates', async (req, res) => {
  try {
    if (!isDbConnected()) {
      console.warn('[Fallback DB] MongoDB not connected. Fetching templates via local JSON...');
      const templates = await fallbackGetTemplates();
      return res.json({ success: true, data: templates });
    }

    const templates = await Template.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: templates });
  } catch (error: any) {
    console.error('Fetch templates error:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch templates' });
  }
});

// ── Start Server ──────────────────────────────────────────────────────────────
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

