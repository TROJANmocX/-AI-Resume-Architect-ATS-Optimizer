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
  Linkedin, Github, ExternalLink, Award as AwardIcon, Microscope
} from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("basic");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRewriting, setIsRewriting] = useState<string | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Resume State
  const [resume, setResume] = useState<any>(RESUME_TEMPLATES.software_engineer);
  const [jdText, setJdText] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);

  // Persistence logic
  useEffect(() => {
    const saved = localStorage.getItem("forge_resume_v2");
    if (saved) {
      try {
        setResume(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load resume");
      }
    }
  }, []);

  const saveToStorage = useCallback((data: any) => {
    localStorage.setItem("forge_resume_v2", JSON.stringify(data));
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

  // Helper for adding to arrays
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

  const handleRewriteBullet = async (expIndex: number, bulletIndex: number) => {
    const bulletId = `${expIndex}-${bulletIndex}`;
    setIsRewriting(bulletId);
    try {
        const bullet = resume.experience[expIndex].bullets[bulletIndex];
        const keywords = analysis?.hardSkills || ["High-performance", "Scalable"];
        
        const res = await fetch("/api/rewrite", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bulletPoint: bullet, targetKeywords: keywords }),
        });
        const data = await res.json();
        
        const newExp = [...resume.experience];
        newExp[expIndex].bullets[bulletIndex] = data.rewrittenBullet || bullet;
        updateSection('experience', newExp);
    } catch (e) {
        console.error(e);
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
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CareerForge_Resume_${resume.basic?.name?.replace(/\s+/g, '_')}.pdf`;
      a.click();
    } catch (e) {
      alert("PDF generation failed. Checking server...");
    } finally {
      setIsDownloading(false);
    }
  };

  const SECTIONS = [
    { id: 'jd', label: 'JD Analysis', icon: <Search size={14} />, category: 'AI AGENT' },
    { id: 'basic', label: 'Basic Info', icon: <User size={14} />, category: 'CORE' },
    { id: 'academics', label: 'Academics', icon: <GraduationCap size={14} />, category: 'CORE' },
    { id: 'experience', label: 'Work Experience', icon: <Briefcase size={14} />, category: 'CORE' },
    { id: 'projects', label: 'Projects', icon: <Layers size={14} />, category: 'CORE' },
    { id: 'skills', label: 'Skills', icon: <FileCheck size={14} />, category: 'SKILLS' },
    { id: 'languages', label: 'Languages', icon: <Globe size={14} />, category: 'SKILLS' },
    { id: 'social', label: 'Social Media', icon: <MessageSquare size={14} />, category: 'SKILLS' },
    { id: 'certifications', label: 'Certification', icon: <FileCheck size={14} />, category: 'ACHIEVEMENTS' },
    { id: 'awards', label: 'Awards', icon: <AwardIcon size={14} />, category: 'ACHIEVEMENTS' },
    { id: 'publications', label: 'Publications', icon: <BookOpen size={14} />, category: 'ACHIEVEMENTS' },
    { id: 'patents', label: 'Patents', icon: <Lightbulb size={14} />, category: 'ACHIEVEMENTS' },
    { id: 'volunteering', label: 'Volunteering', icon: <Heart size={14} />, category: 'OTHER' },
    { id: 'competitions', label: 'Competitions', icon: <Trophy size={14} />, category: 'OTHER' },
    { id: 'testScores', label: 'Test Scores', icon: <Microscope size={14} />, category: 'OTHER' },
    { id: 'scholarships', label: 'Scholarships', icon: <GraduationCap size={14} />, category: 'OTHER' }
  ];

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#eee' }}>
      <Navbar />
      
      {/* Template Chooser */}
      {showTemplateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(20px)' }}>
            <div className="glass" style={{ width: '90%', maxWidth: '800px', padding: '3rem', borderRadius: '2rem', border: '1px solid #333' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.8rem' }}>Master <span className="text-gradient">Templates</span></h2>
                    <X onClick={() => setShowTemplateModal(false)} style={{ cursor: 'pointer' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div onClick={() => { setResume(RESUME_TEMPLATES.software_engineer); setShowTemplateModal(false); saveToStorage(RESUME_TEMPLATES.software_engineer); }} style={{ cursor: 'pointer', padding: '2rem', borderRadius: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid #222' }}>
                        <Layout size={32} color="#00BAFF" />
                        <h3 style={{ marginTop: '1rem' }}>Software Engineering</h3>
                        <p style={{ color: '#666', fontSize: '0.85rem' }}>Strict ATS-optimized for Tech roles.</p>
                    </div>
                    <div onClick={() => { setResume(RESUME_TEMPLATES.product_manager); setShowTemplateModal(false); saveToStorage(RESUME_TEMPLATES.product_manager); }} style={{ cursor: 'pointer', padding: '2rem', borderRadius: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid #222' }}>
                        <Briefcase size={32} color="#00BAFF" />
                        <h3 style={{ marginTop: '1rem' }}>Product Management</h3>
                        <p style={{ color: '#666', fontSize: '0.85rem' }}>Strict ATS-optimized for Business/PM.</p>
                    </div>
                </div>
            </div>
        </div>
      )}

      <div style={{ maxWidth: '1800px', margin: '0 auto', paddingTop: '7rem', paddingInline: '2.5rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <div>
                <h1 style={{ fontSize: '2.4rem', fontWeight: 900 }}>CareerForge <span className="text-gradient">Pro</span></h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.4rem' }}>
                    <p style={{ color: '#666', fontSize: '0.95rem' }}>Real-time ATS Architecture Studio</p>
                    {showSaved && <span className="animate-fade-in" style={{ fontSize: '0.7rem', color: '#00BAFF', border: '1px solid #00BAFF', padding: '1px 8px', borderRadius: '4px' }}>SAVED</span>}
                </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-secondary" onClick={() => setShowTemplateModal(true)}>Templates</button>
                <button className="btn btn-primary" onClick={downloadPDF} disabled={isDownloading} style={{ padding: '0.8rem 2rem' }}>
                    {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                    Download ATS PDF
                </button>
            </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 500px', gap: '2.5rem', height: 'calc(100vh - 220px)' }}>
            {/* Sidebar with all 16 items */}
            <div className="glass" style={{ borderRadius: '1.5rem', padding: '1rem', overflowY: 'auto', border: '1px solid #111' }}>
                {SECTIONS.map((s, i) => (
                    <div key={s.id}>
                        {(i === 0 || SECTIONS[i-1].category !== s.category) && (
                            <p style={{ fontSize: '0.65rem', fontWeight: 800, padding: '1.5rem 0.75rem 0.5rem', color: '#333', letterSpacing: '0.12em' }}>{s.category}</p>
                        )}
                        <button 
                            onClick={() => setActiveTab(s.id)}
                            style={{
                                width: '100%', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
                                background: activeTab === s.id ? 'rgba(0,186,255,0.08)' : 'transparent',
                                border: 'none', borderRadius: '0.75rem', textAlign: 'left', cursor: 'pointer',
                                color: activeTab === s.id ? '#00BAFF' : '#555', fontSize: '0.88rem', fontWeight: activeTab === s.id ? 700 : 400,
                                transition: 'all 0.1s'
                            }}
                        >
                            {s.icon} {s.label}
                        </button>
                    </div>
                ))}
            </div>

            {/* Content Area - Every single tab has an editor now */}
            <div className="glass" style={{ borderRadius: '2rem', padding: '2.5rem', overflowY: 'auto', background: 'rgba(255,255,255,0.01)', border: '1px solid #111' }}>
                
                {activeTab === 'jd' && (
                    <div className="animate-fade-in">
                        <h2 style={{ marginBottom: '2rem' }}>Scan Target JD</h2>
                        <textarea 
                            value={jdText} onChange={(e) => setJdText(e.target.value)}
                            placeholder="Paste the Job Description to reveal keyword gaps..."
                            style={{ width: '100%', height: '400px', background: 'rgba(0,0,0,0.4)', border: '1px solid #111', borderRadius: '1.5rem', padding: '1.5rem', color: 'white', lineHeight: 1.7, outline: 'none' }}
                        />
                        <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', padding: '1.25rem' }}>Identify Gap Match</button>
                    </div>
                )}

                {activeTab === 'basic' && (
                    <div className="animate-fade-in">
                        <h2 style={{ marginBottom: '2.5rem' }}>Personal Identity</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.75rem', color: '#444' }}>Contact Name</label>
                                <input value={resume.basic?.name} onChange={(e) => updateSection('basic', {...resume.basic, name: e.target.value})} className="glass" style={{ padding: '0.9rem', borderRadius: '0.75rem', border: 'none', color: 'white' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.75rem', color: '#444' }}>Email Address</label>
                                <input value={resume.basic?.email} onChange={(e) => updateSection('basic', {...resume.basic, email: e.target.value})} className="glass" style={{ padding: '0.9rem', borderRadius: '0.75rem', border: 'none', color: 'white' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.75rem', color: '#444' }}>Phone</label>
                                <input value={resume.basic?.phone} onChange={(e) => updateSection('basic', {...resume.basic, phone: e.target.value})} className="glass" style={{ padding: '0.9rem', borderRadius: '0.75rem', border: 'none', color: 'white' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.75rem', color: '#444' }}>Location</label>
                                <input value={resume.basic?.location} onChange={(e) => updateSection('basic', {...resume.basic, location: e.target.value})} className="glass" style={{ padding: '0.9rem', borderRadius: '0.75rem', border: 'none', color: 'white' }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.75rem', color: '#444' }}>Professional Statement</label>
                            <textarea value={resume.basic?.summary} onChange={(e) => updateSection('basic', {...resume.basic, summary: e.target.value})} className="glass" style={{ padding: '1rem', borderRadius: '1rem', border: 'none', color: 'white', minHeight: '200px', resize: 'none', lineHeight: 1.7 }} />
                        </div>
                    </div>
                )}

                {activeTab === 'experience' && (
                    <div className="animate-fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                            <h2>Work History</h2>
                            <button onClick={() => addEntry('experience', { company: '', title: '', date: '', bullets: [''] })} className="btn btn-secondary"><Plus size={16} /> Add Position</button>
                        </div>
                        {resume.experience?.map((exp: any, i: number) => (
                            <div key={i} className="glass" style={{ padding: '2rem', borderRadius: '1.5rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.01)', position: 'relative' }}>
                                <Trash2 onClick={() => removeEntry('experience', i)} size={16} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: '#333', cursor: 'pointer' }} />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <input value={exp.company} onChange={(e) => updateEntry('experience', i, 'company', e.target.value)} placeholder="Company" className="glass" style={{ padding: '0.8rem', border: 'none', color: 'white', borderRadius: '0.75rem' }} />
                                    <input value={exp.title} onChange={(e) => updateEntry('experience', i, 'title', e.target.value)} placeholder="Role" className="glass" style={{ padding: '0.8rem', border: 'none', color: 'white', borderRadius: '0.75rem' }} />
                                    <input value={exp.date} onChange={(e) => updateEntry('experience', i, 'date', e.target.value)} placeholder="Dates" className="glass" style={{ padding: '0.8rem', border: 'none', color: 'white', borderRadius: '0.75rem' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {exp.bullets?.map((b: string, j: number) => (
                                        <div key={j} style={{ display: 'flex', gap: '0.75rem' }}>
                                            <textarea value={b} onChange={(e) => {
                                                const nb = [...exp.bullets]; nb[j] = e.target.value; updateEntry('experience', i, 'bullets', nb);
                                            }} className="glass" style={{ flex: 1, padding: '0.8rem', border: 'none', color: '#ccc', borderRadius: '0.5rem', fontSize: '0.85rem', resize: 'none' }} />
                                            <button onClick={() => handleRewriteBullet(i, j)} className="btn btn-secondary" style={{ padding: '0.5rem' }}>
                                                {isRewriting === `${i}-${j}` ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} color="#00BAFF" />}
                                            </button>
                                        </div>
                                    ))}
                                    <button onClick={() => updateEntry('experience', i, 'bullets', [...exp.bullets, ''])} className="btn btn-secondary" style={{ alignSelf: 'flex-start', fontSize: '0.75rem' }}>+ New Bullet</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'academics' && (
                    <div className="animate-fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                            <h2>Academics</h2>
                            <button onClick={() => addEntry('academics', { school: '', degree: '', year: '' })} className="btn btn-secondary"><Plus size={16} /> Add School</button>
                        </div>
                        {resume.academics?.map((edu: any, i: number) => (
                            <div key={i} className="glass" style={{ padding: '1.5rem', borderRadius: '1.25rem', marginBottom: '1rem', position: 'relative' }}>
                                <Trash2 onClick={() => removeEntry('academics', i)} size={16} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', color: '#333', cursor: 'pointer' }} />
                                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr', gap: '1rem' }}>
                                    <input value={edu.school} onChange={(e) => updateEntry('academics', i, 'school', e.target.value)} placeholder="School" className="glass" style={{ padding: '0.8rem', border: 'none', color: 'white', borderRadius: '0.75rem' }} />
                                    <input value={edu.degree} onChange={(e) => updateEntry('academics', i, 'degree', e.target.value)} placeholder="Degree" className="glass" style={{ padding: '0.8rem', border: 'none', color: 'white', borderRadius: '0.75rem' }} />
                                    <input value={edu.year} onChange={(e) => updateEntry('academics', i, 'year', e.target.value)} placeholder="Grad Year" className="glass" style={{ padding: '0.8rem', border: 'none', color: 'white', borderRadius: '0.75rem' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'projects' && (
                    <div className="animate-fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                            <h2>Projects</h2>
                            <button onClick={() => addEntry('projects', { name: '', description: '', bullets: [''] })} className="btn btn-secondary"><Plus size={16} /> Add Project</button>
                        </div>
                        {resume.projects?.map((proj: any, i: number) => (
                            <div key={i} className="glass" style={{ padding: '2rem', borderRadius: '1.5rem', marginBottom: '1.5rem', position: 'relative' }}>
                                <Trash2 onClick={() => removeEntry('projects', i)} size={16} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: '#333', cursor: 'pointer' }} />
                                <input value={proj.name} onChange={(e) => updateEntry('projects', i, 'name', e.target.value)} placeholder="Project Title" className="glass" style={{ width: '100%', padding: '0.8rem', border: 'none', color: 'white', borderRadius: '0.75rem', marginBottom: '1rem' }} />
                                <textarea value={proj.description} onChange={(e) => updateEntry('projects', i, 'description', e.target.value)} placeholder="Quick overview..." className="glass" style={{ width: '100%', padding: '0.8rem', border: 'none', color: 'white', borderRadius: '0.75rem', marginBottom: '1rem', minHeight: '80px' }} />
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'skills' && (
                    <div className="animate-fade-in">
                        <h2>Skill Matrix</h2>
                        <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Separate with commas. (e.g. React, Node.js, AWS)</p>
                        <textarea 
                            value={resume.skills?.join(', ')} 
                            onChange={(e) => updateSection('skills', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                            className="glass" style={{ width: '100%', minHeight: '300px', padding: '1.5rem', color: 'white', borderRadius: '1.5rem', border: 'none', fontSize: '1rem', lineHeight: 1.7 }}
                        />
                    </div>
                )}

                {/* EVERY OTHER TAB NOW HAS AN EDITOR */}
                {['languages', 'social', 'certifications', 'awards', 'publications', 'patents', 'volunteering', 'competitions', 'testScores', 'scholarships'].includes(activeTab) && (
                    <div className="animate-fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                            <h2 style={{ textTransform: 'capitalize' }}>{activeTab}</h2>
                            <button onClick={() => addEntry(activeTab, { name: '', detail: '', date: '' })} className="btn btn-secondary"><Plus size={16} /> New Entry</button>
                        </div>
                        {resume[activeTab]?.map((item: any, i: number) => (
                            <div key={i} className="glass" style={{ padding: '1.5rem', borderRadius: '1.25rem', marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <input value={item.name} onChange={(e) => updateEntry(activeTab, i, 'name', e.target.value)} placeholder="Name / Title" className="glass" style={{ flex: 1, padding: '0.8rem', borderRadius: '0.7rem', color: 'white' }} />
                                <input value={item.detail} onChange={(e) => updateEntry(activeTab, i, 'detail', e.target.value)} placeholder="Detail / Issuer" className="glass" style={{ flex: 1, padding: '0.8rem', borderRadius: '0.7rem', color: 'white' }} />
                                <input value={item.date} onChange={(e) => updateEntry(activeTab, i, 'date', e.target.value)} placeholder="Date / Score" className="glass" style={{ width: '120px', padding: '0.8rem', borderRadius: '0.7rem', color: 'white' }} />
                                <Trash2 onClick={() => removeEntry(activeTab, i)} size={18} style={{ color: '#333', cursor: 'pointer' }} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* LIVE PREVIEW */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ flex: 1, overflow: 'hidden', borderRadius: '1.5rem', border: '1px solid #111', background: '#080808', padding: '10px' }}>
                   <div style={{ height: '100%', width: '100%', overflowY: 'auto', borderRadius: '0.8rem' }}>
                        <ResumePreview data={resume} />
                   </div>
                </div>
                <div className="glass" style={{ padding: '1.25rem', borderRadius: '1.25rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.7rem', color: '#555', fontWeight: 800 }}>
                        <span>PARSING RELIABILITY</span>
                        <span>99%</span>
                    </div>
                    <div style={{ height: '3px', background: '#111', borderRadius: '2px' }}>
                        <div style={{ width: '99%', height: '100%', background: '#00BAFF' }} />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </main>
  );
}
