# CareerForge Pro - Implementation Plan

CareerForge Pro is a premium SaaS solution designed to help job seekers bypass Applicant Tracking Systems (ATS) by intelligently rewriting their resumes to match target job descriptions.

## User Review Required

> [!IMPORTANT]
> **API Keys Required**: The following environment variables will eventually be needed for full functionality:
> - `OPENAI_API_KEY`: For JD analysis and AI rewriting.
> - `STRIPE_SECRET_KEY` & `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: For subscription management.

> [!WARNING]
> **Puppeteer Deployment**: Rendering PDFs via Puppeteer on serverless platforms (like Vercel) requires specific configurations (e.g., `sparticuz-chromium`). I will set this up for local development first.

## Proposed Changes

### 1. Project Scaffolding
- **Framework**: Next.js 14+ (App Router) with TypeScript.
- **Styling**: Vanilla CSS with a global design system (HSL tokens).
- **Icons**: Lucide React for consistent, modern iconography.

### 2. Core Features
#### JD Analysis Agent
- A service that uses an LLM to parse job descriptions.
- Extracts "Hard Skills," "Soft Skills," and "Actionable Keywords."
- Ranks keywords by frequency and importance within the JD.

#### AI Rewrite Logic
- "ATS Resume Optimizer": Rewrites existing experience bullet points.
- Guiding principle: "Contextual Keyword Integration" – ensuring rephrased bullets feel natural but contain the target keywords.
- Calculates an "ATS Match Score" based on keyword coverage.

#### Premium Resume Templates
- React-based CSS templates designed for clean PDF rendering.
- Modern, professional layouts (Classic, Modern, Creative).

#### PDF Generation
- backend route `/api/pdf` using **Puppeteer**.
- Converts the live React resume component into a high-quality, ATS-readable PDF.

#### Subscription (Stripe)
- **Free Tier**: 1 Resume per month, basic templates.
- **Pro Tier**: Unlimited resumes, AI-powered rewriting, premium templates.

---

## Technical Stack
- **Frontend**: Next.js, React, CSS Modules.
- **Backend**: Next.js Route Handlers.
- **LLM**: OpenAI GPT-4o-mini (default for cost-effective, high-quality rewrites).
- **PDF**: Puppeteer.
- **Payments**: Stripe.

---

## Verification Plan

### Automated Tests
- `npm run dev` to verify the application loads.
- Mock API calls to verify keyword extraction logic.

### Manual Verification
1.  Paste a job description and verify keyword extraction.
2.  Input a sample resume bullet and trigger "AI Rewrite."
3.  Simulate a PDF download and check formatting.
4.  Verify Stripe Checkout redirection (Test Mode).
