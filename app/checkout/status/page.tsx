import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const success = searchParams.get('success');

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0a0a0a', 
      color: 'white', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ 
        padding: '3rem', 
        background: 'rgba(255,255,255,0.03)', 
        borderRadius: '2rem', 
        border: '1px solid rgba(255,255,255,0.1)',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: success ? '#00BAFF' : '#ff4444' }}>
          {success ? 'Subscription Active!' : 'Payment Cancelled'}
        </h1>
        <p style={{ color: '#888', marginBottom: '2rem' }}>
          {success ? 'Welcome to CareerForge Pro. Your unlimited access is now unlocked.' : 'Something went wrong with the payment process.'}
        </p>
        <a href="/dashboard" style={{ 
          padding: '1rem 2rem', 
          background: 'linear-gradient(135deg, #00BAFF, #0072FF)', 
          color: 'white', 
          textDecoration: 'none', 
          borderRadius: '0.75rem',
          fontWeight: 600
        }}>
          Return to Dashboard
        </a>
      </div>
    </div>
  );
}
