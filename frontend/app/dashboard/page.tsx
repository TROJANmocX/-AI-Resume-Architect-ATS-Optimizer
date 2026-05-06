/**
 * Dashboard Component
 * The central workspace for resume creation and optimization.
 * Features:
 * - Real-time resume editing across multiple sections.
 * - AI-powered Job Description analysis for keyword matching.
 * - Live ATS-compliant resume preview (A4 format).
 * - Local storage persistence for draft management.
 * - PDF export functionality.
 */
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
  const [showSaved, setShowSaved] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(0);
  const [userName, setUserName] = useState("");

  // Pagination Warning State
  const previewRef = useRef<HTMLDivElement>(null);
  const [isOverPageLimit, setIsOverPageLimit] = useState(false);

  // Resume State
  const [resume, setResume] = useState<any>(RESUME_TEMPLATES.indian_professional);
  const [jdText, setJdText] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);

  // Auth check: redirect to login if no token
  useEffect(() => {
    const token = localStorage.getItem("cf_token");
    const user = localStorage.getItem("cf_user");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setUserName(parsed.name || "");
      } catch {}
    }
  }, []);

  // ResizeObserver to detect if the resume content exceeds the A4 page height (1123px)
  useEffect(() => {
    if (!previewRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
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

  const saveToStorage = useCallback(async (data: any) => {
    // Keep local storage as a fallback
    localStorage.setItem("forge_ultimate_v1", JSON.stringify(data));
    
    // Sync with MongoDB using real user ID
    try {
      const user = localStorage.getItem("cf_user");
      const userId = user ? JSON.parse(user).id : "anonymous-user";
      await fetch("http://localhost:5000/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          resumeData: data,
          jdText: jdText,
          analysis: analysis
        }),
      });
      setShowSaved(true);
    } catch (e) {
      console.error("Cloud Sync Error", e);
    }
  }, [jdText, analysis]);

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

  /**
   * Triggers the AI analysis of the job description.
   * Calls the /api/analyze endpoint to extract keywords and summary.
   */
  const handleAnalyze = async () => {
    if (!jdText) return;
    setIsAnalyzing(true);
    try {
        const res = await fetch("http://localhost:5000/api/analyze", {
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
    { id: 'jd', label: 'AI Strategy', icon: <Search size={18} /> },
    { id: 'basic', label: 'Identity', icon: <User size={18} /> },
    { id: 'academics', label: 'Academics', icon: <GraduationCap size={18} /> },
    { id: 'experience', label: 'History', icon: <Briefcase size={18} /> },
    { id: 'projects', label: 'Projects', icon: <Layers size={18} /> },
    { id: 'skills', label: 'Technical', icon: <FileCheck size={18} /> },
    { id: 'languages', label: 'Linguistic', icon: <Globe size={18} /> },
    { id: 'social', label: 'Links', icon: <MessageSquare size={18} /> },
    { id: 'certifications', label: 'Verified Certs', icon: <ShieldCheck size={18} /> },
    { id: 'awards', label: 'Honors', icon: <Trophy size={18} /> },
    { id: 'publications', label: 'Research', icon: <BookOpen size={18} /> },
    { id: 'patents', label: 'Innovation', icon: <Lightbulb size={18} /> },
    { id: 'volunteering', label: 'Altruism', icon: <Heart size={18} /> },
    { id: 'competitions', label: 'Competitions', icon: <Presentation size={18} /> },
    { id: 'testScores', label: 'Test Scores', icon: <Microscope size={18} /> },
    { id: 'scholarships', label: 'Scholarships', icon: <Trophy size={18} /> }
  ];

  /**
   * Generates a PDF version of the current resume state.
   * Sends the resume data to the /api/pdf endpoint.
   */
  const downloadPDF = async () => {
    setIsDownloading(true);
    try {
      const res = await fetch("http://localhost:5000/api/pdf", {
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
    <label style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted-foreground)', marginBottom: '0.5rem', display: 'block' }}>
      {text}
    </label>
  );

  const getEditorialNote = (tabId: string) => {
    switch (tabId) {
      case 'jd': return "Paste the target job description to analyze keyword alignment and uncover the core narrative recruiters are looking for.";
      case 'basic': return "Your professional identity. Keep the summary focused on strategic impact rather than generic objectives.";
      case 'experience': return "Use strong action verbs. Quantify your impact with metrics wherever possible to demonstrate tangible value.";
      case 'academics': return "Highlight academic rigor. Include GPA only if it is highly competitive, and list relevant coursework if applicable.";
      case 'skills': return "Categorize technical and soft skills clearly. ATS parsers match these exactly against the job description.";
      case 'projects': return "Focus on the problem solved, the technologies used, and the measurable outcome of your independent work.";
      case 'certifications': return "Include only verifiable, industry-recognized certifications that are directly relevant to your target role.";
      case 'awards': return "Detail the context of the award. Mention the selection criteria or the scale of the competition to convey prestige.";
      case 'publications': return "List peer-reviewed research, industry articles, or major presentations. Use standard citation formats.";
      case 'patents': return "Include patent numbers and a brief description of the innovation and its commercial application.";
      case 'volunteering': return "Highlight altruistic work that demonstrates leadership, community engagement, or relevant soft skills.";
      case 'competitions': return "Focus on hackathons or case competitions that show extreme dedication and high performance.";
      case 'testScores': return "Include standardized test scores only if they are exceptionally high or required by the target industry.";
      case 'scholarships': return "Mention merit-based financial awards. Specify if the scholarship was highly selective or prestigious.";
      case 'languages': return "Specify your proficiency level (e.g., Native, Fluent, Conversational) to provide accurate expectations.";
      case 'social': return "Ensure your LinkedIn profile and GitHub/Portfolio are up-to-date and reflect the narrative in this document.";
      default: return "Ensure absolute alignment with your target role. Avoid unnecessary embellishments within text fields.";
    }
  };

  return (
    <main className="theme-editorial" style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--background)', overflow: 'hidden' }}>
      
      {/* EXECUTIVE TOP BAR */}
      <div style={{ padding: '1rem 3rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 100, background: 'var(--background)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--foreground)', letterSpacing: '0.02em', margin: 0, fontFamily: 'var(--font-serif)' }}>
              CareerForge <span style={{ fontStyle: 'italic', color: 'var(--accent-editorial)' }}>Studio</span>
            </h1>
          </Link>
          {showSaved && <span style={{ fontSize: '0.65rem', color: 'var(--foreground)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>SAVED</span>}
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
           <button onClick={() => setShowTemplateModal(true)} style={{ background: 'transparent', border: 'none', fontSize: '0.8rem', color: 'var(--foreground)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              <Layout size={14} /> Layout
           </button>
           <button onClick={downloadPDF} disabled={isDownloading} style={{ background: 'transparent', border: '1px solid var(--foreground)', padding: '0.5rem 1.5rem', fontSize: '0.8rem', color: 'var(--foreground)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--foreground)'; e.currentTarget.style.color = 'var(--background)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--foreground)'; }}>
              {isDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} Export PDF
           </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* SIDEBAR */}
        <div style={{ width: '250px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: '2rem 0', gap: '0.5rem', overflowY: 'auto', scrollbarWidth: 'none' }}>
            {SECTIONS.map(s => (
                <button 
                  key={s.id}
                  onClick={() => setActiveTab(s.id)}
                  style={{
                    width: '100%', padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem',
                    background: 'transparent', border: 'none', borderLeft: activeTab === s.id ? '2px solid var(--accent-editorial)' : '2px solid transparent',
                    color: activeTab === s.id ? 'var(--foreground)' : 'var(--muted-foreground)', cursor: 'pointer', transition: 'all 0.2s',
                    textAlign: 'left', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em'
                  }}
                >
                  <span style={{ opacity: activeTab === s.id ? 1 : 0.6 }}>{s.icon}</span>
                  {s.label}
                </button>
            ))}
            <div style={{ height: '2rem', minHeight: '2rem' }} />
        </div>

        {/* EDITOR PANEL */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '4rem 5rem', scrollbarWidth: 'none', position: 'relative' }}>
            <div className="animate-fade-in" key={activeTab} style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', color: 'var(--foreground)' }}>
                  {SECTIONS.find(s => s.id === activeTab)?.label}
                </h2>

                <div style={{ padding: '1.5rem', border: '1px solid var(--border)', marginBottom: '3rem', display: 'flex', gap: '1rem', alignItems: 'flex-start', background: 'var(--bg-surface)' }}>
                    <Info size={18} color="var(--accent-editorial)" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.9rem', color: 'var(--foreground)', lineHeight: 1.6 }}>
                      <strong style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.1rem', marginRight: '0.5rem' }}>Editorial Note:</strong> 
                      {getEditorialNote(activeTab)}
                    </span>
                </div>

                {activeTab === 'jd' && (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {renderLabel("Target Job Description")}
                          <textarea 
                              value={jdText} onChange={(e) => setJdText(e.target.value)}
                              placeholder="Paste the target Job Description here..."
                              className="input-premium" style={{ height: '300px', padding: '1rem' }}
                          />
                        </div>
                        <button onClick={handleAnalyze} disabled={isAnalyzing} style={{ width: '100%', marginTop: '2rem', padding: '1rem', background: 'var(--foreground)', color: 'var(--background)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', transition: 'background 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent-editorial)'} onMouseLeave={(e) => e.currentTarget.style.background = 'var(--foreground)'}>
                            {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <><Search size={18} /> Analyze Alignment</>}
                        </button>

                        {analysis && (
                            <div className="animate-fade-in" style={{ marginTop: '4rem', padding: '3rem', border: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
                                <h3 style={{ fontSize: '1.5rem', color: 'var(--foreground)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-serif)' }}>
                                    Scan Complete
                                </h3>
                                
                                <div style={{ marginBottom: '3rem' }}>
                                    {renderLabel("Core Summary")}
                                    <p style={{ color: 'var(--muted-foreground)', lineHeight: 1.8, fontSize: '1rem' }}>{analysis.jdSummary}</p>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                                    <div>
                                        {renderLabel("Top Keywords")}
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                            {analysis.topKeywords?.map((kw: string, i: number) => (
                                                <span key={i} style={{ border: '1px solid var(--border)', padding: '0.4rem 1rem', fontSize: '0.8rem', color: 'var(--foreground)' }}>{kw}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        {renderLabel("Action Verbs")}
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                            {analysis.ActionKeywords?.map((kw: string, i: number) => (
                                                <span key={i} style={{ border: '1px solid var(--accent-editorial)', color: 'var(--accent-editorial)', padding: '0.4rem 1rem', fontSize: '0.8rem' }}>{kw}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'basic' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                            <div>
                                {renderLabel("Legal Name")}
                                <input value={resume.basic?.name || ''} onChange={(e) => updateSection('basic', {...resume.basic, name: e.target.value})} className="input-premium" />
                            </div>
                            <div>
                                {renderLabel("Contact Email")}
                                <input value={resume.basic?.email || ''} onChange={(e) => updateSection('basic', {...resume.basic, email: e.target.value})} className="input-premium" />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                            <div>
                                {renderLabel("Phone Number")}
                                <input value={resume.basic?.phone || ''} onChange={(e) => updateSection('basic', {...resume.basic, phone: e.target.value})} className="input-premium" />
                            </div>
                            <div>
                                {renderLabel("Location")}
                                <input value={resume.basic?.location || ''} onChange={(e) => updateSection('basic', {...resume.basic, location: e.target.value})} className="input-premium" />
                            </div>
                        </div>
                        <div>
                            {renderLabel("LinkedIn / Portfolio")}
                            <input value={resume.basic?.linkedin || ''} onChange={(e) => updateSection('basic', {...resume.basic, linkedin: e.target.value})} className="input-premium" />
                        </div>
                        <div>
                            {renderLabel("Professional Summary")}
                            <textarea value={resume.basic?.summary || ''} onChange={(e) => updateSection('basic', {...resume.basic, summary: e.target.value})} placeholder="Strategic Professional Brief..." className="input-premium" style={{ minHeight: '160px' }} />
                        </div>
                    </div>
                )}

                {activeTab === 'experience' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                        {resume.experience?.map((exp: any, i: number) => (
                            <div key={i} style={{ paddingBottom: '3rem', borderBottom: '1px solid var(--border)', position: 'relative' }}>
                                <button onClick={() => removeEntry('experience', i)} style={{ position: 'absolute', top: '0', right: '0', background: 'transparent', border: 'none', color: 'var(--muted-foreground)', cursor: 'pointer', padding: '0.5rem', transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--destructive)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted-foreground)'}>
                                  <Trash2 size={18} />
                                </button>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', marginBottom: '2.5rem' }}>
                                    <div>
                                      {renderLabel("Organization")}
                                      <input value={exp.company || ''} onChange={(e) => updateEntry('experience', i, 'company', e.target.value)} className="input-premium" />
                                    </div>
                                    <div>
                                      {renderLabel("Role Title")}
                                      <input value={exp.title || ''} onChange={(e) => updateEntry('experience', i, 'title', e.target.value)} className="input-premium" />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', marginBottom: '3rem' }}>
                                    <div>
                                      {renderLabel("Duration")}
                                      <input value={exp.date || ''} onChange={(e) => updateEntry('experience', i, 'date', e.target.value)} placeholder="e.g. Jan 2020 - Present" className="input-premium" />
                                    </div>
                                    <div>
                                      {renderLabel("Location")}
                                      <input value={exp.location || ''} onChange={(e) => updateEntry('experience', i, 'location', e.target.value)} className="input-premium" />
                                    </div>
                                </div>
                                
                                <div>
                                    {renderLabel("Impact Statements")}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        {exp.bullets?.map((b: string, j: number) => {
                                            const weak = getWeakVerbs(b);
                                            return (
                                            <div key={j} style={{ position: 'relative' }}>
                                                <textarea className="input-premium" value={b} onChange={(e) => {
                                                    const nb = [...exp.bullets]; nb[j] = e.target.value; updateEntry('experience', i, 'bullets', nb);
                                                }} placeholder="Achieved X by implementing Y, resulting in Z..." style={{ minHeight: '80px', paddingRight: '2.5rem' }} />
                                                <X onClick={() => {
                                                    const nb = [...exp.bullets]; nb.splice(j, 1); updateEntry('experience', i, 'bullets', nb);
                                                }} size={14} style={{ position: 'absolute', top: '1rem', right: '0', color: 'var(--muted-foreground)', cursor: 'pointer' }} />
                                                
                                                {weak.length > 0 && (
                                                    <div className="animate-fade-in" style={{ marginTop: '0.5rem', padding: '0.75rem', borderLeft: '1px solid var(--accent-editorial)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', background: 'var(--bg-surface)' }}>
                                                        <AlertCircle size={14} color="var(--accent-editorial)" style={{ marginTop: '2px' }} />
                                                        <span style={{ fontSize: '0.8rem', color: 'var(--foreground)', lineHeight: 1.4 }}>
                                                            Weak verb detected: <strong style={{ fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>"{weak[0]}"</strong>. Consider stronger action verbs.
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )})}
                                        <button onClick={() => updateEntry('experience', i, 'bullets', [...exp.bullets, ''])} style={{ alignSelf: 'flex-start', background: 'transparent', border: '1px solid var(--border)', color: 'var(--foreground)', padding: '0.75rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'border-color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--foreground)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}>
                                          <Plus size={14} /> Add Statement
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button onClick={() => addEntry('experience', { company: '', title: '', date: '', location: '', bullets: [''] })} style={{ width: '100%', padding: '1.25rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--foreground)', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem', transition: 'border-color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--foreground)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}>
                          <Plus size={16} /> Add Experience
                        </button>
                    </div>
                )}

                {activeTab === 'academics' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                        {resume.academics?.map((edu: any, i: number) => (
                            <div key={i} style={{ paddingBottom: '3rem', borderBottom: '1px solid var(--border)', position: 'relative' }}>
                                <button onClick={() => removeEntry('academics', i)} style={{ position: 'absolute', top: '0', right: '0', background: 'transparent', border: 'none', color: 'var(--muted-foreground)', cursor: 'pointer', padding: '0.5rem', transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--destructive)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted-foreground)'}>
                                  <Trash2 size={18} />
                                </button>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', marginBottom: '2.5rem' }}>
                                    <div>
                                      {renderLabel("Institution")}
                                      <input value={edu.school || edu.name || ''} onChange={(e) => updateEntry('academics', i, 'school', e.target.value)} className="input-premium" />
                                    </div>
                                    <div>
                                      {renderLabel("Degree / Major")}
                                      <input value={edu.degree || edu.detail || ''} onChange={(e) => updateEntry('academics', i, 'degree', e.target.value)} className="input-premium" />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                                    <div>
                                      {renderLabel("Timeframe")}
                                      <input value={edu.year || edu.date || ''} onChange={(e) => updateEntry('academics', i, 'year', e.target.value)} className="input-premium" />
                                    </div>
                                    <div>
                                      {renderLabel("GPA / Honors")}
                                      <input value={edu.gpa || ''} onChange={(e) => updateEntry('academics', i, 'gpa', e.target.value)} className="input-premium" />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button onClick={() => addEntry('academics', { school: '', degree: '', year: '', gpa: '' })} style={{ width: '100%', padding: '1.25rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--foreground)', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem', transition: 'border-color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--foreground)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}>
                          <Plus size={16} /> Add Education
                        </button>
                    </div>
                )}

                {activeTab === 'skills' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                        <div>
                            {renderLabel("Technical Skills (Comma Separated)")}
                            <textarea value={resume.skills?.map((s:any) => s.name).join(', ') || ''} onChange={(e) => updateSection('skills', e.target.value.split(',').map(s => ({name: s.trim()})))} className="input-premium" style={{ minHeight: '120px' }} />
                        </div>
                        <div>
                            {renderLabel("Soft Skills & Linguistic (Comma Separated)")}
                            <textarea value={resume.languages?.map((l:any) => l.name).join(', ') || ''} onChange={(e) => updateSection('languages', e.target.value.split(',').map(s => ({name: s.trim()})))} className="input-premium" style={{ minHeight: '120px' }} />
                        </div>
                    </div>
                )}

                {/* UNIVERSAL EDITOR FOR ALL OTHER 12+ MODULES */}
                {!['jd', 'basic', 'experience', 'academics', 'skills'].includes(activeTab) && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {resume[activeTab]?.map((item: any, i: number) => (
                            <div key={i} style={{ padding: '2rem 0', borderBottom: '1px solid var(--border)', display: 'flex', gap: '2rem', alignItems: 'flex-start', position: 'relative' }}>
                                <div style={{ flex: 2 }}>
                                  {renderLabel("Item Name")}
                                  <input value={item.name || ''} onChange={(e) => updateEntry(activeTab, i, 'name', e.target.value)} className="input-premium" />
                                </div>
                                <div style={{ flex: 1 }}>
                                  {renderLabel("Detail / Provider")}
                                  <input value={item.detail || ''} onChange={(e) => updateEntry(activeTab, i, 'detail', e.target.value)} className="input-premium" />
                                </div>
                                <div style={{ flex: 1 }}>
                                  {renderLabel("Date / Score")}
                                  <input value={item.date || ''} onChange={(e) => updateEntry(activeTab, i, 'date', e.target.value)} className="input-premium" />
                                </div>
                                <button onClick={() => removeEntry(activeTab, i)} style={{ marginTop: '2rem', background: 'transparent', border: 'none', color: 'var(--muted-foreground)', cursor: 'pointer', transition: 'color 0.3s' }} title="Remove" onMouseEnter={(e) => e.currentTarget.style.color = 'var(--destructive)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted-foreground)'}>
                                  <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                        <button onClick={() => addEntry(activeTab, { name: '', detail: '', date: '' })} style={{ width: '100%', padding: '1.25rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--foreground)', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem', transition: 'border-color 0.3s', marginTop: '2rem' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--foreground)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}>
                          <Plus size={16} /> Add Entry
                        </button>
                    </div>
                )}
            </div>
        </div>

        {/* REAL-TIME ATS PREVIEW — A4 Print Stage */}
        <div style={{
          flex: 1, overflowY: 'auto', overflowX: 'auto',
          background: 'var(--bg-surface)',
          padding: '4rem',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          borderLeft: '1px solid var(--border)',
          position: 'relative'
        }}>
            {/* A4 label */}
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase' }}>A4 Preview Document</span>
            </div>

            {/* A4 paper card */}
            <div
              ref={previewRef}
              style={{
                width: '794px',
                minHeight: '1123px',
                height: 'fit-content',
                background: '#ffffff',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                border: '1px solid var(--border)',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <ResumePreview data={resume} templateId={currentTemplate} />
            </div>

            {/* FIT TO ONE PAGE WARNING */}
            <div style={{
                position: 'fixed', bottom: '3rem', right: '3rem', zIndex: 100,
                background: isOverPageLimit ? 'var(--bg-editorial)' : 'var(--bg-editorial)',
                border: isOverPageLimit ? '1px solid var(--destructive)' : '1px solid var(--border)',
                padding: '1rem 1.5rem',
                display: 'flex', alignItems: 'center', gap: '1rem',
                transition: 'all 0.3s'
            }}>
                {isOverPageLimit ? <AlertCircle size={18} color="var(--destructive)" /> : <CheckCircle size={18} color="var(--foreground)" />}
                <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500, color: isOverPageLimit ? 'var(--destructive)' : 'var(--foreground)' }}>
                    {isOverPageLimit ? "Spilling to Page 2" : "Optimal 1-Page Layout"}
                </span>
            </div>
        </div>

      </div>

      {/* TEMPLATE ENGINE OVERLAY */}
      {showTemplateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(245,241,235,0.95)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '90%', maxWidth: '900px', padding: '5rem', background: 'var(--bg-editorial)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4rem', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '3rem', color: 'var(--foreground)', fontFamily: 'var(--font-serif)' }}>Architecture <span style={{ fontStyle: 'italic', color: 'var(--accent-editorial)' }}>Selection</span></h2>
                    <X onClick={() => setShowTemplateModal(false)} style={{ cursor: 'pointer', color: 'var(--foreground)' }} size={32} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                    <div onClick={() => { setCurrentTemplate(0); setShowTemplateModal(false); }} style={{ cursor: 'pointer', padding: '3rem', border: currentTemplate === 0 ? '1px solid var(--foreground)' : '1px solid var(--border)', background: currentTemplate === 0 ? 'var(--bg-surface)' : 'transparent', transition: 'all 0.3s' }}>
                        <h4 style={{ color: 'var(--foreground)', fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>Classic Pro</h4>
                        <p style={{ fontSize: '1rem', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>Clean, single-column design. Universally ATS safe and easily parsed.</p>
                    </div>
                    <div onClick={() => { setCurrentTemplate(1); setShowTemplateModal(false); }} style={{ cursor: 'pointer', padding: '3rem', border: currentTemplate === 1 ? '1px solid var(--foreground)' : '1px solid var(--border)', background: currentTemplate === 1 ? 'var(--bg-surface)' : 'transparent', transition: 'all 0.3s' }}>
                        <h4 style={{ color: 'var(--foreground)', fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>Modern Executive</h4>
                        <p style={{ fontSize: '1rem', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>Bold structured header. Highly ATS Friendly with an elegant layout.</p>
                    </div>
                    <div onClick={() => { setCurrentTemplate(2); setShowTemplateModal(false); }} style={{ cursor: 'pointer', padding: '3rem', border: currentTemplate === 2 ? '1px solid var(--foreground)' : '1px solid var(--border)', background: currentTemplate === 2 ? 'var(--bg-surface)' : 'transparent', transition: 'all 0.3s' }}>
                        <h4 style={{ color: 'var(--foreground)', fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>Two-Column Clean</h4>
                        <p style={{ fontSize: '1rem', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>Skills sidebar configuration. ATS Friendly with spatial separation.</p>
                    </div>
                </div>
            </div>
        </div>
      )}

    </main>
  );
}
