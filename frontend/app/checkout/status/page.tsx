'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function CheckoutStatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'canceled'>('loading');

  const isSuccess = searchParams.get('success') === 'true';
  const isCanceled = searchParams.get('canceled') === 'true';

  useEffect(() => {
    if (isSuccess) {
      setStatus('success');
    } else if (isCanceled) {
      setStatus('canceled');
    } else {
      // Fallback — go home
      router.replace('/');
    }
  }, [isSuccess, isCanceled, router]);

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--background)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div
        style={{
          maxWidth: '520px',
          width: '100%',
          textAlign: 'center',
          padding: '4rem 3rem',
          border: '1px solid var(--border)',
          background: 'var(--bg-surface)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: status === 'success'
              ? 'var(--accent-editorial)'
              : status === 'canceled'
              ? '#ff5050'
              : 'transparent',
            transition: 'background 0.4s',
          }}
        />

        {/* ── Loading ── */}
        {status === 'loading' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <Loader2
              size={48}
              color="var(--accent-editorial)"
              style={{ animation: 'spin 1s linear infinite' }}
            />
            <p style={{ color: 'var(--muted-foreground)', fontSize: '1rem' }}>
              Verifying your payment…
            </p>
          </div>
        )}

        {/* ── Success ── */}
        {status === 'success' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'rgba(180,150,90,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
              }}
            >
              <CheckCircle size={40} color="var(--accent-editorial)" />
            </div>

            <div>
              <h1
                style={{
                  fontSize: '2rem',
                  fontFamily: 'var(--font-serif)',
                  color: 'var(--foreground)',
                  marginBottom: '0.75rem',
                }}
              >
                Payment Successful
              </h1>
              <p style={{ color: 'var(--muted-foreground)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                Welcome to <strong style={{ color: 'var(--accent-editorial)' }}>CareerForge Pro</strong>.{' '}
                Your subscription is now active. Start crafting your perfect resume.
              </p>
            </div>

            <Link
              href="/dashboard"
              id="btn-go-to-dashboard"
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.9rem 2rem',
                marginTop: '0.5rem',
              }}
            >
              Go to Dashboard
              <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* ── Canceled ── */}
        {status === 'canceled' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'rgba(255,80,80,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
              }}
            >
              <XCircle size={40} color="#ff5050" />
            </div>

            <div>
              <h1
                style={{
                  fontSize: '2rem',
                  fontFamily: 'var(--font-serif)',
                  color: 'var(--foreground)',
                  marginBottom: '0.75rem',
                }}
              >
                Payment Canceled
              </h1>
              <p style={{ color: 'var(--muted-foreground)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                No charges were made. You can upgrade to Pro anytime from the pricing page.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link
                href="/pricing"
                id="btn-retry-pricing"
                className="btn btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.9rem 2rem',
                }}
              >
                Try Again
              </Link>
              <Link
                href="/dashboard"
                id="btn-go-dashboard-canceled"
                className="btn btn-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.9rem 2rem',
                }}
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes popIn {
          0%   { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </main>
  );
}

// Wrap in Suspense because useSearchParams requires it in Next.js App Router
export default function CheckoutStatus() {
  return (
    <Suspense fallback={
      <main style={{ minHeight: '100vh', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={48} color="var(--accent-editorial)" style={{ animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    }>
      <CheckoutStatusContent />
    </Suspense>
  );
}
