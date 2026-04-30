"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  const [currentTemplate, setCurrentTemplate] = useState(0);

  // Pagination Warning State
  const previewRef = useRef<HTMLDivElement>(null);
  const [isOverPageLimit, setIsOverPageLimit] = useState(false);

  // Resume State
  const [resume, setResume] = useState<any>(RESUME_TEMPLATES.indian_professional);
  const [jdText, setJdText] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);

  // Pagination Height Checker
  useEffect(() => {
    if (!previewRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        // A4 ratio at 750px width is ~1060px height
        setIsOverPageLimit(entry.contentRect.height > 1060);
      }
    });
    observer.observe(previewRef.current);
    return () => observer.disconnect();
  }, []);

  const WEAK_VERBS = ['helped', 'worked on', 'did', 'made', 'managed', 'assisted', 'responsible for', 'handled', 'was'];
  const getWeakVerbs = (text: string) => {
    const lower = text.toLowerCase();
    return WEAK_VERBS.filter(v => lower.includes(v));
  };

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
    <main style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0B0F1A', overflow: 'hidden', position: 'relative' }}>
      {/* Ambient orbs */}
      <div className="animate-breathe" style={{ position: 'absolute', top: '-20%', left: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(124,92,255,0.12) 0%, transparent 70%)', filter: 'blur(120px)', zIndex: 0 }} />
      <div className="animate-breathe" style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)', filter: 'blur(120px)', zIndex: 0, animationDelay: '3s' }} />
      <div className="grain" style={{ zIndex: 1 }} />
      
      {/* EXECUTIVE TOP BAR */}
      <div style={{ padding: '0.75rem 2rem', background: 'rgba(11,15,26,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(124,92,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 950, color: '#fff', letterSpacing: '-0.04em', margin: 0 }}>CareerForge <span style={{ background: 'linear-gradient(135deg, #7C5CFF, #00D4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Studio</span></h1>
          </Link>
          {showSaved && <span className="save-pulse" style={{ fontSize: '0.6rem', color: '#00FF94', fontWeight: 950 }}>ENCRYPTED & SYNCED</span>}
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <button className="btn btn-secondary" onClick={() => setShowTemplateModal(true)} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', borderColor: 'rgba(124,92,255,0.2)' }}>Change Template</button>
           <button className="btn" onClick={downloadPDF} disabled={isDownloading} style={{ padding: '0.5rem 2rem', fontSize: '0.85rem', background: 'linear-gradient(135deg,#7C5CFF,#9B7CFF)', color: '#fff', borderRadius: '0.75rem' }}>
              {isDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} EXPORT PDF
           </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* SIDEBAR */}
        <div style={{ width: '80px', borderRight: '1px solid rgba(124,92,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '1.5rem', gap: '1rem', background: 'transparent', overflowY: 'auto', scrollbarWidth: 'none', zIndex: 10 }}>
            {SECTIONS.map(s => (
                <button 
                  key={s.id}
                  onClick={() => setActiveTab(s.id)}
                  style={{
                    width: '48px', height: '48px', minHeight: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: activeTab === s.id ? 'rgba(124,92,255,0.12)' : 'transparent',
                    border: activeTab === s.id ? '1px solid rgba(124,92,255,0.3)' : '1px solid transparent',
                    color: activeTab === s.id ? '#9B7CFF' : '#555', cursor: 'pointer', transition: 'all 0.2s',
                    position: 'relative'
                  }}
                  title={s.label}
                >
                  {s.icon}
                  {activeTab === s.id && <div className="sidebar-indicator" style={{ position: 'absolute', left: '-5px', width: '3px', height: '20px', background: '#7C5CFF', borderRadius: '2px', boxShadow: '0 0 8px rgba(124,92,255,0.8)' }} />}
                </button>
            ))}
            <div style={{ height: '2rem', minHeight: '2rem' }} />
        </div>

        {/* EDITOR PANEL */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '3rem 4rem', borderRight: '1px solid rgba(124,92,255,0.1)', scrollbarWidth: 'none', zIndex: 10 }}>
            <div className="animate-fade-in" key={activeTab}>
                <h2 style={{ fontSize: '2rem', fontWeight: 950, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>{SECTIONS.find(s => s.id === activeTab)?.label} <span style={{ background: 'linear-gradient(135deg, #7C5CFF, #00D4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Module</span></h2>

                <div style={{ background: 'rgba(124,92,255,0.06)', border: '1px solid rgba(124,92,255,0.2)', padding: '1rem 1.5rem', borderRadius: '1rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <AlertCircle size={20} color="#9B7CFF" />
                    <span style={{ fontSize: '0.85rem', color: '#9B7CFF', fontWeight: 500 }}>ATS TIP: Use standard phrasing, avoid complex tables or graphs, and tailor keywords directly from the AI Strategy module.</span>
                </div>

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
                                <input value={resume.basic?.name || ''} onChange={(e) => updateSection('basic', {...resume.basic, name: e.target.value})} className="glass" style={{ padding: '1.1rem', borderRadius: '1rem', border: '1px solid #111', color: '#fff', background: 'transparent' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <label style={{ fontSize: '0.8rem', color: '#444', fontWeight: 900 }}>CONTACT EMAIL</label>
                                <input value={resume.basic?.email || ''} onChange={(e) => updateSection('basic', {...resume.basic, email: e.target.value})} className="glass" style={{ padding: '1.1rem', borderRadius: '1rem', border: '1px solid #111', color: '#fff', background: 'transparent' }} />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <label style={{ fontSize: '0.8rem', color: '#444', fontWeight: 900 }}>PHONE NUMBER</label>
                                <input value={resume.basic?.phone || ''} onChange={(e) => updateSection('basic', {...resume.basic, phone: e.target.value})} className="glass" style={{ padding: '1.1rem', borderRadius: '1rem', border: '1px solid #111', color: '#fff', background: 'transparent' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <label style={{ fontSize: '0.8rem', color: '#444', fontWeight: 900 }}>LOCATION</label>
                                <input value={resume.basic?.location || ''} onChange={(e) => updateSection('basic', {...resume.basic, location: e.target.value})} className="glass" style={{ padding: '1.1rem', borderRadius: '1rem', border: '1px solid #111', color: '#fff', background: 'transparent' }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <label style={{ fontSize: '0.8rem', color: '#444', fontWeight: 900 }}>LINKEDIN / PORTFOLIO</label>
                            <input value={resume.basic?.linkedin || ''} onChange={(e) => updateSection('basic', {...resume.basic, linkedin: e.target.value})} className="glass" style={{ padding: '1.1rem', borderRadius: '1rem', border: '1px solid #111', color: '#fff', background: 'transparent' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <label style={{ fontSize: '0.8rem', color: '#444', fontWeight: 900 }}>PROFESSIONAL SUMMARY</label>
                            <textarea value={resume.basic?.summary || ''} onChange={(e) => updateSection('basic', {...resume.basic, summary: e.target.value})} placeholder="Strategic Professional Brief..." className="glass" style={{ padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid #111', color: '#fff', minHeight: '200px', resize: 'vertical', lineHeight: 1.8, background: 'transparent' }} />
                        </div>
                    </div>
                )}

                {activeTab === 'experience' && (
                    <>
                        <button onClick={() => addEntry('experience', { company: '', title: '', date: '', location: '', bullets: [''] })} className="btn btn-secondary" style={{ marginBottom: '2rem' }}><Plus size={16} /> New Node</button>
                        {resume.experience?.map((exp: any, i: number) => (
                            <div key={i} style={{ padding: '2.5rem', borderRadius: '2rem', border: '1px solid #111', marginBottom: '2rem', position: 'relative' }}>
                                <Trash2 onClick={() => removeEntry('experience', i)} size={18} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: '#222', cursor: 'pointer' }} />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                    <input value={exp.company || ''} onChange={(e) => updateEntry('experience', i, 'company', e.target.value)} placeholder="Organization" style={{ padding: '1rem', background: 'transparent', border: '1px solid #111', color: 'white', borderRadius: '0.8rem' }} />
                                    <input value={exp.title || ''} onChange={(e) => updateEntry('experience', i, 'title', e.target.value)} placeholder="Architectural Role" style={{ padding: '1rem', background: 'transparent', border: '1px solid #111', color: 'white', borderRadius: '0.8rem' }} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                                    <input value={exp.date || ''} onChange={(e) => updateEntry('experience', i, 'date', e.target.value)} placeholder="Duration (e.g. Jan 2020 - Present)" style={{ padding: '1rem', background: 'transparent', border: '1px solid #111', color: 'white', borderRadius: '0.8rem' }} />
                                    <input value={exp.location || ''} onChange={(e) => updateEntry('experience', i, 'location', e.target.value)} placeholder="Location" style={{ padding: '1rem', background: 'transparent', border: '1px solid #111', color: 'white', borderRadius: '0.8rem' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {exp.bullets?.map((b: string, j: number) => {
                                        const weak = getWeakVerbs(b);
                                        return (
                                        <div key={j} style={{ position: 'relative' }}>
                                            <textarea className="glass" value={b} onChange={(e) => {
                                                const nb = [...exp.bullets]; nb[j] = e.target.value; updateEntry('experience', i, 'bullets', nb);
                                            }} placeholder="Achieved X by implementing Y, resulting in Z..." style={{ width: '100%', padding: '1rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.8rem', minHeight: '80px', resize: 'vertical' }} />
                                            <X onClick={() => {
                                                const nb = [...exp.bullets]; nb.splice(j, 1); updateEntry('experience', i, 'bullets', nb);
                                            }} size={14} style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#444', cursor: 'pointer' }} />
                                            {weak.length > 0 && (
                                                <div className="animate-fade-in" style={{ marginTop: '0.5rem', padding: '0.75rem', background: 'rgba(255, 170, 0, 0.1)', border: '1px solid rgba(255, 170, 0, 0.2)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <AlertCircle size={14} color="#ffaa00" />
                                                    <span style={{ fontSize: '0.75rem', color: '#ffaa00', fontWeight: 500 }}>
                                                        Weak verb detected: "{weak[0]}". Try using strong action verbs like <b>Engineered</b>, <b>Spearheaded</b>, or <b>Optimized</b>.
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )})}
                                    <button onClick={() => updateEntry('experience', i, 'bullets', [...exp.bullets, ''])} className="btn btn-secondary">+ Append Achievement</button>
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {activeTab === 'academics' && (
                    <>
                        <button onClick={() => addEntry('academics', { school: '', degree: '', year: '', gpa: '' })} className="btn btn-secondary" style={{ marginBottom: '2rem' }}><Plus size={16} /> New Node</button>
                        {resume.academics?.map((edu: any, i: number) => (
                            <div key={i} style={{ padding: '2.5rem', borderRadius: '2rem', border: '1px solid #111', marginBottom: '2rem', position: 'relative' }}>
                                <Trash2 onClick={() => removeEntry('academics', i)} size={18} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: '#222', cursor: 'pointer' }} />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                    <input value={edu.school || edu.name || ''} onChange={(e) => updateEntry('academics', i, 'school', e.target.value)} placeholder="Institution" style={{ padding: '1rem', background: 'transparent', border: '1px solid #111', color: 'white', borderRadius: '0.8rem' }} />
                                    <input value={edu.degree || edu.detail || ''} onChange={(e) => updateEntry('academics', i, 'degree', e.target.value)} placeholder="Degree" style={{ padding: '1rem', background: 'transparent', border: '1px solid #111', color: 'white', borderRadius: '0.8rem' }} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <input value={edu.year || edu.date || ''} onChange={(e) => updateEntry('academics', i, 'year', e.target.value)} placeholder="Dates" style={{ padding: '1rem', background: 'transparent', border: '1px solid #111', color: 'white', borderRadius: '0.8rem' }} />
                                    <input value={edu.gpa || ''} onChange={(e) => updateEntry('academics', i, 'gpa', e.target.value)} placeholder="GPA / Honors" style={{ padding: '1rem', background: 'transparent', border: '1px solid #111', color: 'white', borderRadius: '0.8rem' }} />
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {activeTab === 'skills' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <label style={{ fontSize: '0.8rem', color: '#444', fontWeight: 900 }}>TECHNICAL SKILLS (Comma Separated)</label>
                            <textarea value={resume.skills?.map((s:any) => s.name).join(', ') || ''} onChange={(e) => updateSection('skills', e.target.value.split(',').map(s => ({name: s.trim()})))} className="glass" style={{ padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid #111', color: '#fff', minHeight: '120px', resize: 'vertical', lineHeight: 1.8, background: 'transparent' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <label style={{ fontSize: '0.8rem', color: '#444', fontWeight: 900 }}>SOFT SKILLS & LINGUISTIC (Comma Separated)</label>
                            <textarea value={resume.languages?.map((l:any) => l.name).join(', ') || ''} onChange={(e) => updateSection('languages', e.target.value.split(',').map(s => ({name: s.trim()})))} className="glass" style={{ padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid #111', color: '#fff', minHeight: '120px', resize: 'vertical', lineHeight: 1.8, background: 'transparent' }} />
                        </div>
                    </div>
                )}

                {/* UNIVERSAL EDITOR FOR ALL OTHER 12+ MODULES */}
                {!['jd', 'basic', 'experience', 'academics', 'skills'].includes(activeTab) && (
                    <>
                        <button onClick={() => addEntry(activeTab, { name: '', detail: '', date: '' })} className="btn btn-secondary" style={{ marginBottom: '2rem' }}><Plus size={16} /> New Entry</button>
                        {resume[activeTab]?.map((item: any, i: number) => (
                            <div key={i} style={{ padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid #1a1a1a', marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <input value={item.name || ''} onChange={(e) => updateEntry(activeTab, i, 'name', e.target.value)} placeholder="Name / Title" style={{ flex: 2, padding: '0.8rem', background: 'transparent', border: '1px solid #111', color: 'white', borderRadius: '0.6rem' }} />
                                <input value={item.detail || ''} onChange={(e) => updateEntry(activeTab, i, 'detail', e.target.value)} placeholder="Detail / Provider" style={{ flex: 1, padding: '0.8rem', background: 'transparent', border: '1px solid #111', color: 'white', borderRadius: '0.6rem' }} />
                                <input value={item.date || ''} onChange={(e) => updateEntry(activeTab, i, 'date', e.target.value)} placeholder="Year / Score" style={{ flex: 1, padding: '0.8rem', background: 'transparent', border: '1px solid #111', color: 'white', borderRadius: '0.6rem' }} />
                                <Trash2 onClick={() => removeEntry(activeTab, i)} size={18} style={{ color: '#222', cursor: 'pointer' }} />
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>

        {/* REAL-TIME ATS PREVIEW */}
        <div style={{ flex: 1, overflowY: 'auto', background: 'rgba(0,0,0,0.25)', padding: '4rem', display: 'flex', justifyContent: 'center', borderLeft: '1px solid rgba(124,92,255,0.1)', position: 'relative', zIndex: 10 }}>
            <div ref={previewRef} style={{ width: '100%', maxWidth: '750px', height: 'fit-content', boxShadow: '0 60px 180px rgba(0,0,0,1)', borderRadius: '4px', overflow: 'hidden' }}>
                <ResumePreview data={resume} templateId={currentTemplate} />
            </div>
            
            {/* FIT TO ONE PAGE WARNING */}
            <div style={{
                position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 100,
                background: isOverPageLimit ? 'rgba(255, 0, 85, 0.1)' : 'rgba(124, 92, 255, 0.1)',
                border: isOverPageLimit ? '1px solid rgba(255,0,85,0.3)' : '1px solid rgba(124,92,255,0.3)',
                padding: '0.75rem 1.25rem', borderRadius: '2rem',
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                backdropFilter: 'blur(12px)', transition: 'all 0.3s'
            }}>
                {isOverPageLimit ? <AlertCircle size={16} color="#FF0055" /> : <CheckCircle size={16} color="#7C5CFF" />}
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: isOverPageLimit ? '#FF0055' : '#9B7CFF' }}>
                    {isOverPageLimit ? "⚠️ Spilling to Page 2" : "1 Page (ATS Optimal)"}
                </span>
            </div>
        </div>

      </div>

      {/* TEMPLATE ENGINE OVERLAY */}
      {showTemplateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(11,15,26,0.95)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(30px)' }}>
            <div className="glass-auth-card" style={{ width: '90%', maxWidth: '750px', padding: '4rem', borderRadius: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>Resume <span style={{ background: 'linear-gradient(135deg,#7C5CFF,#00D4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Architectures</span></h2>
                    <X onClick={() => setShowTemplateModal(false)} style={{ cursor: 'pointer', color: '#666' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div onClick={() => { setCurrentTemplate(0); setShowTemplateModal(false); }} style={{ cursor: 'pointer', padding: '2.5rem', border: currentTemplate === 0 ? '1px solid rgba(124,92,255,0.5)' : '1px solid rgba(255,255,255,0.06)', borderRadius: '1.5rem', background: currentTemplate === 0 ? 'rgba(124,92,255,0.1)' : 'rgba(255,255,255,0.02)', transition: 'all 0.2s' }}>
                        <h4 style={{ color: '#9B7CFF' }}>Classic Pro</h4>
                        <p style={{ fontSize: '0.8rem', color: '#555', marginTop: '0.5rem' }}>Clean, single-column. Most ATS Safe.</p>
                    </div>
                    <div onClick={() => { setCurrentTemplate(1); setShowTemplateModal(false); }} style={{ cursor: 'pointer', padding: '2.5rem', border: currentTemplate === 1 ? '1px solid rgba(124,92,255,0.5)' : '1px solid rgba(255,255,255,0.06)', borderRadius: '1.5rem', background: currentTemplate === 1 ? 'rgba(124,92,255,0.1)' : 'rgba(255,255,255,0.02)', transition: 'all 0.2s' }}>
                        <h4 style={{ color: '#9B7CFF' }}>Modern Executive</h4>
                        <p style={{ fontSize: '0.8rem', color: '#555', marginTop: '0.5rem' }}>Bold header, structured. ATS Friendly.</p>
                    </div>
                    <div onClick={() => { setCurrentTemplate(2); setShowTemplateModal(false); }} style={{ cursor: 'pointer', padding: '2.5rem', border: currentTemplate === 2 ? '1px solid rgba(124,92,255,0.5)' : '1px solid rgba(255,255,255,0.06)', borderRadius: '1.5rem', background: currentTemplate === 2 ? 'rgba(124,92,255,0.1)' : 'rgba(255,255,255,0.02)', transition: 'all 0.2s' }}>
                        <h4 style={{ color: '#9B7CFF' }}>Two-Column Clean</h4>
                        <p style={{ fontSize: '0.8rem', color: '#555', marginTop: '0.5rem' }}>Skills sidebar, compact. ATS Friendly.</p>
                    </div>
                </div>
            </div>
        </div>
      )}

    </main>
  );
}
