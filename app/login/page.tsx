"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2, ChevronLeft } from "lucide-react";

export default function Login() {
  return (
    <main style={{ minHeight: '100vh', width: '100%', background: '#0B0F1A', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      
      <Link href="/" style={{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 100, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#888'}>
        <ChevronLeft size={16} /> Back to Home
      </Link>

      {/* Ambient Background Orbs */}
      <div className="animate-breathe" style={{ position: 'absolute', top: '-20%', left: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(124,92,255,0.15) 0%, transparent 70%)', filter: 'blur(120px)', zIndex: 0 }} />
      <div className="animate-breathe" style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)', filter: 'blur(120px)', zIndex: 0, animationDelay: '2s' }} />

      {/* The Asymmetric Glass Card */}
      <div className="glass-auth-card animate-fade-in" style={{ position: 'relative', width: '100%', maxWidth: '1200px', minHeight: '700px', borderRadius: '2.5rem', display: 'flex', overflow: 'hidden', zIndex: 10 }}>
        
        {/* LEFT PANEL: Visual Proof (55%) */}
        <div style={{ flex: '0 0 55%', padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, transparent 100%)', borderRight: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #7C5CFF 0%, #00BAFF 100%)', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(124, 92, 255, 0.4)' }}>
              <Sparkles size={18} color="white" />
            </div>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'white' }}>
              CareerForge <span style={{ color: '#7C5CFF' }}>Pro</span>
            </span>
          </div>

          {/* Visual Overlap Comparison */}
          <div style={{ position: 'relative', height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2rem' }}>
            
            {/* Before (Blurred behind) */}
            <div style={{ position: 'absolute', left: '10%', top: '20%', width: '300px', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1rem', filter: 'blur(3px)', opacity: 0.5, transform: 'rotate(-5deg)' }}>
              <div style={{ width: '40%', height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px', marginBottom: '1rem' }} />
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginBottom: '0.5rem' }} />
              <div style={{ width: '80%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }} />
            </div>

            {/* After (In Focus, glowing) */}
            <div style={{ position: 'absolute', right: '15%', top: '10%', width: '340px', padding: '2rem', background: '#0B0F1A', border: '1px solid #7C5CFF', borderRadius: '1rem', boxShadow: '0 20px 50px rgba(124,92,255,0.2)', transform: 'rotate(2deg)', transition: 'transform 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(0deg) scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(2deg) scale(1)'}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                 <CheckCircle2 size={16} color="#00D4FF" />
                 <span style={{ color: '#00D4FF', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>ATS OPTIMIZED</span>
               </div>
               <p style={{ color: '#fff', fontSize: '1rem', lineHeight: 1.6, fontWeight: 500 }}>
                 "Engineered scalable data pipelines processing 5TB+ daily, improving query latency by 45%."
               </p>
            </div>
            
          </div>

          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>This is what recruiters actually see.</h2>
            <p style={{ color: '#888', fontSize: '1.1rem' }}>Stop applying with a resume that algorithms can't read.</p>
          </div>
        </div>

        {/* RIGHT PANEL: Form (45%) */}
        <div style={{ flex: '1', padding: '4rem 5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em', color: '#fff' }}>Start getting interviews.</h1>
            <p style={{ color: '#888', fontSize: '1rem' }}>Takes less than 60 seconds. No card needed.</p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <Link href="/dashboard" style={{ flex: 1, textDecoration: 'none' }}>
              <button className="btn-oauth" style={{ width: '100%' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
            </Link>
            <Link href="/dashboard" style={{ flex: 1, textDecoration: 'none' }}>
              <button className="btn-oauth" style={{ width: '100%' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                GitHub
              </button>
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ color: '#666', fontSize: '0.85rem', fontWeight: 500 }}>Or skip the form</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
          </div>

          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} onSubmit={(e) => { e.preventDefault(); window.location.href = '/dashboard'; }}>
            <div>
              <input type="text" placeholder="Full Name" className="input-glass" />
            </div>
            <div>
              <input type="email" placeholder="Email Address" className="input-glass" />
            </div>
            <div>
              <input type="password" placeholder="Password" className="input-glass" />
            </div>
            
            <button type="submit" className="btn-auth-primary" style={{ marginTop: '1rem' }}>
              Fix My Resume <ArrowRight size={18} />
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '2rem', color: '#666', fontSize: '0.9rem' }}>
            Already have an account? <Link href="/login" style={{ color: '#7C5CFF', textDecoration: 'none', fontWeight: 600 }}>Log in</Link>
          </p>

        </div>
      </div>
    </main>
  );
}
