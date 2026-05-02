import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Standard ATS-Friendly Layout (Single Column, High Contrast)
    await page.setContent(`
      <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
            body { 
              font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif; 
              padding: 50px; 
              color: #000; 
              line-height: 1.5; 
              font-size: 11pt; 
              background: #fff;
            }
            .header { text-align: center; margin-bottom: 25px; }
            h1 { margin: 0 0 5px 0; font-size: 20pt; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
            .contact { font-size: 10pt; color: #333; }
            .section { margin-top: 20px; }
            .section-title { 
              font-weight: bold; 
              border-bottom: 1px solid #000; 
              text-transform: uppercase; 
              margin-bottom: 8px; 
              font-size: 11pt; 
              letter-spacing: 0.5px;
            }
            .item { margin-bottom: 12px; page-break-inside: avoid; }
            .item-header { display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 2px; }
            .item-sub { font-style: italic; display: flex; justify-content: space-between; color: #444; margin-bottom: 4px; }
            ul { padding-left: 20px; margin: 4px 0; }
            li { margin-bottom: 3px; }
            .skills-box { font-size: 10pt; margin-top: 5px; }
            .skill-label { font-weight: bold; }
            p { margin: 4px 0; font-size: 10.5pt; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${data.basic?.name || 'NAME'}</h1>
            <div class="contact">
                ${data.basic?.location} | ${data.basic?.phone} | ${data.basic?.email}
            </div>
            ${data.social?.length ? `<div class="contact">${data.social.map((s:any) => s.url).join(' | ')}</div>` : ''}
          </div>

          <div class="section">
            <div class="section-title">Professional Summary</div>
            <p>${data.basic?.summary || ''}</p>
          </div>

          ${data.experience?.length ? `
            <div class="section">
                <div class="section-title">Experience</div>
                ${data.experience.map((exp: any) => `
                    <div class="item">
                        <div class="item-header">
                            <span>${exp.company}</span>
                            <span>${exp.date}</span>
                        </div>
                        <div class="item-sub">
                            <span>${exp.title}</span>
                        </div>
                        <ul>
                            ${exp.bullets?.map((b: string) => `<li>${b}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
          ` : ''}

          ${data.academics?.length ? `
            <div class="section">
                <div class="section-title">Education</div>
                ${data.academics.map((edu: any) => `
                    <div class="item">
                        <div class="item-header">
                            <span>${edu.school}</span>
                            <span>${edu.year}</span>
                        </div>
                        <div class="item-sub">
                            <span>${edu.degree}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
          ` : ''}

          ${data.projects?.length ? `
            <div class="section">
                <div class="section-title">Notable Projects</div>
                ${data.projects.map((proj: any) => `
                    <div class="item">
                        <div class="item-header">
                            <span>${proj.name}</span>
                        </div>
                        <p>${proj.description || ''}</p>
                        ${proj.bullets ? `<ul>${proj.bullets.map((b:string) => `<li>${b}</li>`).join('')}</ul>` : ''}
                    </div>
                `).join('')}
            </div>
          ` : ''}

          ${data.skills?.length || data.languages?.length ? `
            <div class="section">
                <div class="section-title">Technical Skills & Languages</div>
                <div class="skills-box">
                    ${data.skills?.length ? `<div><span class="skill-label">Skills:</span> ${data.skills.map((s:any) => s.name || s).join(', ')}</div>` : ''}
                    ${data.languages?.length ? `<div><span class="skill-label">Languages:</span> ${data.languages.map((s:any) => s.name || s).join(', ')}</div>` : ''}
                </div>
            </div>
          ` : ''}

          ${data.certifications?.length ? `
            <div class="section">
                <div class="section-title">Certifications</div>
                <p>${data.certifications.map((c:any) => c.name).join(', ')}</p>
            </div>
          ` : ''}

          ${data.awards?.length ? `
            <div class="section">
                <div class="section-title">Honors & Awards</div>
                <ul>
                    ${data.awards.map((a:any) => `<li>${a.name} (${a.giver})</li>`).join('')}
                </ul>
            </div>
          ` : ''}
        </body>
      </html>
    `);

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0.4in', right: '0.4in', bottom: '0.4in', left: '0.4in' }
    });

    await browser.close();

    return new Response(pdf as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=ATS_Optimized_Resume.pdf'
      }
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
