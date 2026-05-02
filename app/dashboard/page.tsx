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
  Microscope,
  CheckCircle, Database, Zap, ShieldCheck,
  Info
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
        // True A4 height at 96dpi = 1123px
        setIsOverPageLimit(entry.contentRect.height > 1123);
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
    { id: 'jd', label: 'AI Strategy', icon: <Search size={20} />, category: 'AI' },
    { id: 'basic', label: 'Identity', icon: <User size={20} />, category: 'CORE' },
    { id: 'academics', label: 'Academics', icon: <GraduationCap size={20} />, category: 'CORE' },
    { id: 'experience', label: 'History', icon: <Briefcase size={20} />, category: 'CORE' },
    { id: 'projects', label: 'Projects', icon: <Layers size={20} />, category: 'CORE' },
    { id: 'skills', label: 'Technical', icon: <FileCheck size={20} />, category: 'SKILLS' },
    { id: 'languages', label: 'Linguistic', icon: <Globe size={20} />, category: 'SKILLS' },
    { id: 'social', label: 'Links', icon: <MessageSquare size={20} />, category: 'SKILLS' },
    { id: 'certifications', label: 'Verified Certs', icon: <ShieldCheck size={20} />, category: 'HONORS' },
    { id: 'awards', label: 'Honors', icon: <Trophy size={20} />, category: 'HONORS' },
    { id: 'publications', label: 'Research', icon: <BookOpen size={20} />, category: 'HONORS' },
    { id: 'patents', label: 'Innovation', icon: <Lightbulb size={20} />, category: 'HONORS' },
    { id: 'volunteering', label: 'Altruism', icon: <Heart size={20} />, category: 'OTHER' },
    { id: 'competitions', label: 'Competitions', icon: <Presentation size={20} />, category: 'OTHER' },
    { id: 'testScores', label: 'Test Scores', icon: <Microscope size={20} />, category: 'OTHER' },
    { id: 'scholarships', label: 'Scholarships', icon: <Trophy size={20} />, category: 'OTHER' }
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

  const renderLabel = (text: string) => (
    <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: '#888', marginBottom: '0.5rem', display: 'block' }}>
      {text}
    </label>
  );

  return (
    <main style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0B0F1A', overflow: 'hidden', position: 'relative' }}>
      {/* Ambient orbs */}
      <div className="animate-breathe" style={{ position: 'absolute', top: '-20%', left: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(124,92,255,0.08) 0%, transparent 70%)', filter: 'blur(120px)', zIndex: 0 }} />
      <div className="animate-breathe" style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)', filter: 'blur(120px)', zIndex: 0, animationDelay: '3s' }} />
      <div className="grain" style={{ zIndex: 1 }} />
      
      {/* EXECUTIVE TOP BAR */}
      <div style={{ padding: '0.75rem 2rem', background: 'rgba(11,15,26,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(124,92,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 950, color: '#fff', letterSpacing: '-0.04em', margin: 0 }}>
              CareerForge <span style={{ background: 'linear-gradient(135deg, #7C5CFF, #00D4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Studio</span>
            </h1>
          </Link>
          {showSaved && <span className="save-pulse" style={{ fontSize: '0.65rem', color: '#00D4FF', fontWeight: 800, letterSpacing: '0.05em' }}>✓ SYNCED</span>}
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <button className="btn btn-secondary" onClick={() => setShowTemplateModal(true)} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}>
              <Layout size={14} /> Change Template
           </button>
           <button className="btn" onClick={downloadPDF} disabled={isDownloading} style={{ padding: '0.5rem 2rem', fontSize: '0.85rem', background: '#fff', color: '#000', borderRadius: '0.5rem', fontWeight: 700 }}>
              {isDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} EXPORT PDF
           </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* SIDEBAR */}
        <div style={{ width: '80px', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '1.5rem', gap: '0.75rem', background: 'rgba(0,0,0,0.2)', overflowY: 'auto', scrollbarWidth: 'none', zIndex: 10 }}>
            {SECTIONS.map(s => (
                <button 
                  key={s.id}
                  onClick={() => setActiveTab(s.id)}
                  style={{
                    width: '44px', height: '44px', minHeight: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: activeTab === s.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                    border: activeTab === s.id ? '1px solid rgba(255,255,255,0.15)' : '1px solid transparent',
                    color: activeTab === s.id ? '#fff' : '#666', cursor: 'pointer', transition: 'all 0.2s',
                    position: 'relative'
                  }}
                  title={s.label}
                >
                  {s.icon}
                  {activeTab === s.id && <div className="sidebar-indicator" style={{ position: 'absolute', left: '-4px', width: '3px', height: '16px', background: '#fff', borderRadius: '2px' }} />}
                </button>
            ))}
            <div style={{ height: '2rem', minHeight: '2rem' }} />
        </div>

        {/* EDITOR PANEL */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '3rem 4rem', borderRight: '1px solid rgba(255,255,255,0.05)', scrollbarWidth: 'none', zIndex: 10, position: 'relative' }}>
            <div className="animate-fade-in" key={activeTab} style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 600, marginBottom: '1.5rem', letterSpacing: '-0.02em', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                  {SECTIONS.find(s => s.id === activeTab)?.label}
                </h2>

                <div style={{ padding: '1rem 1.25rem', borderLeft: '3px solid #7C5CFF', background: 'linear-gradient(90deg, rgba(124,92,255,0.08) 0%, transparent 100%)', marginBottom: '2.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start', borderRadius: '0 0.5rem 0.5rem 0' }}>
                    <Info size={18} color="#7C5CFF" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.85rem', color: '#bbb', lineHeight: 1.5 }}>
                      <strong style={{ color: '#fff' }}>ATS Strategy:</strong> Ensure absolute alignment with your target role. Avoid formatting elements like columns or progress bars within text fields.
                    </span>
                </div>

                {activeTab === 'jd' && (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {renderLabel("TARGET JOB DESCRIPTION")}
                          <textarea 
                              value={jdText} onChange={(e) => setJdText(e.target.value)}
                              placeholder="Paste the target Job Description here to analyze keyword overlaps..."
                              className="input-premium" style={{ height: '300px' }}
                          />
                        </div>
                        <button onClick={handleAnalyze} disabled={isAnalyzing} style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', background: '#fff', color: '#000', borderRadius: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                            {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <><Search size={18} /> Analyze Alignment</>}
                        </button>

                        {analysis && (
                            <div className="animate-fade-in" style={{ marginTop: '2.5rem', padding: '2rem', background: 'rgba(0, 212, 255, 0.05)', border: '1px solid rgba(0, 212, 255, 0.2)', borderRadius: '1rem' }}>
                                <h3 style={{ fontSize: '1.2rem', color: '#00D4FF', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                                    <Sparkles size={18} /> Scan Complete
                                </h3>
                                
                                <div style={{ marginBottom: '1.5rem' }}>
                                    {renderLabel("CORE SUMMARY")}
                                    <p style={{ color: '#ddd', lineHeight: 1.6, fontSize: '0.9rem' }}>{analysis.jdSummary}</p>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                    <div>
                                        {renderLabel("TOP KEYWORDS")}
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            {analysis.topKeywords?.map((kw: string, i: number) => (
                                                <span key={i} style={{ background: 'rgba(124, 92, 255, 0.15)', color: '#9B7CFF', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', border: '1px solid rgba(124, 92, 255, 0.3)' }}>{kw}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        {renderLabel("ACTION VERBS")}
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            {analysis.ActionKeywords?.map((kw: string, i: number) => (
                                                <span key={i} style={{ background: 'rgba(0, 212, 255, 0.15)', color: '#00D4FF', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', border: '1px solid rgba(0, 212, 255, 0.3)' }}>{kw}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'basic' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                {renderLabel("LEGAL NAME")}
                                <input value={resume.basic?.name || ''} onChange={(e) => updateSection('basic', {...resume.basic, name: e.target.value})} className="input-premium" />
                            </div>
                            <div>
                                {renderLabel("CONTACT EMAIL")}
                                <input value={resume.basic?.email || ''} onChange={(e) => updateSection('basic', {...resume.basic, email: e.target.value})} className="input-premium" />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                {renderLabel("PHONE NUMBER")}
                                <input value={resume.basic?.phone || ''} onChange={(e) => updateSection('basic', {...resume.basic, phone: e.target.value})} className="input-premium" />
                            </div>
                            <div>
                                {renderLabel("LOCATION")}
                                <input value={resume.basic?.location || ''} onChange={(e) => updateSection('basic', {...resume.basic, location: e.target.value})} className="input-premium" />
                            </div>
                        </div>
                        <div>
                            {renderLabel("LINKEDIN / PORTFOLIO")}
                            <input value={resume.basic?.linkedin || ''} onChange={(e) => updateSection('basic', {...resume.basic, linkedin: e.target.value})} className="input-premium" />
                        </div>
                        <div>
                            {renderLabel("PROFESSIONAL SUMMARY")}
                            <textarea value={resume.basic?.summary || ''} onChange={(e) => updateSection('basic', {...resume.basic, summary: e.target.value})} placeholder="Strategic Professional Brief..." className="input-premium" style={{ minHeight: '160px' }} />
                        </div>
                    </div>
                )}

                {activeTab === 'experience' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {resume.experience?.map((exp: any, i: number) => (
                            <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                                <button onClick={() => removeEntry('experience', i)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', padding: '0.5rem' }} title="Remove Entry">
                                  <Trash2 size={16} />
                                </button>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                    <div>
                                      {renderLabel("ORGANIZATION")}
                                      <input value={exp.company || ''} onChange={(e) => updateEntry('experience', i, 'company', e.target.value)} className="input-premium" />
                                    </div>
                                    <div>
                                      {renderLabel("ROLE TITLE")}
                                      <input value={exp.title || ''} onChange={(e) => updateEntry('experience', i, 'title', e.target.value)} className="input-premium" />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                                    <div>
                                      {renderLabel("DURATION")}
                                      <input value={exp.date || ''} onChange={(e) => updateEntry('experience', i, 'date', e.target.value)} placeholder="e.g. Jan 2020 - Present" className="input-premium" />
                                    </div>
                                    <div>
                                      {renderLabel("LOCATION")}
                                      <input value={exp.location || ''} onChange={(e) => updateEntry('experience', i, 'location', e.target.value)} className="input-premium" />
                                    </div>
                                </div>
                                
                                <div>
                                    {renderLabel("IMPACT BULLETS")}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {exp.bullets?.map((b: string, j: number) => {
                                            const weak = getWeakVerbs(b);
                                            return (
                                            <div key={j} style={{ position: 'relative' }}>
                                                <textarea className="input-premium" value={b} onChange={(e) => {
                                                    const nb = [...exp.bullets]; nb[j] = e.target.value; updateEntry('experience', i, 'bullets', nb);
                                                }} placeholder="Achieved X by implementing Y, resulting in Z..." style={{ minHeight: '80px', paddingRight: '2.5rem' }} />
                                                <X onClick={() => {
                                                    const nb = [...exp.bullets]; nb.splice(j, 1); updateEntry('experience', i, 'bullets', nb);
                                                }} size={14} style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#666', cursor: 'pointer' }} />
                                                
                                                {weak.length > 0 && (
                                                    <div className="animate-fade-in" style={{ marginTop: '0.5rem', padding: '0.75rem', background: 'rgba(255, 170, 0, 0.05)', borderLeft: '2px solid #ffaa00', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                                                        <AlertCircle size={14} color="#ffaa00" style={{ marginTop: '2px' }} />
                                                        <span style={{ fontSize: '0.75rem', color: '#ccc', lineHeight: 1.4 }}>
                                                            Weak verb detected: <strong style={{ color: '#ffaa00' }}>"{weak[0]}"</strong>. Consider stronger action verbs.
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )})}
                                        <button onClick={() => updateEntry('experience', i, 'bullets', [...exp.bullets, ''])} style={{ alignSelf: 'flex-start', background: 'transparent', border: '1px dashed rgba(255,255,255,0.2)', color: '#aaa', padding: '0.75rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                          <Plus size={14} /> Add Bullet
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button onClick={() => addEntry('experience', { company: '', title: '', date: '', location: '', bullets: [''] })} style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', color: '#fff', borderRadius: '1rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                          <Plus size={16} /> Add Experience
                        </button>
                    </div>
                )}

                {activeTab === 'academics' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {resume.academics?.map((edu: any, i: number) => (
                            <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                                <button onClick={() => removeEntry('academics', i)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', padding: '0.5rem' }} title="Remove Entry">
                                  <Trash2 size={16} />
                                </button>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                    <div>
                                      {renderLabel("INSTITUTION")}
                                      <input value={edu.school || edu.name || ''} onChange={(e) => updateEntry('academics', i, 'school', e.target.value)} className="input-premium" />
                                    </div>
                                    <div>
                                      {renderLabel("DEGREE / MAJOR")}
                                      <input value={edu.degree || edu.detail || ''} onChange={(e) => updateEntry('academics', i, 'degree', e.target.value)} className="input-premium" />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div>
                                      {renderLabel("TIMEFRAME")}
                                      <input value={edu.year || edu.date || ''} onChange={(e) => updateEntry('academics', i, 'year', e.target.value)} className="input-premium" />
                                    </div>
                                    <div>
                                      {renderLabel("GPA / HONORS")}
                                      <input value={edu.gpa || ''} onChange={(e) => updateEntry('academics', i, 'gpa', e.target.value)} className="input-premium" />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button onClick={() => addEntry('academics', { school: '', degree: '', year: '', gpa: '' })} style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', color: '#fff', borderRadius: '1rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                          <Plus size={16} /> Add Education
                        </button>
                    </div>
                )}

                {activeTab === 'skills' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div>
                            {renderLabel("TECHNICAL SKILLS (Comma Separated)")}
                            <textarea value={resume.skills?.map((s:any) => s.name).join(', ') || ''} onChange={(e) => updateSection('skills', e.target.value.split(',').map(s => ({name: s.trim()})))} className="input-premium" style={{ minHeight: '120px' }} />
                        </div>
                        <div>
                            {renderLabel("SOFT SKILLS & LINGUISTIC (Comma Separated)")}
                            <textarea value={resume.languages?.map((l:any) => l.name).join(', ') || ''} onChange={(e) => updateSection('languages', e.target.value.split(',').map(s => ({name: s.trim()})))} className="input-premium" style={{ minHeight: '120px' }} />
                        </div>
                    </div>
                )}

                {/* UNIVERSAL EDITOR FOR ALL OTHER 12+ MODULES */}
                {!['jd', 'basic', 'experience', 'academics', 'skills'].includes(activeTab) && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {resume[activeTab]?.map((item: any, i: number) => (
                            <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '1rem', alignItems: 'flex-start', position: 'relative' }}>
                                <div style={{ flex: 2 }}>
                                  {renderLabel("ITEM NAME")}
                                  <input value={item.name || ''} onChange={(e) => updateEntry(activeTab, i, 'name', e.target.value)} className="input-premium" />
                                </div>
                                <div style={{ flex: 1 }}>
                                  {renderLabel("DETAIL / PROVIDER")}
                                  <input value={item.detail || ''} onChange={(e) => updateEntry(activeTab, i, 'detail', e.target.value)} className="input-premium" />
                                </div>
                                <div style={{ flex: 1 }}>
                                  {renderLabel("DATE / SCORE")}
                                  <input value={item.date || ''} onChange={(e) => updateEntry(activeTab, i, 'date', e.target.value)} className="input-premium" />
                                </div>
                                <button onClick={() => removeEntry(activeTab, i)} style={{ marginTop: '1.75rem', background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', padding: '0.5rem' }} title="Remove">
                                  <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                        <button onClick={() => addEntry(activeTab, { name: '', detail: '', date: '' })} style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', color: '#fff', borderRadius: '1rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontWeight: 600, marginTop: '1rem' }}>
                          <Plus size={16} /> Add Entry
                        </button>
                    </div>
                )}
            </div>
        </div>

        {/* REAL-TIME ATS PREVIEW — A4 Print Stage */}
        <div style={{
          flex: 1, overflowY: 'auto', overflowX: 'auto',
          background: '#1A1C23',
          padding: '3rem 2rem',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          borderLeft: '1px solid rgba(255,255,255,0.05)',
          position: 'relative', zIndex: 10
        }}>
            {/* A4 label */}
            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.7rem', color: '#666', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>A4 Preview · 210 × 297 mm</span>
            </div>

            {/* A4 paper card: 794 × 1123 px at 96 dpi */}
            <div
              ref={previewRef}
              style={{
                width: '794px',
                minHeight: '1123px',
                height: 'fit-content',
                background: '#ffffff',
                boxShadow: '0 8px 40px rgba(0,0,0,0.4), 0 0 10px rgba(0,0,0,0.2)',
                borderRadius: '4px',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <ResumePreview data={resume} templateId={currentTemplate} />
            </div>

            {/* FIT TO ONE PAGE WARNING */}
            <div style={{
                position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 100,
                background: isOverPageLimit ? 'rgba(255, 0, 85, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                border: isOverPageLimit ? '1px solid rgba(255,0,85,0.3)' : '1px solid rgba(255,255,255,0.1)',
                padding: '0.75rem 1.25rem', borderRadius: '1rem',
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                backdropFilter: 'blur(12px)', transition: 'all 0.3s'
            }}>
                {isOverPageLimit ? <AlertCircle size={16} color="#FF0055" /> : <CheckCircle size={16} color="#fff" />}
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: isOverPageLimit ? '#FF0055' : '#fff' }}>
                    {isOverPageLimit ? "Spilling to Page 2" : "1 Page Layout Optimal"}
                </span>
            </div>
        </div>

      </div>

      {/* TEMPLATE ENGINE OVERLAY */}
      {showTemplateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(11,15,26,0.95)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(30px)' }}>
            <div className="glass-auth-card" style={{ width: '90%', maxWidth: '800px', padding: '4rem', borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff' }}>Resume <span style={{ color: '#00D4FF' }}>Architectures</span></h2>
                    <X onClick={() => setShowTemplateModal(false)} style={{ cursor: 'pointer', color: '#666' }} size={28} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div onClick={() => { setCurrentTemplate(0); setShowTemplateModal(false); }} style={{ cursor: 'pointer', padding: '2.5rem', border: currentTemplate === 0 ? '2px solid #00D4FF' : '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', background: currentTemplate === 0 ? 'rgba(0,212,255,0.05)' : 'rgba(255,255,255,0.02)', transition: 'all 0.2s' }}>
                        <h4 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Classic Pro</h4>
                        <p style={{ fontSize: '0.9rem', color: '#888' }}>Clean, single-column design. Universally ATS safe.</p>
                    </div>
                    <div onClick={() => { setCurrentTemplate(1); setShowTemplateModal(false); }} style={{ cursor: 'pointer', padding: '2.5rem', border: currentTemplate === 1 ? '2px solid #00D4FF' : '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', background: currentTemplate === 1 ? 'rgba(0,212,255,0.05)' : 'rgba(255,255,255,0.02)', transition: 'all 0.2s' }}>
                        <h4 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Modern Executive</h4>
                        <p style={{ fontSize: '0.9rem', color: '#888' }}>Bold structured header. Highly ATS Friendly.</p>
                    </div>
                    <div onClick={() => { setCurrentTemplate(2); setShowTemplateModal(false); }} style={{ cursor: 'pointer', padding: '2.5rem', border: currentTemplate === 2 ? '2px solid #00D4FF' : '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', background: currentTemplate === 2 ? 'rgba(0,212,255,0.05)' : 'rgba(255,255,255,0.02)', transition: 'all 0.2s' }}>
                        <h4 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Two-Column Clean</h4>
                        <p style={{ fontSize: '0.9rem', color: '#888' }}>Skills sidebar configuration. ATS Friendly.</p>
                    </div>
                </div>
            </div>
        </div>
      )}

    </main>
  );
}
