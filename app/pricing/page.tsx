import Navbar from "@/components/Navbar";
import { Check } from "lucide-react";
import { PLANS } from "@/lib/stripe";

export default function Pricing() {
  return (
    <main style={{ minHeight: '100vh', paddingBottom: '8rem', background: 'var(--background)' }}>
      <Navbar />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '12rem', paddingInline: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)', color: 'var(--foreground)' }}>
          Select your <span style={{ fontStyle: 'italic', color: 'var(--accent-editorial)' }}>membership</span>
        </h1>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '1.1rem', marginBottom: '6rem', maxWidth: '500px', marginInline: 'auto' }}>
          Choose the tier that aligns with your professional aspirations.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0', border: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
          {PLANS.map((plan, index) => (
            <div 
              key={plan.name} 
              style={{ 
                padding: '4rem 3rem', 
                textAlign: 'left',
                position: 'relative',
                borderRight: index !== PLANS.length - 1 ? '1px solid var(--border)' : 'none',
                background: plan.name === 'Pro' ? 'var(--background)' : 'transparent'
              }}
            >
              {plan.name === 'Pro' && (
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  height: '4px',
                  background: 'var(--accent-editorial)',
                }} />
              )}

              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, color: 'var(--foreground)' }}>{plan.name}</h3>
              <div style={{ marginBottom: '2.5rem' }}>
                <span style={{ fontSize: '4rem', fontWeight: 500, fontFamily: 'var(--font-serif)', color: 'var(--foreground)' }}>${plan.price}</span>
                <span style={{ color: 'var(--muted-foreground)', fontSize: '1rem' }}>/month</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '4rem', flex: 1 }}>
                {plan.features.map((feature, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', fontSize: '0.95rem', color: 'var(--foreground)' }}>
                    <div style={{ marginTop: '3px' }}>
                      <Check size={16} color="var(--accent-editorial)" />
                    </div>
                    <span style={{ lineHeight: 1.5 }}>{feature}</span>
                  </div>
                ))}
              </div>

              <a 
                href={`/checkout/status?success=true`}
                className={plan.name === 'Pro' ? 'btn btn-primary' : 'btn btn-secondary'} 
                style={{ width: '100%', padding: '1rem', justifyContent: 'center' }}
              >
                {plan.price === 0 ? 'Start Free' : 'Select Pro'}
              </a>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
