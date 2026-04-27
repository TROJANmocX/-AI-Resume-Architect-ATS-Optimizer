"use client";

import React from 'react';

interface ResumePreviewProps {
  data: any;
}

export default function ResumePreview({ data }: ResumePreviewProps) {
  return (
    <div className="preview-container" style={{
      width: '100%',
      minHeight: '100%',
      background: 'white',
      color: '#000',
      padding: '40px',
      fontSize: '11px',
      lineHeight: '1.5',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      overflowY: 'auto'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: '0 0 5px 0', fontSize: '20px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {data.basic?.name || 'YOUR NAME'}
        </h1>
        <div style={{ fontSize: '10px', color: '#333' }}>
          {data.basic?.location} | {data.basic?.phone} | {data.basic?.email}
        </div>
        {data.social?.length > 0 && (
          <div style={{ fontSize: '10px', color: '#333', marginTop: '2px' }}>
            {data.social.map((s:any) => s.url).join(' | ')}
          </div>
        )}
      </div>

      {/* Summary */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{ fontWeight: 'bold', borderBottom: '1.5px solid #000', textTransform: 'uppercase', marginBottom: '6px', fontSize: '11px' }}>
          Professional Summary
        </div>
        <p style={{ margin: 0, fontSize: '10.5px' }}>{data.basic?.summary || 'Craft a compelling summary...'}</p>
      </div>

      {/* Experience */}
      {data.experience?.length > 0 && (
        <div style={{ marginBottom: '15px' }}>
          <div style={{ fontWeight: 'bold', borderBottom: '1.5px solid #000', textTransform: 'uppercase', marginBottom: '8px', fontSize: '11px' }}>
            Professional Experience
          </div>
          {data.experience.map((exp: any, i: number) => (
            <div key={i} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '11px' }}>
                <span>{exp.company}</span>
                <span>{exp.date}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontStyle: 'italic', fontSize: '10.5px', color: '#333', marginBottom: '3px' }}>
                <span>{exp.title}</span>
              </div>
              <ul style={{ paddingLeft: '18px', margin: '4px 0' }}>
                {exp.bullets?.map((b: string, j: number) => (
                  <li key={j} style={{ fontSize: '10.5px', marginBottom: '2px' }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.academics?.length > 0 && (
        <div style={{ marginBottom: '15px' }}>
          <div style={{ fontWeight: 'bold', borderBottom: '1.5px solid #000', textTransform: 'uppercase', marginBottom: '6px', fontSize: '11px' }}>
            Education
          </div>
          {data.academics.map((edu: any, i: number) => (
            <div key={i} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '11px' }}>
                <span>{edu.school}</span>
                <span>{edu.year}</span>
              </div>
              <div style={{ fontStyle: 'italic', fontSize: '10.5px' }}>{edu.degree}</div>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {data.projects?.length > 0 && (
        <div style={{ marginBottom: '15px' }}>
          <div style={{ fontWeight: 'bold', borderBottom: '1.5px solid #000', textTransform: 'uppercase', marginBottom: '6px', fontSize: '11px' }}>
            Projects
          </div>
          {data.projects.map((proj: any, i: number) => (
            <div key={i} style={{ marginBottom: '8px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '11px' }}>{proj.name}</div>
              <p style={{ margin: '2px 0', fontSize: '10.5px' }}>{proj.description}</p>
              {proj.bullets?.length > 0 && (
                <ul style={{ paddingLeft: '18px', margin: '2px 0' }}>
                  {proj.bullets.map((b: string, j: number) => (
                    <li key={j} style={{ fontSize: '10.5px', marginBottom: '1px' }}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {(data.skills?.length > 0 || data.languages?.length > 0) && (
        <div style={{ marginBottom: '15px' }}>
          <div style={{ fontWeight: 'bold', borderBottom: '1.5px solid #000', textTransform: 'uppercase', marginBottom: '6px', fontSize: '11px' }}>
            Technical Skills & Languages
          </div>
          <div style={{ fontSize: '10.5px' }}>
            {data.skills?.length > 0 && (
              <div style={{ marginBottom: '3px' }}>
                <span style={{ fontWeight: 'bold' }}>Skills:</span> {data.skills.join(', ')}
              </div>
            )}
            {data.languages?.length > 0 && (
              <div>
                <span style={{ fontWeight: 'bold' }}>Languages:</span> {data.languages.join(', ')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
