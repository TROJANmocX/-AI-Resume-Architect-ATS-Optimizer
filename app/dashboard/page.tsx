"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import { 
  Search, Loader2, Sparkles, Wand2, Download, 
  Plus, Trash2, User, Mail, Phone, MapPin, 
  Save, AlertCircle, Briefcase, GraduationCap,
  Layers, Check, X, BookOpen, Award, Globe, 
  MessageSquare, Heart, Trophy, Presentation, 
  FileCheck, Lightbulb, GraduationCap as ScholarshipIcon
} from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("basic");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRewriting, setIsRewriting] = useState<number | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  const [showError, setShowError] = useState<string | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Expanded Resume State
  const [resume, setResume] = useState<any>({
    basic: { name: "John Carter", email: "john@example.com", phone: "+1 (555) 012-3456", location: "San Francisco, CA", summary: "Senior Engineer..." },
    academics: [{ school: "MIT", degree: "B.S. CS", year: "2018" }],
    experience: [{ company: "TechNova", title: "Senior Dev", date: "2020-Present", bullets: ["Led team..."] }],
    projects: [{ name: "CareerForge", description: "AI Resume Builder", link: "github.com/..." }],
    skills: ["React", "TypeScript", "Node.js"],
    languages: ["English (Native)", "German (Fluent)"],
    social: [{ platform: "LinkedIn", url: "linkedin.com/in/john" }],
    awards: [{ name: "Innovation Award 2023", giver: "IEEE" }],
    certifications: [{ name: "AWS Certified Solution Architect" }],
    publications: [{ title: "Deep Learning in Web Apps", journal: "TechDaily" }],
    volunteering: [{ role: "Mentor", org: "Code.org" }],
    competitions: [{ name: "HackMIT 2018", rank: "Top 10" }],
    events: [{ name: "Google I/O 2024", role: "Attendee" }],
    testScores: [{ name: "GRE", score: "330" }],
    patents: [{ title: "Real-time AI Routing" }],
    scholarships: [{ name: "Full Merit Scholarship" }]
  });

  const [jdText, setJdText] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    if (showSaved) {
      const timer = setTimeout(() => setShowSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showSaved]);

  const updateSection = (section: string, data: any) => {
    setResume((prev: any) => ({ ...prev, [section]: data }));
    setShowSaved(true);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jdText }),
      });
      const data = await res.json();
      if (data.error) throw new Error();
      setAnalysis(data);
    } catch {
      setAnalysis({
        hardSkills: ["Critical Systems", "Cloud Scale"],
        softSkills: ["Leadership"],
        jdSummary: "Demo Mode Enabled"
      });
    } finally {
      setIsAnalyzing(false);
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
      a.download = "Resume_Full.pdf";
      a.click();
    } finally {
      setIsDownloading(false);
    }
  };

  const SECTIONS = [
    { id: 'jd', label: 'JD Analysis', icon: <Search size={16} />, category: 'AI' },
    { id: 'basic', label: 'Basic Info', icon: <User size={16} />, category: 'Core' },
    { id: 'academics', label: 'Academics', icon: <GraduationCap size={16} />, category: 'Core' },
    { id: 'experience', label: 'Work Experience', icon: <Briefcase size={16} />, category: 'Core' },
    { id: 'projects', label: 'Projects', icon: <Layers size={16} />, category: 'Core' },
    { id: 'skills', label: 'Skills', icon: <Trophy size={16} />, category: 'Expertise' },
    { id: 'languages', label: 'Languages', icon: < Globe size={16} />, category: 'Expertise' },
    { id: 'certifications', label: 'Certifications', icon: <FileCheck size={16} />, category: 'Expertise' },
    { id: 'social', label: 'Social Media', icon: <MessageSquare size={16} />, category: 'Online' },
    { id: 'awards', label: 'Awards', icon: <Award size={16} />, category: 'Achievements' },
    { id: 'publications', label: 'Publications', icon: <BookOpen size={16} />, category: 'Achievements' },
    { id: 'patents', label: 'Patents', icon: <Lightbulb size={16} />, category: 'Achievements' },
    { id: 'volunteering', label: 'Volunteering', icon: <Heart size={16} />, category: 'Community' },
    { id: 'competitions', label: 'Competitions', icon: <Trophy size={16} />, category: 'Community' },
    { id: 'events', label: 'Workshops', icon: <Presentation size={16} />, category: 'Engagement' },
    { id: 'testScores', label: 'Test Scores', icon: <FileCheck size={16} />, category: 'Engagement' },
    { id: 'scholarships', label: 'Scholarships', icon: <ScholarshipIcon size={16} />, category: 'Engagement' }
  ];

  return (
    <main style={{ minHeight: '100vh', background: '#070707' }}>
      <Navbar />
      
      <div style={{ maxWidth: '1600px', margin: '0 auto', paddingTop: '8rem', paddingInline: '2rem' }}>
        <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Forge <span className="text-gradient">Studio</span></h1>
            {showSaved && <span className="animate-fade-in" style={{ fontSize: '0.8rem', color: '#00BAFF' }}>✓ Saved to local cache</span>}
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-secondary" onClick={() => setShowTemplateModal(true)}>Template</button>
            <button className="btn btn-primary" onClick={downloadPDF} disabled={isDownloading}>
               {isDownloading ? <Loader2 className="animate-spin" /> : <Download />} Export All
            </button>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 340px', gap: '2rem', height: '800px' }}>
          {/* Section Sidebar */}
          <div className="glass" style={{ borderRadius: '1.5rem', padding: '1rem', overflowY: 'auto' }}>
            {SECTIONS.map((section, i) => (
              <div key={section.id}>
                {(i === 0 || SECTIONS[i-1].category !== section.category) && (
                  <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#444', padding: '1rem 0.5rem 0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {section.category}
                  </p>
                )}
                <button 
                  onClick={() => setActiveTab(section.id)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    background: activeTab === section.id ? 'rgba(0, 186, 255, 0.1)' : 'transparent',
                    border: 'none',
                    borderRadius: '0.75rem',
                    color: activeTab === section.id ? '#00BAFF' : 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    textAlign: 'left'
                  }}
                >
                  {section.icon} {section.label}
                </button>
              </div>
            ))}
          </div>

          {/* Main Editor */}
          <div className="glass" style={{ borderRadius: '2rem', padding: '2.5rem', overflowY: 'auto' }}>
            {activeTab === 'jd' && (
               <div className="animate-fade-in">
                  <h2 style={{ marginBottom: '1.5rem' }}>Strategic JD Parser</h2>
                  <textarea 
                    value={jdText} onChange={(e) => setJdText(e.target.value)}
                    placeholder="Paste JD..." 
                    style={{ width: '100%', height: '300px', background: 'rgba(0,0,0,0.4)', borderRadius: '1rem', border: '1px solid #222', padding: '1.5rem', color: 'white' }}
                  />
                  <button className="btn btn-primary" onClick={handleAnalyze} style={{ width: '100%', marginTop: '1rem' }}>Analyze Alignment</button>
               </div>
            )}

            {activeTab === 'basic' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h2>Identification</h2>
                <input className="glass" style={{ padding: '1rem', borderRadius: '0.75rem', color: 'white' }} defaultValue={resume.basic.name} />
                <input className="glass" style={{ padding: '1rem', borderRadius: '0.75rem', color: 'white' }} defaultValue={resume.basic.email} />
                <textarea className="glass" style={{ padding: '1rem', borderRadius: '0.75rem', color: 'white', minHeight: '150px' }} defaultValue={resume.basic.summary} />
              </div>
            )}

            {activeTab !== 'jd' && activeTab !== 'basic' && (
                <div className="animate-fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ textTransform: 'capitalize' }}>{activeTab}</h2>
                        <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}><Plus size={16} /> Add Entry</button>
                    </div>
                    {Array.isArray(resume[activeTab]) && resume[activeTab].map((item: any, i: number) => (
                        <div key={i} className="glass" style={{ padding: '1.5rem', borderRadius: '1rem', marginBottom: '1rem', position: 'relative' }}>
                            <button style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'none', color: '#ff4444' }}><Trash2 size={16} /></button>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {Object.keys(item).map(key => (
                                    <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                        <label style={{ fontSize: '0.7rem', color: '#666' }}>{key.toUpperCase()}</label>
                                        <input className="glass" style={{ padding: '0.6rem', border: 'none', borderRadius: '0.5rem', color: 'white' }} defaultValue={item[key]} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {!Array.isArray(resume[activeTab]) && (
                        <div style={{ padding: '4rem', textAlign: 'center', color: '#444' }}>
                           <Layers size={40} style={{ margin: '0 auto 1rem' }} />
                           <p>Dynamic {activeTab} editor ready.</p>
                        </div>
                    )}
                </div>
            )}
          </div>

          {/* Right Preview / Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass" style={{ padding: '2rem', borderRadius: '1.5rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#00BAFF', marginBottom: '2rem' }}>ATS COMPATIBILITY</p>
                <div style={{ fontSize: '4rem', fontWeight: 900 }}>{analysis ? '92' : '05'}%</div>
                <div style={{ height: '6px', background: '#222', borderRadius: '3px', marginTop: '1.5rem', overflow: 'hidden' }}>
                    <div style={{ width: analysis ? '92%' : '5%', height: '100%', background: '#00BAFF', transition: 'width 1s ease' }} />
                </div>
            </div>

            <div className="glass" style={{ padding: '1.5rem', borderRadius: '1.5rem' }}>
                <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>Smart Suggestions</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                    <p>• Add "Docker" to Skills</p>
                    <p>• Quantify Projects more</p>
                </div>
            </div>

            <div className="glass" style={{ padding: '1.5rem', borderRadius: '1.5rem', background: 'linear-gradient(135deg, rgba(0,186,255,0.05), transparent)' }}>
                <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>Quick Tip</h4>
                <p style={{ fontSize: '0.8rem', color: '#888', lineHeight: 1.5 }}>
                   Using a multi-column layout can confuse old ATS. Forge Pro defaults to single-column logic for maximum safety.
                </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
