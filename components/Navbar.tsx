"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <>
      <style>{`
        .nav-link {
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 0.85rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--muted-foreground);
          border-bottom: 1px solid transparent;
          padding-bottom: 4px;
        }
        .nav-link:hover {
          color: var(--foreground);
          border-bottom-color: var(--foreground);
        }
        .logo-hover {
          transition: opacity 0.3s ease;
        }
        .logo-hover:hover {
          opacity: 0.7;
        }
      `}</style>

      {/* MAIN NAVBAR */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 100,
        padding: '1.5rem 5%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'transparent',
      }}>
        <Link href="/" className="logo-hover" style={{ textDecoration: 'none' }}>
          <span style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '1.5rem', 
            fontWeight: 600, 
            letterSpacing: '0.02em', 
            color: 'var(--foreground)' 
          }}>
            CareerForge <span style={{ fontStyle: 'italic', color: 'var(--accent-editorial)' }}>Pro</span>
          </span>
        </Link>

        <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
          {!isDashboard && (
            <>
              <Link href="/pricing" className="nav-link">Pricing</Link>
            </>
          )}
          
          {isDashboard ? (
            <Link href="/pricing" style={{ 
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--accent-editorial)',
              borderBottom: '1px solid var(--accent-editorial)',
              paddingBottom: '2px',
              textDecoration: 'none',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--foreground)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--accent-editorial)'}
            >
              Upgrade
            </Link>
          ) : (
            <Link href="/login" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '0.85rem' }}>
              Optimize Resume
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
