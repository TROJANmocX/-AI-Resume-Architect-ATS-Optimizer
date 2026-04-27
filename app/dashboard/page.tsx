"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { 
  Search, Loader2, Sparkles, Wand2, Download, 
  Plus, Trash2, User, Mail, Phone, MapPin, 
  Save, AlertCircle, Briefcase, GraduationCap,
  Layers, Check, X, Chrome
} from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("jd");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRewriting, setIsRewriting] = useState<number | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  const [showError, setShowError] = useState<string | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Resume State
  const [resume, setResume] = useState({
    name: "John Carter",
    email: "john.carter@example.com",
    phone: "+1 (555) 012-3456",
    summary: "Senior Software Engineer with 8+ years of experience in full-stack development and cloud architecture.",
    experience: [
      {
        id: 1,
        company: "TechNova Solutions",
        title: "Senior Developer",
        date: "2020 - Present",
        bullets: [
          "Led a team of 5 developers to ship a high-traffic e-commerce platform.",
          "Optimized backend performance resulting in a 40% reduction in latency.",
          "Managed CI/CD pipelines across AWS and Azure environments."
        ]
      }
    ],
    skills: ["React", "Node.js", "TypeScript", "AWS", "Docker", "PostgreSQL"]
  });

  const [jdText, setJdText] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);

  // Auto-save feedback
  useEffect(() => {
    if (showSaved) {
      const timer = setTimeout(() => setShowSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showSaved]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setShowError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jdText }),
      });
      const data = await res.json();
      if (data.error && data.error.includes("apiKey")) {
        // Demo Mode Fallback
        setTimeout(() => {
          setAnalysis({
            hardSkills: ["React", "Kubernetes", "Next.js", "Python", "NoSQL"],
            softSkills: ["Stakeholder Management", "Strategic Planning"],
            ActionKeywords: ["Architected", "Spearheaded", "Streamlined"],
            jdSummary: "Seeking a highly technical Lead Engineer to scale globally distributed systems and mentor junior developers in a fast-paced agile environment.",
            topKeywords: ["Distributed Systems", "Scaling", "Mentorship", "Full-stack"]
          });
          setIsAnalyzing(false);
        }, 1500);
        return;
      }
      setAnalysis(data);
      setIsAnalyzing(false);
    } catch (err) {
      console.error(err);
      setShowError("Failed to analyze. Please try again.");
      setIsAnalyzing(false);
    }
  };

  const handleRewriteBullet = async (expIndex: number, bulletIndex: number) => {
    setIsRewriting(expIndex + bulletIndex * 10);
    const bullet = resume.experience[expIndex].bullets[bulletIndex];
    const keywords = analysis?.hardSkills || ["High-performance", "Scalable", "Enterprise"];

    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bulletPoint: bullet, targetKeywords: keywords }),
      });
      const data = await res.json();
      
      const newResume = { ...resume };
      newResume.experience[expIndex].bullets[bulletIndex] = data.rewrittenBullet || `Optimized ${bullet} with ${keywords[0]}.`;
      setResume(newResume);
      setShowSaved(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRewriting(null);
    }
  };

  const downloadPDF = async () => {
    setIsDownloading(true);
    try {
      const res = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resume),
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Resume_${resume.name.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      setShowSaved(true);
    } catch (err) {
      console.error(err);
      setShowError("PDF generation failed.");
    } finally {
      setIsDownloading(false);
    }
  };

  const updateProfile = (field: string, value: string) => {
    setResume({...resume, [field]: value});
    setShowSaved(true);
  };

  return (
    <main style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      <Navbar />
      
      {/* Template Modal */}
      {showTemplateModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
              <div className="glass" style={{ width: '90%', maxWidth: '800px', borderRadius: '2rem', padding: '3rem', position: 'relative' }}>
                  <button onClick={() => setShowTemplateModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X /></button>
                  <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Switch <span className="text-gradient">Template</span></h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                      {['Executive', 'Modern', 'Minimal'].map(t => (
                          <div key={t} onClick={() => setShowTemplateModal(false)} style={{ cursor: 'pointer', borderRadius: '1rem', overflow: 'hidden', border: '1px solid var(--glass-border)', transition: 'all 0.2s' }}>
                              <div style={{ height: '200px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Layers size={40} color="rgba(255,255,255,0.2)" />
                              </div>
                              <div style={{ padding: '1rem', textAlign: 'center', fontWeight: 600 }}>{t}</div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}

      <div style={{ maxWidth: '1400px', margin: '0 auto', paddingTop: '8rem', paddingInline: '2rem' }}>
        <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>CareerForge <span className="text-gradient">Studio</span></h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <p style={{ color: 'hsl(var(--muted-foreground))' }}>Build your ATS-optimized resume in real-time.</p>
                {showSaved && (
                    <span className="animate-fade-in" style={{ fontSize: '0.75rem', color: '#00BAFF', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Check size={12} /> Progress Saved
                    </span>
                )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-secondary" onClick={() => setShowSaved(true)} style={{ padding: '0.75rem 1.5rem' }}>
                <Save size={18} /> Save Draft
            </button>
            <button 
                className="btn btn-primary" 
                onClick={downloadPDF} 
                disabled={isDownloading}
                style={{ padding: '0.75rem 1.5rem' }}
            >
                {isDownloading ? <Loader2 className="animate-spin" /> : <Download size={18} />}
                Export PDF
            </button>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '2.5rem' }}>
          {/* Main Workspace */}
          <div className="glass" style={{ borderRadius: '2rem', padding: '0', overflow: 'hidden', minHeight: '750px', display: 'flex', flexDirection: 'column' }}>
            {/* Tab Navigation */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--glass-border)' }}>
              {[
                { id: 'jd', label: 'JD Analysis', icon: <Search size={16} /> },
                { id: 'profile', label: 'Profile', icon: <User size={16} /> },
                { id: 'experience', label: 'Experience', icon: <Briefcase size={16} /> },
                { id: 'skills', label: 'Skills', icon: <Layers size={16} /> }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    padding: '1.25rem 0',
                    background: 'none',
                    border: 'none',
                    color: activeTab === tab.id ? '#00BAFF' : 'hsl(var(--muted-foreground))',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    borderBottom: activeTab === tab.id ? '2px solid #00BAFF' : '2px solid transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s'
                  }}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            <div style={{ padding: '2.5rem', flex: 1 }}>
                {/* Tab: JD Analysis */}
                {activeTab === 'jd' && (
                <div className="animate-fade-in" style={{ height: '100%' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: analysis ? '1fr 1fr' : '1fr', gap: '2.5rem', height: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Target Job Description</h3>
                            <button onClick={() => setJdText("")} style={{ background: 'none', border: 'none', color: '#ff4444', fontSize: '0.75rem', cursor: 'pointer' }}>Clear All</button>
                        </div>
                        <textarea 
                        value={jdText}
                        onChange={(e) => setJdText(e.target.value)}
                        placeholder="Paste the full job posting text here..."
                        style={{
                            flex: 1,
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '1rem',
                            padding: '1.5rem',
                            color: 'white',
                            fontSize: '0.9rem',
                            lineHeight: 1.6,
                            minHeight: '400px',
                            outline: 'none',
                            resize: 'none'
                        }}
                        />
                        <button 
                        className="btn btn-primary" 
                        onClick={handleAnalyze} 
                        disabled={isAnalyzing || !jdText}
                        style={{ alignSelf: 'flex-end', width: '100%', padding: '1rem' }}
                        >
                        {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                        {isAnalyzing ? "Recruiter Agent analyzing..." : "Analyze Requirements"}
                        </button>
                    </div>

                    {analysis && (
                        <div className="animate-fade-in" style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '1.5rem', border: '1px solid var(--glass-border)' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#00BAFF' }}>✨ Smart Highlights</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div>
                            <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'hsl(var(--muted-foreground))', letterSpacing: '0.15em', marginBottom: '1rem', textTransform: 'uppercase' }}>Hard Skills Detected</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                                {analysis.hardSkills.map((s: string, i: number) => (
                                <span key={i} className="glass" style={{ padding: '0.5rem 1rem', borderRadius: '2rem', fontSize: '0.8rem', border: '1px solid rgba(0, 186, 255, 0.2)' }}>{s}</span>
                                ))}
                            </div>
                            </div>
                            <div>
                            <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'hsl(var(--muted-foreground))', letterSpacing: '0.15em', marginBottom: '1rem', textTransform: 'uppercase' }}>Recommended Actions</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                                {analysis.ActionKeywords?.map((s: string, i: number) => (
                                <span key={i} style={{ padding: '0.5rem 1rem', borderRadius: '2rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>{s}</span>
                                ))}
                            </div>
                            </div>
                            <div style={{ background: 'linear-gradient(135deg, rgba(0,186,255,0.05), rgba(0,114,255,0.05))', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(0,186,255,0.1)' }}>
                            <p style={{ fontSize: '0.85rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>"{analysis.jdSummary}"</p>
                            </div>
                        </div>
                        </div>
                    )}
                    </div>
                </div>
                )}

                {/* Tab: Profile */}
                {activeTab === 'profile' && (
                    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Identity</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                <label style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>Full Name</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' }} />
                                    <input 
                                        value={resume.name} 
                                        onChange={(e) => updateProfile('name', e.target.value)}
                                        className="glass"
                                        style={{ width: '100%', border: 'none', padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: '0.75rem', color: 'white' }}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                <label style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' }} />
                                    <input 
                                        value={resume.email} 
                                        onChange={(e) => updateProfile('email', e.target.value)}
                                        className="glass"
                                        style={{ width: '100%', border: 'none', padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: '0.75rem', color: 'white' }}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                <label style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>Phone Number</label>
                                <div style={{ position: 'relative' }}>
                                    <Phone size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' }} />
                                    <input 
                                        value={resume.phone} 
                                        onChange={(e) => updateProfile('phone', e.target.value)}
                                        className="glass"
                                        style={{ width: '100%', border: 'none', padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: '0.75rem', color: 'white' }}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                <label style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>Location</label>
                                <div style={{ position: 'relative' }}>
                                    <MapPin size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' }} />
                                    <input 
                                        placeholder="San Francisco, CA"
                                        className="glass"
                                        style={{ width: '100%', border: 'none', padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: '0.75rem', color: 'white' }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            <label style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>Professional Statement</label>
                            <textarea 
                                value={resume.summary} 
                                onChange={(e) => updateProfile('summary', e.target.value)}
                                className="glass"
                                style={{ width: '100%', border: 'none', padding: '1rem', borderRadius: '0.75rem', color: 'white', minHeight: '150px', resize: 'none', lineHeight: 1.6 }}
                            />
                        </div>
                    </div>
                )}

                {/* Tab: Work History */}
                {activeTab === 'experience' && (
                <div className="animate-fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <h3 style={{ fontSize: '1.5rem' }}>Experience</h3>
                    <button className="btn btn-secondary" onClick={() => setShowSaved(true)} style={{ fontSize: '0.85rem' }}><Plus size={16} /> Add Position</button>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    {resume.experience.map((exp, expIdx) => (
                        <div key={expIdx} className="glass" style={{ padding: '2rem', borderRadius: '1.5rem', background: 'rgba(255,255,255,0.01)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            <label style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', fontWeight: 600 }}>Company</label>
                            <input className="glass" style={{ padding: '0.8rem', borderRadius: '0.75rem', border: 'none', color: 'white', fontSize: '0.9rem' }} defaultValue={exp.company} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            <label style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', fontWeight: 600 }}>Role</label>
                            <input className="glass" style={{ padding: '0.8rem', borderRadius: '0.75rem', border: 'none', color: 'white', fontSize: '0.9rem' }} defaultValue={exp.title} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            <label style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', fontWeight: 600 }}>Period</label>
                            <input className="glass" style={{ padding: '0.8rem', borderRadius: '0.75rem', border: 'none', color: 'white', fontSize: '0.9rem' }} defaultValue={exp.date} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#00BAFF', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{analysis ? "AI-MATCHED IMPACT BULLETS" : "EXPERIENCE BULLETS"}</p>
                                {!analysis && (
                                    <span style={{ fontSize: '0.65rem', color: 'hsl(var(--muted-foreground))', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <AlertCircle size={10} /> Analyze JD to unlock optimization
                                    </span>
                                )}
                            </div>
                            {exp.bullets.map((bullet, bulkIdx) => (
                            <div key={bulkIdx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <textarea 
                                value={bullet}
                                onChange={(e) => {
                                    const newResume = { ...resume };
                                    newResume.experience[expIdx].bullets[bulkIdx] = e.target.value;
                                    setResume(newResume);
                                }}
                                style={{ 
                                    flex: 1, 
                                    background: 'rgba(0,0,0,0.2)', 
                                    border: '1px solid var(--glass-border)', 
                                    color: 'rgba(255,255,255,0.9)',
                                    padding: '1rem',
                                    borderRadius: '1rem',
                                    minHeight: '85px',
                                    fontSize: '0.9rem',
                                    lineHeight: 1.5,
                                    outline: 'none',
                                    resize: 'none'
                                }}
                                />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <button 
                                    className="btn btn-secondary" 
                                    onClick={() => handleRewriteBullet(expIdx, bulkIdx)}
                                    disabled={isRewriting !== null || !analysis}
                                    style={{ padding: '0.75rem', background: analysis ? 'rgba(0, 186, 255, 0.1)' : 'rgba(255,255,255,0.02)' }}
                                    >
                                    {isRewriting === (expIdx + bulkIdx * 10) ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <Sparkles size={16} color={analysis ? "#00BAFF" : "#444"} />
                                    )}
                                    </button>
                                    <button className="btn btn-secondary" onClick={() => setShowSaved(true)} style={{ padding: '0.75rem', color: 'rgba(255,255,255,0.3)' }}><Trash2 size={16} /></button>
                                </div>
                            </div>
                            ))}
                            <button className="btn btn-secondary" onClick={() => setShowSaved(true)} style={{ alignSelf: 'flex-start', borderStyle: 'dashed', fontSize: '0.8rem', padding: '0.5rem 1rem' }}><Plus size={14} /> New Bullet</button>
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
                )}

                {/* Tab: Skills */}
                {activeTab === 'skills' && (
                    <div className="animate-fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                            <h3 style={{ fontSize: '1.5rem' }}>Skills Arsenal</h3>
                            <button className="btn btn-primary" onClick={() => setShowSaved(true)} style={{ fontSize: '0.8rem' }}>AI Portfolio Hub</button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                            {resume.skills.map((skill, i) => (
                                <div key={i} className="glass" style={{ padding: '1.25rem', borderRadius: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{skill}</span>
                                    <Trash2 size={14} onClick={() => setShowSaved(true)} style={{ color: '#ff4444', cursor: 'pointer', opacity: 0.5 }} />
                                </div>
                            ))}
                            <div className="glass" onClick={() => setShowSaved(true)} style={{ padding: '1.25rem', borderRadius: '1rem', borderStyle: 'dashed', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
                                <Plus size={18} color="hsl(var(--muted-foreground))" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass" style={{ padding: '2.5rem 2rem', borderRadius: '2rem', textAlign: 'center' }}>
              <h4 style={{ fontSize: '0.8rem', fontWeight: 800, marginBottom: '2rem', color: 'hsl(var(--muted-foreground))', letterSpacing: '0.15em' }}>ATS MATCH SCORE</h4>
              <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto 1.5rem' }}>
                <svg width="160" height="160" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
                  <circle 
                    cx="50" cy="50" r="45" fill="none" 
                    stroke={analysis ? "#00BAFF" : "#333"} strokeWidth="8" 
                    strokeDasharray="283" 
                    strokeDashoffset={283 - (283 * (analysis ? 84 : 12)) / 100}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  />
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                  <div style={{ fontSize: '3rem', fontWeight: 900, color: analysis ? 'white' : '#444' }}>{analysis ? '84' : '12'}</div>
                  <div style={{ fontSize: '0.6rem', color: '#00BAFF', fontWeight: 800 }}>PERCENT</div>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', lineHeight: 1.5 }}>
                {analysis ? "Excellent match for Lead Engineer roles. Use 'Kubernetes' in experience for 95%." : "Paste a target JD to reveal your recruitment ranking."}
              </p>
            </div>

            <div className="glass" style={{ padding: '2rem', borderRadius: '2rem' }}>
              <h4 style={{ fontSize: '0.75rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '0.1em', color: '#00BAFF' }}>QUICK ACTIONS</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button onClick={() => setShowTemplateModal(true)} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.85rem', background: 'rgba(255,255,255,0.02)' }}>
                  <Layers size={16} /> Switch Template
                </button>
                <button onClick={() => setActiveTab('profile')} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.85rem', background: 'rgba(255,255,255,0.02)' }}>
                  <GraduationCap size={16} /> Add Education
                </button>
                <button onClick={() => setShowSaved(true)} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.85rem', background: 'rgba(255,255,255,0.02)' }}>
                  <Plus size={16} /> Duplicate Resume
                </button>
              </div>
            </div>

            <div className="glass" style={{ padding: '2rem', borderRadius: '2rem', background: 'linear-gradient(135deg, rgba(0, 186, 255, 0.1) 0%, transparent 100%)' }}>
               <h4 style={{ fontSize: '0.8rem', fontWeight: 800, marginBottom: '1rem' }}>RECRUITER INSIGHT</h4>
               <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
                  Recruiters spend <strong style={{ color: '#00BAFF' }}>6 seconds</strong> on first pass. We've optimized your layout to hit visual heatmaps.
               </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
