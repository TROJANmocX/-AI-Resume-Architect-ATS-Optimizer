import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Launch browser
    const browser = await puppeteer.launch({
      headless: true
    });
    
    const page = await browser.newPage();

    // Set content - In a real app, this would be a full HTML template
    // For this demo, we'll generate a simple professional resume layout
    await page.setContent(`
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; line-height: 1.5; }
            .header { text-align: center; border-bottom: 2px solid #0072FF; padding-bottom: 20px; margin-bottom: 20px; }
            h1 { margin: 0; color: #000; font-size: 24px; }
            .contact { font-size: 12px; color: #666; margin-top: 5px; }
            .section { margin-bottom: 20px; }
            .section-title { font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #eee; margin-bottom: 10px; color: #0072FF; }
            .experience-item { margin-bottom: 15px; }
            .job-title { font-weight: bold; }
            .company { font-style: italic; color: #444; }
            .date { float: right; font-size: 12px; color: #777; }
            ul { padding-left: 20px; margin-top: 5px; }
            li { margin-bottom: 3px; font-size: 13px; }
            .skills { display: flex; flex-wrap: wrap; gap: 10px; }
            .skill-tag { background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-size: 11px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${data.name || 'John Doe'}</h1>
            <div class="contact">${data.email || 'john@example.com'} | ${data.phone || '555-0123'}</div>
            <div class="contact">${data.linkedin || ''}</div>
          </div>

          <div class="section">
            <div class="section-title">Professional Summary</div>
            <p style="font-size: 13px;">${data.summary || 'Results-driven professional with experience in...'}</p>
          </div>

          <div class="section">
            <div class="section-title">Experience</div>
            ${data.experience?.map((exp: any) => `
              <div class="experience-item">
                <span class="date">${exp.date || ''}</span>
                <div class="job-title">${exp.title || ''}</div>
                <div class="company">${exp.company || ''}</div>
                <ul>
                  ${exp.bullets?.map((bullet: string) => `<li>${bullet}</li>`).join('')}
                </ul>
              </div>
            `).join('') || ''}
          </div>

          <div class="section">
            <div class="section-title">Skills</div>
            <div class="skills">
              ${data.skills?.map((skill: string) => `<span class="skill-tag">${skill}</span>`).join('') || ''}
            </div>
          </div>
        </body>
      </html>
    `);

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' }
    });

    await browser.close();

    return new Response(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=resume.pdf'
      }
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
