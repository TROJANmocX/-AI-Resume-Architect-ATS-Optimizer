# CareerForge Pro: The Applicant's Strategic Advantage

CareerForge Pro is a sophisticated suite of tools engineered for the sole purpose of assisting human professionals in their ongoing conflict with Applicant Tracking Systems (ATS). While we cannot technically guarantee that a robot will not reject your resume, we have gone to great lengths to ensure that if it does, it will be because of your lack of experience, not our failure to properly highlight it.

## Executive Summary

The modern recruitment process is largely a game of semantic hide-and-seek. Employers hide what they want in a Job Description (JD), and applicants hide what they can do in a PDF. CareerForge Pro acts as a high-precision bridge between these two opaque entities. Our AI-driven agents scan, parse, and optimize your professional history to ensure that the keywords recruiters are looking for are exactly where the bots expect to find them.

## Core Capabilities

### 1. The JD Analysis Agent
Our proprietary agent scrapes the target Job Description to identify and rank critical keywords. It distinguishes between actual technical requirements (Hard Skills) and the corporate adjectives often used to fill space (Soft Skills). It prioritizes the former while gracefully incorporating the latter.

### 2. Contextual AI Rewriting
Utilizing advanced prompt engineering, our system rewrites your professional experience bullets. The goal is to maximize your "ATS Match Score" without making you sound like a sentient toaster. We aim for impact-driven professional prose that satisfies both the algorithmic gatekeepers and the humans who eventually read the result.

### 3. Tiered SaaS Model
We offer a structured subscription model integrated via Stripe. The Free tier allows for a single, cautious attempt at a new career. The Pro tier offers unlimited resumes and cover letters for those who have a more aggressive approach to the job market.

### 4. High-Fidelity PDF Rendering
Leveraging Puppeteer and Headless Chrome, the application renders complex React components into pixel-perfect, non-editable PDF documents. This ensures that your formatting remains intact, even when subjected to the harsh environment of a corporate database.

## Technical Infrastructure

This application is built using a modern full-stack architecture:
- Framework: Next.js (App Router)
- Logic: TypeScript
- Style: Vanilla CSS (Glassmorphism design language)
- Analysis: OpenAI GPT-4o-mini
- Payments: Stripe SDK
- Export Engine: Puppeteer

## Installation & Setup

This is a monorepo containing both the frontend (Next.js) and backend (Express/Node.js).

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Stripe account (for payments)
- Gemini or OpenAI API key (for AI features)

### 1. Clone the repository
```bash
git clone https://github.com/TROJANmocX/-AI-Resume-Architect-ATS-Optimizer.git
cd -AI-Resume-Architect-ATS-Optimizer
```

### 2. Backend Setup
```bash
cd backend
npm install
# Copy .env.example and fill in your keys
cp .env.example .env
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
# Copy .env.example and fill in your keys
cp .env.example .env
npm run dev
```

### 4. Stripe Webhooks (Local Testing)
To handle subscription updates locally, use the Stripe CLI:
```bash
stripe listen --forward-to localhost:5000/api/stripe/webhook
```
Copy the signing secret into your `backend/.env` as `STRIPE_WEBHOOK_SECRET`.

## Disclosure

CareerForge Pro is designed to help you tell the best possible version of the truth. We are not responsible for any existential dread caused by realizing how much of your career is defined by keywords.

---
Managed by the CareerForge Pro Development Team.