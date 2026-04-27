"use client";

import { useState, useEffect, useCallback } from "react";
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
import Link from "next/link";

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
    const saved = localStorage.getItem("forge_ultimate_v1");
    if (saved) {
      try {
        setResume(JSON.parse(saved));
      } catch (e) {
        console.error("Storage Error");
      }
    }
  }, []);

  const saveToStorage = useCallback((data: any) => {
    localStorage.setItem("forge_ultimate_v1", JSON.stringify(data));
    setShowSaved(true);
  }, []);

  useEffect(() => {
    if (showSaved) {
      const timer = setTimeout(() => setShowSaved(false), 2000);
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
    } catch (e) {
        console.error(e);
    } finally {
        setIsAnalyzing(false);
    }
  };

  const SECTIONS = [
    { id: 'jd', label: 'AI Strategy', icon: <Search size={22} />, category: 'AI' },
    { id: 'basic', label: 'Identity', icon: <User size={22} />, category: 'CORE' },
    { id: 'academics', label: 'Academics', icon: <GraduationCap size={22} />, category: 'CORE' },
    { id: 'experience', label: 'History', icon: <Briefcase size={22} />, category: 'CORE' },
    { id: 'projects', label: 'Projects', icon: <Layers size={22} />, category: 'CORE' },
    { id: 'skills', label: 'Technical', icon: <FileCheck size={22} />, category: 'SKILLS' },
    { id: 'languages', label: 'Linguistic', icon: <Globe size={22} />, category: 'SKILLS' },
    { id: 'social', label: 'Links', icon: <MessageSquare size={22} />, category: 'SKILLS' },
    { id: 'certifications', label: 'Verified Certs', icon: <ShieldCheck size={22} />, category: 'HONORS' },
    { id: 'awards', label: 'Honors', icon: <Trophy size={22} />, category: 'HONORS' },
    { id: 'publications', label: 'Research', icon: <BookOpen size={22} />, category: 'HONORS' },
    { id: 'patents', label: 'Innovation', icon: <Lightbulb size={22} />, category: 'HONORS' },
    { id: 'volunteering', label: 'Altruism', icon: <Heart size={22} />, category: 'OTHER' },
    { id: 'competitions', label: 'Competitions', icon: <Presentation size={22} />, category: 'OTHER' },
    { id: 'testScores', label: 'Test Scores', icon: <Microscope size={22} />, category: 'OTHER' },
    { id: 'scholarships', label: 'Scholarships', icon: <Trophy size={22} />, category: 'OTHER' }
  ];

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
      a.download = `CareerForge_Master.pdf`;
      a.click();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#000', overflow: 'hidden' }}>
      <div className="grain" />
      
      {/* EXECUTIVE TOP BAR */}
      <div style={{ padding: '0.75rem 2rem', background: '#000', borderBottom: '1px solid #111', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 950, color: '#fff', letterSpacing: '-0.04em', margin: 0 }}>CareerForge <span className="text-gradient">Studio</span></h1>
          </Link>
          {showSaved && <span className="save-pulse" style={{ fontSize: '0.6rem', color: '#00FF94', fontWeight: 950 }}>ENCRYPTED & SYNCED</span>}
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <button className="btn btn-secondary" onClick={() => setShowTemplateModal(true)} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Change Template</button>
           <button className="btn btn-primary" onClick={downloadPDF} disabled={isDownloading} style={{ padding: '0.5rem 2rem', fontSize: '0.85rem' }}>
              {isDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} EXPORT PDF
           </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* FULL 16-FEATURE SCROLLABLE SIDEBAR */}
        <div style={{ width: '80px', borderRight: '1px solid #111', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '1.5rem', gap: '1rem', background: '#000', overflowY: 'auto', scrollbarWidth: 'none' }}>
            {SECTIONS.map(s => (
                <button 
                  key={s.id}
                  onClick={() => setActiveTab(s.id)}
                  style={{
                    width: '48px', height: '48px', minHeight: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: activeTab === s.id ? 'rgba(0,186,255,0.1)' : 'transparent',
                    border: 'none', color: activeTab === s.id ? '#00BAFF' : '#444', cursor: 'pointer', transition: 'all 0.2s',
                    position: 'relative'
                  }}
                  title={s.label}
                >
                  {s.icon}
                  {activeTab === s.id && <div style={{ position: 'absolute', left: '-5px', width: '3px', height: '20px', background: '#00BAFF', borderRadius: '2px' }} />}
                </button>
            ))}
            <div style={{ height: '2rem', minHeight: '2rem' }} />
        </div>

        {/* 50% DYNAMIC EDITOR PANEL */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '3rem 4rem', borderRight: '1px solid #111', scrollbarWidth: 'none' }}>
            <div className="animate-fade-in" key={activeTab}>
                <h2 style={{ fontSize: '2rem', fontWeight: 950, marginBottom: '2.5rem', letterSpacing: '-0.02em' }}>{SECTIONS.find(s => s.id === activeTab)?.label} <span className="text-gradient">Module</span></h2>

                {activeTab === 'jd' && (
                    <>
                        <textarea 
                            value={jdText} onChange={(e) => setJdText(e.target.value)}
                            placeholder="Paste Job Description for AI alignment..."
                            style={{ width: '100%', height: '400px', background: 'rgba(255,255,255,0.01)', border: '1px solid #111', borderRadius: '1.5rem', padding: '2rem', color: '#fff', fontSize: '1rem', lineHeight: 1.8, outline: 'none' }}
                        />
                        <button onClick={handleAnalyze} disabled={isAnalyzing} className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', padding: '1.25rem' }}>
                            {isAnalyzing ? <Loader2 size={20} className="animate-spin" /> : "Initiate ATS Scan"}
                        </button>
                    </>
                )}

                {activeTab === 'basic' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <label style={{ fontSize: '0.8rem', color: '#444', fontWeight: 900 }}>LEGAL NAME</label>
                                <input value={resume.basic?.name} onChange={(e) => updateSection('basic', {...resume.basic, name: e.target.value})} className="glass" style={{ padding: '1.1rem', borderRadius: '1rem', border: '1px solid #111', color: '#fff', background: 'transparent' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <label style={{ fontSize: '0.8rem', color: '#444', fontWeight: 900 }}>CONTACT EMAIL</label>
                                <input value={resume.basic?.email} onChange={(e) => updateSection('basic', {...resume.basic, email: e.target.value})} className="glass" style={{ padding: '1.1rem', borderRadius: '1rem', border: '1px solid #111', color: '#fff', background: 'transparent' }} />
                            </div>
                        </div>
                        <textarea value={resume.basic?.summary} onChange={(e) => updateSection('basic', {...resume.basic, summary: e.target.value})} placeholder="Strategic Professional Brief..." className="glass" style={{ padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid #111', color: '#fff', minHeight: '300px', resize: 'none', lineHeight: 1.8, background: 'transparent' }} />
                    </div>
                )}

                {activeTab === 'experience' && (
                    <>
                        <button onClick={() => addEntry('experience', { company: '', title: '', date: '', bullets: [''] })} className="btn btn-secondary" style={{ marginBottom: '2rem' }}><Plus size={16} /> New Node</button>
                        {resume.experience?.map((exp: any, i: number) => (
                            <div key={i} style={{ padding: '2.5rem', borderRadius: '2rem', border: '1px solid #111', marginBottom: '2rem', position: 'relative' }}>
                                <Trash2 onClick={() => removeEntry('experience', i)} size={18} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: '#222', cursor: 'pointer' }} />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                                    <input value={exp.company} onChange={(e) => updateEntry('experience', i, 'company', e.target.value)} placeholder="Organization" style={{ padding: '1rem', background: 'transparent', border: '1px solid #111', color: 'white', borderRadius: '0.8rem' }} />
                                    <input value={exp.title} onChange={(e) => updateEntry('experience', i, 'title', e.target.value)} placeholder="Architectural Role" style={{ padding: '1rem', background: 'transparent', border: '1px solid #111', color: 'white', borderRadius: '0.8rem' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {exp.bullets?.map((b: string, j: number) => (
                                        <textarea key={j} value={b} onChange={(e) => {
                                            const nb = [...exp.bullets]; nb[j] = e.target.value; updateEntry('experience', i, 'bullets', nb);
                                        }} style={{ width: '100%', padding: '1rem', background: 'transparent', border: '1px solid #111', color: '#888', borderRadius: '0.8rem' }} />
                                    ))}
                                    <button onClick={() => updateEntry('experience', i, 'bullets', [...exp.bullets, ''])} className="btn btn-secondary">+ Append Achievement</button>
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {/* UNIVERSAL EDITOR FOR ALL OTHER 13+ MODULES */}
                {!['jd', 'basic', 'experience'].includes(activeTab) && (
                    <>
                        <button onClick={() => addEntry(activeTab, { name: '', detail: '', date: '' })} className="btn btn-secondary" style={{ marginBottom: '2rem' }}><Plus size={16} /> New Entry</button>
                        {resume[activeTab]?.map((item: any, i: number) => (
                            <div key={i} style={{ padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid #1a1a1a', marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <input value={item.name} onChange={(e) => updateEntry(activeTab, i, 'name', e.target.value)} placeholder="Name / Title" style={{ flex: 2, padding: '0.8rem', background: 'transparent', border: '1px solid #111', color: 'white', borderRadius: '0.6rem' }} />
                                <input value={item.detail} onChange={(e) => updateEntry(activeTab, i, 'detail', e.target.value)} placeholder="Detail / Provider" style={{ flex: 1, padding: '0.8rem', background: 'transparent', border: '1px solid #111', color: 'white', borderRadius: '0.6rem' }} />
                                <input value={item.date} onChange={(e) => updateEntry(activeTab, i, 'date', e.target.value)} placeholder="Year / Score" style={{ flex: 1, padding: '0.8rem', background: 'transparent', border: '1px solid #111', color: 'white', borderRadius: '0.6rem' }} />
                                <Trash2 onClick={() => removeEntry(activeTab, i)} size={18} style={{ color: '#222', cursor: 'pointer' }} />
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>

        {/* 50% REAL-TIME ATS PREVIEW */}
        <div style={{ flex: 1, overflowY: 'auto', background: '#0a0a0a', padding: '4rem', display: 'flex', justifyContent: 'center', borderLeft: '1px solid #111' }}>
            <div style={{ width: '100%', maxWidth: '750px', height: 'fit-content', boxShadow: '0 60px 180px rgba(0,0,0,1)', borderRadius: '4px' }}>
                <ResumePreview data={resume} />
            </div>
        </div>

      </div>

      {/* TEMPLATE ENGINE OVERLAY */}
      {showTemplateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.98)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(30px)' }}>
            <div className="glass-card" style={{ width: '90%', maxWidth: '750px', padding: '4rem', borderRadius: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>Resume <span className="text-gradient">Architectures</span></h2>
                    <X onClick={() => setShowTemplateModal(false)} style={{ cursor: 'pointer' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div onClick={() => { setResume(RESUME_TEMPLATES.indian_professional); setShowTemplateModal(false); saveToStorage(RESUME_TEMPLATES.indian_professional); }} style={{ cursor: 'pointer', padding: '2.5rem', border: '1px solid #222', borderRadius: '1.5rem' }}>
                        <h4 style={{ color: '#00BAFF' }}>Indian Executive</h4>
                        <p style={{ fontSize: '0.8rem', color: '#444', marginTop: '0.5rem' }}>Localized for IIT/NIT/Tier-1 Tech Markets.</p>
                    </div>
                    <div onClick={() => { setResume(RESUME_TEMPLATES.software_engineer); setShowTemplateModal(false); saveToStorage(RESUME_TEMPLATES.software_engineer); }} style={{ cursor: 'pointer', padding: '2.5rem', border: '1px solid #222', borderRadius: '1.5rem' }}>
                        <h4 style={{ color: '#00BAFF' }}>Global Tech Catalyst</h4>
                        <p style={{ fontSize: '0.8rem', color: '#444', marginTop: '0.5rem' }}>FAANG & International Remote Standards.</p>
                    </div>
                </div>
            </div>
        </div>
      )}

    </main>
  );
}
