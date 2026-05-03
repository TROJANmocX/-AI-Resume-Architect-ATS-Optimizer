"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="theme-editorial" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1 }}>
        {/* HERO SECTION */}
        <section style={{ 
          paddingTop: '15rem', 
          paddingBottom: '8rem', 
          paddingInline: '5%',
          maxWidth: '1400px',
          margin: '0 auto',
          position: 'relative'
        }}>
          <div style={{ maxWidth: '800px' }}>
            <p className="animate-fade-in" style={{ 
              fontSize: '0.85rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.2em', 
              color: 'var(--accent-editorial)',
              marginBottom: '2rem',
              fontWeight: 600
            }}>
              Next-Gen Optimization
            </p>
            <h1 className="animate-fade-in" style={{ 
              fontSize: 'clamp(3.5rem, 8vw, 7rem)', 
              lineHeight: 1.05, 
              marginBottom: '2rem',
              animationDelay: '0.1s'
            }}>
              Your Resume<br />
              <span style={{ fontStyle: 'italic', color: 'var(--accent-editorial)' }}>Isn’t Bad.</span><br />
              It’s Invisible.
            </h1>
            
            <p className="animate-fade-in" style={{ 
              fontSize: '1.25rem', 
              color: 'rgba(26,26,26,0.7)', 
              maxWidth: '500px', 
              marginBottom: '4rem',
              animationDelay: '0.2s',
              lineHeight: 1.6,
              fontWeight: 300
            }}>
              Make it clear, measurable, and impossible to ignore. A beautifully orchestrated document that demands attention.
            </p>

            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Link href="/login" style={{ 
                display: 'inline-block',
                padding: '1.2rem 3rem', 
                fontSize: '1rem', 
                background: 'var(--text-editorial)',
                color: 'var(--bg-editorial)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                transition: 'all 0.3s ease',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--accent-editorial)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--text-editorial)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                Optimize Resume
              </Link>
            </div>
          </div>
        </section>

        <div className="theme-editorial-divider"></div>

        {/* PROBLEM SECTION */}
        <section style={{ padding: '10rem 5%', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '6rem' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(26,26,26,0.1)', paddingBottom: '1rem' }}>01. Missing the Mark</h3>
              <p style={{ color: 'rgba(26,26,26,0.7)', lineHeight: 1.8, fontSize: '1.1rem', fontWeight: 300 }}>Your resume isn’t reaching recruiters. Most never do.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(26,26,26,0.1)', paddingBottom: '1rem' }}>02. Weak Messaging</h3>
              <p style={{ color: 'rgba(26,26,26,0.7)', lineHeight: 1.8, fontSize: '1.1rem', fontWeight: 300 }}>Generic bullet points fail to communicate real impact.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(26,26,26,0.1)', paddingBottom: '1rem' }}>03. Lost in the Pile</h3>
              <p style={{ color: 'rgba(26,26,26,0.7)', lineHeight: 1.8, fontSize: '1.1rem', fontWeight: 300 }}>One-size-fits-all resumes rarely get responses.</p>
            </div>
          </div>
        </section>

        {/* TRANSFORMATION SECTION */}
        <section style={{ padding: '10rem 5%', background: '#EAE5DB' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '6rem', textAlign: 'center' }}>
              From Generic to <span style={{ fontStyle: 'italic', color: 'var(--accent-editorial)' }}>Unignorable.</span>
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
              <div style={{ padding: '3rem', borderLeft: '1px solid rgba(26,26,26,0.1)' }}>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(26,26,26,0.5)', display: 'block', marginBottom: '1rem', fontWeight: 600 }}>Before</span>
                <p style={{ fontSize: '1.5rem', color: 'rgba(26,26,26,0.4)', textDecoration: 'line-through', fontStyle: 'italic', lineHeight: 1.6 }}>
                  "Helped the team build the new backend database and fixed some bugs."
                </p>
              </div>
              
              <div style={{ padding: '3rem', borderLeft: '2px solid var(--accent-editorial)' }}>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-editorial)', display: 'block', marginBottom: '1rem', fontWeight: 600 }}>After</span>
                <p style={{ fontSize: '2rem', color: 'var(--text-editorial)', lineHeight: 1.4 }}>
                  "Architected scalable PostgreSQL database migration, resolving critical bottlenecks and reducing P99 query time by 40%."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section style={{ padding: '10rem 5%', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              { title: "Keyword Alignment", desc: "Align your resume with job descriptions automatically." },
              { title: "Impact-Focused Writing", desc: "Turn responsibilities into measurable achievements." },
              { title: "Dynamic Formatting", desc: "Ensure perfect ATS parsing with clean, compliant structures." },
              { title: "Instant Scoring", desc: "Predict your match rate before you apply." }
            ].map((feature, i) => (
              <div key={i} style={{ 
                padding: '3rem 0', 
                borderBottom: '1px solid rgba(26,26,26,0.1)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'baseline',
                gap: '2rem'
              }}>
                <h3 style={{ fontSize: '2.5rem', flex: '1 1 400px', margin: 0 }}>{feature.title}</h3>
                <p style={{ fontSize: '1.1rem', color: 'rgba(26,26,26,0.6)', flex: '1 1 300px', margin: 0, fontWeight: 300 }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* PROOF SECTION */}
        <section style={{ padding: '6rem 5%', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '4rem',
            textAlign: 'center'
          }}>
              <div>
                  <div style={{ fontSize: '6rem', color: 'var(--text-editorial)', marginBottom: '1rem', lineHeight: 1, fontFamily: 'var(--font-serif)' }}>38<span style={{ fontSize: '3rem', color: 'var(--accent-editorial)' }}>%</span></div>
                  <p style={{ color: 'rgba(26,26,26,0.6)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500 }}>Higher interview rate</p>
              </div>
              <div>
                  <div style={{ fontSize: '6rem', color: 'var(--text-editorial)', marginBottom: '1rem', lineHeight: 1, fontFamily: 'var(--font-serif)' }}>62<span style={{ fontSize: '3rem', color: 'var(--accent-editorial)' }}>%</span></div>
                  <p style={{ color: 'rgba(26,26,26,0.6)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500 }}>Better ATS compatibility</p>
              </div>
              <div>
                  <div style={{ fontSize: '6rem', color: 'var(--text-editorial)', marginBottom: '1rem', lineHeight: 1, fontFamily: 'var(--font-serif)' }}>3<span style={{ fontSize: '3rem', color: 'var(--accent-editorial)' }}>x</span></div>
                  <p style={{ color: 'rgba(26,26,26,0.6)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500 }}>Faster responses</p>
              </div>
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section style={{ padding: '15rem 5%', textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', marginBottom: '3rem' }}>
                Get noticed in seconds.
            </h2>
            <Link href="/login" style={{ 
              display: 'inline-block',
              padding: '1.2rem 4rem', 
              fontSize: '1rem', 
              background: 'transparent',
              color: 'var(--text-editorial)',
              border: '1px solid var(--text-editorial)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              transition: 'all 0.3s ease',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--text-editorial)';
              e.currentTarget.style.color = 'var(--bg-editorial)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-editorial)';
            }}
            >
                Improve My Resume
            </Link>
        </section>
      </main>

      <footer style={{ 
        padding: '3rem 5%', 
        borderTop: '1px solid rgba(26,26,26,0.1)', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        fontSize: '0.9rem',
        color: 'rgba(26,26,26,0.5)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      }}>
          <div style={{ fontWeight: 600, color: 'var(--text-editorial)' }}>
            CareerForge Pro
          </div>
          <div>© 2026. All rights reserved.</div>
      </footer>
    </div>
  );
}
