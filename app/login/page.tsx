"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function Login() {
  return (
    <main style={{ minHeight: '100vh', width: '100%', background: 'var(--bg-editorial)', position: 'relative', display: 'flex' }}>
      
      <Link href="/" style={{ position: 'absolute', top: '2rem', left: '2.5rem', zIndex: 100, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted-foreground)', textDecoration: 'none', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--foreground)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted-foreground)'}>
        <ChevronLeft size={16} /> Return
      </Link>

      <div style={{ display: 'flex', width: '100%' }}>
        
        {/* LEFT PANEL: Editorial Statement (50%) */}
        <div style={{ flex: '1', padding: '6rem 4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRight: '1px solid var(--border)' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 600, letterSpacing: '0.02em', color: 'var(--foreground)', fontFamily: 'var(--font-serif)', marginBottom: '4rem', display: 'block' }}>
            CareerForge <span style={{ fontStyle: 'italic', color: 'var(--accent-editorial)' }}>Pro</span>
          </span>

          <h1 style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', lineHeight: 1.1, marginBottom: '2rem' }}>
            The standard <br />
            <span style={{ fontStyle: 'italic', color: 'var(--accent-editorial)' }}>for modern</span> <br />
            applications.
          </h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '1.1rem', lineHeight: 1.6, maxWidth: '400px', fontWeight: 300 }}>
            Step into the workspace designed to craft documents that demand attention and command results.
          </p>
        </div>

        {/* RIGHT PANEL: Minimal Form (50%) */}
        <div style={{ flex: '1', padding: '4rem 6rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--bg-surface)' }}>
          
          <div style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Access Workspace</h2>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.95rem' }}>Enter your details to continue.</p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
            <Link href="/dashboard" style={{ flex: 1, textDecoration: 'none' }}>
              <button className="btn-oauth">
                <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.8 }}>
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
            </Link>
            <Link href="/dashboard" style={{ flex: 1, textDecoration: 'none' }}>
              <button className="btn-oauth">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="var(--foreground)" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.8 }}>
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                GitHub
              </button>
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <span style={{ color: 'var(--muted-foreground)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Or</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>

          <form style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} onSubmit={(e) => { e.preventDefault(); window.location.href = '/dashboard'; }}>
            <div>
              <input type="text" placeholder="Full Name" className="input-premium" />
            </div>
            <div>
              <input type="email" placeholder="Email Address" className="input-premium" />
            </div>
            <div>
              <input type="password" placeholder="Password" className="input-premium" />
            </div>
            
            <button type="submit" className="btn-auth-primary" style={{ marginTop: '2rem' }}>
              Continue
            </button>
          </form>

        </div>
      </div>
    </main>
  );
}
