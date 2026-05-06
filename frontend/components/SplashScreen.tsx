"use client";

import { useState, useEffect } from "react";

export default function SplashScreen({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress line slowly
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 2;
      });
    }, 40);

    // Start fade out at 2.0s, remove at 2.6s
    const fadeTimer = setTimeout(() => setFadeOut(true), 2000);
    const removeTimer = setTimeout(() => setShow(false), 2600);

    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <>
      {show && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'var(--bg-editorial)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: fadeOut ? 0 : 1,
          transition: 'opacity 0.6s ease',
          pointerEvents: show ? 'all' : 'none',
        }}>

          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem' }}>
            
            <div style={{ textAlign: 'center' }}>
              <h1 style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 500, letterSpacing: '0.02em',
                color: 'var(--foreground)', margin: 0, fontFamily: 'var(--font-serif)'
              }}>
                CareerForge <span style={{ fontStyle: 'italic', color: 'var(--accent-editorial)' }}>Pro</span>
              </h1>
              <p style={{ color: 'var(--muted-foreground)', marginTop: '1rem', fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Refining your career narrative
              </p>
            </div>

            {/* Minimal Progress line */}
            <div style={{
              width: '150px', height: '1px',
              background: 'var(--border)',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', width: `${progress}%`,
                background: 'var(--foreground)',
                position: 'absolute',
                left: 0, top: 0,
                transition: 'width 0.05s linear',
              }} />
            </div>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
