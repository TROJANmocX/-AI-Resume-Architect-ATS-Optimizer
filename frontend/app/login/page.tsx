"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2, AlertCircle, CheckCircle } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    // UNIVERSAL BYPASS LOGIN
    if (email === "admin@careerforge.com" && password === "admin123") {
      const mockUser = {
        id: "admin-master-key",
        name: "Admin User",
        email: "admin@careerforge.com"
      };
      const mockToken = "admin.jwt.token." + Date.now();

      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      setSuccess('Admin Bypass Successful!');
      setTimeout(() => {
        router.push('/dashboard');
      }, 800);
      return;
    }

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin ? { email, password } : { name, email, password };

      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        setIsLoading(false);
        return;
      }

      // Save token and user info to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setSuccess(isLogin ? 'Welcome back!' : 'Account created successfully!');

      // Redirect to dashboard after a brief delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 800);
    } catch (err) {
      setError('Unable to connect to server. Please try again.');
      setIsLoading(false);
    }
  };

  const handleGuestAccess = () => {
    // Generate a mock token and user to bypass authentication locally
    const mockUser = {
      id: "guest-" + Math.random().toString(36).substr(2, 9),
      name: "Guest User",
      email: "guest@careerforge.local"
    };
    
    // Create a dummy JWT-like string
    const mockToken = "mock.jwt.token." + Date.now();

    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    router.push('/dashboard');
  };

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

        {/* RIGHT PANEL: Functional Auth Form (50%) */}
        <div style={{ flex: '1', padding: '4rem 6rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--bg-surface)' }}>
          
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.95rem' }}>
              {isLogin ? 'Sign in to access your workspace.' : 'Register to start crafting your resume.'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem', borderRadius: '8px', background: 'rgba(220, 38, 38, 0.08)', border: '1px solid rgba(220, 38, 38, 0.2)', marginBottom: '2rem', color: '#dc2626', fontSize: '0.9rem' }}>
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem', borderRadius: '8px', background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.2)', marginBottom: '2rem', color: '#16a34a', fontSize: '0.9rem' }}>
              <CheckCircle size={18} />
              {success}
            </div>
          )}

          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleSubmit}>
            
            {/* Name field (only for registration) */}
            {!isLogin && (
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="input-premium"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            )}
            
            <div>
              <input
                type="email"
                placeholder="Email Address"
                className="input-premium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className="input-premium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              {!isLogin && (
                <p style={{ color: 'var(--muted-foreground)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                  Must be at least 6 characters
                </p>
              )}
            </div>
            
            <button
              type="submit"
              className="btn-auth-primary"
              disabled={isLoading}
              style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Toggle between Login and Register */}
          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--accent-editorial)', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'underline', textUnderlineOffset: '3px' }}
              >
                {isLogin ? 'Register' : 'Sign In'}
              </button>
            </p>
          </div>

          <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
            <button 
              onClick={handleGuestAccess}
              style={{ width: '100%', background: 'transparent', border: '1px solid var(--border)', padding: '1rem', color: 'var(--muted-foreground)', cursor: 'pointer', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', transition: 'all 0.3s' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--foreground)'; e.currentTarget.style.color = 'var(--foreground)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted-foreground)'; }}
            >
              Continue as Guest
            </button>
          </div>
          </div>
        </div>
      </main>
  );
}
