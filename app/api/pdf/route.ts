import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const sections = [
        { title: 'Education', key: 'academics', fields: ['school', 'degree', 'year'] },
        { title: 'Work Experience', key: 'experience', fields: ['title', 'company', 'date'] },
        { title: 'Projects', key: 'projects', fields: ['name', 'description'] },
        { title: 'Awards', key: 'awards', fields: ['name', 'giver'] },
        { title: 'Certifications', key: 'certifications', fields: ['name'] },
        { title: 'Publications', key: 'publications', fields: ['title', 'journal'] },
        { title: 'Patents', key: 'patents', fields: ['title'] },
        { title: 'Volunteering', key: 'volunteering', fields: ['role', 'org'] },
        { title: 'Competitions', key: 'competitions', fields: ['name', 'rank'] },
        { title: 'Workshops & Events', key: 'events', fields: ['name', 'role'] },
        { title: 'Scholarships', key: 'scholarships', fields: ['name'] }
    ];

    await page.setContent(`
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica', sans-serif; padding: 30px; color: #111; line-height: 1.4; font-size: 11px; }
            .header { text-align: center; margin-bottom: 15px; border-bottom: 2px solid #000; padding-bottom: 10px; }
            h1 { margin: 0; font-size: 20px; text-transform: uppercase; }
            .contact { font-size: 10px; margin-top: 3px; color: #444; }
            .section { margin-top: 15px; }
            .section-title { font-weight: bold; border-bottom: 1px solid #444; text-transform: uppercase; margin-bottom: 5px; font-size: 10px; }
            .item { margin-bottom: 8px; }
            .item-header { font-weight: bold; display: flex; justify-content: space-between; }
            ul { padding-left: 15px; margin: 3px 0; }
            .skills-list { display: flex; flex-wrap: wrap; gap: 5px; }
            .skill { background: #f0f0f0; padding: 2px 6px; border-radius: 3px; font-size: 9px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${data.basic?.name || 'John Doe'}</h1>
            <div class="contact">
                ${data.basic?.email} | ${data.basic?.phone} | ${data.basic?.location}
            </div>
          </div>

          <div class="section">
            <div class="section-title">Summary</div>
            <p>${data.basic?.summary || ''}</p>
          </div>

          ${sections.map(s => {
            const items = data[s.key];
            if (!items || items.length === 0) return '';
            return `
                <div class="section">
                    <div class="section-title">${s.title}</div>
                    ${items.map((item: any) => `
                        <div class="item">
                            <div class="item-header">
                                <span>${item[s.fields[0]] || ''}${s.fields[1] ? ` @ ${item[s.fields[1]]}` : ''}</span>
                                <span>${item[s.fields[2]] || ''}</span>
                            </div>
                            ${item.description ? `<p>${item.description}</p>` : ''}
                            ${item.bullets ? `<ul>${item.bullets.map((b: string) => `<li>${b}</li>`).join('')}</ul>` : ''}
                        </div>
                    `).join('')}
                </div>
            `;
          }).join('')}

          <div class="section">
            <div class="section-title">Skills & Languages</div>
            <div class="skills-list">
              ${(data.skills || []).map((s: string) => `<span class="skill">${s}</span>`).join('')}
              ${(data.languages || []).map((l: string) => `<span class="skill" style="background:#eefbff;">${l}</span>`).join('')}
            </div>
          </div>
        </body>
      </html>
    `);

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0.4in', right: '0.4in', bottom: '0.4in', left: '0.4in' }
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
