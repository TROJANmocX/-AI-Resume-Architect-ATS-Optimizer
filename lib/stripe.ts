import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// Only initialize Stripe if the key is present to avoid runtime crashes
export const stripe = STRIPE_SECRET_KEY 
  ? new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2025-01-27-ac',
    })
  : null;

export const PLANS = [
  {
    name: 'Free',
    priceId: '',
    price: 0,
    features: ['1 Resume Analysis', 'Standard Templates', 'Community Support'],
  },
  {
    name: 'Pro',
    priceId: 'price_H5ggY...', // Placeholder
    price: 19,
    features: ['Unlimited Resume Analysis', 'AI Bullet Rewriting', 'Premium PDF Templates', 'Priority Support'],
  }
];
