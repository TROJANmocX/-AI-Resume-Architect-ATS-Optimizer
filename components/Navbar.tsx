"use client";

import Link from "next/link";
import { Sparkles, LayoutDashboard, CreditCard, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <nav className="glass" style={{
      position: 'fixed',
      top: '1.5rem',
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
      boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)'
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, #00BAFF 0%, #0072FF 100%)',
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(0, 186, 255, 0.3)'
        }}>
          <Sparkles size={20} color="white" />
        </div>
        <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'white' }}>
          CareerForge <span className="text-gradient">Pro</span>
        </span>
      </Link>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {!isDashboard && (
          <>
            <Link href="/#features" style={{ fontSize: '0.9rem', fontWeight: 500, color: 'hsl(var(--muted-foreground))' }}>Features</Link>
            <Link href="/pricing" style={{ fontSize: '0.9rem', fontWeight: 500, color: 'hsl(var(--muted-foreground))' }}>Pricing</Link>
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
            <CreditCard size={14} /> Upgrade
          </Link>
        ) : (
          <Link href="/dashboard" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}>
            {isDashboard ? 'Dashboard' : 'Launch Dashboard'} <ChevronRight size={16} />
          </Link>
        )}
      </div>
    </nav>
  );
}
