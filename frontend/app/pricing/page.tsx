'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Check, Loader2, Zap } from 'lucide-react';
import { PLANS } from '@/lib/stripe';

const BACKEND_URL = 'http://localhost:5000';

export default function Pricing() {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (plan: { name: string; priceId: string; price: number; features: readonly string[] }) => {
    // Free plan — just go to dashboard
    if (plan.price === 0) {
      router.push('/dashboard');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login?redirect=/pricing');
      return;
    }

    if (!plan.priceId || (typeof plan.priceId === 'string' && plan.priceId.startsWith('price_REPLACE'))) {
      setError('The Pro plan is not yet configured. Please add a valid Stripe Price ID.');
      return;
    }

    setLoadingPlan(plan.name);
    setError(null);

    try {
      const res = await fetch(`${BACKEND_URL}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ priceId: plan.priceId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to start checkout');
      }

      // Redirect to Stripe Hosted Checkout
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoadingPlan(null);
    }
  };

  return (
    <main style={{ minHeight: '100vh', paddingBottom: '8rem', background: 'var(--background)' }}>
      <Navbar />

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          paddingTop: '12rem',
          paddingInline: '2rem',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(3rem, 5vw, 4.5rem)',
            marginBottom: '1.5rem',
            fontFamily: 'var(--font-serif)',
            color: 'var(--foreground)',
          }}
        >
          Select your{' '}
          <span style={{ fontStyle: 'italic', color: 'var(--accent-editorial)' }}>membership</span>
        </h1>
        <p
          style={{
            color: 'var(--muted-foreground)',
            fontSize: '1.1rem',
            marginBottom: '3rem',
            maxWidth: '500px',
            marginInline: 'auto',
          }}
        >
          Choose the tier that aligns with your professional aspirations.
        </p>

        {/* Error banner */}
        {error && (
          <div
            style={{
              background: 'rgba(255,80,80,0.1)',
              border: '1px solid rgba(255,80,80,0.4)',
              borderRadius: '8px',
              padding: '1rem 1.5rem',
              color: '#ff5050',
              marginBottom: '2.5rem',
              maxWidth: '600px',
              marginInline: 'auto',
              fontSize: '0.9rem',
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '0',
            border: '1px solid var(--border)',
            background: 'var(--bg-surface)',
          }}
        >
          {PLANS.map((plan, index) => (
            <div
              key={plan.name}
              className={`pricing-card ${plan.name === 'Pro' ? 'pricing-card-pro' : ''}`}
              style={{
                padding: '4rem 3rem',
                textAlign: 'left',
                position: 'relative',
                borderRight: index !== PLANS.length - 1 ? '1px solid var(--border)' : 'none',
                background: plan.name === 'Pro' ? 'var(--background)' : 'transparent',
              }}
            >
              {/* Pro accent bar */}
              {plan.name === 'Pro' && (
                <div
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    right: '0',
                    height: '4px',
                    background: 'var(--accent-editorial)',
                  }}
                />
              )}

              {/* Plan header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  marginBottom: '1rem',
                }}
              >
                {plan.name === 'Pro' && (
                  <Zap size={18} color="var(--accent-editorial)" fill="var(--accent-editorial)" />
                )}
                <h3
                  style={{
                    fontSize: '1.2rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontWeight: 600,
                    color: 'var(--foreground)',
                    margin: 0,
                  }}
                >
                  {plan.name}
                </h3>
              </div>

              {/* Price */}
              <div style={{ marginBottom: '2.5rem' }}>
                <span
                  style={{
                    fontSize: '4rem',
                    fontWeight: 500,
                    fontFamily: 'var(--font-serif)',
                    color: 'var(--foreground)',
                  }}
                >
                  ${plan.price}
                </span>
                <span style={{ color: 'var(--muted-foreground)', fontSize: '1rem' }}>/month</span>
              </div>

              {/* Features */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  marginBottom: '4rem',
                }}
              >
                {plan.features.map((feature, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      fontSize: '0.95rem',
                      color: 'var(--foreground)',
                    }}
                  >
                    <div style={{ marginTop: '3px', flexShrink: 0 }}>
                      <Check size={16} color="var(--accent-editorial)" />
                    </div>
                    <span style={{ lineHeight: 1.5 }}>{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA button */}
              <button
                id={`btn-plan-${plan.name.toLowerCase()}`}
                onClick={() => handleCheckout(plan)}
                disabled={loadingPlan !== null}
                className={plan.name === 'Pro' ? 'btn btn-primary' : 'btn btn-secondary'}
                style={{
                  width: '100%',
                  padding: '1rem',
                  justifyContent: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: loadingPlan ? 'not-allowed' : 'pointer',
                  opacity: loadingPlan && loadingPlan !== plan.name ? 0.5 : 1,
                  transition: 'opacity 0.2s',
                }}
              >
                {loadingPlan === plan.name ? (
                  <>
                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    Redirecting to Stripe…
                  </>
                ) : plan.price === 0 ? (
                  'Start Free'
                ) : (
                  'Select Pro'
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Trust signals */}
        <p
          style={{
            color: 'var(--muted-foreground)',
            fontSize: '0.8rem',
            marginTop: '2.5rem',
            opacity: 0.7,
          }}
        >
          🔒 Secured by Stripe. Cancel anytime. Test card: 4242 4242 4242 4242
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .pricing-card {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .pricing-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
          z-index: 10;
        }
        .pricing-card-pro {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        }
      `}</style>
    </main>
  );
}
