import Navbar from "@/components/Navbar";
import { Check, Zap } from "lucide-react";
import { PLANS } from "@/lib/stripe";

export default function Pricing() {
  return (
    <main style={{ minHeight: '100vh', paddingBottom: '6rem' }}>
      <Navbar />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '10rem', paddingInline: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Elevate Your <span className="text-gradient">Career</span></h1>
        <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '1.25rem', marginBottom: '4rem' }}>
          Choose the plan that fits your job search needs.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          {PLANS.map((plan) => (
            <div 
              key={plan.name} 
              className="glass" 
              style={{ 
                padding: '3rem 2rem', 
                borderRadius: '2rem', 
                width: '350px',
                textAlign: 'left',
                position: 'relative',
                border: plan.name === 'Pro' ? '1px solid #00BAFF' : '1px solid var(--glass-border)'
              }}
            >
              {plan.name === 'Pro' && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(0, 186, 255, 0.1)',
                  color: '#00BAFF',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  <Zap size={12} /> MOST POPULAR
                </div>
              )}

              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{plan.name}</h3>
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '3rem', fontWeight: 700 }}>${plan.price}</span>
                <span style={{ color: 'hsl(var(--muted-foreground))' }}>/month</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
                {plan.features.map((feature, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
                    <div style={{ 
                      width: '20px', 
                      height: '20px', 
                      borderRadius: '50%', 
                      background: 'rgba(0, 186, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Check size={12} color="#00BAFF" />
                    </div>
                    {feature}
                  </div>
                ))}
              </div>

              <a 
                href={`/checkout/status?success=true`}
                className={plan.name === 'Pro' ? 'btn btn-primary' : 'btn btn-secondary'} 
                style={{ width: '100%', padding: '1rem' }}
              >
                {plan.price === 0 ? 'Start for Free' : 'Upgrade to Pro'}
              </a>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
