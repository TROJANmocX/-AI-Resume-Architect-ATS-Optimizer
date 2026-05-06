/**
 * Application Configuration (app.js)
 * 
 * This file contains the core Express application setup for the CareerForge project.
 * It includes all global middleware, authentication routes, and core API endpoints
 * (such as JD analysis, resume rewriting, PDF generation, and saving).
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const puppeteer = require('puppeteer');

// Import your database models and utility functions
// Note: If your backend is in TypeScript, you might need to compile them first
// or use ts-node to run this file if it requires .ts files directly.
const User = require('./backend/database/models/User').default || require('./backend/database/models/User');
const Resume = require('./backend/database/models/Resume').default || require('./backend/database/models/Resume');
const { analyzeJobDescriptionWithGemini, rewriteBulletWithGemini } = require('./backend/lib/gemini');
const { analyzeJobDescription: analyzeWithOpenAI, rewriteResumeBullet: rewriteWithOpenAI } = require('./backend/lib/openai');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// --- Global Middleware ---
app.use(cors());
app.use(express.json());

// --- Authentication Routes ---

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

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const user = await User.create({ name, email, password });

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
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
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: error.message || 'Login failed' });
  }
});

// Get current user from token
app.get('/api/auth/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

// --- API Routes ---

// 1. Analyze Job Description
app.post('/api/analyze', async (req, res) => {
  try {
    const { jdText } = req.body;
    if (!jdText) {
      return res.status(400).json({ error: 'Job description text is required' });
    }

    if (process.env.GEMINI_API_KEY) {
      const analysis = await analyzeJobDescriptionWithGemini(jdText);
      return res.json(analysis);
    } else if (process.env.OPENAI_API_KEY) {
      const analysis = await analyzeWithOpenAI(jdText);
      return res.json(analysis);
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
      const rewrite = await rewriteBulletWithGemini(bulletPoint, targetKeywords);
      return res.json(rewrite);
    } else if (process.env.OPENAI_API_KEY) {
      const rewrite = await rewriteWithOpenAI(bulletPoint, targetKeywords);
      return res.json(rewrite);
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

    // Standard ATS-Friendly Layout (Single Column, High Contrast)
    await page.setContent(`
      <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
            body { 
              font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif; 
              padding: 50px; 
              color: #000; 
              line-height: 1.5; 
              font-size: 11pt; 
              background: #fff;
            }
            .header { text-align: center; margin-bottom: 25px; }
            h1 { margin: 0 0 5px 0; font-size: 20pt; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
            .contact { font-size: 10pt; color: #333; }
            .section { margin-top: 20px; }
            .section-title { 
              font-weight: bold; 
              border-bottom: 1px solid #000; 
              text-transform: uppercase; 
              margin-bottom: 8px; 
              font-size: 11pt; 
              letter-spacing: 0.5px;
            }
            .item { margin-bottom: 12px; page-break-inside: avoid; }
            .item-header { display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 2px; }
            .item-sub { font-style: italic; display: flex; justify-content: space-between; color: #444; margin-bottom: 4px; }
            ul { padding-left: 20px; margin: 4px 0; }
            li { margin-bottom: 3px; }
            .skills-box { font-size: 10pt; margin-top: 5px; }
            .skill-label { font-weight: bold; }
            p { margin: 4px 0; font-size: 10.5pt; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${data.basic?.name || 'NAME'}</h1>
            <div class="contact">
                ${data.basic?.location} | ${data.basic?.phone} | ${data.basic?.email}
            </div>
            ${data.social?.length ? '<div class="contact">' + data.social.map(s => s.url).join(' | ') + '</div>' : ''}
          </div>

          <div class="section">
            <div class="section-title">Professional Summary</div>
            <p>${data.basic?.summary || ''}</p>
          </div>

          ${data.experience?.length ? \`
            <div class="section">
                <div class="section-title">Experience</div>
                \` + data.experience.map(exp => \`
                    <div class="item">
                        <div class="item-header">
                            <span>\${exp.company}</span>
                            <span>\${exp.date}</span>
                        </div>
                        <div class="item-sub">
                            <span>\${exp.title}</span>
                        </div>
                        <ul>
                            \` + (exp.bullets?.map(b => \`<li>\${b}</li>\`).join('') || '') + \`
                        </ul>
                    </div>
                \`).join('') + \`
            </div>
          \` : ''}

          ${data.academics?.length ? \`
            <div class="section">
                <div class="section-title">Education</div>
                \` + data.academics.map(edu => \`
                    <div class="item">
                        <div class="item-header">
                            <span>\${edu.school}</span>
                            <span>\${edu.year}</span>
                        </div>
                        <div class="item-sub">
                            <span>\${edu.degree}</span>
                        </div>
                    </div>
                \`).join('') + \`
            </div>
          \` : ''}

          ${data.projects?.length ? \`
            <div class="section">
                <div class="section-title">Notable Projects</div>
                \` + data.projects.map(proj => \`
                    <div class="item">
                        <div class="item-header">
                            <span>\${proj.name}</span>
                        </div>
                        <p>\${proj.description || ''}</p>
                        \` + (proj.bullets ? \`<ul>\` + proj.bullets.map(b => \`<li>\${b}</li>\`).join('') + \`</ul>\` : '') + \`
                    </div>
                \`).join('') + \`
            </div>
          \` : ''}

          ${data.skills?.length || data.languages?.length ? \`
            <div class="section">
                <div class="section-title">Technical Skills & Languages</div>
                <div class="skills-box">
                    \` + (data.skills?.length ? \`<div><span class="skill-label">Skills:</span> \` + data.skills.map(s => s.name || s).join(', ') + \`</div>\` : '') + \`
                    \` + (data.languages?.length ? \`<div><span class="skill-label">Languages:</span> \` + data.languages.map(s => s.name || s).join(', ') + \`</div>\` : '') + \`
                </div>
            </div>
          \` : ''}

          ${data.certifications?.length ? \`
            <div class="section">
                <div class="section-title">Certifications</div>
                <p>\` + data.certifications.map(c => c.name).join(', ') + \`</p>
            </div>
          \` : ''}

          ${data.awards?.length ? \`
            <div class="section">
                <div class="section-title">Honors & Awards</div>
                <ul>
                    \` + data.awards.map(a => \`<li>\${a.name} (\${a.giver})</li>\`).join('') + \`
                </ul>
            </div>
          \` : ''}
        </body>
      </html>
    \`);

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0.4in', right: '0.4in', bottom: '0.4in', left: '0.4in' }
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

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const updatedResume = await Resume.findOneAndUpdate(
      { userId },
      { resumeData, jdText, analysis, lastModified: new Date() },
      { upsert: true, new: true }
    );

    return res.json({ success: true, data: updatedResume });
  } catch (error) {
    console.error('Database Error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// --- Global Error Handling ---
app.use((err, req, res, next) => {
  console.error('[Global Error]', err.stack);
  res.status(500).json({ error: 'An unexpected internal server error occurred.' });
});

module.exports = app;
