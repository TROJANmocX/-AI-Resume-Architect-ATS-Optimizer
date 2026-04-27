"use client";

import React from 'react';

interface ResumePreviewProps {
  data: any;
}

export default function ResumePreview({ data }: ResumePreviewProps) {
  const sections = [
    { title: 'Education', key: 'academics', fields: ['school', 'degree', 'year'] },
    { title: 'Work', key: 'experience', fields: ['title', 'company', 'date'] },
    { title: 'Projects', key: 'projects', fields: ['name', 'description'] },
    { title: 'Awards', key: 'awards', fields: ['name', 'giver'] },
    { title: 'Certs', key: 'certifications', fields: ['name'] },
    { title: 'Pubs', key: 'publications', fields: ['title', 'journal'] },
    { title: 'Patents', key: 'patents', fields: ['title'] },
    { title: 'Volunteering', key: 'volunteering', fields: ['role', 'org'] }
  ];

  return (
    <div className="preview-container" style={{
      width: '100%',
      minHeight: '100%',
      background: 'white',
      color: '#111',
      padding: '40px',
      fontSize: '10px',
      lineHeight: '1.4',
      boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
      fontFamily: 'serif',
      transform: 'scale(1)',
      transformOrigin: 'top center'
    }}>
      <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '15px' }}>
        <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{data.basic?.name || 'NAME'}</h1>
        <div style={{ fontSize: '9px', marginTop: '4px', color: '#555' }}>
          {data.basic?.email} | {data.basic?.phone} | {data.basic?.location}
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <div style={{ fontWeight: 'bold', borderBottom: '1px solid #ddd', marginBottom: '4px', fontSize: '9px', textTransform: 'uppercase' }}>Summary</div>
        <p style={{ margin: 0 }}>{data.basic?.summary || 'Professional summary goes here...'}</p>
      </div>

      {sections.map(s => {
        const items = data[s.key];
        if (!items || items.length === 0) return null;
        return (
          <div key={s.key} style={{ marginBottom: '15px' }}>
            <div style={{ fontWeight: 'bold', borderBottom: '1px solid #ddd', marginBottom: '6px', fontSize: '9px', textTransform: 'uppercase' }}>{s.title}</div>
            {items.map((item: any, i: number) => (
              <div key={i} style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <span>{item[s.fields[0]]} {item[s.fields[1]] ? `@ ${item[s.fields[1]]}` : ''}</span>
                  <span>{item[s.fields[2]]}</span>
                </div>
                {item.description && <p style={{ margin: '2px 0' }}>{item.description}</p>}
                {item.bullets && (
                  <ul style={{ paddingLeft: '15px', margin: '2px 0' }}>
                    {item.bullets.map((b: string, j: number) => <li key={j}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        );
      })}

      <div>
        <div style={{ fontWeight: 'bold', borderBottom: '1px solid #ddd', marginBottom: '6px', fontSize: '9px', textTransform: 'uppercase' }}>Skills & Languages</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {(data.skills || []).map((s: string) => <span key={s} style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '3px' }}>{s}</span>)}
          {(data.languages || []).map((l: string) => <span key={l} style={{ background: '#ebf5ff', padding: '2px 6px', borderRadius: '3px' }}>{l}</span>)}
        </div>
      </div>
    </div>
  );
}
