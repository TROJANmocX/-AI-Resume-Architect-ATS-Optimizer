"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ResumePreview from "@/components/ResumePreview";
import { RESUME_TEMPLATES } from "@/lib/templates";
import { 
  Search, Loader2, Sparkles, Wand2, Download, 
  Plus, Trash2, User, Mail, Phone, MapPin, 
  Save, AlertCircle, Briefcase, GraduationCap,
  Layers, Trophy, Globe, FileCheck, MessageSquare,
  BookOpen, Heart, Presentation, Lightbulb, X, Layout
} from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("basic");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRewriting, setIsRewriting] = useState<number | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Resume State
  const [resume, setResume] = useState<any>(RESUME_TEMPLATES.software_engineer);
  const [jdText, setJdText] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    if (showSaved) {
      const timer = setTimeout(() => setShowSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showSaved]);

  const loadTemplate = (key: string) => {
    setResume((RESUME_TEMPLATES as any)[key]);
    setShowTemplateModal(false);
    setShowSaved(true);
  };

  const updateSection = (section: string, data: any) => {
    setResume((prev: any) => ({ ...prev, [section]: data }));
    setShowSaved(true);
  };

  const addItem = (section: string, template: any) => {
    const current = resume[section] || [];
    updateSection(section, [...current, template]);
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
      a.download = `${resume.basic.name}_Resume.pdf`;
      a.click();
    } finally {
      setIsDownloading(false);
    }
  };

  const SECTIONS = [
    { id: 'jd', label: 'JD Analysis', icon: <Search size={14} />, category: 'AI AGENT' },
    { id: 'basic', label: 'Basic Info', icon: <User size={14} />, category: 'BUILDER' },
    { id: 'academics', label: 'Academics', icon: <GraduationCap size={14} />, category: 'BUILDER' },
    { id: 'experience', label: 'Experience', icon: <Briefcase size={14} />, category: 'BUILDER' },
    { id: 'projects', label: 'Projects', icon: <Layers size={14} />, category: 'BUILDER' },
    { id: 'skills', label: 'Expertise', icon: <Trophy size={14} />, category: 'BUILDER' },
    { id: 'certifications', label: 'Certs', icon: <FileCheck size={14} />, category: 'BUILDER' },
    { id: 'extra', label: 'More', icon: <Plus size={14} />, category: 'OPTIONAL' }
  ];

  return (
    <main style={{ minHeight: '100vh', background: '#080808', color: '#eee' }}>
      <Navbar />
      
      {/* PROFESSIONAL TEMPLATE MODAL */}
      {showTemplateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(20px)' }}>
            <div className="glass" style={{ width: '90%', maxWidth: '900px', padding: '3rem', borderRadius: '2rem', border: '1px solid #333' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2rem' }}>Role-Specific <span className="text-gradient">Templates</span></h2>
                    <button onClick={() => setShowTemplateModal(false)} className="btn btn-secondary"><X /></button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div onClick={() => loadTemplate('software_engineer')} style={{ cursor: 'pointer', padding: '2rem', borderRadius: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid #222' }}>
                        <Layout size={30} color="#00BAFF" style={{ marginBottom: '1rem' }} />
                        <h3 style={{ marginBottom: '0.5rem' }}>Full-Stack Engineer</h3>
                        <p style={{ color: '#888', fontSize: '0.85rem' }}>Optimized for tech roles at FAANG and Startups.</p>
                    </div>
                    <div onClick={() => loadTemplate('product_manager')} style={{ cursor: 'pointer', padding: '2rem', borderRadius: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid #222' }}>
                        <Briefcase size={30} color="#00BAFF" style={{ marginBottom: '1rem' }} />
                        <h3 style={{ marginBottom: '0.5rem' }}>Product Manager</h3>
                        <p style={{ color: '#888', fontSize: '0.85rem' }}>Focused on growth, strategy, and cross-functional leadership.</p>
                    </div>
                </div>
            </div>
        </div>
      )}

      <div style={{ maxWidth: '1800px', margin: '0 auto', paddingTop: '7rem', paddingInline: '2rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
                <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>CareerForge <span className="text-gradient">Studio</span></h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
                    <p style={{ color: '#888', fontSize: '0.9rem' }}>Real-time workspace for ATS-proof resumes.</p>
                    {showSaved && <span className="animate-fade-in" style={{ fontSize: '0.75rem', color: '#00BAFF' }}>• Draft Syncing...</span>}
                </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-secondary" onClick={() => setShowTemplateModal(true)}>Templates</button>
                <button className="btn btn-primary" onClick={downloadPDF} disabled={isDownloading}>
                    {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                    Export Resume
                </button>
            </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 500px', gap: '2rem', height: 'calc(100vh - 200px)' }}>
            {/* NAVIGATION SIDEBAR */}
            <div className="glass" style={{ borderRadius: '1.5rem', padding: '1rem', overflowY: 'auto' }}>
                {SECTIONS.map((s, i) => (
                    <div key={s.id}>
                        {(i === 0 || SECTIONS[i-1].category !== s.category) && (
                            <p style={{ fontSize: '0.65rem', fontWeight: 800, padding: '1.5rem 0.75rem 0.5rem', color: '#555', letterSpacing: '0.1em' }}>{s.category}</p>
                        )}
                        <button 
                            onClick={() => setActiveTab(s.id)}
                            style={{
                                width: '100%', padding: '0.8rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
                                background: activeTab === s.id ? 'rgba(0,186,255,0.1)' : 'transparent',
                                border: 'none', borderRadius: '0.75rem', textAlign: 'left', cursor: 'pointer',
                                color: activeTab === s.id ? '#00BAFF' : '#888', fontSize: '0.85rem', fontWeight: activeTab === s.id ? 600 : 400
                            }}
                        >
                            {s.icon} {s.label}
                        </button>
                    </div>
                ))}
            </div>

            {/* EDITOR MAIN PANE */}
            <div className="glass" style={{ borderRadius: '2rem', padding: '2.5rem', overflowY: 'auto', background: 'rgba(255,255,255,0.01)' }}>
                {activeTab === 'jd' && (
                    <div className="animate-fade-in">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                            <Sparkles size={20} color="#00BAFF" />
                            <h2 style={{ fontSize: '1.3rem' }}>Analysis Agent</h2>
                        </div>
                        <textarea 
                            value={jdText} onChange={(e) => setJdText(e.target.value)}
                            placeholder="Paste the target Job Description to identify keyword gaps..."
                            style={{ width: '100%', height: '400px', background: 'rgba(0,0,0,0.4)', border: '1px solid #222', borderRadius: '1.25rem', padding: '1.5rem', color: 'white', lineHeight: 1.6, outline: 'none' }}
                        />
                        <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1.2rem' }}>Extract & Match Keywords</button>
                    </div>
                )}

                {activeTab === 'basic' && (
                    <div className="animate-fade-in">
                        <h2 style={{ marginBottom: '2rem' }}>Personal Identity</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.75rem', color: '#666' }}>Full Name</label>
                                <input value={resume.basic.name} onChange={(e) => updateSection('basic', {...resume.basic, name: e.target.value})} className="glass" style={{ padding: '1rem', borderRadius: '0.75rem', border: 'none', color: 'white' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.75rem', color: '#666' }}>Email</label>
                                <input value={resume.basic.email} onChange={(e) => updateSection('basic', {...resume.basic, email: e.target.value})} className="glass" style={{ padding: '1rem', borderRadius: '0.75rem', border: 'none', color: 'white' }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.75rem', color: '#666' }}>Professional Summary</label>
                            <textarea value={resume.basic.summary} onChange={(e) => updateSection('basic', {...resume.basic, summary: e.target.value})} className="glass" style={{ padding: '1rem', borderRadius: '0.8rem', border: 'none', color: 'white', minHeight: '180px', resize: 'none', lineHeight: 1.6 }} />
                        </div>
                    </div>
                )}

                {activeTab === 'experience' && (
                    <div className="animate-fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                            <h2>Career History</h2>
                            <button onClick={() => addItem('experience', { company: '', title: '', date: '', bullets: [''] })} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}><Plus size={16} /> Add Role</button>
                        </div>
                        {resume.experience.map((exp: any, i: number) => (
                            <div key={i} className="glass" style={{ padding: '2rem', borderRadius: '1.5rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.01)' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                    <input value={exp.company} onChange={(e) => {
                                        const newExp = [...resume.experience];
                                        newExp[i].company = e.target.value;
                                        updateSection('experience', newExp);
                                    }} placeholder="Company" className="glass" style={{ padding: '0.8rem', border: 'none', color: 'white', borderRadius: '0.75rem' }} />
                                    <input value={exp.title} onChange={(e) => {
                                        const newExp = [...resume.experience];
                                        newExp[i].title = e.target.value;
                                        updateSection('experience', newExp);
                                    }} placeholder="Title" className="glass" style={{ padding: '0.8rem', border: 'none', color: 'white', borderRadius: '0.75rem' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#00BAFF', letterSpacing: '0.1em' }}>IMPACT BULLETS</p>
                                    {exp.bullets.map((b: string, j: number) => (
                                        <div key={j} style={{ display: 'flex', gap: '0.75rem' }}>
                                            <textarea value={b} onChange={(e) => {
                                                const newExp = [...resume.experience];
                                                newExp[i].bullets[j] = e.target.value;
                                                updateSection('experience', newExp);
                                            }} className="glass" style={{ flex: 1, padding: '0.75rem', border: 'none', color: '#ccc', borderRadius: '0.5rem', fontSize: '0.85rem', resize: 'none' }} />
                                            <button className="btn btn-secondary" style={{ padding: '0.5rem' }}><Sparkles size={14} color="#00BAFF" /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* OTHER TABS (Simplified for demo) */}
                {!['jd', 'basic', 'experience'].includes(activeTab) && (
                    <div className="animate-fade-in" style={{ padding: '4rem', textAlign: 'center' }}>
                        <Layout size={40} style={{ color: '#333', marginBottom: '1.5rem' }} />
                        <h3>{activeTab.toUpperCase()} Editor</h3>
                        <p style={{ color: '#666', marginTop: '1rem' }}>This section is synced and ready for custom entry.</p>
                    </div>
                )}
            </div>

            {/* LIVE PREVIEW PANE */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#00BAFF', letterSpacing: '0.1em' }}>LIVE PREVIEW</p>
                    <span style={{ fontSize: '0.6rem', color: '#444' }}>A4 PAPER • REAL TIME</span>
                </div>
                <div style={{ 
                    flex: 1, 
                    overflow: 'hidden', 
                    borderRadius: '1rem', 
                    border: '1px solid #222', 
                    position: 'relative',
                    background: '#111',
                    padding: '10px'
                }}>
                   <div style={{ 
                       height: '141%', // A4 Ratio approx
                       width: '100%',
                       transform: 'scale(1)', // Can be scaled down if needed
                       transformOrigin: 'top center',
                       overflowY: 'auto',
                       borderRadius: '0.5rem'
                   }}>
                        <ResumePreview data={resume} />
                   </div>
                </div>
            </div>
        </div>
      </div>
    </main>
  );
}
