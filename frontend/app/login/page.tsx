"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2, AlertCircle, CheckCircle, Github, Mail } from "lucide-react";

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
    const mockUser = {
      id: "guest-" + Math.random().toString(36).substr(2, 9),
      name: "Guest User",
      email: "guest@careerforge.local"
    };
    const mockToken = "mock.jwt.token." + Date.now();
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    router.push('/dashboard');
  };

  return (
    <main style={{ minHeight: '100vh', width: '100%', background: 'var(--bg-editorial)', position: 'relative', display: 'flex', overflow: 'hidden' }}>
      
      {/* Return Link */}
      <Link href="/" style={{ 
        position: 'absolute', top: '2.5rem', left: '2.5rem', zIndex: 100, 
        display: 'flex', alignItems: 'center', gap: '0.5rem', 
        color: 'var(--muted-foreground)', textDecoration: 'none', 
        fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', 
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' 
      }} onMouseEnter={(e) => {
        e.currentTarget.style.color = 'var(--foreground)';
        e.currentTarget.style.transform = 'translateX(-4px)';
      }} onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--muted-foreground)';
        e.currentTarget.style.transform = 'translateX(0)';
      }}>
        <ChevronLeft size={14} /> Back to Entry
      </Link>

      <div style={{ display: 'flex', width: '100%', flex: 1 }}>
        
        {/* LEFT PANEL: Visual Identity */}
        <div style={{ 
          flex: '1.2', 
          position: 'relative',
          display: 'none', 
          flexDirection: 'column', 
          justifyContent: 'space-between',
          padding: '4rem',
          overflow: 'hidden',
          background: 'var(--text-editorial)'
        }} className="md:flex">
          {/* Background Image with Overlay */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: 'url("/images/luxury_workspace_editorial.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.65,
            filter: 'grayscale(20%) contrast(110%)'
          }} />
          
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(to bottom, rgba(26,26,26,0.4) 0%, rgba(26,26,26,0.8) 100%)',
          }} />

          <div style={{ position: 'relative', zIndex: 10 }}>
            <span style={{ 
              fontSize: '1rem', fontWeight: 600, letterSpacing: '0.3em', 
              color: 'var(--bg-editorial)', textTransform: 'uppercase',
              display: 'block', marginBottom: '1rem'
            }}>
              CareerForge <span style={{ fontStyle: 'italic', color: 'var(--accent-editorial)' }}>Studio</span>
            </span>
            <div style={{ height: '1px', width: '60px', background: 'var(--accent-editorial)' }} />
          </div>

          <div style={{ position: 'relative', zIndex: 10 }}>
            <h1 style={{ 
              fontSize: 'clamp(3rem, 4vw, 5rem)', 
              lineHeight: 0.95, 
              color: 'var(--bg-editorial)',
              marginBottom: '2rem',
              letterSpacing: '-0.03em'
            }}>
              Refined <br />
              <span style={{ fontStyle: 'italic', fontFamily: 'var(--font-serif)', color: 'var(--accent-editorial)' }}>Excellence.</span>
            </h1>
            <p style={{ 
              color: 'rgba(245, 241, 235, 0.7)', 
              fontSize: '1rem', 
              lineHeight: 1.6, 
              maxWidth: '380px', 
              fontWeight: 300,
              letterSpacing: '0.01em'
            }}>
              Join the elite circle of professionals who define their future through meticulous design and strategic presentation.
            </p>
          </div>

          <div style={{ position: 'relative', zIndex: 10, display: 'flex', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: 'var(--accent-editorial)', fontSize: '1.5rem', fontWeight: 500 }}>01</span>
              <span style={{ color: 'var(--bg-editorial)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Precision</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: 'var(--accent-editorial)', fontSize: '1.5rem', fontWeight: 500 }}>02</span>
              <span style={{ color: 'var(--bg-editorial)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Elegance</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: 'var(--accent-editorial)', fontSize: '1.5rem', fontWeight: 500 }}>03</span>
              <span style={{ color: 'var(--bg-editorial)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Impact</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Authentication Surface */}
        <div style={{ 
          flex: '1', 
          padding: '6rem clamp(2rem, 8vw, 6rem)', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          background: 'var(--bg-surface)',
          position: 'relative'
        }}>
          
          <div style={{ maxWidth: '440px', width: '100%', margin: '0 auto' }}>
            <div style={{ marginBottom: '3.5rem' }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <div style={{ height: '2px', width: '40px', background: 'var(--foreground)', marginBottom: '1.5rem' }} />
              <p style={{ color: 'var(--muted-foreground)', fontSize: '0.95rem', fontWeight: 300 }}>
                {isLogin ? 'Secure access to your professional suite.' : 'Begin your journey with the industry standard.'}
              </p>
            </div>

            {/* Error/Success Feedbacks */}
            {error && (
              <div style={{ 
                display: 'flex', alignItems: 'center', gap: '0.75rem', 
                padding: '1rem', borderRadius: '0', 
                background: 'rgba(139, 0, 0, 0.05)', 
                borderLeft: '3px solid var(--destructive)', 
                marginBottom: '2rem', color: 'var(--destructive)', fontSize: '0.85rem' 
              }}>
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {success && (
              <div style={{ 
                display: 'flex', alignItems: 'center', gap: '0.75rem', 
                padding: '1rem', borderRadius: '0', 
                background: 'rgba(34, 197, 94, 0.05)', 
                borderLeft: '3px solid #16a34a', 
                marginBottom: '2rem', color: '#16a34a', fontSize: '0.85rem' 
              }}>
                <CheckCircle size={16} />
                {success}
              </div>
            )}

            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }} onSubmit={handleSubmit}>
              {!isLogin && (
                <div style={{ position: 'relative' }}>
                  <label style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted-foreground)', display: 'block', marginBottom: '0.25rem' }}>Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="input-premium"
                    style={{ padding: '0.5rem 0' }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                  />
                </div>
              )}
              
              <div style={{ position: 'relative' }}>
                <label style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted-foreground)', display: 'block', marginBottom: '0.25rem' }}>Email Address</label>
                <input
                  type="email"
                  placeholder="name@domain.com"
                  className="input-premium"
                  style={{ padding: '0.5rem 0' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <label style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted-foreground)' }}>Password</label>
                  {isLogin && (
                    <button type="button" style={{ background: 'none', border: 'none', color: 'var(--accent-editorial)', fontSize: '0.7rem', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Forgot?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input-premium"
                  style={{ padding: '0.5rem 0' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              
              <button
                type="submit"
                className="btn-auth-primary"
                disabled={isLoading}
                style={{ 
                  marginTop: '1.5rem', 
                  height: '3.5rem',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  opacity: isLoading ? 0.7 : 1
                }}
              >
                {isLoading ? (
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '2.5rem 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              <span style={{ fontSize: '0.65rem', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>or continue with</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button className="btn-oauth" style={{ borderRadius: 0 }}>
                <Github size={18} /> <span style={{ fontSize: '0.8rem' }}>Github</span>
              </button>
              <button className="btn-oauth" style={{ borderRadius: 0 }}>
                <Mail size={18} /> <span style={{ fontSize: '0.8rem' }}>Google</span>
              </button>
            </div>

            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--muted-foreground)', fontSize: '0.85rem', fontWeight: 300 }}>
                {isLogin ? "New to the Studio?" : 'Already a member?'}{' '}
                <button
                  onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
                  style={{ 
                    background: 'none', border: 'none', 
                    color: 'var(--accent-editorial)', cursor: 'pointer', 
                    fontWeight: 500, fontSize: '0.85rem', 
                    textDecoration: 'underline', textUnderlineOffset: '4px',
                    marginLeft: '0.5rem'
                  }}
                >
                  {isLogin ? 'Create an account' : 'Sign in to access'}
                </button>
              </p>
            </div>

            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
              <button 
                onClick={handleGuestAccess}
                style={{ 
                  width: '100%', background: 'transparent', border: 'none', 
                  color: 'var(--muted-foreground)', cursor: 'pointer', 
                  fontSize: '0.7rem', textTransform: 'uppercase', 
                  letterSpacing: '0.15em', transition: 'all 0.3s' 
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--foreground)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted-foreground)'}
              >
                Access as Guest
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
