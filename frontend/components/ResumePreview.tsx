/**
 * Resume Preview Component
 * Responsible for rendering the resume data into various ATS-friendly templates.
 * Supports multiple layouts (Classic, Modern Executive, Two-Column) with high-fidelity styling.
 */
"use client";

import React from 'react';

export default function ResumePreview({ data, templateId = 0 }: { data: any, templateId?: number }) {
  const buildContactLine = () => {
    return [data?.basic?.email, data?.basic?.phone, data?.basic?.location, data?.basic?.linkedin].filter(Boolean).join(' | ');
  };

  const buildSkillsLine = () => {
    const tech = data?.skills?.filter((s:any) => s.name && s.name.trim() !== '').map((s:any) => s.name.trim()).join(', ');
    const lang = data?.languages?.filter((s:any) => s.name && s.name.trim() !== '').map((s:any) => s.name.trim()).join(', ');
    return [tech, lang].filter(Boolean).join(' • ');
  };

  const buildSkillPills = () => {
    const all = [
      ...(data?.skills?.map((s:any) => s.name) || []),
      ...(data?.languages?.map((s:any) => s.name) || [])
    ].filter(s => s && s.trim() !== '');
    return all.map((s, idx) => (
      <span key={idx} className="skill-pill">
        {s}
      </span>
    ));
  };

  const ClassicPro = () => (
    <div className="resume resume-t1">
      <div className="rh rs">
        <h1>{data?.basic?.name || 'Your Name'}</h1>
        <div className="contact">
          {data?.experience?.[0]?.title || 'Job Title'} &nbsp;|&nbsp; {buildContactLine()}
        </div>
      </div>
      <div className="rs">
        {data?.basic?.summary && (
            <>
                <h2>Professional Summary</h2>
                <p>{data.basic.summary}</p>
            </>
        )}
        
        {data?.experience?.length > 0 && <h2>Experience</h2>}
        {data?.experience?.map((e: any, idx: number) => (
          <div key={idx} style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span className="entry-title-r">
                {e.title}
                {e.company ? ', ' + e.company : ''}
              </span>
              <span className="entry-sub">{e.date}</span>
            </div>
            <ul>
              {e.bullets?.map((b: string, i: number) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        ))}

        {data?.academics?.length > 0 && <h2>Education</h2>}
        {data?.academics?.map((e: any, idx: number) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
            <div>
              <span className="entry-title-r">{e.degree || e.detail}</span>
              <br />
              <span className="entry-sub">
                {e.school || e.name}
              </span>
            </div>
            <span className="entry-sub">{e.year || e.date}</span>
          </div>
        ))}

        {(data?.skills?.length > 0 || data?.languages?.length > 0) && buildSkillsLine() && <h2>Skills</h2>}
        <p>{buildSkillsLine()}</p>
        
        {data?.projects?.length > 0 && <h2>Projects</h2>}
        {data?.projects?.map((p: any, idx: number) => (
          <div key={idx} style={{ marginBottom: '10px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span className="entry-title-r">{p.name}</span>
                <span className="entry-sub">{p.date}</span>
             </div>
             <div className="entry-sub">{p.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const ModernExecutive = () => (
    <div className="resume resume-t2">
      <div className="rh">
        <h1>{data?.basic?.name || 'Your Name'}</h1>
        <div className="contact">
          {data?.experience?.[0]?.title || 'Job Title'} &nbsp;&middot;&nbsp; {buildContactLine()}
        </div>
      </div>
      <div className="rs">
        {data?.basic?.summary && (
            <>
                <h2>Summary</h2>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px' }}>{data.basic.summary}</p>
            </>
        )}
        
        {data?.experience?.length > 0 && <h2>Experience</h2>}
        {data?.experience?.map((e: any, idx: number) => (
          <div key={idx} style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span className="entry-title-r">
                {e.title}
                {e.company ? ', ' + e.company : ''}
              </span>
              <span className="entry-sub">{e.date}</span>
            </div>
            <ul>
              {e.bullets?.map((b: string, i: number) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
        
        {data?.academics?.length > 0 && <h2>Education</h2>}
        {data?.academics?.map((e: any, idx: number) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
            <div>
              <span className="entry-title-r">{e.degree || e.detail}</span>
              <br />
              <span className="entry-sub">
                {e.school || e.name}
              </span>
            </div>
            <span className="entry-sub">{e.year || e.date}</span>
          </div>
        ))}
        
        {(data?.skills?.length > 0 || data?.languages?.length > 0) && buildSkillsLine() && <h2>Core Skills</h2>}
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px' }}>{buildSkillsLine()}</p>
        
        {data?.projects?.length > 0 && <h2>Projects</h2>}
        {data?.projects?.map((p: any, idx: number) => (
          <div key={idx} style={{ marginBottom: '10px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span className="entry-title-r">{p.name}</span>
                <span className="entry-sub">{p.date}</span>
             </div>
             <div className="entry-sub" style={{ fontFamily: 'var(--font-sans)' }}>{p.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const EditorialPremium = () => (
    <div className="resume resume-t4">
      <div className="rh">
        <h1>{data?.basic?.name || 'Your Name'}</h1>
        <div className="contact">
          {buildContactLine()}
        </div>
      </div>
      <div className="rs">
        {data?.basic?.summary && (
            <>
                <div className="section-title">
                  <h2>Professional Summary</h2>
                  <div className="title-line"></div>
                </div>
                <p className="summary-text">{data.basic.summary}</p>
            </>
        )}
        
        {data?.experience?.length > 0 && (
          <div className="section-title">
            <h2>Experience</h2>
            <div className="title-line"></div>
          </div>
        )}
        {data?.experience?.map((e: any, idx: number) => (
          <div key={idx} className="entry">
            <div className="entry-header">
              <span className="entry-title">
                {e.title}
                {e.company ? <span className="company-name"> | {e.company}</span> : ''}
              </span>
              <span className="entry-date">{e.date}</span>
            </div>
            {e.location && <div className="entry-location">{e.location}</div>}
            <ul>
              {e.bullets?.map((b: string, i: number) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        ))}

        {data?.academics?.length > 0 && (
          <div className="section-title">
            <h2>Education</h2>
            <div className="title-line"></div>
          </div>
        )}
        {data?.academics?.map((e: any, idx: number) => (
          <div key={idx} className="entry education-entry">
            <div className="entry-header">
              <span className="entry-title">{e.school || e.name}</span>
              <span className="entry-date">{e.year || e.date}</span>
            </div>
            <div className="degree-info">
              {e.degree || e.detail} {e.gpa ? ` | GPA: ${e.gpa}` : ''}
            </div>
          </div>
        ))}

        {(data?.skills?.length > 0 || data?.languages?.length > 0) && buildSkillsLine() && (
          <div className="section-title">
            <h2>Core Competencies</h2>
            <div className="title-line"></div>
          </div>
        )}
        <p className="skills-text">{buildSkillsLine()}</p>
        
        {data?.projects?.length > 0 && (
          <div className="section-title">
            <h2>Selected Projects</h2>
            <div className="title-line"></div>
          </div>
        )}
        {data?.projects?.map((p: any, idx: number) => (
          <div key={idx} className="entry">
             <div className="entry-header">
                <span className="entry-title">{p.name}</span>
                <span className="entry-date">{p.date}</span>
             </div>
             <div className="project-detail">{p.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const TwoColumnClean = () => (
    <div className="resume resume-t3">
      <div className="r-left">
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.2 }}>{data?.basic?.name || 'Your Name'}</div>
          <div style={{ fontSize: '11px', color: '#555', marginTop: '3px' }}>{data?.experience?.[0]?.title || 'Job Title'}</div>
        </div>
        <div className="sl-h">Contact</div>
        <div style={{ fontSize: '10px', color: '#555', lineHeight: 1.8 }}>
          {data?.basic?.email && <div>{data.basic.email}</div>}
          {data?.basic?.phone && <div>{data.basic.phone}</div>}
          {data?.basic?.location && <div>{data.basic.location}</div>}
          {data?.social?.[0]?.detail && <div>{data.social[0].detail}</div>}
        </div>
        {(data?.skills?.length > 0 || data?.languages?.length > 0) && buildSkillPills().length > 0 && (
            <>
                <div className="sl-h">Skills</div>
                <div>{buildSkillPills()}</div>
            </>
        )}
        {data?.basic?.summary && (
            <>
                <div className="sl-h">Summary</div>
                <div style={{ fontSize: '10px', color: '#444', lineHeight: 1.6 }}>{data.basic.summary}</div>
            </>
        )}
      </div>
      <div className="r-right">
        <div className="rs">
          {data?.experience?.length > 0 && <h2>Experience</h2>}
          {data?.experience?.map((e: any, idx: number) => (
            <div key={idx} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span className="entry-title-r">
                  {e.title}
                  {e.company ? ', ' + e.company : ''}
                </span>
                <span className="entry-sub">{e.date}</span>
              </div>
              <ul>
                {e.bullets?.map((b: string, i: number) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
          
          {data?.academics?.length > 0 && <h2>Education</h2>}
          {data?.academics?.map((e: any, idx: number) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
              <div>
                <span className="entry-title-r">{e.degree || e.detail}</span>
                <br />
                <span className="entry-sub">
                  {e.school || e.name}
                </span>
              </div>
              <span className="entry-sub">{e.year || e.date}</span>
            </div>
          ))}
          
          {data?.projects?.length > 0 && <h2>Projects</h2>}
          {data?.projects?.map((p: any, idx: number) => (
            <div key={idx} style={{ marginBottom: '10px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span className="entry-title-r">{p.name}</span>
                  <span className="entry-sub">{p.date}</span>
               </div>
               <div className="entry-sub" style={{ fontFamily: 'var(--font-sans)' }}>{p.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .resume { font-family: 'Georgia', serif; font-size: 12px; line-height: 1.5; color: #111; word-wrap: break-word; overflow-wrap: break-word; }
        .resume-t1 .rh { border-bottom: 2px solid #111; padding-bottom: 8px; margin-bottom: 12px; }
        .resume-t1 .rh h1 { font-size: 22px; font-weight: 700; letter-spacing: -0.5px; margin: 0; }
        .resume-t1 .rh .contact { font-size: 11px; margin-top: 4px; color: #444; }
        .resume-t1 .rs h2 { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #bbb; padding-bottom: 2px; margin: 14px 0 6px; }
        .resume-t1 .rs .entry-title-r { font-weight: 700; }
        .resume-t1 .rs .entry-sub { color: #555; font-size: 11px; }
        .resume-t1 .rs ul { padding-left: 14px; margin-top: 4px; }
        .resume-t1 .rs ul li { margin-bottom: 2px; }

        .resume-t2 { }
        .resume-t2 .rh { background: #1a2e3d; color: #fff; padding: 20px 24px; margin: -56px -64px 20px; }
        .resume-t2 .rh h1 { font-size: 20px; font-weight: 700; font-family: var(--font-sans); margin: 0; color: #fff !important; }
        .resume-t2 .rh .contact { font-size: 11px; margin-top: 4px; color: #9bb5c8; }
        .resume-t2 .rs h2 { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #1a2e3d; border-left: 3px solid #1a2e3d; padding-left: 8px; margin: 14px 0 6px; }
        .resume-t2 .rs .entry-title-r { font-weight: 700; font-family: var(--font-sans); font-size: 12px; }
        .resume-t2 .rs .entry-sub { color: #555; font-size: 11px; font-family: var(--font-sans); }
        .resume-t2 .rs ul { padding-left: 14px; margin-top: 4px; font-family: var(--font-sans); }
        .resume-t2 .rs ul li { margin-bottom: 2px; }

        .resume-t3 { display: grid; grid-template-columns: 200px minmax(0, 1fr); gap: 0; min-height: 100%; }
        .resume-t3 .r-left { background: #f5f5f3; padding: 20px 16px; font-family: var(--font-sans); }
        .resume-t3 .r-right { padding: 20px 24px; }
        .resume-t3 .rh { margin-bottom: 16px; }
        .resume-t3 .rh h1 { font-size: 18px; font-weight: 700; font-family: var(--font-sans); line-height: 1.2; margin: 0; }
        .resume-t3 .rh .contact { font-size: 10px; margin-top: 6px; color: #555; line-height: 1.7; }
        .resume-t3 .sl-h { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #555; margin: 16px 0 8px; }
        .resume-t3 .skill-pill { display: inline-block; background: #e8e8e5; padding: 3px 8px; border-radius: 4px; font-size: 10px; margin: 2px 4px 4px 0; }
        .resume-t3 .rs h2 { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin: 12px 0 8px; color: #333; font-family: var(--font-sans); }
        .resume-t3 .rs .entry-title-r { font-weight: 700; font-family: var(--font-sans); font-size: 12px; }
        .resume-t3 .rs .entry-sub { color: #555; font-size: 10px; font-family: var(--font-sans); }
        .resume-t3 .rs ul { padding-left: 14px; margin-top: 4px; font-family: var(--font-sans); font-size: 11px; }
        .resume-t3 .rs ul li { margin-bottom: 3px; }

        .resume-t4 { font-family: 'Garamond', 'Georgia', serif; color: #2A2A2A; padding: 0 10px; }
        .resume-t4 .rh { text-align: center; margin-bottom: 24px; padding-bottom: 0; border: none; }
        .resume-t4 .rh h1 { font-size: 28px; font-weight: 400; text-transform: uppercase; letter-spacing: 4px; color: #1a1a1a; margin-bottom: 8px; }
        .resume-t4 .rh .contact { font-size: 11px; color: #555; letter-spacing: 1px; font-family: var(--font-sans); text-transform: uppercase; }
        .resume-t4 .rs .section-title { display: flex; align-items: center; gap: 12px; margin: 20px 0 12px; }
        .resume-t4 .rs h2 { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #8C7345; margin: 0; white-space: nowrap; }
        .resume-t4 .rs .title-line { flex-grow: 1; height: 1px; background: #e0dcd3; }
        .resume-t4 .rs .summary-text { font-size: 12px; line-height: 1.6; color: #333; text-align: justify; margin-bottom: 16px; }
        .resume-t4 .rs .entry { margin-bottom: 14px; }
        .resume-t4 .rs .entry-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px; }
        .resume-t4 .rs .entry-title { font-size: 13px; font-weight: 600; color: #1a1a1a; }
        .resume-t4 .rs .company-name { font-weight: 400; font-style: italic; color: #444; }
        .resume-t4 .rs .entry-date { font-size: 11px; font-family: var(--font-sans); color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
        .resume-t4 .rs .entry-location { font-size: 11px; font-style: italic; color: #666; margin-bottom: 4px; }
        .resume-t4 .rs ul { padding-left: 18px; margin-top: 6px; }
        .resume-t4 .rs ul li { margin-bottom: 4px; line-height: 1.5; font-size: 12px; color: #333; }
        .resume-t4 .rs .education-entry { margin-bottom: 10px; }
        .resume-t4 .rs .degree-info { font-size: 12px; color: #444; font-style: italic; }
        .resume-t4 .rs .skills-text { font-size: 12px; line-height: 1.6; color: #333; }
        .resume-t4 .rs .project-detail { font-size: 12px; line-height: 1.5; color: #333; margin-top: 4px; }
      `}} />
      {/* A4 at 96dpi = 794 × 1123 px. Margins: 18mm ≈ 68px top/bottom, 20mm ≈ 76px left/right */}
      <div style={{
        background: 'white',
        color: 'black',
        width: '794px',
        minHeight: '1123px',
        boxSizing: 'border-box',
        padding: templateId === 2 ? 0 : '56px 64px',
        position: 'relative',
      }}>
        {templateId === 0 && <ClassicPro />}
        {templateId === 1 && <ModernExecutive />}
        {templateId === 2 && <TwoColumnClean />}
        {templateId === 3 && <EditorialPremium />}
      </div>
    </>
  );
}
