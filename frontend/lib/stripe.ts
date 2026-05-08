/**
 * frontend/lib/stripe.ts
 *
 * - Server-side: initialises Stripe with the secret key (used by API routes).
 * - Client-side: exports the publishable key and the plan catalogue.
 *
 * Price IDs must match real Prices created in your Stripe Dashboard.
 * Test mode price IDs start with `price_` and can be found in
 *   Stripe Dashboard → Products → [your product] → Pricing.
 */
import Stripe from 'stripe';

// ── Server-side Stripe client ─────────────────────────────────────────────────
// Only safe to import in server components / API routes.
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

export const stripe: Stripe | null = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2025-01-27.acacia' as any })
  : null;

// ── Client-safe publishable key ───────────────────────────────────────────────
export const STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '';

// ── Plan catalogue ────────────────────────────────────────────────────────────
// TODO: Replace the Pro priceId with the real Price ID from your Stripe Dashboard.
//       e.g. 'price_1AbCdEfGhIjKlMnO'
export const PLANS = [
  {
    name: 'Free',
    priceId: '',
    price: 0,
    features: [
      '1 Resume Analysis per month',
      'Standard ATS Templates',
      'Community Support',
    ],
  },
  {
    name: 'Pro',
    priceId: 'price_REPLACE_WITH_REAL_PRICE_ID', // ← replace this
    price: 19,
    features: [
      'Unlimited Resume Analyses',
      'AI Bullet Point Rewriting',
      'Premium PDF Templates',
      'Priority Support',
      'Early access to new features',
    ],
  },
] as const;

export type PlanName = (typeof PLANS)[number]['name'];
