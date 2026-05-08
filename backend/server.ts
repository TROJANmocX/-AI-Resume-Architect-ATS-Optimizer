import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import puppeteer from 'puppeteer';
import Stripe from 'stripe';
import dbConnect from './database/mongodb';
import Resume from './database/models/Resume';
import User from './database/models/User';
import { analyzeJobDescriptionWithGemini, rewriteBulletWithGemini } from './lib/gemini';
import { analyzeJobDescription as analyzeWithOpenAI, rewriteResumeBullet as rewriteWithOpenAI } from './lib/openai';

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
app.use(express.json());

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

// 3. Generate PDF
app.post('/api/pdf', async (req, res) => {
  try {
    const data = req.body;
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setContent(`
      <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
            body { font-family: 'Roboto','Helvetica','Arial',sans-serif; padding: 50px; color:#000; line-height:1.5; font-size:11pt; background:#fff; }
            .header { text-align:center; margin-bottom:25px; }
            h1 { margin:0 0 5px 0; font-size:20pt; font-weight:bold; text-transform:uppercase; letter-spacing:1px; }
            .contact { font-size:10pt; color:#333; }
            .section { margin-top:20px; }
            .section-title { font-weight:bold; border-bottom:1px solid #000; text-transform:uppercase; margin-bottom:8px; font-size:11pt; letter-spacing:0.5px; }
            .item { margin-bottom:12px; page-break-inside:avoid; }
            .item-header { display:flex; justify-content:space-between; font-weight:bold; margin-bottom:2px; }
            .item-sub { font-style:italic; display:flex; justify-content:space-between; color:#444; margin-bottom:4px; }
            ul { padding-left:20px; margin:4px 0; }
            li { margin-bottom:3px; }
            .skills-box { font-size:10pt; margin-top:5px; }
            .skill-label { font-weight:bold; }
            p { margin:4px 0; font-size:10.5pt; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${data.basic?.name || 'NAME'}</h1>
            <div class="contact">${data.basic?.location} | ${data.basic?.phone} | ${data.basic?.email}</div>
            ${data.social?.length ? '<div class="contact">' + data.social.map((s: any) => s.url).join(' | ') + '</div>' : ''}
          </div>
          <div class="section">
            <div class="section-title">Professional Summary</div>
            <p>${data.basic?.summary || ''}</p>
          </div>
          ${data.experience?.length ? '<div class="section"><div class="section-title">Experience</div>' + data.experience.map((exp: any) => `<div class="item"><div class="item-header"><span>${exp.company}</span><span>${exp.date}</span></div><div class="item-sub"><span>${exp.title}</span></div><ul>${(exp.bullets || []).map((b: string) => `<li>${b}</li>`).join('')}</ul></div>`).join('') + '</div>' : ''}
          ${data.academics?.length ? '<div class="section"><div class="section-title">Education</div>' + data.academics.map((edu: any) => `<div class="item"><div class="item-header"><span>${edu.school}</span><span>${edu.year}</span></div><div class="item-sub"><span>${edu.degree}</span></div></div>`).join('') + '</div>' : ''}
          ${data.projects?.length ? '<div class="section"><div class="section-title">Notable Projects</div>' + data.projects.map((proj: any) => `<div class="item"><div class="item-header"><span>${proj.name}</span></div><p>${proj.description || ''}</p>${proj.bullets ? '<ul>' + proj.bullets.map((b: string) => `<li>${b}</li>`).join('') + '</ul>' : ''}</div>`).join('') + '</div>' : ''}
          ${data.skills?.length || data.languages?.length ? '<div class="section"><div class="section-title">Technical Skills &amp; Languages</div><div class="skills-box">' + (data.skills?.length ? '<div><span class="skill-label">Skills:</span> ' + data.skills.map((s: any) => s.name || s).join(', ') + '</div>' : '') + (data.languages?.length ? '<div><span class="skill-label">Languages:</span> ' + data.languages.map((s: any) => s.name || s).join(', ') + '</div>' : '') + '</div></div>' : ''}
          ${data.certifications?.length ? '<div class="section"><div class="section-title">Certifications</div><p>' + data.certifications.map((c: any) => c.name).join(', ') + '</p></div>' : ''}
          ${data.awards?.length ? '<div class="section"><div class="section-title">Honors &amp; Awards</div><ul>' + data.awards.map((a: any) => `<li>${a.name} (${a.giver})</li>`).join('') + '</ul></div>' : ''}
        </body>
      </html>
    `);

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0.4in', right: '0.4in', bottom: '0.4in', left: '0.4in' },
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

// ── Start Server ──────────────────────────────────────────────────────────────
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
