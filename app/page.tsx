import Navbar from "@/components/Navbar";
import { ArrowRight, CheckCircle, Zap, Shield, FileText, BarChart3, Globe, Rocket } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Background Orbs */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '40%',
        height: '40%',
        background: 'radial-gradient(circle, rgba(0, 186, 255, 0.15) 0%, transparent 70%)',
        filter: 'blur(100px)',
        zIndex: -1
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-10%',
        width: '40%',
        height: '40%',
        background: 'radial-gradient(circle, rgba(0, 114, 255, 0.15) 0%, transparent 70%)',
        filter: 'blur(100px)',
        zIndex: -1
      }} />

      <Navbar />

      {/* Hero Section */}
      <section style={{ 
        paddingTop: '10rem', 
        paddingBottom: '8rem', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        textAlign: 'center',
        paddingInline: '2rem'
      }}>
        <div className="glass animate-fade-in" style={{ 
          padding: '0.5rem 1rem', 
          borderRadius: '2rem', 
          fontSize: '0.8rem', 
          fontWeight: 500,
          color: '#00BAFF',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Zap size={14} />
          <span>Powered by GPT-4o-mini Agent</span>
        </div>
        
        <h1 className="animate-fade-in" style={{ 
          fontSize: 'clamp(3rem, 8vw, 4.5rem)', 
          maxWidth: '900px', 
          lineHeight: 1.1, 
          marginBottom: '1.5rem',
          animationDelay: '0.1s'
        }}>
          Don't Just Apply. <span className="text-gradient">Get Hired.</span>
        </h1>
        
        <p className="animate-fade-in" style={{ 
          fontSize: '1.25rem', 
          color: 'hsl(var(--muted-foreground))', 
          maxWidth: '600px', 
          marginBottom: '3rem',
          animationDelay: '0.2s',
          lineHeight: 1.6
        }}>
          Revolutionary AI that scans job postings to extract the exact keywords you need to bypass ATS bots and impress recruiters.
        </p>

        <div className="animate-fade-in" style={{ 
          display: 'flex', 
          gap: '1rem',
          animationDelay: '0.3s'
        }}>
          <Link href="/dashboard" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            Open Dashboard <ArrowRight size={20} />
          </Link>
          <Link href="/pricing" className="btn btn-secondary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            View Pricing
          </Link>
        </div>

        {/* Feature Grid Brief */}
        <div id="features" style={{
          marginTop: '8rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          maxWidth: '1200px',
          width: '100%'
        }}>
          {[
            { icon: <Shield color="#00BAFF" />, title: "ATS Optimization", desc: "Our agent scans 50+ data points to ensure your resume matches every requirement." },
            { icon: <Zap color="#00BAFF" />, title: "AI Bullet Rewriting", desc: "Instantly transform your work history into industry-standard high-impact bullets." },
            { icon: <FileText color="#00BAFF" />, title: "Pixel Perfect PDF", desc: "Non-editable, professional PDF exports that are fully readable by all major ATS systems." },
            { icon: <BarChart3 color="#00BAFF" />, title: "Recruiter Analytics", desc: "Get a match score based on keyword density and technical skill relevance." },
            { icon: <Globe color="#00BAFF" />, title: "Market Insights", desc: "Analyze salary ranges and role demand directly from the job description." },
            { icon: <Rocket color="#00BAFF" />, title: "Instant Export", desc: "Ready to apply in seconds with a perfectly tailored resume for every role." }
          ].map((feature, i) => (
            <div key={i} className="glass animate-fade-in" style={{ 
              padding: '2.5rem', 
              borderRadius: '2rem', 
              textAlign: 'left',
              animationDelay: `${0.4 + i * 0.1}s`,
              transition: 'transform 0.3s ease'
            }}>
              <div style={{ 
                marginBottom: '1.5rem', 
                width: '48px', 
                height: '48px', 
                background: 'rgba(0,186,255,0.05)', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{feature.title}</h3>
              <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.95rem', lineHeight: 1.6 }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <section id="pricing" style={{ marginTop: '10rem', paddingBottom: '4rem', width: '100%' }}>
            <div className="glass" style={{ 
                background: 'linear-gradient(135deg, rgba(0, 186, 255, 0.05) 0%, rgba(0, 114, 255, 0.05) 100%)',
                padding: '4rem 2rem',
                borderRadius: '3rem',
                maxWidth: '1000px',
                margin: '0 auto',
                border: '1px solid rgba(0, 186, 255, 0.1)'
            }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Ready to land your dream role?</h2>
                <p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: '2.5rem', fontSize: '1.1rem' }}>Join 10,000+ professionals using CareerForge to land interviews.</p>
                <Link href="/pricing" className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
                    Choose Your Plan
                </Link>
            </div>
        </section>
      </section>

      <footer style={{ padding: '4rem 2rem', borderTop: '1px solid var(--glass-border)', textAlign: 'center', color: 'hsl(var(--muted-foreground))', fontSize: '0.9rem' }}>
          © 2026 CareerForge Pro. All rights reserved.
      </footer>
    </main>
  );
}
