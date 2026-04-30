"use client";

import Navbar from "@/components/Navbar";
import { ArrowRight, CheckCircle, Zap, Shield, FileText, BarChart3, X, AlertOctagon, Target, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <main style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', background: '#060B14' }}>
      {/* Background Orbs */}
      <div className="animate-breathe" style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '40%',
        height: '40%',
        background: 'radial-gradient(circle, rgba(0, 186, 255, 0.15) 0%, transparent 70%)',
        filter: 'blur(100px)',
        zIndex: -1,
        animationDelay: '0s'
      }} />
      <div className="animate-breathe" style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-10%',
        width: '40%',
        height: '40%',
        background: 'radial-gradient(circle, rgba(255, 0, 85, 0.08) 0%, transparent 70%)',
        filter: 'blur(100px)',
        zIndex: -1,
        animationDelay: '2s'
      }} />

      <Navbar />

      {/* Hero Section */}
      <section style={{ 
        paddingTop: '10rem', 
        paddingBottom: '8rem', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        textAlign: 'center',
        paddingInline: '2rem'
      }}>
        <div className="glass animate-fade-in" style={{ 
          padding: '0.5rem 1.25rem', 
          borderRadius: '2rem', 
          fontSize: '0.85rem', 
          fontWeight: 600,
          color: '#00BAFF',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          border: '1px solid rgba(0,186,255,0.3)',
          boxShadow: '0 0 20px rgba(0,186,255,0.1)'
        }}>
          <Zap size={14} />
          <span>ATS Keyword Injection Engine</span>
        </div>
        
        <h1 className="animate-fade-in" style={{ 
          fontSize: 'clamp(3rem, 8vw, 5rem)', 
          maxWidth: '1000px', 
          lineHeight: 1.1, 
          marginBottom: '1.5rem',
          animationDelay: '0.1s',
          letterSpacing: '-0.03em'
        }}>
          You're Not Unqualified. <br/><span className="text-gradient">You're Just Invisible.</span>
        </h1>
        
        <p className="animate-fade-in" style={{ 
          fontSize: '1.25rem', 
          color: 'hsl(var(--muted-foreground))', 
          maxWidth: '650px', 
          marginBottom: '3rem',
          animationDelay: '0.2s',
          lineHeight: 1.6
        }}>
          Stop getting filtered out by bots before a human ever sees your name. CareerForge Pro injects the exact keywords recruiters demand, forcing your resume to the top of the pile.
        </p>

        <div className="animate-fade-in" style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          animationDelay: '0.3s'
        }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="/dashboard" className="btn btn-primary-intense" style={{ fontSize: '1.1rem', padding: '1.2rem 2.5rem', borderRadius: '1rem' }}>
                Fix My Resume Now
              </Link>
              <a href="#reality-check" className="btn btn-secondary" style={{ fontSize: '1.1rem', padding: '1.2rem 2.5rem', borderRadius: '1rem' }}>
                See the Cheat Code in Action
              </a>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', marginTop: '0.5rem' }}>Stop getting ghosted. No credit card required.</span>
        </div>
      </section>

      {/* REALITY CHECK SECTION */}
      <section id="reality-check" style={{ padding: '6rem 2rem', background: 'rgba(0,0,0,0.4)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <h2 className="animate-fade-in" style={{ fontSize: '3rem', marginBottom: '4rem', textAlign: 'center', letterSpacing: '-0.02em' }}>
                  Why You're Actually <span className="text-gradient-danger">Getting Ghosted</span>
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                  <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '1.5rem', borderTop: '2px solid #FF0055' }}>
                      <Target color="#FF0055" size={32} style={{ marginBottom: '1.5rem' }} />
                      <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>You're Speaking Human. They're Speaking Robot.</h3>
                      <p style={{ color: '#888', lineHeight: 1.6 }}>Recruiters don't read resumes; algorithms do. If you don't have a 90% keyword match, your PDF is going straight to the digital trash.</p>
                  </div>
                  <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '1.5rem', borderTop: '2px solid #FF4400' }}>
                      <AlertOctagon color="#FF4400" size={32} style={{ marginBottom: '1.5rem' }} />
                      <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Your Bullets Are Weak.</h3>
                      <p style={{ color: '#888', lineHeight: 1.6 }}>Using words like "Responsible for" or "Assisted with" screams amateur. You aren't quantifying your impact, so they assume you didn't have any.</p>
                  </div>
                  <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '1.5rem', borderTop: '2px solid #FF8800' }}>
                      <EyeOff color="#FF8800" size={32} style={{ marginBottom: '1.5rem' }} />
                      <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>You're Mass Applying Blind.</h3>
                      <p style={{ color: '#888', lineHeight: 1.6 }}>Sending the exact same resume to 50 different companies is a guaranteed way to get 50 rejections. Every submission must be mathematically tailored.</p>
                  </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                  <Link href="/dashboard" className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 700, textDecoration: 'none', borderBottom: '2px solid #00BAFF', paddingBottom: '4px' }}>
                      Stop Making These Mistakes. Fix Your Resume →
                  </Link>
              </div>
          </div>
      </section>

      {/* The Before vs. After Slider */}
      <section style={{ padding: '10rem 2rem', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>From Filtered Out to <span className="text-gradient">First Interview.</span></h2>
          <div style={{ position: 'relative', height: '300px', borderRadius: '2rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: '#0a0a0a', cursor: 'ew-resize' }} 
               onMouseMove={(e) => {
                   const rect = e.currentTarget.getBoundingClientRect();
                   const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                   setSliderPos((x / rect.width) * 100);
               }}
               onTouchMove={(e) => {
                   const rect = e.currentTarget.getBoundingClientRect();
                   const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
                   setSliderPos((x / rect.width) * 100);
               }}
          >
              {/* BAD RESUME (Underneath) */}
              <div style={{ position: 'absolute', inset: 0, padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', background: '#110505' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <X color="#ff0055" />
                      <span style={{ color: '#ff0055', fontWeight: 700, letterSpacing: '0.1em' }}>MATCH: 22%</span>
                  </div>
                  <p style={{ fontSize: '1.5rem', color: '#888', textAlign: 'left', lineHeight: 1.5, fontFamily: 'monospace' }}>
                      "Handled customer complaints and managed the backend database."
                  </p>
              </div>

              {/* GOOD RESUME (On Top, Clipped) */}
              <div style={{ position: 'absolute', inset: 0, padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', background: '#051118', clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <CheckCircle color="#00BAFF" />
                      <span style={{ color: '#00BAFF', fontWeight: 700, letterSpacing: '0.1em' }}>MATCH: 98%</span>
                  </div>
                  <p style={{ fontSize: '1.5rem', color: '#fff', textAlign: 'left', lineHeight: 1.5, fontWeight: 500 }}>
                      "Spearheaded backend PostgreSQL migration, resolving critical latency bottlenecks and reducing customer complaints by 40%."
                  </p>
              </div>

              {/* Slider Handle */}
              <div style={{ position: 'absolute', top: '0', bottom: '0', left: `${sliderPos}%`, width: '2px', background: '#00BAFF', transform: 'translateX(-50%)', pointerEvents: 'none', boxShadow: '0 0 10px #00BAFF' }}>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '40px', height: '40px', background: '#00BAFF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 800, boxShadow: '0 0 20px rgba(0,186,255,0.5)' }}>
                      <>↔</>
                  </div>
              </div>
          </div>
          <p style={{ color: '#666', marginTop: '1.5rem', fontSize: '0.9rem' }}>Drag to reveal the CareerForge cheat code.</p>
      </section>

      {/* Feature Grid Brief */}
      <section style={{ padding: '4rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '2rem'
          }}>
            {[
              { icon: <Shield color="#00BAFF" size={28} />, title: "Get Past the Robots", desc: "Applicant Tracking Systems don't care how hard you work. They care if you have the right words. We scrape the job description and inject the exact keywords you need to force your resume onto the recruiter's desk." },
              { icon: <Zap color="#00BAFF" size={28} />, title: "Stop Sounding Like Everyone Else", desc: "\"I helped with a project\" is how you get ignored. Our AI weaponizes your history—transforming weak bullets into aggressive, quantifiable achievements that demand respect." },
              { icon: <FileText color="#00BAFF" size={28} />, title: "Format-Unbreakable PDFs", desc: "You spent hours formatting your Word doc, just for the ATS portal to completely scramble it. Never again. Export sleek PDFs that look stunning to humans and parse perfectly for bots." },
              { icon: <BarChart3 color="#00BAFF" size={28} />, title: "Know You Won Before You Submit", desc: "Stop applying blind. Run our instant Match Score to see exactly how you stack up against the job posting before you hit submit. If it’s green, you’re golden." }
            ].map((feature, i) => (
              <div key={i} className="glass-card glass-card-magnetic animate-fade-in" style={{ 
                padding: '3rem', 
                borderRadius: '2rem', 
                textAlign: 'left',
                animationDelay: `${0.4 + i * 0.1}s`,
                marginTop: i % 2 !== 0 ? '3rem' : '0' // Staggered layout
              }}>
                <div style={{ 
                  marginBottom: '2rem', 
                  width: '64px', 
                  height: '64px', 
                  background: 'rgba(0,186,255,0.05)', 
                  border: '1px solid rgba(0,186,255,0.2)',
                  borderRadius: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'inset 0 0 20px rgba(0,186,255,0.1)'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>{feature.title}</h3>
                <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '1.05rem', lineHeight: 1.7 }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
      </section>

      {/* Wall of Proof */}
      <section style={{ marginTop: '8rem', padding: '6rem 2rem', background: 'radial-gradient(ellipse at center, rgba(0,186,255,0.05) 0%, transparent 70%)', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>The Keyword Injection is Basically a <span className="text-gradient">Cheat Code.</span></h2>
              <div className="glass-card" style={{ padding: '3.5rem', borderRadius: '2.5rem', textAlign: 'left', position: 'relative', marginTop: '4rem', border: '1px solid rgba(0,186,255,0.2)' }}>
                  <span style={{ position: 'absolute', top: '-2rem', left: '2rem', fontSize: '6rem', color: 'rgba(0,186,255,0.15)', lineHeight: 1, fontFamily: 'serif' }}>"</span>
                  <p style={{ fontSize: '1.35rem', lineHeight: 1.8, color: '#fff', fontStyle: 'italic', marginBottom: '2rem', position: 'relative', zIndex: 1 }}>
                      40 applications. Absolute silence. I ran my resume through CareerForge, hit a 95% match on a Senior PM role, and got 3 interviews in a week. Stop applying without this.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF0055, #00BAFF)' }} />
                      <div>
                          <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Sarah J.</div>
                          <div style={{ color: '#00BAFF', fontSize: '0.9rem', fontWeight: 600 }}>Senior Product Manager</div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" style={{ padding: '8rem 2rem 10rem', width: '100%' }}>
          <div className="glass-card" style={{ 
              background: 'linear-gradient(135deg, rgba(0, 186, 255, 0.08) 0%, rgba(255, 0, 85, 0.05) 100%)',
              padding: '6rem 2rem',
              borderRadius: '3rem',
              maxWidth: '1000px',
              margin: '0 auto',
              border: '1px solid rgba(0, 186, 255, 0.2)',
              textAlign: 'center'
          }}>
              <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>Ready to stop getting ghosted?</h2>
              <p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: '3rem', fontSize: '1.25rem' }}>Join 10,000+ professionals beating the ATS bots every single day.</p>
              <Link href="/dashboard" className="btn btn-primary-intense" style={{ padding: '1.25rem 4rem', fontSize: '1.2rem', borderRadius: '1rem' }}>
                  Fix My Resume Now
              </Link>
          </div>
      </section>

      <footer style={{ padding: '4rem 2rem', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', color: '#555', fontSize: '0.9rem' }}>
          © 2026 CareerForge Pro. We help you win.
      </footer>
    </main>
  );
}
