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
  Info, Upload, Share2
} from "lucide-react";
import Link from "next/link";

function normalizeResumeData(data: any): any {
  if (!data) return RESUME_TEMPLATES.indian_professional;

  // Helper to ensure an array of objects with {name, detail, date}
  const ensureArrayOfObjects = (arr: any) => {
    if (!Array.isArray(arr)) return [];
    return arr.map((item: any) => {
      if (typeof item === 'string') {
        return { name: item, detail: '', date: '' };
      }
      if (typeof item === 'object' && item !== null) {
        return {
          name: item.name || item.title || '',
          detail: item.detail || item.provider || item.giver || item.description || '',
          date: item.date || item.year || ''
        };
      }
      return { name: '', detail: '', date: '' };
    });
  };

  // Helper for experience
  const ensureExperience = (arr: any) => {
    if (!Array.isArray(arr)) return [];
    return arr.map((item: any) => {
      if (typeof item !== 'object' || item === null) return null;
      let bullets: string[] = [];
      if (Array.isArray(item.bullets)) {
        bullets = item.bullets.map((b: any) => typeof b === 'string' ? b : String(b || ''));
      } else if (typeof item.bullets === 'string') {
        bullets = [item.bullets];
      } else if (typeof item.description === 'string') {
        bullets = [item.description];
      }
      return {
        company: item.company || '',
        title: item.title || '',
        date: item.date || '',
        location: item.location || '',
        bullets: bullets.length > 0 ? bullets : ['']
      };
    }).filter(Boolean);
  };

  // Helper for academics
  const ensureAcademics = (arr: any) => {
    if (!Array.isArray(arr)) return [];
    return arr.map((item: any) => {
      if (typeof item !== 'object' || item === null) return null;
      return {
        school: item.school || item.name || '',
        degree: item.degree || item.detail || '',
        year: item.year || item.date || '',
        gpa: item.gpa || ''
      };
    }).filter(Boolean);
  };

  // Helper for skills and languages (arrays of { name: string })
  const ensureSkillsOrLanguages = (arr: any) => {
    if (!Array.isArray(arr)) return [];
    return arr.map((item: any) => {
      if (typeof item === 'string') {
        return { name: item };
      }
      if (typeof item === 'object' && item !== null) {
        return { name: item.name || '' };
      }
      return { name: '' };
    }).filter(s => s && s.name !== '');
  };

  const basic = {
    name: data.basic?.name || '',
    email: data.basic?.email || '',
    phone: data.basic?.phone || '',
    location: data.basic?.location || '',
    summary: data.basic?.summary || ''
  };

  return {
    basic,
    academics: ensureAcademics(data.academics || data.education),
    experience: ensureExperience(data.experience || data.workHistory),
    projects: ensureArrayOfObjects(data.projects),
    skills: ensureSkillsOrLanguages(data.skills),
    languages: ensureSkillsOrLanguages(data.languages),
    certifications: ensureArrayOfObjects(data.certifications),
    awards: ensureArrayOfObjects(data.awards),
    publications: ensureArrayOfObjects(data.publications),
    patents: ensureArrayOfObjects(data.patents),
    volunteering: ensureArrayOfObjects(data.volunteering),
    competitions: ensureArrayOfObjects(data.competitions),
    testScores: ensureArrayOfObjects(data.testScores),
    scholarships: ensureArrayOfObjects(data.scholarships),
    social: ensureArrayOfObjects(data.social || data.links)
  };
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("basic");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(0);
  const [userName, setUserName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [zoomRatio, setZoomRatio] = useState(0.8);

  // Importer States
  const [showImportModal, setShowImportModal] = useState(false);
  const [importTab, setImportTab] = useState<"upload" | "text" | "linkedin">("upload");
  const [importText, setImportText] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState("");

  // Sharing States
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareName, setShareName] = useState("");
  const [shareDescription, setShareDescription] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const [shareError, setShareError] = useState("");
  const [shareSuccess, setShareSuccess] = useState(false);

  // Template Tab States
  const [templateModalTab, setTemplateModalTab] = useState<"styles" | "community">("styles");
  const [publicTemplates, setPublicTemplates] = useState<any[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);

  // Pagination Warning State
  const previewRef = useRef<HTMLDivElement>(null);
  const [isOverPageLimit, setIsOverPageLimit] = useState(false);

  // Resume State
  const [resume, setResume] = useState<any>(normalizeResumeData(RESUME_TEMPLATES.indian_professional));
  const [jdText, setJdText] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);

  // Version controls
  const [resumeVersions, setResumeVersions] = useState<any[]>([
    { id: "master", label: "Master Resume", resumeData: normalizeResumeData(RESUME_TEMPLATES.indian_professional) }
  ]);
  const [currentVersionId, setCurrentVersionId] = useState<string>("master");
  const [tailorLabel, setTailorLabel] = useState("");
  const [isTailoring, setIsTailoring] = useState(false);

  // Bullet rewriter Modal states
  const [showRewriteModal, setShowRewriteModal] = useState(false);
  const [rewriteBulletIndex, setRewriteBulletIndex] = useState<number>(-1);
  const [rewriteBulletSubIndex, setRewriteBulletSubIndex] = useState<number>(-1);
  const [rewriteTargetRole, setRewriteTargetRole] = useState("");
  const [rewriteTargetIndustry, setRewriteTargetIndustry] = useState("");
  const [rewriteKeywords, setRewriteKeywords] = useState<string[]>([]);
  const [isRewritingBullet, setIsRewritingBullet] = useState(false);
  const [rewriteResult, setRewriteResult] = useState<any>(null);
  const [selectedRewriteVersion, setSelectedRewriteVersion] = useState<"primary" | "alt1" | "alt2">("primary");

  // Outreach campaign states
  const [outreachCompany, setOutreachCompany] = useState("");
  const [outreachRole, setOutreachRole] = useState("");
  const [outreachManager, setOutreachManager] = useState("");
  const [outreachTone, setOutreachTone] = useState("professional");
  const [isGeneratingOutreach, setIsGeneratingOutreach] = useState(false);
  const [outreachResult, setOutreachResult] = useState<any>(null);
  const [outreachError, setOutreachError] = useState("");
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Auth check: redirect to login if no token
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
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

  const handleCopyToClipboard = (text: string, section: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    }
  };

  const WEAK_VERBS = ['helped', 'worked on', 'did', 'made', 'managed', 'assisted', 'responsible for', 'handled', 'was'];
  const getWeakVerbs = (text: string) => {
    const lower = text.toLowerCase();
    return WEAK_VERBS.filter(v => lower.includes(v));
  };

  // Helper to serialize active resume state to plain text for ATS scanner
  const getResumePlainText = (data: any): string => {
    if (!data) return "";
    let text = "";
    if (data.basic) {
      text += `${data.basic.name || ""}\n`;
      text += `${data.basic.email || ""} | ${data.basic.phone || ""} | ${data.basic.location || ""}\n`;
      if (data.basic.summary) text += `Professional Summary:\n${data.basic.summary}\n\n`;
    }
    if (Array.isArray(data.experience) && data.experience.length > 0) {
      text += `Professional Experience:\n`;
      data.experience.forEach((exp: any) => {
        text += `${exp.company || ""} - ${exp.title || ""} (${exp.date || ""}, ${exp.location || ""})\n`;
        if (Array.isArray(exp.bullets)) {
          exp.bullets.forEach((b: string) => {
            text += `- ${b}\n`;
          });
        }
        text += `\n`;
      });
    }
    if (Array.isArray(data.academics) && data.academics.length > 0) {
      text += `Education:\n`;
      data.academics.forEach((edu: any) => {
        text += `${edu.school || ""} - ${edu.degree || ""} (${edu.year || ""}) ${edu.gpa ? "GPA: " + edu.gpa : ""}\n`;
      });
      text += `\n`;
    }
    if (Array.isArray(data.skills) && data.skills.length > 0) {
      text += `Technical Skills: ${data.skills.map((s: any) => s.name).join(", ")}\n`;
    }
    return text;
  };

  // Load versions & draft from local storage
  useEffect(() => {
    const savedVersions = localStorage.getItem("forge_versions_v1");
    const savedActiveId = localStorage.getItem("forge_current_version_id_v1");
    const savedResume = localStorage.getItem("forge_ultimate_v1");
    
    let parsedResume = null;
    if (savedResume) {
      try {
        parsedResume = normalizeResumeData(JSON.parse(savedResume));
      } catch {}
    }
    
    if (savedVersions) {
      try {
        const parsedVersions = JSON.parse(savedVersions);
        if (Array.isArray(parsedVersions) && parsedVersions.length > 0) {
          setResumeVersions(parsedVersions);
          const activeId = savedActiveId || parsedVersions[0].id;
          setCurrentVersionId(activeId);
          const activeVer = parsedVersions.find((v: any) => v.id === activeId);
          if (activeVer) {
            setResume(normalizeResumeData(activeVer.resumeData));
          } else if (parsedResume) {
            setResume(parsedResume);
          }
          return;
        }
      } catch (e) {
        console.error("Error loading versions list", e);
      }
    }
    
    if (parsedResume) {
      setResume(parsedResume);
      setResumeVersions([
        { id: "master", label: "Master Resume", resumeData: parsedResume }
      ]);
    } else {
      const defaultResume = normalizeResumeData(RESUME_TEMPLATES.indian_professional);
      setResume(defaultResume);
      setResumeVersions([
        { id: "master", label: "Master Resume", resumeData: defaultResume }
      ]);
    }
  }, []);

  const saveToStorage = useCallback(async (data: any, versionsList?: any[]) => {
    localStorage.setItem("forge_ultimate_v1", JSON.stringify(data));
    const listToSave = versionsList || resumeVersions;
    localStorage.setItem("forge_versions_v1", JSON.stringify(listToSave));
    localStorage.setItem("forge_current_version_id_v1", currentVersionId);
    setIsSaving(true);
    
    try {
      const user = localStorage.getItem("user");
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
    } finally {
      setIsSaving(false);
    }
  }, [jdText, analysis, resumeVersions, currentVersionId]);

  useEffect(() => {
    if (showSaved) {
      const timer = setTimeout(() => setShowSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showSaved]);

  const updateSection = (section: string, data: any) => {
    const next = { ...resume, [section]: data };
    setResume(next);
    
    const updatedVersions = resumeVersions.map((v: any) => {
      if (v.id === currentVersionId) {
        return { ...v, resumeData: next };
      }
      return v;
    });
    setResumeVersions(updatedVersions);
    localStorage.setItem("forge_versions_v1", JSON.stringify(updatedVersions));
    localStorage.setItem("forge_ultimate_v1", JSON.stringify(next));
    
    saveToStorage(next, updatedVersions);
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

  // Switch between version variants
  const handleSwitchVersion = (id: string) => {
    setCurrentVersionId(id);
    localStorage.setItem("forge_current_version_id_v1", id);
    const targetVer = resumeVersions.find(v => v.id === id);
    if (targetVer) {
      const normalized = normalizeResumeData(targetVer.resumeData);
      setResume(normalized);
      localStorage.setItem("forge_ultimate_v1", JSON.stringify(normalized));
    }
  };

  // Delete a tailored variant
  const handleDeleteVersion = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (id === "master") return;
    
    const updated = resumeVersions.filter(v => v.id !== id);
    setResumeVersions(updated);
    localStorage.setItem("forge_versions_v1", JSON.stringify(updated));
    
    if (currentVersionId === id) {
      setCurrentVersionId("master");
      const masterVer = updated.find(v => v.id === "master") || updated[0];
      setResume(normalizeResumeData(masterVer.resumeData));
      localStorage.setItem("forge_current_version_id_v1", masterVer.id);
      localStorage.setItem("forge_ultimate_v1", JSON.stringify(masterVer.resumeData));
      saveToStorage(masterVer.resumeData, updated);
    } else {
      saveToStorage(resume, updated);
    }
  };

  // Calls ATS score gauge endpoint
  const handleAnalyze = async () => {
    if (!jdText) return;
    setIsAnalyzing(true);
    try {
        const resumeText = getResumePlainText(resume);
        const res = await fetch("http://localhost:5000/api/ai/ats-analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ resume_text: resumeText, job_description: jdText }),
        });
        if (res.ok) {
          const data = await res.json();
          setAnalysis(data);
          if (Array.isArray(data.missing_keywords)) {
            setRewriteKeywords(data.missing_keywords);
          }
        }
    } catch (e) {
        console.error("ATS Analyzer Error:", e);
    } finally {
        setIsAnalyzing(false);
    }
  };

  // Calls A/B Tailor engine
  const handleTailorResume = async () => {
    if (!jdText.trim()) return;
    setIsTailoring(true);
    try {
      const label = tailorLabel.trim() || `Tailored v${resumeVersions.length}`;
      const res = await fetch("http://localhost:5000/api/ai/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          master_resume: resume,
          job_description: jdText,
          version_label: label
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to tailor resume");
      }

      const tailoredData = await res.json();
      const normalized = normalizeResumeData(tailoredData);
      
      const newVersion = {
        id: Math.random().toString(36).substr(2, 9),
        label: label,
        resumeData: normalized
      };

      const updatedVersions = [...resumeVersions, newVersion];
      setResumeVersions(updatedVersions);
      setCurrentVersionId(newVersion.id);
      setResume(normalized);
      setTailorLabel("");
      
      localStorage.setItem("forge_versions_v1", JSON.stringify(updatedVersions));
      localStorage.setItem("forge_current_version_id_v1", newVersion.id);
      localStorage.setItem("forge_ultimate_v1", JSON.stringify(normalized));
      
      saveToStorage(normalized, updatedVersions);
    } catch (err: any) {
      alert(err.message || "Failed to tailor resume.");
    } finally {
      setIsTailoring(false);
    }
  };

  // Calls AI Bullet Rewriter advanced pipeline
  const handleRewriteBullet = async () => {
    if (rewriteBulletIndex === -1 || rewriteBulletSubIndex === -1) return;
    const currentBullet = resume.experience[rewriteBulletIndex].bullets[rewriteBulletSubIndex];
    if (!currentBullet) return;
    
    setIsRewritingBullet(true);
    setRewriteResult(null);
    try {
      const res = await fetch("http://localhost:5000/api/ai/bullet-rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          original_bullet: currentBullet,
          target_role: rewriteTargetRole,
          target_industry: rewriteTargetIndustry,
          missing_keywords: rewriteKeywords
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to rewrite bullet");
      }

      const data = await res.json();
      setRewriteResult(data);
      setSelectedRewriteVersion("primary");
    } catch (err: any) {
      alert(err.message || "Failed to rewrite bullet.");
    } finally {
      setIsRewritingBullet(false);
    }
  };

  const handleApplyRewrittenBullet = () => {
    if (!rewriteResult || rewriteBulletIndex === -1 || rewriteBulletSubIndex === -1) return;
    
    let textToApply = "";
    const primary = rewriteResult.primary || rewriteResult.rewritten_bullet || "";
    const alternatives = rewriteResult.alternatives || rewriteResult.alternative_versions || [];

    if (selectedRewriteVersion === "primary") {
      textToApply = primary;
    } else if (selectedRewriteVersion === "alt1") {
      textToApply = alternatives[0] || primary;
    } else if (selectedRewriteVersion === "alt2") {
      textToApply = alternatives[1] || primary;
    }

    if (textToApply) {
      const currentBullets = [...resume.experience[rewriteBulletIndex].bullets];
      currentBullets[rewriteBulletSubIndex] = textToApply;
      updateEntry('experience', rewriteBulletIndex, 'bullets', currentBullets);
    }
    
    setShowRewriteModal(false);
    setRewriteBulletIndex(-1);
    setRewriteBulletSubIndex(-1);
    setRewriteResult(null);
  };

  // Calls Cover Letter & Connection Outreach engine
  const handleGenerateOutreach = async () => {
    setIsGeneratingOutreach(true);
    setOutreachError("");
    setOutreachResult(null);
    try {
      const summary = resume.basic?.summary || "";
      const achievements: string[] = [];
      if (Array.isArray(resume.experience)) {
        resume.experience.forEach((exp: any) => {
          if (Array.isArray(exp.bullets)) {
            exp.bullets.forEach((b: string) => {
              if (b.trim()) achievements.push(b.trim());
            });
          }
        });
      }

      const res = await fetch("http://localhost:5000/api/ai/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume_summary: summary || "Experienced professional in modern systems architectures.",
          key_achievements: achievements.slice(0, 5),
          job_description: jdText || "Job description targeting highly scalable applications.",
          company_name: outreachCompany,
          role_title: outreachRole,
          hiring_manager_name: outreachManager,
          tone: outreachTone
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to generate outreach materials");
      }

      const data = await res.json();
      setOutreachResult(data);
    } catch (err: any) {
      setOutreachError(err.message || "An error occurred while generating outreach campaign.");
    } finally {
      setIsGeneratingOutreach(false);
    }
  };

  // Calls LinkedIn Profile Parser
  const handleLinkedInImport = async () => {
    if (!importText.trim()) return;
    setIsImporting(true);
    setImportError("");
    try {
      const res = await fetch("http://localhost:5000/api/ai/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw_text: importText, source_type: "linkedin" }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to parse LinkedIn text");
      }

      const parsedData = await res.json();
      const normalized = normalizeResumeData(parsedData);
      setResume(normalized);
      
      const updatedVersions = resumeVersions.map((v: any) => {
        if (v.id === currentVersionId) {
          return { ...v, resumeData: normalized };
        }
        return v;
      });
      setResumeVersions(updatedVersions);
      localStorage.setItem("forge_versions_v1", JSON.stringify(updatedVersions));
      localStorage.setItem("forge_ultimate_v1", JSON.stringify(normalized));
      
      saveToStorage(normalized, updatedVersions);
      setShowImportModal(false);
      setImportText("");
    } catch (err: any) {
      setImportError(err.message || "An error occurred while parsing the LinkedIn text.");
    } finally {
      setIsImporting(false);
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
    { id: 'scholarships', label: 'Scholarships', icon: <Trophy size={18} /> },
    { id: 'outreach', label: 'Outreach & Cover Letter', icon: <MessageSquare size={18} /> }
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
        body: JSON.stringify({ resume, templateId: currentTemplate }),
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

  const handleFileImport = async (file: File) => {
    setIsImporting(true);
    setImportError("");
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const result = e.target?.result as string;
          const base64Data = result.split(',')[1];
          const fileType = file.name.endsWith('.pdf') ? 'pdf' : 'txt';

          const res = await fetch("http://localhost:5000/api/import", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileBase64: base64Data, fileType }),
          });

          if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || "Failed to parse file");
          }

          const parsedData = await res.json();
          const normalized = normalizeResumeData(parsedData);
          setResume(normalized);
          saveToStorage(normalized);
          setShowImportModal(false);
        } catch (err: any) {
          setImportError(err.message || "An error occurred while parsing the file.");
        } finally {
          setIsImporting(false);
        }
      };
      reader.onerror = () => {
        setImportError("Failed to read file.");
        setIsImporting(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setImportError(err.message || "Failed to process file.");
      setIsImporting(false);
    }
  };

  const handleTextImport = async () => {
    if (!importText.trim()) return;
    setIsImporting(true);
    setImportError("");
    try {
      const res = await fetch("http://localhost:5000/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: importText }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to parse text");
      }

      const parsedData = await res.json();
      const normalized = normalizeResumeData(parsedData);
      setResume(normalized);
      saveToStorage(normalized);
      setShowImportModal(false);
      setImportText("");
    } catch (err: any) {
      setImportError(err.message || "An error occurred while parsing the text.");
    } finally {
      setIsImporting(false);
    }
  };

  const fetchPublicTemplates = async () => {
    setIsLoadingTemplates(true);
    try {
      const res = await fetch("http://localhost:5000/api/templates");
      if (res.ok) {
        const body = await res.json();
        setPublicTemplates(body.data || []);
      }
    } catch (e) {
      console.error("Failed to fetch public templates", e);
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  const handleShareTemplate = async () => {
    if (!shareName.trim() || !shareDescription.trim()) return;
    setIsSharing(true);
    setShareError("");
    setShareSuccess(false);
    try {
      const res = await fetch("http://localhost:5000/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: shareName,
          description: shareDescription,
          resumeData: resume
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save template");
      }

      setShareSuccess(true);
      setShareName("");
      setShareDescription("");
      fetchPublicTemplates();
    } catch (err: any) {
      setShareError(err.message || "An error occurred while sharing the template.");
    } finally {
      setIsSharing(false);
    }
  };

  const handleSelectPublicTemplate = (tmpl: any) => {
    const confirmLoad = window.confirm(
      `Loading "${tmpl.name}" will replace all of your current resume content inside the editor. Are you sure you want to proceed?`
    );
    if (!confirmLoad) return;

    if (tmpl.resumeData) {
      const normalized = normalizeResumeData(tmpl.resumeData);
      setResume(normalized);
      saveToStorage(normalized);
      setShowTemplateModal(false);
    }
  };

  const renderLabel = (text: string) => (
    <label style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted-foreground)', marginBottom: '0.5rem', display: 'block' }}>
      {text}
    </label>
  );

  const getEditorialNote = (tabId: string) => {
    switch (tabId) {
      case 'outreach': return "Forge bespoke cover letters and short LinkedIn messages optimized for recruiters and hiring managers.";
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
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '1px solid var(--border)', paddingLeft: '1.5rem', marginLeft: '0.5rem' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--muted-foreground)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Variant:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <select
                value={currentVersionId}
                onChange={(e) => handleSwitchVersion(e.target.value)}
                style={{
                  background: 'var(--background)',
                  border: '1px solid var(--border)',
                  color: 'var(--foreground)',
                  padding: '0.3rem 1.5rem 0.3rem 0.6rem',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  borderRadius: '0px',
                  outline: 'none',
                }}
              >
                {resumeVersions.map((v: any) => (
                  <option key={v.id} value={v.id}>
                    {v.label} {v.id === "master" ? "(Master)" : ""}
                  </option>
                ))}
              </select>
              
              {currentVersionId !== "master" && (
                <button
                  onClick={(e) => handleDeleteVersion(currentVersionId, e)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--destructive)',
                    cursor: 'pointer',
                    padding: '0.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="Delete this version"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <button onClick={() => saveToStorage(resume)} disabled={isSaving} style={{ background: 'transparent', border: 'none', fontSize: '0.8rem', color: 'var(--foreground)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
               {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {isSaving ? "Saving..." : "Save"}
            </button>
            <button onClick={() => setShowImportModal(true)} style={{ background: 'transparent', border: 'none', fontSize: '0.8rem', color: 'var(--foreground)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
               <Upload size={14} /> Import AI
            </button>
           <button onClick={() => setShowTemplateModal(true)} style={{ background: 'transparent', border: 'none', fontSize: '0.8rem', color: 'var(--foreground)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              <Layout size={14} /> Layouts
           </button>
           <button onClick={() => setShowShareModal(true)} style={{ background: 'transparent', border: 'none', fontSize: '0.8rem', color: 'var(--foreground)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              <Share2 size={14} /> Share
           </button>
           <button onClick={downloadPDF} disabled={isDownloading} style={{ background: 'transparent', border: '1px solid var(--foreground)', padding: '0.5rem 1.5rem', fontSize: '0.8rem', color: 'var(--foreground)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--foreground)'; e.currentTarget.style.color = 'var(--background)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--foreground)'; }}>
              {isDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} Export PDF
           </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <style>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* LEFT COLUMN: BUILDER (50% width) */}
        <div style={{
          flex: '0 0 50%',
          maxWidth: '50%',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: 'var(--background)'
        }}>
          {/* HORIZONTAL TAB SELECTOR */}
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            overflowX: 'auto',
            padding: '1rem 2rem',
            borderBottom: '1px solid var(--border)',
            background: 'var(--background)',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }} className="no-scrollbar">
            {SECTIONS.map(s => (
              <button 
                key={s.id}
                onClick={() => setActiveTab(s.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 1.2rem',
                  background: activeTab === s.id ? 'var(--foreground)' : 'transparent',
                  border: '1px solid ' + (activeTab === s.id ? 'var(--foreground)' : 'var(--border)'),
                  color: activeTab === s.id ? 'var(--background)' : 'var(--muted-foreground)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                  borderRadius: '0px',
                }}
              >
                {s.icon}
                <span>{s.label}</span>
              </button>
            ))}
          </div>

          {/* EDITOR FORM AREA */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '3rem 4rem', scrollbarWidth: 'none' }} className="no-scrollbar">
            <div className="animate-fade-in" key={activeTab} style={{ width: '100%' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--foreground)' }}>
                {SECTIONS.find(s => s.id === activeTab)?.label}
              </h2>

              <div style={{ padding: '1.25rem', border: '1px solid var(--border)', marginBottom: '2.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start', background: 'var(--bg-surface)' }}>
                  <Info size={18} color="var(--accent-editorial)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--foreground)', lineHeight: 1.6 }}>
                    <strong style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1rem', marginRight: '0.5rem' }}>Editorial Note:</strong> 
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
                            className="input-premium" style={{ height: '240px', padding: '1rem' }}
                        />
                      </div>
                      <button onClick={handleAnalyze} disabled={isAnalyzing} style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', background: 'var(--foreground)', color: 'var(--background)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', transition: 'background 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent-editorial)'} onMouseLeave={(e) => e.currentTarget.style.background = 'var(--foreground)'}>
                          {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <><Search size={18} /> Analyze Alignment</>}
                      </button>

                      {analysis && (
                          <div className="animate-fade-in" style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                              
                              {/* 1. TOP STATS HEADER: CIRCULAR DIAL & PROGRESS MATRIX */}
                              <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', padding: '2rem', border: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
                                  
                                  {/* Circular SVG Match Gauge */}
                                  <div style={{ position: 'relative', width: '110px', height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                      <svg width="110" height="110" style={{ transform: 'rotate(-90deg)' }}>
                                          {/* Background Circle */}
                                          <circle 
                                              cx="55" cy="55" r="48" 
                                              stroke="rgba(194, 165, 108, 0.15)" 
                                              strokeWidth="7" 
                                              fill="transparent" 
                                          />
                                          {/* Active Gold Circle */}
                                          <circle 
                                              cx="55" cy="55" r="48" 
                                              stroke="var(--accent-editorial)" 
                                              strokeWidth="7" 
                                              fill="transparent" 
                                              strokeDasharray={2 * Math.PI * 48}
                                              strokeDashoffset={2 * Math.PI * 48 * (1 - (analysis.ats_score || 0) / 100)}
                                              strokeLinecap="square"
                                              style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                                          />
                                      </svg>
                                      <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                          <span style={{ fontSize: '1.65rem', fontWeight: 600, color: 'var(--foreground)', fontFamily: 'var(--font-serif)', lineHeight: 1 }}>
                                              {analysis.ats_score || 0}
                                          </span>
                                          <span style={{ fontSize: '0.55rem', fontWeight: 600, color: 'var(--muted-foreground)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '2px' }}>
                                              Match
                                          </span>
                                      </div>
                                  </div>

                                  {/* Section Score Bars Grid */}
                                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                      <span style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>
                                          ATS Parameter Scans
                                      </span>
                                      
                                      {/* Technical Skills score */}
                                      <div>
                                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '3px' }}>
                                              <span>Technical Skills Alignment</span>
                                              <span>{analysis.section_scores?.skills ?? 0}%</span>
                                          </div>
                                          <div style={{ height: '3px', background: 'rgba(26,26,26,0.06)', position: 'relative' }}>
                                              <div style={{ width: `${analysis.section_scores?.skills ?? 0}%`, height: '100%', background: 'var(--foreground)' }} />
                                          </div>
                                      </div>

                                      {/* Experience Relevance score */}
                                      <div>
                                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '3px' }}>
                                              <span>Role Narrative & Scope</span>
                                              <span>{analysis.section_scores?.experience ?? 0}%</span>
                                          </div>
                                          <div style={{ height: '3px', background: 'rgba(26,26,26,0.06)', position: 'relative' }}>
                                              <div style={{ width: `${analysis.section_scores?.experience ?? 0}%`, height: '100%', background: 'var(--foreground)' }} />
                                          </div>
                                      </div>

                                      {/* Education match score */}
                                      <div>
                                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '3px' }}>
                                              <span>Academic Relevance</span>
                                              <span>{analysis.section_scores?.education ?? 0}%</span>
                                          </div>
                                          <div style={{ height: '3px', background: 'rgba(26,26,26,0.06)', position: 'relative' }}>
                                              <div style={{ width: `${analysis.section_scores?.education ?? 0}%`, height: '100%', background: 'var(--foreground)' }} />
                                          </div>
                                      </div>
                                  </div>

                              </div>

                              {/* 2. SUMMARY & ROADMAP */}
                              <div style={{ padding: '2rem', border: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
                                  <div style={{ marginBottom: '2rem' }}>
                                      {renderLabel("Core Role Profile")}
                                      <p style={{ color: 'var(--foreground)', lineHeight: 1.7, fontSize: '0.85rem' }}>
                                          {analysis.jdSummary || "Job profile parsed. Focus resume narrative on scaling robust pipelines."}
                                      </p>
                                  </div>

                                  <div>
                                      {renderLabel("Optimization Roadmaps")}
                                      <ul style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                          {(analysis.top_recommendations || []).map((rec: string, i: number) => (
                                              <li key={i} style={{ fontSize: '0.85rem', color: 'var(--foreground)', lineHeight: 1.5 }}>
                                                  {rec}
                                              </li>
                                          ))}
                                      </ul>
                                  </div>
                              </div>

                              {/* 3. SIDE-BY-SIDE KEYWORDS DICTIONARY */}
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                  
                                  {/* Matched Keywords with Checks */}
                                  <div style={{ padding: '1.5rem', border: '1px solid var(--border)', background: 'rgba(26,26,26,0.01)' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                                          <span style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--foreground)' }}>
                                              Matched Keywords
                                          </span>
                                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-editorial)' }}>
                                              {analysis.matched_keywords?.length ?? 0}
                                          </span>
                                      </div>
                                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                          {(analysis.matched_keywords || []).map((kw: string, i: number) => (
                                              <span key={i} style={{ 
                                                  background: 'rgba(194,165,108,0.08)', 
                                                  border: '1px solid rgba(194,165,108,0.2)', 
                                                  padding: '0.3rem 0.6rem', 
                                                  fontSize: '0.7rem', 
                                                  color: 'var(--foreground)',
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  gap: '0.25rem'
                                              }}>
                                                  <span style={{ color: 'var(--accent-editorial)' }}>✓</span> {kw}
                                              </span>
                                          ))}
                                      </div>
                                  </div>

                                  {/* Missing Keywords with Outlines */}
                                  <div style={{ padding: '1.5rem', border: '1px solid var(--border)', background: 'rgba(26,26,26,0.01)' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                                          <span style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--foreground)' }}>
                                              Missing Keywords
                                          </span>
                                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--destructive)' }}>
                                              {analysis.missing_keywords?.length ?? 0}
                                          </span>
                                      </div>
                                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                          {(analysis.missing_keywords || []).map((kw: string, i: number) => {
                                              const isHigh = (analysis.high_priority_missing_keywords || []).includes(kw);
                                              return (
                                                  <span key={i} style={{ 
                                                      background: 'transparent', 
                                                      border: isHigh ? '1.5px solid var(--accent-editorial)' : '1px solid var(--border)', 
                                                      padding: '0.3rem 0.6rem', 
                                                      fontSize: '0.7rem', 
                                                      color: 'var(--foreground)',
                                                      fontWeight: isHigh ? 600 : 400
                                                  }} title={isHigh ? "High priority keyword (frequently mentioned in JD)" : ""}>
                                                      {kw} {isHigh && <span style={{ color: 'var(--accent-editorial)', fontSize: '0.6rem', marginLeft: '2px' }}>★</span>}
                                                  </span>
                                              );
                                          })}
                                      </div>
                                  </div>

                              </div>

                              {/* 4. A/B RESUME TAILOR LAUNCHER */}
                              <div style={{ padding: '2rem', border: '1px solid var(--border)', background: 'var(--bg-surface)', marginTop: '1rem' }}>
                                  {renderLabel("A/B Resume Tailor Engine")}
                                  <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                                      Instantly build a highly targeted variant of this resume optimized for the target Job Description. The tailored variant is fanned out safely under a new name without overwriting your master copy.
                                  </p>
                                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                                      <input 
                                          type="text" 
                                          placeholder="e.g. Fintech Senior Architect" 
                                          value={tailorLabel}
                                          onChange={(e) => setTailorLabel(e.target.value)}
                                          className="input-premium" 
                                          style={{ flex: 1, padding: '0.6rem 1rem', fontSize: '0.8rem', height: '40px' }}
                                      />
                                      <button 
                                          onClick={handleTailorResume} 
                                          disabled={isTailoring || !jdText.trim()}
                                          style={{ 
                                              padding: '0.6rem 1.5rem', 
                                              background: 'var(--foreground)', 
                                              color: 'var(--background)', 
                                              border: 'none', 
                                              cursor: 'pointer', 
                                              fontSize: '0.75rem', 
                                              fontWeight: 600,
                                              textTransform: 'uppercase',
                                              letterSpacing: '0.1em',
                                              display: 'flex', 
                                              alignItems: 'center', 
                                              gap: '0.5rem',
                                              height: '40px',
                                              transition: 'background 0.3s'
                                          }}
                                          onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = 'var(--accent-editorial)'; }}
                                          onMouseLeave={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = 'var(--foreground)'; }}
                                      >
                                          {isTailoring ? <Loader2 size={14} className="animate-spin" /> : <><Wand2 size={14} /> Tailor Resume</>}
                                      </button>
                                  </div>
                              </div>

                          </div>
                      )}
                  </>
              )}

              {activeTab === 'basic' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                          <div>
                              {renderLabel("Legal Name")}
                              <input value={resume.basic?.name || ''} onChange={(e) => updateSection('basic', {...resume.basic, name: e.target.value})} className="input-premium" />
                          </div>
                          <div>
                              {renderLabel("Contact Email")}
                              <input value={resume.basic?.email || ''} onChange={(e) => updateSection('basic', {...resume.basic, email: e.target.value})} className="input-premium" />
                          </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
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
                          <textarea value={resume.basic?.summary || ''} onChange={(e) => updateSection('basic', {...resume.basic, summary: e.target.value})} placeholder="Strategic Professional Brief..." className="input-premium" style={{ minHeight: '130px' }} />
                      </div>
                  </div>
              )}

              {activeTab === 'experience' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                      {resume.experience?.map((exp: any, i: number) => (
                          <div key={i} style={{ paddingBottom: '2.5rem', borderBottom: '1px solid var(--border)', position: 'relative' }}>
                              <button onClick={() => removeEntry('experience', i)} style={{ position: 'absolute', top: '0', right: '0', background: 'transparent', border: 'none', color: 'var(--muted-foreground)', cursor: 'pointer', padding: '0.5rem', transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--destructive)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted-foreground)'}>
                                <Trash2 size={18} />
                              </button>
                              
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                                  <div>
                                    {renderLabel("Organization")}
                                    <input value={exp.company || ''} onChange={(e) => updateEntry('experience', i, 'company', e.target.value)} className="input-premium" />
                                  </div>
                                  <div>
                                    {renderLabel("Role Title")}
                                    <input value={exp.title || ''} onChange={(e) => updateEntry('experience', i, 'title', e.target.value)} className="input-premium" />
                                  </div>
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
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
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                      {exp.bullets?.map((b: string, j: number) => {
                                          const weak = getWeakVerbs(b);
                                          return (
                                          <div key={j} style={{ position: 'relative' }}>
                                              <textarea className="input-premium" value={b} onChange={(e) => {
                                                  const nb = [...exp.bullets]; nb[j] = e.target.value; updateEntry('experience', i, 'bullets', nb);
                                              }} placeholder="Achieved X by implementing Y, resulting in Z..." style={{ minHeight: '70px', paddingRight: '3.5rem' }} />
                                              
                                              <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', display: 'flex', gap: '0.65rem', alignItems: 'center', background: 'var(--bg-surface)', padding: '4px 8px', border: '1px solid var(--border)' }}>
                                                  <Sparkles onClick={() => {
                                                      setRewriteBulletIndex(i);
                                                      setRewriteBulletSubIndex(j);
                                                      setRewriteTargetRole(exp.title || "");
                                                      setRewriteResult(null);
                                                      setShowRewriteModal(true);
                                                  }} size={14} style={{ color: 'var(--accent-editorial)', cursor: 'pointer' }} />
                                                  <div style={{ width: '1px', height: '10px', background: 'var(--border)' }} />
                                                  <X onClick={() => {
                                                      const nb = [...exp.bullets]; nb.splice(j, 1); updateEntry('experience', i, 'bullets', nb);
                                                  }} size={14} style={{ color: 'var(--muted-foreground)', cursor: 'pointer' }} />
                                              </div>
                                              
                                              {weak.length > 0 && (
                                                  <div className="animate-fade-in" style={{ marginTop: '0.5rem', padding: '0.6rem', borderLeft: '1px solid var(--accent-editorial)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', background: 'var(--bg-surface)' }}>
                                                      <AlertCircle size={14} color="var(--accent-editorial)" style={{ marginTop: '2px' }} />
                                                      <span style={{ fontSize: '0.75rem', color: 'var(--foreground)', lineHeight: 1.4 }}>
                                                          Weak verb: <strong style={{ fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>"{weak[0]}"</strong>. Consider stronger action verbs.
                                                      </span>
                                                  </div>
                                              )}
                                          </div>
                                      )})}
                                      <button onClick={() => updateEntry('experience', i, 'bullets', [...exp.bullets, ''])} style={{ alignSelf: 'flex-start', background: 'transparent', border: '1px solid var(--border)', color: 'var(--foreground)', padding: '0.6rem 1.2rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'border-color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--foreground)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}>
                                        <Plus size={14} /> Add Statement
                                      </button>
                                  </div>
                              </div>
                          </div>
                      ))}
                      <button onClick={() => addEntry('experience', { company: '', title: '', date: '', location: '', bullets: [''] })} style={{ width: '100%', padding: '1rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--foreground)', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem', transition: 'border-color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--foreground)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}>
                        <Plus size={16} /> Add Experience
                      </button>
                  </div>
              )}

              {activeTab === 'academics' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                      {resume.academics?.map((edu: any, i: number) => (
                          <div key={i} style={{ paddingBottom: '2.5rem', borderBottom: '1px solid var(--border)', position: 'relative' }}>
                              <button onClick={() => removeEntry('academics', i)} style={{ position: 'absolute', top: '0', right: '0', background: 'transparent', border: 'none', color: 'var(--muted-foreground)', cursor: 'pointer', padding: '0.5rem', transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--destructive)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted-foreground)'}>
                                <Trash2 size={18} />
                              </button>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                                  <div>
                                    {renderLabel("Institution")}
                                    <input value={edu.school || edu.name || ''} onChange={(e) => updateEntry('academics', i, 'school', e.target.value)} className="input-premium" />
                                  </div>
                                  <div>
                                    {renderLabel("Degree / Major")}
                                    <input value={edu.degree || edu.detail || ''} onChange={(e) => updateEntry('academics', i, 'degree', e.target.value)} className="input-premium" />
                                  </div>
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
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
                      <button onClick={() => addEntry('academics', { school: '', degree: '', year: '', gpa: '' })} style={{ width: '100%', padding: '1rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--foreground)', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem', transition: 'border-color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--foreground)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}>
                        <Plus size={16} /> Add Education
                      </button>
                  </div>
              )}

              {activeTab === 'skills' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                      <div>
                          {renderLabel("Technical Skills (Comma Separated)")}
                          <textarea value={resume.skills?.map((s:any) => s.name).join(', ') || ''} onChange={(e) => updateSection('skills', e.target.value.split(',').map(s => ({name: s.trim()})))} className="input-premium" style={{ minHeight: '100px' }} />
                      </div>
                      <div>
                          {renderLabel("Soft Skills & Linguistic (Comma Separated)")}
                          <textarea value={resume.languages?.map((l:any) => l.name).join(', ') || ''} onChange={(e) => updateSection('languages', e.target.value.split(',').map(s => ({name: s.trim()})))} className="input-premium" style={{ minHeight: '100px' }} />
                      </div>
                  </div>
              )}

              {/* OUTREACH FORM */}
              {activeTab === 'outreach' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      <div style={{ padding: '1.5rem', background: 'rgba(26,26,26,0.02)', border: '1px solid var(--border)' }}>
                          <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic', marginBottom: '1rem', color: 'var(--foreground)' }}>Target Opportunity</h3>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                              <div>
                                  {renderLabel("Company Name")}
                                  <input value={outreachCompany} onChange={e => setOutreachCompany(e.target.value)} className="input-premium" placeholder="e.g. Acme Corp" />
                              </div>
                              <div>
                                  {renderLabel("Role Title")}
                                  <input value={outreachRole} onChange={e => setOutreachRole(e.target.value)} className="input-premium" placeholder="e.g. Senior Frontend Engineer" />
                              </div>
                              <div>
                                  {renderLabel("Hiring Manager (Optional)")}
                                  <input value={outreachManager} onChange={e => setOutreachManager(e.target.value)} className="input-premium" placeholder="e.g. Jane Doe" />
                              </div>
                          </div>
                      </div>

                      <div style={{ padding: '1.5rem', background: 'rgba(26,26,26,0.02)', border: '1px solid var(--border)' }}>
                          <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic', marginBottom: '1rem', color: 'var(--foreground)' }}>Outreach Tone</h3>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                              {['professional', 'conversational', 'bold'].map(t => (
                                  <button key={t} onClick={() => setOutreachTone(t)} style={{ padding: '0.75rem', border: outreachTone === t ? '2px solid var(--foreground)' : '1px solid var(--border)', background: outreachTone === t ? 'var(--foreground)' : 'transparent', color: outreachTone === t ? 'var(--background)' : 'var(--muted-foreground)', cursor: 'pointer', textTransform: 'capitalize', fontSize: '0.85rem', transition: 'all 0.3s' }}>
                                      {t}
                                  </button>
                              ))}
                          </div>
                      </div>

                      {outreachError && (
                          <div style={{ padding: '1rem', background: 'rgba(139,0,0,0.05)', borderLeft: '3px solid var(--destructive)', color: 'var(--destructive)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                              {outreachError}
                          </div>
                      )}

                      <button onClick={handleGenerateOutreach} disabled={isGeneratingOutreach} style={{ padding: '1.25rem', background: 'var(--accent-editorial)', color: 'white', border: 'none', cursor: isGeneratingOutreach ? 'not-allowed' : 'pointer', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', transition: 'background 0.3s' }} onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = 'var(--foreground)'; }} onMouseLeave={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = 'var(--accent-editorial)'; }}>
                          {isGeneratingOutreach ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
                          {isGeneratingOutreach ? "Forging Outreach..." : "Generate Campaign"}
                      </button>
                  </div>
              )}

              {/* UNIVERSAL EDITOR FOR ALL OTHER 12+ MODULES */}
              {!['jd', 'basic', 'experience', 'academics', 'skills', 'outreach'].includes(activeTab) && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {resume[activeTab]?.map((item: any, i: number) => (
                          <div key={i} style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--border)', display: 'flex', gap: '1.5rem', alignItems: 'flex-start', position: 'relative' }}>
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
                              <button onClick={() => removeEntry(activeTab, i)} style={{ marginTop: '1.75rem', background: 'transparent', border: 'none', color: 'var(--muted-foreground)', cursor: 'pointer', transition: 'color 0.3s' }} title="Remove" onMouseEnter={(e) => e.currentTarget.style.color = 'var(--destructive)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted-foreground)'}>
                                <Trash2 size={18} />
                              </button>
                          </div>
                      ))}
                      <button onClick={() => addEntry(activeTab, { name: '', detail: '', date: '' })} style={{ width: '100%', padding: '1rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--foreground)', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem', transition: 'border-color 0.3s', marginTop: '1.5rem' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--foreground)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}>
                        <Plus size={16} /> Add Entry
                      </button>
                  </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE PREVIEW (50% width) */}
        <div style={{
          flex: '0 0 50%',
          maxWidth: '50%',
          background: 'var(--bg-surface)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {activeTab === 'outreach' ? (
              <div style={{ padding: '4rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '3rem', background: 'var(--bg-editorial)' }} className="no-scrollbar">
                  {!outreachResult ? (
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-foreground)' }}>
                          <MessageSquare size={48} style={{ opacity: 0.2, marginBottom: '1.5rem' }} />
                          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontStyle: 'italic', color: 'var(--foreground)', marginBottom: '0.5rem' }}>Awaiting Target Profile</p>
                          <p style={{ fontSize: '0.9rem' }}>Fill in the details on the left to generate tailored outreach materials.</p>
                      </div>
                  ) : (
                      <>
                          <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                  <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-serif)', color: 'var(--foreground)' }}>Cover <span style={{ fontStyle: 'italic', color: 'var(--accent-editorial)' }}>Letter</span></h2>
                                  <button onClick={() => handleCopyToClipboard(outreachResult.cover_letter?.body, 'cover-letter')} style={{ background: 'transparent', border: '1px solid var(--border)', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: copiedSection === 'cover-letter' ? 'var(--accent-editorial)' : 'var(--foreground)' }}>
                                      {copiedSection === 'cover-letter' ? <CheckCircle size={14} color="var(--accent-editorial)" /> : <FileCheck size={14} />}
                                      {copiedSection === 'cover-letter' ? 'Copied' : 'Copy'}
                                  </button>
                              </div>
                              <div style={{ padding: '2.5rem', background: '#fff', border: '1px solid var(--border)', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', fontSize: '0.95rem', lineHeight: 1.8, color: 'var(--foreground)', whiteSpace: 'pre-wrap', fontFamily: 'var(--font-serif)' }}>
                                  <div style={{ fontWeight: 600, marginBottom: '2rem' }}>Subject: {outreachResult.cover_letter?.subject_line}</div>
                                  {outreachResult.cover_letter?.body}
                              </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                              <div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                      <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--foreground)' }}>LinkedIn Note</h3>
                                      <button onClick={() => handleCopyToClipboard(outreachResult.linkedin_outreach?.message, 'linkedin-note')} style={{ background: 'transparent', border: 'none', color: copiedSection === 'linkedin-note' ? 'var(--accent-editorial)' : 'var(--muted-foreground)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>
                                          {copiedSection === 'linkedin-note' ? <CheckCircle size={12} /> : <FileCheck size={12} />} {copiedSection === 'linkedin-note' ? 'Copied' : 'Copy'}
                                      </button>
                                  </div>
                                  <div style={{ padding: '1.5rem', background: '#fff', border: '1px solid var(--border)', fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--foreground)', minHeight: '150px' }}>
                                      {outreachResult.linkedin_outreach?.message}
                                  </div>
                                  <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: (outreachResult.linkedin_outreach?.message?.length || 0) > 300 ? 'var(--destructive)' : 'var(--muted-foreground)', textAlign: 'right' }}>
                                      {outreachResult.linkedin_outreach?.message?.length || 0} / 300 chars
                                  </div>
                              </div>
                              
                              <div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                      <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--foreground)' }}>Follow-up DM</h3>
                                      <button onClick={() => handleCopyToClipboard(outreachResult.linkedin_outreach?.follow_up_dm, 'linkedin-dm')} style={{ background: 'transparent', border: 'none', color: copiedSection === 'linkedin-dm' ? 'var(--accent-editorial)' : 'var(--muted-foreground)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>
                                          {copiedSection === 'linkedin-dm' ? <CheckCircle size={12} /> : <FileCheck size={12} />} {copiedSection === 'linkedin-dm' ? 'Copied' : 'Copy'}
                                      </button>
                                  </div>
                                  <div style={{ padding: '1.5rem', background: '#fff', border: '1px solid var(--border)', fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--foreground)', minHeight: '150px' }}>
                                      {outreachResult.linkedin_outreach?.follow_up_dm}
                                  </div>
                              </div>
                          </div>
                          
                          <div style={{ padding: '1.25rem', background: 'rgba(194, 165, 108, 0.05)', border: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--muted-foreground)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                              <Lightbulb size={18} style={{ color: 'var(--accent-editorial)', flexShrink: 0, marginTop: '0.2rem' }} />
                              <div>
                                  <strong style={{ display: 'block', color: 'var(--foreground)', marginBottom: '0.25rem' }}>Narrative Strategy</strong>
                                  {outreachResult.narrative_thread}
                              </div>
                          </div>
                      </>
                  )}
              </div>
          ) : (
            <>
          {/* FLOATING ZOOM HUD */}
          <div style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--border)',
            padding: '0.4rem 0.8rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          }}>
            <button
              onClick={() => setZoomRatio(prev => Math.max(0.4, prev - 0.05))}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--foreground)',
                cursor: 'pointer',
                fontSize: '1.1rem',
                padding: '0.2rem 0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
              }}
              title="Zoom Out"
            >
              -
            </button>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, minWidth: '2.5rem', textAlign: 'center', color: 'var(--foreground)', fontFamily: 'monospace' }}>
              {Math.round(zoomRatio * 100)}%
            </span>
            <button
              onClick={() => setZoomRatio(prev => Math.min(1.5, prev + 0.05))}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--foreground)',
                cursor: 'pointer',
                fontSize: '1.1rem',
                padding: '0.2rem 0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
              }}
              title="Zoom In"
            >
              +
            </button>
            <div style={{ width: '1px', height: '1rem', background: 'var(--border)' }} />
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  const rightColWidth = (window.innerWidth / 2) - 80;
                  const computedFit = Math.min(1.2, Math.max(0.4, rightColWidth / 794));
                  setZoomRatio(parseFloat(computedFit.toFixed(2)));
                } else {
                  setZoomRatio(0.8);
                }
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-editorial)',
                cursor: 'pointer',
                fontSize: '0.7rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                padding: '0.2rem 0.5rem',
              }}
            >
              Fit
            </button>
          </div>

          {/* SCROLLABLE LIVE PREVIEW STAGE */}
          <div style={{
            flex: 1,
            overflow: 'auto',
            padding: '4rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }} className="no-scrollbar">
            
            {/* Centered A4 paper card with dynamic scaling */}
            <div
              ref={previewRef}
              style={{
                width: '794px',
                height: '1123px',
                transform: `scale(${zoomRatio})`,
                transformOrigin: 'top center',
                transition: 'transform 0.1s ease-out',
                marginBottom: `calc(1123px * (${zoomRatio} - 1) + 2rem)`,
                flexShrink: 0,
                background: '#ffffff',
                boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                border: '1px solid var(--border)',
                overflow: 'hidden',
              }}
            >
              <ResumePreview data={resume} templateId={currentTemplate} />
            </div>
          </div>

          {/* FIT TO ONE PAGE WARNING */}
          <div style={{
              position: 'absolute', bottom: '1.5rem', right: '1.5rem', zIndex: 100,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              border: isOverPageLimit ? '1px solid var(--destructive)' : '1px solid var(--border)',
              padding: '0.6rem 1.2rem',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              transition: 'all 0.3s',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          }}>
              {isOverPageLimit ? <AlertCircle size={14} color="var(--destructive)" /> : <CheckCircle size={14} color="var(--foreground)" />}
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, color: isOverPageLimit ? 'var(--destructive)' : 'var(--foreground)' }}>
                  {isOverPageLimit ? "Spilling to Page 2" : "Optimal 1-Page Layout"}
              </span>
          </div>
            </>
          )}
        </div>

      </div>

      {/* TEMPLATE ENGINE OVERLAY */}
      {showTemplateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(245,241,235,0.95)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '90%', maxWidth: '950px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', padding: '4rem 5rem', background: 'var(--bg-editorial)', border: '1px solid var(--border)', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem', color: 'var(--foreground)', fontFamily: 'var(--font-serif)' }}>Design & Profile <span style={{ fontStyle: 'italic', color: 'var(--accent-editorial)' }}>Studio</span></h2>
                    <X onClick={() => setShowTemplateModal(false)} style={{ cursor: 'pointer', color: 'var(--foreground)' }} size={32} />
                </div>
                
                {/* SUB-TABS inside the selection modal */}
                <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '2.5rem' }}>
                    <button onClick={() => setTemplateModalTab("styles")} style={{ background: 'transparent', border: 'none', borderBottom: templateModalTab === 'styles' ? '2px solid var(--accent-editorial)' : '2px solid transparent', color: templateModalTab === 'styles' ? 'var(--foreground)' : 'var(--muted-foreground)', cursor: 'pointer', paddingBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                        Layout Aesthetics
                    </button>
                    <button onClick={() => { setTemplateModalTab("community"); fetchPublicTemplates(); }} style={{ background: 'transparent', border: 'none', borderBottom: templateModalTab === 'community' ? '2px solid var(--accent-editorial)' : '2px solid transparent', color: templateModalTab === 'community' ? 'var(--foreground)' : 'var(--muted-foreground)', cursor: 'pointer', paddingBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                        Collective Resumes
                    </button>
                </div>

                {templateModalTab === 'styles' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                        <div onClick={() => { setCurrentTemplate(0); setShowTemplateModal(false); }} style={{ cursor: 'pointer', padding: '2.5rem', border: currentTemplate === 0 ? '1px solid var(--foreground)' : '1px solid var(--border)', background: currentTemplate === 0 ? 'var(--bg-surface)' : 'transparent', transition: 'all 0.3s' }}>
                            <h4 style={{ color: 'var(--foreground)', fontSize: '1.3rem', marginBottom: '0.75rem', fontFamily: 'var(--font-serif)' }}>Classic Pro</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>Clean, single-column design. Universally ATS safe and easily parsed by legacy recruiters.</p>
                        </div>
                        <div onClick={() => { setCurrentTemplate(1); setShowTemplateModal(false); }} style={{ cursor: 'pointer', padding: '2.5rem', border: currentTemplate === 1 ? '1px solid var(--foreground)' : '1px solid var(--border)', background: currentTemplate === 1 ? 'var(--bg-surface)' : 'transparent', transition: 'all 0.3s' }}>
                            <h4 style={{ color: 'var(--foreground)', fontSize: '1.3rem', marginBottom: '0.75rem', fontFamily: 'var(--font-serif)' }}>Modern Executive</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>Bold structured header. Highly ATS Friendly with an elegant corporate layout.</p>
                        </div>
                        <div onClick={() => { setCurrentTemplate(2); setShowTemplateModal(false); }} style={{ cursor: 'pointer', padding: '2.5rem', border: currentTemplate === 2 ? '1px solid var(--foreground)' : '1px solid var(--border)', background: currentTemplate === 2 ? 'var(--bg-surface)' : 'transparent', transition: 'all 0.3s' }}>
                            <h4 style={{ color: 'var(--foreground)', fontSize: '1.3rem', marginBottom: '0.75rem', fontFamily: 'var(--font-serif)' }}>Two-Column Clean</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>Skills sidebar configuration. ATS Friendly with clean spatial grid separations.</p>
                        </div>
                        <div onClick={() => { setCurrentTemplate(3); setShowTemplateModal(false); }} style={{ cursor: 'pointer', padding: '2.5rem', border: currentTemplate === 3 ? '1px solid var(--accent-editorial)' : '1px solid var(--border)', background: currentTemplate === 3 ? 'var(--bg-surface)' : 'transparent', transition: 'all 0.3s' }}>
                            <h4 style={{ color: 'var(--accent-editorial)', fontSize: '1.3rem', marginBottom: '0.75rem', fontFamily: 'var(--font-serif)' }}>Editorial Premium</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>Luxury editorial typography with ATS-safe structuring. Designed for impact roles.</p>
                        </div>
                    </div>
                ) : (
                    <div>
                        {isLoadingTemplates ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
                                <Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent-editorial)' }} />
                            </div>
                        ) : publicTemplates.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--muted-foreground)' }}>
                                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontStyle: 'italic', marginBottom: '0.5rem' }}>No collective resumes registered yet.</p>
                                <p style={{ fontSize: '0.85rem' }}>Be the first to publish yours by clicking the "Share" button in the top bar!</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', maxHeight: '45vh', overflowY: 'auto', paddingRight: '1rem' }}>
                                {publicTemplates.map((tmpl: any) => (
                                    <div key={tmpl._id || tmpl.id} onClick={() => handleSelectPublicTemplate(tmpl)} style={{ cursor: 'pointer', padding: '2.5rem', border: '1px solid var(--border)', background: 'transparent', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-editorial)'; e.currentTarget.style.background = 'rgba(26,26,26,0.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent'; }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem' }}>
                                            <h4 style={{ color: 'var(--foreground)', fontSize: '1.3rem', fontFamily: 'var(--font-serif)' }}>{tmpl.name}</h4>
                                            <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-editorial)', fontWeight: 600 }}>LOAD PROFILE</span>
                                        </div>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)', lineHeight: 1.5, marginBottom: '1rem' }}>{tmpl.description}</p>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                                            <span>By: {tmpl.resumeData?.basic?.name || "Anonymous"}</span>
                                            <span>•</span>
                                            <span>{tmpl.resumeData?.experience?.length || 0} Exp Bullets</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
      )}

      {/* AI IMPORTER OVERLAY */}
      {showImportModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(245,241,235,0.95)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '90%', maxWidth: '700px', padding: '4rem', background: 'var(--bg-editorial)', border: '1px solid var(--border)', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem', color: 'var(--foreground)', fontFamily: 'var(--font-serif)' }}>AI Resume <span style={{ fontStyle: 'italic', color: 'var(--accent-editorial)' }}>Importer</span></h2>
                    <X onClick={() => { setShowImportModal(false); setImportError(""); }} style={{ cursor: 'pointer', color: 'var(--foreground)' }} size={28} />
                </div>
                
                {/* TABS: UPLOAD FILE & PASTE TEXT */}
                <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '2rem' }}>
                    <button onClick={() => setImportTab("upload")} style={{ background: 'transparent', border: 'none', borderBottom: importTab === 'upload' ? '2px solid var(--accent-editorial)' : '2px solid transparent', color: importTab === 'upload' ? 'var(--foreground)' : 'var(--muted-foreground)', cursor: 'pointer', paddingBottom: '0.5rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                        Upload Document
                    </button>
                    <button onClick={() => setImportTab("text")} style={{ background: 'transparent', border: 'none', borderBottom: importTab === 'text' ? '2px solid var(--accent-editorial)' : '2px solid transparent', color: importTab === 'text' ? 'var(--foreground)' : 'var(--muted-foreground)', cursor: 'pointer', paddingBottom: '0.5rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                        Paste Plain Text
                    </button>
                    <button onClick={() => setImportTab("linkedin")} style={{ background: 'transparent', border: 'none', borderBottom: importTab === 'linkedin' ? '2px solid var(--accent-editorial)' : '2px solid transparent', color: importTab === 'linkedin' ? 'var(--foreground)' : 'var(--muted-foreground)', cursor: 'pointer', paddingBottom: '0.5rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                        LinkedIn Import
                    </button>
                </div>

                {importError && (
                    <div style={{ padding: '1rem', background: 'rgba(139,0,0,0.05)', borderLeft: '3px solid var(--destructive)', color: 'var(--destructive)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                        {importError}
                    </div>
                )}

                {isImporting ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 0', gap: '1.5rem' }}>
                        <Loader2 size={48} className="animate-spin" style={{ color: 'var(--accent-editorial)' }} />
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontStyle: 'italic', color: 'var(--foreground)', marginBottom: '0.5rem' }}>Forging your resume structure...</p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', letterSpacing: '0.05em' }}>AI is extracting semantic sections and matching ATS keywords.</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {importTab === 'upload' && (
                            <div>
                                <div style={{ border: '2px dashed var(--border)', padding: '3rem', textAlign: 'center', background: 'rgba(26,26,26,0.02)', cursor: 'pointer', position: 'relative', transition: 'border-color 0.3s' }} onDragOver={(e) => e.preventDefault()} onDrop={(e) => {
                                    e.preventDefault();
                                    const file = e.dataTransfer.files?.[0];
                                    if (file) handleFileImport(file);
                                }}>
                                    <input type="file" accept=".pdf,.txt" style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleFileImport(file);
                                    }} />
                                    <Upload size={32} style={{ color: 'var(--accent-editorial)', marginBottom: '1rem' }} />
                                    <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '0.5rem' }}>Drag & Drop your resume here</p>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>or click to browse files. Supports PDF or TXT formats.</p>
                                </div>
                            </div>
                        )}

                        {importTab === 'text' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <textarea value={importText} onChange={(e) => setImportText(e.target.value)} placeholder="Paste the full, unstructured text of your resume here. AI will organize it into beautiful, professional sections." className="input-premium" style={{ height: '200px', padding: '1rem', border: '1px solid var(--border)', background: 'rgba(26,26,26,0.02)' }} />
                                <button onClick={handleTextImport} disabled={!importText.trim()} style={{ padding: '1rem', background: 'var(--foreground)', color: 'var(--background)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem', border: 'none', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }} onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = 'var(--accent-editorial)'; }} onMouseLeave={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = 'var(--foreground)'; }}>
                                    Parse with CareerForge AI
                                </button>
                            </div>
                        )}

                        {importTab === 'linkedin' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <textarea 
                                    value={importText} 
                                    onChange={(e) => setImportText(e.target.value)} 
                                    placeholder="Paste your LinkedIn Profile text content (e.g. from 'Save to PDF' text or direct copy-paste of your profile sections). AI will map it into clean resume modules." 
                                    className="input-premium" 
                                    style={{ height: '200px', padding: '1rem', border: '1px solid var(--border)', background: 'rgba(26,26,26,0.02)' }} 
                                />
                                <button 
                                    onClick={handleLinkedInImport} 
                                    disabled={!importText.trim()} 
                                    style={{ 
                                        padding: '1rem', 
                                        background: 'var(--foreground)', 
                                        color: 'var(--background)', 
                                        textTransform: 'uppercase', 
                                        letterSpacing: '0.1em', 
                                        fontSize: '0.85rem', 
                                        border: 'none', 
                                        cursor: 'pointer', 
                                        transition: 'all 0.3s', 
                                        display: 'flex', 
                                        justifyContent: 'center', 
                                        alignItems: 'center', 
                                        gap: '0.5rem' 
                                    }} 
                                    onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = 'var(--accent-editorial)'; }} 
                                    onMouseLeave={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = 'var(--foreground)'; }}
                                >
                                    Extract LinkedIn Profile
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
      )}

      {/* SHARE TEMPLATE OVERLAY */}
      {showShareModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(245,241,235,0.95)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '90%', maxWidth: '600px', padding: '4rem', background: 'var(--bg-editorial)', border: '1px solid var(--border)', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem', color: 'var(--foreground)', fontFamily: 'var(--font-serif)' }}>Share <span style={{ fontStyle: 'italic', color: 'var(--accent-editorial)' }}>Template</span></h2>
                    <X onClick={() => { setShowShareModal(false); setShareSuccess(false); setShareError(""); }} style={{ cursor: 'pointer', color: 'var(--foreground)' }} size={28} />
                </div>

                {shareSuccess ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 0', gap: '1.5rem', textAlign: 'center' }}>
                        <CheckCircle size={48} style={{ color: 'var(--accent-editorial)' }} />
                        <div>
                            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontStyle: 'italic', color: 'var(--foreground)', marginBottom: '0.5rem' }}>Template Published!</p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', letterSpacing: '0.05em', lineHeight: 1.5 }}>
                                Your design and content have been registered as a public template.<br />
                                Other members of the collective can now view and build upon it.
                            </p>
                        </div>
                        <button onClick={() => { setShowShareModal(false); setShareSuccess(false); }} style={{ marginTop: '1.5rem', padding: '0.75rem 2rem', background: 'var(--foreground)', color: 'var(--background)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem', border: 'none', cursor: 'pointer' }}>
                            Return to Editor
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {shareError && (
                            <div style={{ padding: '1rem', background: 'rgba(139,0,0,0.05)', borderLeft: '3px solid var(--destructive)', color: 'var(--destructive)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                                {shareError}
                            </div>
                        )}

                        <div>
                            {renderLabel("Template Name")}
                            <input value={shareName} onChange={(e) => setShareName(e.target.value)} placeholder="e.g. Minimalist Fintech Architect" className="input-premium" />
                        </div>

                        <div>
                            {renderLabel("Description & Context")}
                            <textarea value={shareDescription} onChange={(e) => setShareDescription(e.target.value)} placeholder="Explain the structural details, target roles, or aesthetic purpose..." className="input-premium" style={{ minHeight: '100px' }} />
                        </div>

                        <button onClick={handleShareTemplate} disabled={isSharing || !shareName.trim() || !shareDescription.trim()} style={{ width: '100%', marginTop: '1rem', padding: '1rem', background: 'var(--foreground)', color: 'var(--background)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', transition: 'all 0.3s' }} onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = 'var(--accent-editorial)'; }} onMouseLeave={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = 'var(--foreground)'; }}>
                            {isSharing ? <Loader2 size={18} className="animate-spin" /> : <><Globe size={18} /> Register as Public Template</>}
                        </button>
                    </div>
                )}
            </div>
        </div>
      )}

      {/* AI BULLET REWRITE MODAL */}
      {showRewriteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(245,241,235,0.95)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '90%', maxWidth: '750px', maxHeight: '90vh', padding: '4rem', background: 'var(--bg-editorial)', border: '1px solid var(--border)', overflowY: 'auto', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '2rem', color: 'var(--foreground)', fontFamily: 'var(--font-serif)', margin: 0 }}>AI Bullet <span style={{ fontStyle: 'italic', color: 'var(--accent-editorial)' }}>Optimizer</span></h2>
                    <X onClick={() => { setShowRewriteModal(false); setRewriteResult(null); }} style={{ cursor: 'pointer', color: 'var(--foreground)' }} size={28} />
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', lineHeight: 1.5 }}>
                    Formulate measurable, high-impact statements that immediately showcase your scale and scope. 
                    AI will inject strong action verbs and estimate impact metrics marked with ⚠ where necessary.
                </div>

                {isRewritingBullet ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 0', gap: '1.5rem' }}>
                        <Loader2 size={48} className="animate-spin" style={{ color: 'var(--accent-editorial)' }} />
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontStyle: 'italic', color: 'var(--foreground)', marginBottom: '0.5rem' }}>Architecting professional bullet statements...</p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', letterSpacing: '0.05em' }}>Polishing narrative, estimating functional scale, and injecting keywords.</p>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* INPUT FIELDS CARD */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                {renderLabel("Target Role / Title")}
                                <input 
                                    value={rewriteTargetRole} 
                                    onChange={(e) => setRewriteTargetRole(e.target.value)} 
                                    placeholder="e.g. Senior Systems Architect" 
                                    className="input-premium" 
                                />
                            </div>
                            <div>
                                {renderLabel("Target Industry")}
                                <input 
                                    value={rewriteTargetIndustry} 
                                    onChange={(e) => setRewriteTargetIndustry(e.target.value)} 
                                    placeholder="e.g. FinTech / Enterprise SaaS" 
                                    className="input-premium" 
                                />
                            </div>
                        </div>

                        <div>
                            {renderLabel("Keywords to Integrate (Comma Separated)")}
                            <input 
                                value={rewriteKeywords.join(", ")} 
                                onChange={(e) => setRewriteKeywords(e.target.value.split(',').map(s => s.trim()).filter(Boolean))} 
                                placeholder="e.g. Kubernetes, AWS, Scalability" 
                                className="input-premium" 
                            />
                        </div>

                        <button 
                            onClick={handleRewriteBullet} 
                            style={{ 
                                padding: '1rem', 
                                background: 'var(--foreground)', 
                                color: 'var(--background)', 
                                border: 'none', 
                                cursor: 'pointer', 
                                textTransform: 'uppercase', 
                                letterSpacing: '0.1em', 
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'background 0.3s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent-editorial)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--foreground)'}
                        >
                            <Sparkles size={16} /> Generate AI Variations
                        </button>

                        {/* REWRITE RESULTS DISPLAY */}
                        {rewriteResult && (
                            <div className="animate-fade-in" style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                
                                {rewriteResult.changes_made && rewriteResult.changes_made.length > 0 && (
                                    <div style={{ background: 'rgba(26,26,26,0.01)', border: '1px solid var(--border)', padding: '1.25rem' }}>
                                        {renderLabel("Strategic Enhancements Made")}
                                        <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.8rem', color: 'var(--foreground)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                            {rewriteResult.changes_made.map((change: string, idx: number) => (
                                                <li key={idx}>{change}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div>
                                    {renderLabel("Choose Optimization Variant")}
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {/* Option 1: Primary (Quantified Impact) */}
                                        <div 
                                            onClick={() => setSelectedRewriteVersion("primary")}
                                            style={{ 
                                                padding: '1.5rem', 
                                                border: selectedRewriteVersion === 'primary' ? '1.5px solid var(--accent-editorial)' : '1px solid var(--border)', 
                                                background: selectedRewriteVersion === 'primary' ? 'var(--bg-surface)' : 'transparent',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--accent-editorial)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Variant A: Quantified Impact</span>
                                                <input type="radio" checked={selectedRewriteVersion === 'primary'} readOnly style={{ accentColor: 'var(--accent-editorial)' }} />
                                            </div>
                                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--foreground)', lineHeight: 1.6 }}>
                                                {rewriteResult.rewritten_bullet || rewriteResult.primary}
                                            </p>
                                        </div>

                                        {/* Option 2: Alternative 1 (Technical Focus) */}
                                        {(rewriteResult.alternative_versions?.[0] || rewriteResult.alternatives?.[0]) && (
                                            <div 
                                                onClick={() => setSelectedRewriteVersion("alt1")}
                                                style={{ 
                                                    padding: '1.5rem', 
                                                    border: selectedRewriteVersion === 'alt1' ? '1.5px solid var(--accent-editorial)' : '1px solid var(--border)', 
                                                    background: selectedRewriteVersion === 'alt1' ? 'var(--bg-surface)' : 'transparent',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--accent-editorial)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Variant B: Technical Architecture</span>
                                                    <input type="radio" checked={selectedRewriteVersion === 'alt1'} readOnly style={{ accentColor: 'var(--accent-editorial)' }} />
                                                </div>
                                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--foreground)', lineHeight: 1.6 }}>
                                                    {rewriteResult.alternative_versions?.[0] || rewriteResult.alternatives?.[0]}
                                                </p>
                                            </div>
                                        )}

                                        {/* Option 3: Alternative 2 (Leadership & Scale) */}
                                        {(rewriteResult.alternative_versions?.[1] || rewriteResult.alternatives?.[1]) && (
                                            <div 
                                                onClick={() => setSelectedRewriteVersion("alt2")}
                                                style={{ 
                                                    padding: '1.5rem', 
                                                    border: selectedRewriteVersion === 'alt2' ? '1.5px solid var(--accent-editorial)' : '1px solid var(--border)', 
                                                    background: selectedRewriteVersion === 'alt2' ? 'var(--bg-surface)' : 'transparent',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--accent-editorial)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Variant C: Leadership & Scale</span>
                                                    <input type="radio" checked={selectedRewriteVersion === 'alt2'} readOnly style={{ accentColor: 'var(--accent-editorial)' }} />
                                                </div>
                                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--foreground)', lineHeight: 1.6 }}>
                                                    {rewriteResult.alternative_versions?.[1] || rewriteResult.alternatives?.[1]}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button 
                                        onClick={handleApplyRewrittenBullet}
                                        style={{ 
                                            flex: 1, 
                                            padding: '1rem', 
                                            background: 'var(--foreground)', 
                                            color: 'var(--background)', 
                                            border: 'none', 
                                            cursor: 'pointer', 
                                            textTransform: 'uppercase', 
                                            letterSpacing: '0.1em', 
                                            fontSize: '0.8rem',
                                            fontWeight: 600,
                                            textAlign: 'center'
                                        }}
                                    >
                                        Apply Selected to Editor
                                    </button>
                                    <button 
                                        onClick={() => {
                                            const text = selectedRewriteVersion === 'primary' 
                                                ? (rewriteResult.rewritten_bullet || rewriteResult.primary)
                                                : selectedRewriteVersion === 'alt1' 
                                                    ? (rewriteResult.alternative_versions?.[0] || rewriteResult.alternatives?.[0])
                                                    : (rewriteResult.alternative_versions?.[1] || rewriteResult.alternatives?.[1]);
                                            handleCopyToClipboard(text, "bullet_rewrite");
                                        }}
                                        style={{ 
                                            padding: '1rem 2rem', 
                                            background: 'transparent', 
                                            border: '1px solid var(--border)', 
                                            color: 'var(--foreground)', 
                                            cursor: 'pointer', 
                                            textTransform: 'uppercase', 
                                            letterSpacing: '0.1em', 
                                            fontSize: '0.8rem',
                                            fontWeight: 600,
                                            textAlign: 'center'
                                        }}
                                    >
                                        {copiedSection === "bullet_rewrite" ? "Copied!" : "Copy Text"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
      )}

    </main>
  );
}
