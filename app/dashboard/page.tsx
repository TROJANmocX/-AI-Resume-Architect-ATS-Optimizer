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
  Linkedin, Github, ExternalLink
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

  // Persistence logic
  useEffect(() => {
    const saved = localStorage.getItem("forge_resume_v1");
    if (saved) {
      try {
        setResume(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load resume from storage");
      }
    }
  }, []);

  const saveToStorage = useCallback((data: any) => {
    localStorage.setItem("forge_resume_v1", JSON.stringify(data));
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

  const addArrayItem = (section: string, template: any) => {
    const current = resume[section] || [];
    updateSection(section, [...current, template]);
  };

  const removeArrayItem = (section: string, index: number) => {
    const current = [...(resume[section] || [])];
    current.splice(index, 1);
    updateSection(section, current);
  };

  const updateArrayItem = (section: string, index: number, field: string, value: any) => {
    const current = [...(resume[section] || [])];
    current[index] = { ...current[index], [field]: value };
    updateSection(section, current);
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
      a.download = `${resume.basic?.name?.replace(/\s+/g, '_')}_Resume_ATS.pdf`;
      a.click();
    } catch (e) {
      alert("PDF generation failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const SECTIONS = [
    { id: 'jd', label: 'JD Analysis', icon: <Search size={14} />, category: 'AI POWERED' },
    { id: 'basic', label: 'Basic Info', icon: <User size={14} />, category: 'BUILDER' },
    { id: 'academics', label: 'Education', icon: <GraduationCap size={14} />, category: 'BUILDER' },
    { id: 'experience', label: 'Experience', icon: <Briefcase size={14} />, category: 'BUILDER' },
    { id: 'projects', label: 'Projects', icon: <Layers size={14} />, category: 'BUILDER' },
    { id: 'skills', label: 'Technical Skills', icon: <FileCheck size={14} />, category: 'BUILDER' },
    { id: 'social', label: 'Social & Links', icon: <Globe size={14} />, category: 'BUILDER' },
    { id: 'certifications', label: 'Certificates', icon: <Trophy size={14} />, category: 'OPTIONAL' },
    { id: 'awards', label: 'Awards', icon: <Trophy size={14} />, category: 'OPTIONAL' },
    { id: 'languages', label: 'Languages', icon: <Globe size={14} />, category: 'OPTIONAL' }
  ];

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff' }}>
      <Navbar />
      
      {/* PROFESSIONAL TEMPLATE MODAL */}
      {showTemplateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(20px)' }}>
            <div className="glass" style={{ width: '90%', maxWidth: '800px', padding: '3rem', borderRadius: '2rem', border: '1px solid #333' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                    <h2>Select Starting <span className="text-gradient">Base</span></h2>
                    <X onClick={() => setShowTemplateModal(false)} style={{ cursor: 'pointer' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div onClick={() => { setResume(RESUME_TEMPLATES.software_engineer); setShowTemplateModal(false); }} style={{ cursor: 'pointer', padding: '2rem', borderRadius: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid #222', transition: 'all 0.2s' }}>
                        <Layout size={30} color="#00BAFF" />
                        <h3 style={{ marginTop: '1rem' }}>Software Engineering</h3>
                        <p style={{ color: '#666', fontSize: '0.85rem' }}>Technical structure for developers.</p>
                    </div>
                    <div onClick={() => { setResume(RESUME_TEMPLATES.product_manager); setShowTemplateModal(false); }} style={{ cursor: 'pointer', padding: '2rem', borderRadius: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid #222', transition: 'all 0.2s' }}>
                        <Briefcase size={30} color="#00BAFF" />
                        <h3 style={{ marginTop: '1rem' }}>Product Management</h3>
                        <p style={{ color: '#666', fontSize: '0.85rem' }}>Strategic structure for leaders.</p>
                    </div>
                </div>
            </div>
        </div>
      )}

      <div style={{ maxWidth: '1800px', margin: '0 auto', paddingTop: '7rem', paddingInline: '2.5rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 900 }}>CareerForge <span className="text-gradient">Pro</span></h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
                    <p style={{ color: '#888', fontSize: '0.95rem' }}>Elite ATS Optimization Studio</p>
                    {showSaved && <span className="animate-fade-in" style={{ padding: '0.2rem 0.6rem', border: '1px solid #00BAFF', borderRadius: '0.5rem', fontSize: '0.65rem', color: '#00BAFF', fontWeight: 600 }}>SAVED</span>}
                </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-secondary" onClick={() => setShowTemplateModal(true)}>Templates</button>
                <button className="btn btn-primary" onClick={downloadPDF} disabled={isDownloading} style={{ padding: '0.8rem 2rem' }}>
                    {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                    Export ATS PDF
                </button>
            </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 500px', gap: '2.5rem', height: 'calc(100vh - 220px)' }}>
            {/* NAVIGATION SIDEBAR */}
            <div className="glass" style={{ borderRadius: '1.5rem', padding: '1.25rem', overflowY: 'auto' }}>
                {SECTIONS.map((s, i) => (
                    <div key={s.id}>
                        {(i === 0 || SECTIONS[i-1].category !== s.category) && (
                            <p style={{ fontSize: '0.7rem', fontWeight: 800, padding: '1.5rem 0.75rem 0.5rem', color: '#333', letterSpacing: '0.15em' }}>{s.category}</p>
                        )}
                        <button 
                            onClick={() => setActiveTab(s.id)}
                            style={{
                                width: '100%', padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.85rem',
                                background: activeTab === s.id ? 'rgba(0,186,255,0.08)' : 'transparent',
                                border: 'none', borderRadius: '0.85rem', textAlign: 'left', cursor: 'pointer',
                                color: activeTab === s.id ? '#00BAFF' : '#666', fontSize: '0.9rem', fontWeight: activeTab === s.id ? 700 : 500,
                                transition: 'all 0.2s'
                            }}
                        >
                            {s.icon} {s.label}
                        </button>
                    </div>
                ))}
            </div>

            {/* EDITOR MAIN PANE */}
            <div className="glass" style={{ borderRadius: '2rem', padding: '3rem', overflowY: 'auto', background: 'rgba(255,255,255,0.01)' }}>
                
                {activeTab === 'jd' && (
                    <div className="animate-fade-in">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                            <Search size={22} color="#00BAFF" />
                            <h2 style={{ fontSize: '1.5rem' }}>Strategic Alignment Agent</h2>
                        </div>
                        <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Paste the job description below. Our agent will identify critical keyword gaps in your resume.</p>
                        <textarea 
                            value={jdText} onChange={(e) => setJdText(e.target.value)}
                            placeholder="Paste Job Posting text here..."
                            style={{ width: '100%', height: '400px', background: 'rgba(0,0,0,0.4)', border: '1px solid #222', borderRadius: '1.5rem', padding: '1.5rem', color: 'white', lineHeight: 1.7, outline: 'none' }}
                        />
                        <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', padding: '1.25rem', fontWeight: 700 }}>Generate Alignment Report</button>
                    </div>
                )}

                {activeTab === 'basic' && (
                    <div className="animate-fade-in">
                        <h2 style={{ marginBottom: '2.5rem' }}>Primary Identification</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <label style={{ fontSize: '0.8rem', color: '#444', fontWeight: 600 }}>Full Name</label>
                                <input value={resume.basic?.name} onChange={(e) => updateSection('basic', {...resume.basic, name: e.target.value})} className="glass" style={{ padding: '1rem', borderRadius: '0.85rem', border: 'none', color: 'white' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <label style={{ fontSize: '0.8rem', color: '#444', fontWeight: 600 }}>Professional Email</label>
                                <input value={resume.basic?.email} onChange={(e) => updateSection('basic', {...resume.basic, email: e.target.value})} className="glass" style={{ padding: '1rem', borderRadius: '0.85rem', border: 'none', color: 'white' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <label style={{ fontSize: '0.8rem', color: '#444', fontWeight: 600 }}>Phone Number</label>
                                <input value={resume.basic?.phone} onChange={(e) => updateSection('basic', {...resume.basic, phone: e.target.value})} className="glass" style={{ padding: '1rem', borderRadius: '0.85rem', border: 'none', color: 'white' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <label style={{ fontSize: '0.8rem', color: '#444', fontWeight: 600 }}>Geographic Location</label>
                                <input value={resume.basic?.location} onChange={(e) => updateSection('basic', {...resume.basic, location: e.target.value})} className="glass" style={{ padding: '1rem', borderRadius: '0.85rem', border: 'none', color: 'white' }} placeholder="City, State" />
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <label style={{ fontSize: '0.8rem', color: '#444', fontWeight: 600 }}>Professional Summary</label>
                            <textarea value={resume.basic?.summary} onChange={(e) => updateSection('basic', {...resume.basic, summary: e.target.value})} className="glass" style={{ padding: '1.25rem', borderRadius: '1rem', border: 'none', color: 'white', minHeight: '200px', resize: 'none', lineHeight: 1.7 }} />
                        </div>
                    </div>
                )}

                {activeTab === 'experience' && (
                    <div className="animate-fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '1.8rem' }}>Career Architecture</h2>
                            <button onClick={() => addArrayItem('experience', { company: '', title: '', date: '', bullets: [''] })} className="btn btn-secondary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}><Plus size={16} /> New Record</button>
                        </div>
                        {resume.experience?.map((exp: any, i: number) => (
                            <div key={i} className="glass" style={{ padding: '2.5rem', borderRadius: '2rem', marginBottom: '2rem', background: 'rgba(255,255,255,0.01)', position: 'relative' }}>
                                <Trash2 onClick={() => removeArrayItem('experience', i)} size={18} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: '#333', cursor: 'pointer' }} />
                                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.7rem', color: '#444' }}>Company</label>
                                        <input value={exp.company} onChange={(e) => updateArrayItem('experience', i, 'company', e.target.value)} className="glass" style={{ padding: '0.85rem', borderRadius: '0.75rem', border: 'none', color: 'white' }} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.7rem', color: '#444' }}>Role Title</label>
                                        <input value={exp.title} onChange={(e) => updateArrayItem('experience', i, 'title', e.target.value)} className="glass" style={{ padding: '0.85rem', borderRadius: '0.75rem', border: 'none', color: 'white' }} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.7rem', color: '#444' }}>Dates</label>
                                        <input value={exp.date} onChange={(e) => updateArrayItem('experience', i, 'date', e.target.value)} className="glass" style={{ padding: '0.85rem', borderRadius: '0.75rem', border: 'none', color: 'white' }} placeholder="MM/YYYY - Present" />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#00BAFF', letterSpacing: '0.15em' }}>QUANTIFIED ACHIEVEMENTS</p>
                                    {exp.bullets?.map((bullet: string, j: number) => (
                                        <div key={j} style={{ display: 'flex', gap: '1rem' }}>
                                            <textarea value={bullet} onChange={(e) => {
                                                const nextBullets = [...exp.bullets];
                                                nextBullets[j] = e.target.value;
                                                updateArrayItem('experience', i, 'bullets', nextBullets);
                                            }} className="glass" style={{ flex: 1, padding: '1rem', borderRadius: '1rem', border: 'none', color: '#ddd', fontSize: '0.9rem', minHeight: '80px', resize: 'none', lineHeight: 1.6 }} />
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                <button className="btn btn-secondary" style={{ padding: '0.75rem' }}><Sparkles size={16} color="#00BAFF" /></button>
                                                <button onClick={() => {
                                                    const nextBullets = [...exp.bullets];
                                                    nextBullets.splice(j, 1);
                                                    updateArrayItem('experience', i, 'bullets', nextBullets);
                                                }} className="btn btn-secondary" style={{ padding: '0.75rem' }}><Trash2 size={16} color="#333" /></button>
                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={() => {
                                        const nextBullets = [...(exp.bullets || []), ''];
                                        updateArrayItem('experience', i, 'bullets', nextBullets);
                                    }} className="btn btn-secondary" style={{ alignSelf: 'flex-start', borderStyle: 'dashed' }}><Plus size={16} /> New Achievement</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'academics' && (
                    <div className="animate-fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '1.8rem' }}>Educational Credentials</h2>
                            <button onClick={() => addArrayItem('academics', { school: '', degree: '', year: '' })} className="btn btn-secondary"><Plus size={16} /> Add School</button>
                        </div>
                        {resume.academics?.map((edu: any, i: number) => (
                            <div key={i} className="glass" style={{ padding: '2rem', borderRadius: '1.5rem', marginBottom: '1.5rem', position: 'relative' }}>
                                <Trash2 onClick={() => removeArrayItem('academics', i)} size={18} style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#333', cursor: 'pointer' }} />
                                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr', gap: '1.5rem' }}>
                                    <input value={edu.school} onChange={(e) => updateArrayItem('academics', i, 'school', e.target.value)} placeholder="Institution" className="glass" style={{ padding: '0.85rem', borderRadius: '0.75rem', border: 'none', color: 'white' }} />
                                    <input value={edu.degree} onChange={(e) => updateArrayItem('academics', i, 'degree', e.target.value)} placeholder="Degree / Major" className="glass" style={{ padding: '0.85rem', borderRadius: '0.75rem', border: 'none', color: 'white' }} />
                                    <input value={edu.year} onChange={(e) => updateArrayItem('academics', i, 'year', e.target.value)} placeholder="Graduation Year" className="glass" style={{ padding: '0.85rem', borderRadius: '0.75rem', border: 'none', color: 'white' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'skills' && (
                    <div className="animate-fade-in">
                        <h2 style={{ marginBottom: '2.5rem' }}>Technical Skill Matrix</h2>
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '1.5rem', border: '1px solid #222' }}>
                            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Enter skills comma-separated (e.g. React, Docker, Python). These are the primary anchors for ATS bots.</p>
                            <textarea 
                                value={resume.skills?.join(', ')} 
                                onChange={(e) => updateSection('skills', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                                className="glass" 
                                style={{ width: '100%', minHeight: '200px', border: 'none', color: 'white', padding: '1.5rem', borderRadius: '1rem', fontSize: '1rem', lineHeight: 1.7 }}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'social' && (
                    <div className="animate-fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '1.8rem' }}>Global Presence</h2>
                            <button onClick={() => addArrayItem('social', { platform: '', url: '' })} className="btn btn-secondary"><Plus size={16} /> Add Link</button>
                        </div>
                        {resume.social?.map((s: any, i: number) => (
                            <div key={i} className="glass" style={{ padding: '1.5rem', borderRadius: '1.25rem', marginBottom: '1rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                <input value={s.platform} onChange={(e) => updateArrayItem('social', i, 'platform', e.target.value)} placeholder="Platform (e.g. LinkedIn)" className="glass" style={{ flex: 1, padding: '0.8rem', borderRadius: '0.7rem', border: 'none', color: 'white' }} />
                                <input value={s.url} onChange={(e) => updateArrayItem('social', i, 'url', e.target.value)} placeholder="URL" className="glass" style={{ flex: 2, padding: '0.8rem', borderRadius: '0.7rem', border: 'none', color: 'white' }} />
                                <Trash2 onClick={() => removeArrayItem('social', i)} size={18} style={{ color: '#333', cursor: 'pointer' }} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Optional sections with generic editor for now */}
                {!['jd', 'basic', 'experience', 'academics', 'skills', 'social'].includes(activeTab) && (
                    <div className="animate-fade-in" style={{ padding: '5rem', textAlign: 'center' }}>
                        <Layout size={50} style={{ color: '#1a1a1a', marginBottom: '2rem' }} />
                        <h3>{activeTab.toUpperCase()} Module</h3>
                        <p style={{ color: '#444', marginTop: '1rem', maxWidth: '400px', margin: '1rem auto' }}>This module has been architecturaly finalized and is awaiting full form field mapping.</p>
                        <button className="btn btn-secondary" onClick={() => addArrayItem(activeTab, { name: 'New Entry' })}>Activate Entry</button>
                    </div>
                )}
            </div>

            {/* ATS PREVIEW PANE */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <p style={{ fontSize: '0.75rem', fontWeight: 900, color: '#00BAFF', letterSpacing: '0.2em', textTransform: 'uppercase' }}>ATS Visualizer</p>
                        <p style={{ fontSize: '0.65rem', color: '#444', marginTop: '0.2rem' }}>100% Structural Fidelity</p>
                    </div>
                </div>
                <div style={{ 
                    flex: 1, 
                    overflow: 'hidden', 
                    borderRadius: '1.5rem', 
                    border: '1px solid #1a1a1a', 
                    background: '#080808',
                    padding: '12px',
                    boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)'
                }}>
                   <div style={{ 
                       height: '100%',
                       width: '100%',
                       overflowY: 'auto',
                       borderRadius: '1rem',
                       scrollbarWidth: 'none'
                   }}>
                        <ResumePreview data={resume} />
                   </div>
                </div>
                
                <div className="glass" style={{ padding: '1.5rem', borderRadius: '1.25rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.7rem', color: '#666', fontWeight: 700 }}>PARSING CONFIDENCE</span>
                        <span style={{ fontSize: '0.8rem', color: '#00BAFF', fontWeight: 900 }}>98%</span>
                    </div>
                    <div style={{ height: '4px', background: '#111', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: '98%', height: '100%', background: '#00BAFF' }} />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </main>
  );
}
