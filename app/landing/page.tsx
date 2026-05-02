"use client";

import Navbar from "@/components/Navbar";
import { ArrowRight, CheckCircle, Zap, Shield, FileText, BarChart3, X, AlertOctagon, Target, EyeOff, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [sliderPos, setSliderPos] = useState(50);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', background: 'hsl(var(--background))' }}>
      {/* Dynamic Background Orbs */}
      <div className="animate-breathe" style={{
        position: 'absolute',
        top: '-20%',
        left: '-10%',
        width: '60%',
        height: '60%',
        background: 'radial-gradient(circle, rgba(124, 92, 255, 0.15) 0%, transparent 70%)',
        filter: 'blur(120px)',
        zIndex: 0,
        animationDuration: '15s'
      }} />
      <div className="animate-breathe" style={{
        position: 'absolute',
        bottom: '-20%',
        right: '-10%',
        width: '50%',
        height: '50%',
        background: 'radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%)',
        filter: 'blur(100px)',
        zIndex: 0,
        animationDuration: '20s',
        animationDelay: '-5s'
      }} />
      
      {/* Grid pattern overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <Navbar />

      {/* Hero Section */}
      <section style={{ 
        paddingTop: '12rem', 
        paddingBottom: '6rem', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        textAlign: 'center',
        paddingInline: '2rem',
        position: 'relative',
        zIndex: 10
      }}>
        <div className="glass animate-fade-in" style={{ 
          padding: '0.5rem 1.25rem', 
          borderRadius: '2rem', 
          fontSize: '0.85rem', 
          fontWeight: 600,
          color: '#00D4FF',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          border: '1px solid rgba(0, 212, 255, 0.3)',
          boxShadow: '0 0 20px rgba(0, 212, 255, 0.1)'
        }}>
          <Zap size={14} />
          <span>Next-Gen ATS Optimization Engine</span>
        </div>
        
        <h1 className="animate-fade-in" style={{ 
          fontSize: 'clamp(3rem, 8vw, 5.5rem)', 
          maxWidth: '1100px', 
          lineHeight: 1.1, 
          marginBottom: '1.5rem',
          animationDelay: '0.1s',
          letterSpacing: '-0.04em'
        }}>
          Stop Applying Blindly.<br/>
          <span style={{ 
            background: 'linear-gradient(135deg, #7C5CFF 0%, #00D4FF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 10px 40px rgba(124, 92, 255, 0.2)'
          }}>Start Engineering Offers.</span>
        </h1>
        
        <p className="animate-fade-in" style={{ 
          fontSize: '1.25rem', 
          color: 'hsl(var(--muted-foreground))', 
          maxWidth: '700px', 
          marginBottom: '3.5rem',
          animationDelay: '0.2s',
          lineHeight: 1.6
        }}>
          CareerForge Pro analyzes job descriptions, dynamically restructures your experience, and injects high-priority keywords to guarantee you bypass the algorithms.
        </p>

        <div className="animate-fade-in" style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          animationDelay: '0.3s'
        }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="/login" className="btn btn-primary-intense" style={{ 
                fontSize: '1.1rem', 
                padding: '1.2rem 2.5rem', 
                borderRadius: '1rem',
                background: 'linear-gradient(135deg, #7C5CFF 0%, #00D4FF 100%)',
                boxShadow: '0 10px 30px -10px rgba(124, 92, 255, 0.6)'
              }}>
                Engineer My Resume
              </Link>
              <a href="#reality-check" className="btn btn-secondary" style={{ 
                fontSize: '1.1rem', 
                padding: '1.2rem 2.5rem', 
                borderRadius: '1rem',
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(255,255,255,0.1)'
              }}>
                See How It Works
              </a>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', marginTop: '0.5rem' }}>No credit card required. Instantly see your match score.</span>
        </div>

      </section>

      {/* REALITY CHECK SECTION */}
      <section id="reality-check" style={{ padding: '8rem 2rem', position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
              <h2 className="animate-fade-in" style={{ fontSize: '3rem', marginBottom: '4rem', textAlign: 'center', letterSpacing: '-0.02em' }}>
                  The Reason You're <span className="text-gradient-danger">Still Waiting</span>
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                  <div className="glass-card glass-card-magnetic" style={{ padding: '3rem', borderRadius: '1.5rem', borderTop: '2px solid #FF0055' }}>
                      <div style={{ background: 'rgba(255, 0, 85, 0.1)', width: '60px', height: '60px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '1px solid rgba(255, 0, 85, 0.2)' }}>
                        <Target color="#FF0055" size={28} />
                      </div>
                      <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Failing the Robot Test</h3>
                      <p style={{ color: 'hsl(var(--muted-foreground))', lineHeight: 1.6 }}>75% of resumes never reach a human. If you aren't scoring a 90%+ keyword match with the JD, you are instantly discarded by the ATS.</p>
                  </div>
                  <div className="glass-card glass-card-magnetic" style={{ padding: '3rem', borderRadius: '1.5rem', borderTop: '2px solid #FF8800' }}>
                      <div style={{ background: 'rgba(255, 136, 0, 0.1)', width: '60px', height: '60px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '1px solid rgba(255, 136, 0, 0.2)' }}>
                        <AlertOctagon color="#FF8800" size={28} />
                      </div>
                      <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Weak Bullet Points</h3>
                      <p style={{ color: 'hsl(var(--muted-foreground))', lineHeight: 1.6 }}>"Responsible for" is the fastest way to get rejected. You need hard metrics, action verbs, and proven impact to stand out.</p>
                  </div>
                  <div className="glass-card glass-card-magnetic" style={{ padding: '3rem', borderRadius: '1.5rem', borderTop: '2px solid #7C5CFF' }}>
                      <div style={{ background: 'rgba(124, 92, 255, 0.1)', width: '60px', height: '60px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '1px solid rgba(124, 92, 255, 0.2)' }}>
                        <EyeOff color="#7C5CFF" size={28} />
                      </div>
                      <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Spray and Pray Applied</h3>
                      <p style={{ color: 'hsl(var(--muted-foreground))', lineHeight: 1.6 }}>Using one generic resume for every application guarantees a 0% callback rate. Every single submission must be mathematically tailored.</p>
                  </div>
              </div>
          </div>
      </section>

      {/* The Before vs. After Slider */}
      <section style={{ padding: '6rem 2rem', maxWidth: '1000px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>From Discarded to <span style={{ color: '#00D4FF' }}>First Interview.</span></h2>
          <p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: '3rem', fontSize: '1.1rem' }}>Drag the slider to reveal how we transform a weak bullet point.</p>
          
          <div className="glass-panel" style={{ 
            position: 'relative', 
            height: '350px', 
            borderRadius: '2rem', 
            overflow: 'hidden', 
            cursor: 'ew-resize',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
          }} 
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
              <div style={{ position: 'absolute', inset: 0, padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', background: '#0B0F1A' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', background: 'rgba(255,0,85,0.1)', padding: '0.5rem 1rem', borderRadius: '1rem', border: '1px solid rgba(255,0,85,0.2)' }}>
                      <X color="#ff0055" size={20} />
                      <span style={{ color: '#ff0055', fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.9rem' }}>ATS MATCH: 12%</span>
                  </div>
                  <p style={{ fontSize: '1.8rem', color: '#666', textAlign: 'left', lineHeight: 1.5, fontFamily: 'monospace' }}>
                      "Helped the team build the new backend database and fixed some bugs."
                  </p>
              </div>

              {/* GOOD RESUME (On Top, Clipped) */}
              <div style={{ position: 'absolute', inset: 0, padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', background: 'linear-gradient(135deg, #0B0F1A 0%, rgba(124,92,255,0.1) 100%)', clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', background: 'rgba(0,212,255,0.1)', padding: '0.5rem 1rem', borderRadius: '1rem', border: '1px solid rgba(0,212,255,0.2)' }}>
                      <CheckCircle color="#00D4FF" size={20} />
                      <span style={{ color: '#00D4FF', fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.9rem' }}>ATS MATCH: 98%</span>
                  </div>
                  <p style={{ fontSize: '1.8rem', color: '#fff', textAlign: 'left', lineHeight: 1.5, fontWeight: 500 }}>
                      "Architected scalable PostgreSQL database migration, resolving critical latency bottlenecks and reducing P99 query time by 40%."
                  </p>
              </div>

              {/* Slider Handle */}
              <div style={{ position: 'absolute', top: '0', bottom: '0', left: `${sliderPos}%`, width: '3px', background: '#00D4FF', transform: 'translateX(-50%)', pointerEvents: 'none', boxShadow: '0 0 15px #00D4FF' }}>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '48px', height: '48px', background: 'linear-gradient(135deg, #00D4FF, #7C5CFF)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, boxShadow: '0 0 30px rgba(0,212,255,0.6)', border: '2px solid rgba(255,255,255,0.8)' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                  </div>
              </div>
          </div>
      </section>

      {/* Feature Grid */}
      <section style={{ padding: '8rem 2rem', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{ fontSize: '3rem' }}>The Ultimate <span style={{ color: '#7C5CFF' }}>Advantage.</span></h2>
            <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '1.2rem', marginTop: '1rem' }}>Built for the modern hiring landscape.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '2.5rem'
          }}>
            {[
              { icon: <Shield color="#00D4FF" size={32} />, title: "Bypass the Bots", desc: "Applicant Tracking Systems are ruthless. We inject the exact keywords you need to guarantee your resume hits the recruiter's desk." },
              { icon: <Zap color="#7C5CFF" size={32} />, title: "Quantify Your Impact", desc: "Our AI engine automatically reframes your past experience into powerful, metrics-driven bullet points that demand attention." },
              { icon: <LayoutDashboard color="#00D4FF" size={32} />, title: "Premium Dark Studio", desc: "Edit your career history in a gorgeous, distraction-free environment designed to help you focus and write better content." },
              { icon: <BarChart3 color="#7C5CFF" size={32} />, title: "Instant Match Scoring", desc: "Never guess again. See a live, predictive match score against your target job description before you ever click submit." }
            ].map((feature, i) => (
              <div key={i} className="glass-panel glass-card-magnetic animate-fade-in" style={{ 
                padding: '3rem', 
                borderRadius: '2rem', 
                textAlign: 'left',
                animationDelay: `${0.4 + i * 0.1}s`,
                marginTop: i % 2 !== 0 ? '4rem' : '0', // Staggered layout
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', 
                  background: i % 2 === 0 ? 'rgba(0, 212, 255, 0.05)' : 'rgba(124, 92, 255, 0.05)',
                  filter: 'blur(40px)', borderRadius: '50%'
                }} />
                
                <div style={{ 
                  marginBottom: '2rem', 
                  width: '72px', 
                  height: '72px', 
                  background: 'rgba(255,255,255,0.02)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `inset 0 0 20px ${i % 2 === 0 ? 'rgba(0,212,255,0.1)' : 'rgba(124,92,255,0.1)'}`
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '1.6rem', marginBottom: '1rem', fontWeight: 700 }}>{feature.title}</h3>
                <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '1.1rem', lineHeight: 1.7 }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" style={{ padding: '6rem 2rem 10rem', width: '100%', position: 'relative', zIndex: 10 }}>
          <div className="glass-panel" style={{ 
              background: 'linear-gradient(135deg, rgba(124, 92, 255, 0.1) 0%, rgba(0, 212, 255, 0.05) 100%)',
              padding: '6rem 3rem',
              borderRadius: '3rem',
              maxWidth: '1000px',
              margin: '0 auto',
              border: '1px solid rgba(124, 92, 255, 0.3)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
          }}>
              <div style={{
                  position: 'absolute',
                  top: '-50%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '100%',
                  height: '100%',
                  background: 'radial-gradient(ellipse at top, rgba(124,92,255,0.3) 0%, transparent 70%)',
                  pointerEvents: 'none'
              }} />
              <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', letterSpacing: '-0.02em', position: 'relative', zIndex: 2 }}>Ready to <span style={{ color: '#fff' }}>Dominate?</span></h2>
              <p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: '3rem', fontSize: '1.3rem', maxWidth: '600px', margin: '0 auto 3rem', position: 'relative', zIndex: 2 }}>Join 10,000+ top-tier professionals beating the ATS bots every single day.</p>
              <Link href="/login" className="btn btn-primary-intense" style={{ 
                padding: '1.25rem 4rem', 
                fontSize: '1.2rem', 
                borderRadius: '1rem',
                background: 'linear-gradient(135deg, #7C5CFF 0%, #00D4FF 100%)',
                border: '1px solid rgba(255,255,255,0.2)',
                position: 'relative',
                zIndex: 2
              }}>
                  Build Your Resume Free
              </Link>
          </div>
      </section>

      <footer style={{ 
        padding: '3rem 2rem', 
        borderTop: '1px solid rgba(255,255,255,0.05)', 
        textAlign: 'center', 
        color: 'hsl(var(--muted-foreground))', 
        fontSize: '0.9rem',
        background: '#060A10'
      }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'linear-gradient(135deg, #7C5CFF, #00D4FF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={14} color="white" />
                </div>
                <span style={{ fontWeight: 600, color: 'white' }}>CareerForge Pro</span>
              </div>
              <div>© 2026 CareerForge Pro. All rights reserved.</div>
          </div>
      </footer>
    </main>
  );
}

