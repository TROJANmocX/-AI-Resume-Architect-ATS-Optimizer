"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, Zap, Flame } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <>
      <style>{`
        .nav-link {
          position: relative;
          text-decoration: none;
          transition: all 0.2s ease;
          font-size: 0.9rem;
          font-weight: 500;
          color: hsl(var(--muted-foreground));
        }
        .nav-link::after {
          content: '•';
          position: absolute;
          bottom: -15px;
          left: 50%;
          transform: translateX(-50%);
          color: #00BAFF;
          opacity: 0;
          transition: all 0.2s ease;
          font-size: 1.5rem;
          line-height: 0;
        }
        .nav-link:hover {
          color: #fff !important;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }
        .nav-link:hover::after {
          bottom: -8px;
          opacity: 1;
          text-shadow: 0 0 10px #00BAFF;
        }
        .logo-hover {
          transition: all 0.3s ease;
        }
        .logo-hover:hover .logo-bg {
          box-shadow: 0 0 30px rgba(0, 186, 255, 0.6) !important;
          transform: scale(1.05);
        }
      `}</style>

      {/* TOP STRIP - Trust Bar */}
      {!isDashboard && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            background: 'linear-gradient(90deg, #110505 0%, #060B14 50%, #051118 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            zIndex: 110,
            padding: '0.4rem 1rem',
            textAlign: 'center',
            fontSize: '0.8rem',
            color: '#e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            fontWeight: 500
          }}>
            <Flame size={14} color="#FF4400" />
            <span>Join 10,000+ job seekers averaging 3x more interviews this week.</span>
          </div>
      )}

      {/* MAIN NAVBAR */}
      <nav className="glass" style={{
        position: 'fixed',
        top: isDashboard ? '1.5rem' : '3.5rem', /* Shift down if Top Strip exists */
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 3rem)',
        maxWidth: '1200px',
        zIndex: 100,
        padding: '0.75rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: '1.25rem',
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.05)'
      }}>
        <Link href="/" className="logo-hover" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div className="logo-bg" style={{
            background: 'linear-gradient(135deg, #00BAFF 0%, #0072FF 100%)',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0, 186, 255, 0.3)',
            transition: 'all 0.3s ease'
          }}>
            <Sparkles size={20} color="white" />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'white' }}>
            CareerForge <span className="text-gradient">Pro</span>
          </span>
        </Link>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {!isDashboard && (
            <>
              <Link href="/#how-it-works" className="nav-link">See the Cheat Code</Link>
              <Link href="/#wall-of-proof" className="nav-link">Wall of Proof</Link>
              <Link href="/pricing" className="nav-link" style={{ opacity: 0.7 }}>Pricing</Link>
            </>
          )}
          
          {isDashboard ? (
            <Link href="/pricing" className="glass" style={{ 
              padding: '0.5rem 1rem', 
              borderRadius: '0.75rem', 
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#00BAFF',
              border: '1px solid rgba(0, 186, 255, 0.2)'
            }}>
              <Zap size={14} /> Upgrade
            </Link>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'linear-gradient(135deg, #FF0055, #FF8800)', color: '#fff', fontSize: '0.6rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', letterSpacing: '1px', boxShadow: '0 0 10px rgba(255,0,85,0.5)', zIndex: 10 }}>
                FREE
              </div>
              <Link href="/dashboard" className="btn btn-primary-intense" style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem', borderRadius: '0.75rem', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                Fix My Resume Now <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
