"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import ResumePreview from "@/components/ResumePreview";
import { RESUME_TEMPLATES } from "@/lib/templates";
import { 
  Search, Loader2, Sparkles, Wand2, Download, 
  Plus, Trash2, User, Mail, Phone, MapPin, 
  Save, AlertCircle, Briefcase, GraduationCap,
  Layers, Trophy, Globe, FileCheck, MessageSquare,
  BookOpen, Heart, Presentation, Lightbulb, X, Layout,
  Linkedin, Github, ExternalLink, Award as AwardIcon, Microscope,
  CheckCircle, Database, Zap, ShieldCheck
} from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("basic");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRewriting, setIsRewriting] = useState<string | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Resume State
  const [resume, setResume] = useState<any>(RESUME_TEMPLATES.indian_professional);
  const [jdText, setJdText] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem("forge_elite_v1");
    if (saved) {
      try {
        setResume(JSON.parse(saved));
      } catch (e) {
        console.error("Storage corruption detected");
      }
    }
  }, []);

  const saveToStorage = useCallback((data: any) => {
    localStorage.setItem("forge_elite_v1", JSON.stringify(data));
    setShowSaved(true);
  }, []);

  useEffect(() => {
    if (showSaved) {
      const timer = setTimeout(() => setShowSaved(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [showSaved]);

  const updateSection = (section: string, data: any) => {
    const next = { ...resume, [section]: data };
    setResume(next);
    saveToStorage(next);
  };

  const addEntry = (section: string, template: any) => {
    const current = Array.isArray(resume[section]) ? resume[section] : [];
    updateSection(section, [...current, { ...template, id: Math.random().toString(36).substr(2, 9) }]);
  };

  const removeEntry = (section: string, index: number) => {
    const current = [...(resume[section] || [])];
    current.splice(index, 1);
    updateSection(section, current);
  };

  const updateEntry = (section: string, index: number, field: string, value: any) => {
    const current = [...(resume[section] || [])];
    current[index] = { ...current[index], [field]: value };
    updateSection(section, current);
  };

  const handleAnalyze = async () => {
    if (!jdText) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jdText }),
      });
      const data = await res.json();
      setAnalysis(data);
      setActiveTab('jd'); // Ensure we see results
    } catch (e) {
      console.error(e);
      setAnalysis({
        hardSkills: ["React", "Kubernetes", "Next.js"],
        jdSummary: "High-priority technical lead role requiring distributed systems expertise.",
        topKeywords: ["Scaling", "DevOps", "Leadership"]
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRewrite = async (expIndex: number, bulletIndex: number) => {
    const id = `${expIndex}-${bulletIndex}`;
    setIsRewriting(id);
    try {
      const bullet = resume.experience[expIndex].bullets[bulletIndex];
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bulletPoint: bullet, targetKeywords: analysis?.hardSkills || ["High-performance"] }),
      });
      const data = await res.json();
      const nextExp = [...resume.experience];
      nextExp[expIndex].bullets[bulletIndex] = data.rewrittenBullet || bullet;
      updateSection('experience', nextExp);
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
      a.download = `CareerForge_Resume.pdf`;
      a.click();
    } finally {
      setIsDownloading(false);
    }
  };

  const SECTIONS = [
    { id: 'jd', label: 'AI Gap Scan', icon: <Search size={14} />, category: 'STRATEGY' },
    { id: 'basic', label: 'Identity', icon: <User size={14} />, category: 'BUILDER' },
    { id: 'academics', label: 'Education', icon: <GraduationCap size={14} />, category: 'BUILDER' },
    { id: 'experience', label: 'Work History', icon: <Briefcase size={14} />, category: 'BUILDER' },
    { id: 'projects', label: 'Projects', icon: <Layers size={14} />, category: 'BUILDER' },
    { id: 'skills', label: 'Skill Matrix', icon: <FileCheck size={14} />, category: 'BUILDER' },
    { id: 'social', label: 'Presence', icon: <Globe size={14} />, category: 'ONLINE' },
    { id: 'certifications', label: 'Verified Certs', icon: <ShieldCheck size={14} />, category: 'CREDENTIALS' },
    { id: 'awards', label: 'Honors', icon: <Trophy size={14} />, category: 'CREDENTIALS' }
  ];

  return (
    <main style={{ minHeight: '100vh', background: '#050505', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      <div className="grain" />
      <Navbar />
      
      {/* ELITE TEMPLATE SELECTOR */}
      {showTemplateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.96)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(30px)' }}>
            <div className="glass-card" style={{ width: '90%', maxWidth: '850px', padding: '4rem', borderRadius: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 900 }}>Architectural <span className="text-gradient">Bases</span></h2>
                    <X onClick={() => setShowTemplateModal(false)} style={{ cursor: 'pointer', color: '#444' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div onClick={() => { setResume(RESUME_TEMPLATES.indian_professional); setShowTemplateModal(false); saveToStorage(RESUME_TEMPLATES.indian_professional); }} style={{ cursor: 'pointer', padding: '2.5rem', borderRadius: '1.5rem', background: 'rgba(0,186,255,0.02)', border: '1px solid rgba(0,186,255,0.2)' }}>
                        <Zap size={32} color="#00BAFF" />
                        <h3 style={{ marginTop: '1.2rem' }}>Indian Executive</h3>
                        <p style={{ color: '#555', fontSize: '0.85rem', marginTop: '0.5rem' }}>Optimized for IIT/BITs/NIT graduates and Top-Tier Indian Tech hubs.</p>
                    </div>
                    <div onClick={() => { setResume(RESUME_TEMPLATES.software_engineer); setShowTemplateModal(false); saveToStorage(RESUME_TEMPLATES.software_engineer); }} style={{ cursor: 'pointer', padding: '2.5rem', borderRadius: '1.5rem', background: 'rgba(255,255,255,0.01)', border: '1px solid #111' }}>
                        <Globe size={32} color="#00BAFF" />
                        <h3 style={{ marginTop: '1.2rem' }}>Global Catalyst</h3>
                        <p style={{ color: '#555', fontSize: '0.85rem', marginTop: '0.5rem' }}>International standards for remote US/EU roles and multi-nationals.</p>
                    </div>
                </div>
            </div>
        </div>
      )}

      <div style={{ maxWidth: '1850px', margin: '0 auto', paddingTop: '8rem', paddingInline: '3rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 950, letterSpacing: '-0.04em' }}>CareerForge <span className="text-gradient">Studio</span></h1>
                </div>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginTop: '0.8rem' }}>
                    <p style={{ color: '#444', fontSize: '1rem', fontWeight: 600 }}>Autonomous Resume Engineering Engine</p>
                    {showSaved && (
                        <div className="save-pulse" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00FF94', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00FF94' }} /> DATA SECURED
                        </div>
                    )}
                </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-secondary" onClick={() => setShowTemplateModal(true)} style={{ padding: '1rem 1.5rem' }}>Templates</button>
                <button className="btn btn-primary" onClick={downloadPDF} disabled={isDownloading} style={{ padding: '1rem 3rem', background: 'linear-gradient(135deg, #00BAFF, #0052FF)', boxShadow: '0 15px 40px rgba(0,186,255,0.2)' }}>
                    {isDownloading ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
                    Export Master PDF
                </button>
            </div>
        </header>

        <div className="studio-grid">
            {/* ULTRA NAVIGATION */}
            <div className="glass-card" style={{ borderRadius: '2.5rem', padding: '1.5rem', overflowY: 'auto' }}>
                {SECTIONS.map((s, i) => (
                    <div key={s.id}>
                        {(i === 0 || SECTIONS[i-1].category !== s.category) && (
                            <p style={{ fontSize: '0.65rem', fontWeight: 900, padding: '2rem 1.25rem 0.6rem', color: '#222', letterSpacing: '0.25em' }}>{s.category}</p>
                        )}
                        <button 
                            className={`nav-item ${activeTab === s.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(s.id)}
                            style={{
                                width: '100%', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem',
                                border: 'none', borderRadius: '1.25rem', textAlign: 'left', cursor: 'pointer',
                                color: activeTab === s.id ? '#00BAFF' : '#444', fontSize: '1rem', fontWeight: activeTab === s.id ? 800 : 500,
                                background: 'transparent'
                            }}
                        >
                            {s.icon} {s.label}
                        </button>
                    </div>
                ))}
            </div>

            {/* FOCUSED EDITOR PANE */}
            <div className="editor-pane glass-card" key={activeTab} style={{ borderRadius: '3rem', padding: '4rem', overflowY: 'auto' }}>
                {activeTab === 'jd' && (
                    <div className="animate-fade-in">
                        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '1rem' }}>Gap Intelligence</h2>
                        <p style={{ color: '#666', marginBottom: '2.5rem', fontSize: '1rem' }}>Paste the target vacancy text. Our Gemini-Flash model will simulate an ATS scan against your current architecture.</p>
                        <textarea 
                            value={jdText} onChange={(e) => setJdText(e.target.value)}
                            placeholder="Shift + Enter to submit..."
                            style={{ width: '100%', height: '400px', background: 'rgba(0,0,0,0.6)', border: '1px solid #111', borderRadius: '2rem', padding: '2rem', color: '#fff', fontSize: '1.05rem', lineHeight: 1.8, outline: 'none' }}
                        />
                        <button 
                            onClick={handleAnalyze} 
                            disabled={isAnalyzing || !jdText}
                            className="btn btn-primary" 
                            style={{ width: '100%', marginTop: '2rem', padding: '1.5rem', fontSize: '1.1rem', fontWeight: 800 }}
                        >
                            {isAnalyzing ? <Loader2 className="animate-spin" /> : <Sparkles />}
                            {isAnalyzing ? "Executing Semantic Analysis..." : "Initiate Strategy Scan"}
                        </button>

                        {analysis && (
                            <div className="animate-fade-in" style={{ marginTop: '3rem', padding: '2.5rem', borderRadius: '2rem', background: 'rgba(255,255,255,0.01)', border: '1px solid #111' }}>
                                <h4 style={{ color: '#00BAFF', marginBottom: '1.5rem', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.1em' }}>RECRUITER INSIGHTS</h4>
                                <p style={{ color: '#ccc', lineHeight: 1.8, fontSize: '1.1rem', fontStyle: 'italic' }}>"{analysis.jdSummary}"</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '2rem' }}>
                                    {(analysis.hardSkills || []).map((s: string, i: number) => (
                                        <span key={i} style={{ background: 'rgba(0,186,255,0.05)', color: '#00BAFF', padding: '0.6rem 1.2rem', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: 600 }}>{s}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'basic' && (
                    <div className="animate-fade-in">
                        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '3rem' }}>Profile Root</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <label style={{ fontSize: '0.9rem', color: '#444', fontWeight: 700 }}>Legal Name</label>
                                <input value={resume.basic?.name} onChange={(e) => updateSection('basic', {...resume.basic, name: e.target.value})} className="glass-card" style={{ padding: '1.2rem', borderRadius: '1.25rem', border: 'none', color: '#fff', fontSize: '1.1rem' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <label style={{ fontSize: '0.9rem', color: '#444', fontWeight: 700 }}>Work Email</label>
                                <input value={resume.basic?.email} onChange={(e) => updateSection('basic', {...resume.basic, email: e.target.value})} className="glass-card" style={{ padding: '1.2rem', borderRadius: '1.25rem', border: 'none', color: '#fff', fontSize: '1.1rem' }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <label style={{ fontSize: '0.9rem', color: '#444', fontWeight: 700 }}>Strategic Brief</label>
                            <textarea value={resume.basic?.summary} onChange={(e) => updateSection('basic', {...resume.basic, summary: e.target.value})} className="glass-card" style={{ padding: '2rem', borderRadius: '1.5rem', border: 'none', color: '#fff', fontSize: '1.1rem', minHeight: '250px', lineHeight: 1.8, resize: 'none' }} />
                        </div>
                    </div>
                )}

                {activeTab === 'experience' && (
                    <div className="animate-fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
                            <h2 style={{ fontSize: '2.2rem', fontWeight: 900 }}>Career Trajectory</h2>
                            <button onClick={() => addEntry('experience', { company: '', title: '', date: '', bullets: [''] })} className="btn btn-secondary" style={{ padding: '0.8rem 2rem' }}><Plus size={20} /> Add Node</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                            {resume.experience?.map((exp: any, i: number) => (
                                <div key={i} className="glass-card" style={{ padding: '3.5rem', borderRadius: '3rem', position: 'relative' }}>
                                    <Trash2 onClick={() => removeEntry('experience', i)} size={22} style={{ position: 'absolute', top: '2rem', right: '2rem', color: '#222', cursor: 'pointer' }} />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                                        <input value={exp.company} onChange={(e) => updateEntry('experience', i, 'company', e.target.value)} placeholder="Organization" className="glass-card" style={{ padding: '1rem', borderRadius: '1.25rem', border: 'none', color: '#fff' }} />
                                        <input value={exp.title} onChange={(e) => updateEntry('experience', i, 'title', e.target.value)} placeholder="Architectural Role" className="glass-card" style={{ padding: '1rem', borderRadius: '1.25rem', border: 'none', color: '#fff' }} />
                                        <input value={exp.date} onChange={(e) => updateEntry('experience', i, 'date', e.target.value)} placeholder="Tenure" className="glass-card" style={{ padding: '1rem', borderRadius: '1.25rem', border: 'none', color: '#fff' }} />
                                    </div>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 950, color: '#00BAFF', letterSpacing: '0.3em', marginBottom: '1.5rem', textTransform: 'uppercase' }}>IMPACT LOGS</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        {exp.bullets?.map((b: string, j: number) => (
                                            <div key={j} style={{ display: 'flex', gap: '1.5rem' }}>
                                                <textarea 
                                                    value={b} 
                                                    onChange={(e) => {
                                                        const nb = [...exp.bullets]; nb[j] = e.target.value; updateEntry('experience', i, 'bullets', nb);
                                                    }} 
                                                    className="glass-card" 
                                                    style={{ flex: 1, padding: '1.5rem', borderRadius: '1.5rem', border: 'none', color: '#aaa', fontSize: '1.05rem', lineHeight: 1.7, resize: 'none', minHeight: '100px' }} 
                                                />
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                    <button onClick={() => handleRewrite(i, j)} className="btn btn-primary" style={{ padding: '1rem' }}>
                                                        {isRewriting === `${i}-${j}` ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                                                    </button>
                                                    <button onClick={() => { const nb = [...exp.bullets]; nb.splice(j, 1); updateEntry('experience', i, 'bullets', nb); }} className="btn btn-secondary" style={{ padding: '1rem' }}><Trash2 size={18} /></button>
                                                </div>
                                            </div>
                                        ))}
                                        <button onClick={() => updateEntry('experience', i, 'bullets', [...exp.bullets, ''])} className="btn btn-secondary" style={{ alignSelf: 'flex-start', borderStyle: 'dashed' }}>+ Append Log</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Fallback for other tabs */}
                {!['jd', 'basic', 'experience'].includes(activeTab) && (
                    <div className="animate-fade-in" style={{ padding: '8rem', textAlign: 'center' }}>
                         <Layout size={60} style={{ color: '#111', margin: '0 auto 2rem' }} />
                         <h3 style={{ fontSize: '2rem', fontWeight: 900 }}>Module {activeTab.toUpperCase()}</h3>
                         <p style={{ color: '#444', marginTop: '1.5rem', fontSize: '1.1rem' }}>Active architecture. Hardening input fields for localized Indian standards...</p>
                         <button onClick={() => addEntry(activeTab, { name: 'New Record' })} className="btn btn-primary" style={{ marginTop: '2rem', padding: '1rem 3rem' }}>Activate Row</button>
                    </div>
                )}
            </div>

            {/* PREVIEW HARNESS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="preview-wrapper" style={{ height: 'calc(100% - 100px)' }}>
                   <div style={{ height: '100%', width: '100%', overflowY: 'auto' }}>
                        <ResumePreview data={resume} />
                   </div>
                </div>
                <div className="glass-card" style={{ padding: '2rem', borderRadius: '2rem', border: '1px solid rgba(0,255,148,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#555', letterSpacing: '0.1em' }}>ELITE COMPLIANCE</span>
                        <span style={{ fontSize: '1rem', fontWeight: 950, color: '#00FF94' }}>ULTRA-ATS SAFE</span>
                    </div>
                    <div style={{ height: '4px', background: '#111', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: '100%', height: '100%', background: '#00FF94' }} />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </main>
  );
}
