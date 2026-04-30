"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

export default function SplashScreen({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 2;
      });
    }, 30);

    // Start fade out at 1.8s, remove at 2.2s
    const fadeTimer = setTimeout(() => setFadeOut(true), 1800);
    const removeTimer = setTimeout(() => setShow(false), 2200);

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
          background: '#0B0F1A',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: fadeOut ? 0 : 1,
          transition: 'opacity 0.4s ease',
          pointerEvents: show ? 'all' : 'none',
        }}>
          {/* Ambient orbs */}
          <div style={{
            position: 'absolute', top: '-20%', left: '-10%', width: '50%', height: '50%',
            background: 'radial-gradient(circle, rgba(124,92,255,0.2) 0%, transparent 70%)',
            filter: 'blur(120px)',
          }} />
          <div style={{
            position: 'absolute', bottom: '-20%', right: '-10%', width: '50%', height: '50%',
            background: 'radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)',
            filter: 'blur(120px)',
          }} />

          {/* Logo */}
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '24px',
              background: 'linear-gradient(135deg, #7C5CFF 0%, #00D4FF 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 60px rgba(124,92,255,0.5), 0 0 120px rgba(124,92,255,0.2)',
              animation: 'splashPulse 1.5s ease-in-out infinite',
            }}>
              <Sparkles size={40} color="white" />
            </div>

            <div style={{ textAlign: 'center' }}>
              <h1 style={{
                fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em',
                color: '#fff', margin: 0,
              }}>
                CareerForge <span style={{
                  background: 'linear-gradient(135deg, #7C5CFF 0%, #00D4FF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>Pro</span>
              </h1>
              <p style={{ color: '#555', marginTop: '0.5rem', fontSize: '0.95rem', letterSpacing: '0.1em' }}>
                AI RESUME ARCHITECT
              </p>
            </div>

            {/* Progress bar */}
            <div style={{
              width: '200px', height: '2px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '99px', overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', width: `${progress}%`,
                background: 'linear-gradient(90deg, #7C5CFF, #00D4FF)',
                borderRadius: '99px',
                transition: 'width 0.03s linear',
                boxShadow: '0 0 10px rgba(124,92,255,0.8)',
              }} />
            </div>
          </div>

          <style>{`
            @keyframes splashPulse {
              0%, 100% { box-shadow: 0 0 60px rgba(124,92,255,0.5), 0 0 120px rgba(124,92,255,0.2); }
              50% { box-shadow: 0 0 80px rgba(124,92,255,0.8), 0 0 160px rgba(124,92,255,0.3); }
            }
          `}</style>
        </div>
      )}
      {children}
    </>
  );
}
