import {readFile, writeFile, copyFile} from 'node:fs/promises';
import {naturalCopy, naturalDateRanges} from './source/portfolio-copy.mjs';

// Apply the approved design to the main pages before building shared project
// navigation and review routes. Keep the original production metadata.
const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg>';
const copyIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V4H4v12h4"/></svg>';
const labels = {
  en: {projects:'Projects', career:'Career', contact:'Contact', email:'Email address', copy:'Copy email'},
  es: {projects:'Proyectos', career:'Trayectoria', contact:'Contacto', email:'Correo electrónico', copy:'Copiar correo'}
};
function requiredReplace(text, pattern, replacement, name) {
  const result = text.replace(pattern, replacement);
  if (result === text) throw new Error(`Approved design: missing ${name}`);
  return result;
}
function sectionLabel(number, label) {
  return `<span class="design-section-label"><span aria-hidden="true">${number}</span>${label}</span>`;
}

for (const lang of ['en', 'es']) {
  const copy = labels[lang];
  let html = await readFile(`dist/${lang}/index.html`, 'utf8');
  html = requiredReplace(html, 'class="hero-experiment ', 'class="portfolio-design hero-experiment ', 'body class');
  html = html.replace('</head>', '<link rel="stylesheet" href="/design.css?v=2"><script src="/design.js?v=1" defer></script></head>');
  html = requiredReplace(html, /(<section id="projects"[\s\S]*?)<span class="text-xs font-mono text-cobalt font-bold tracking-widest uppercase">[^<]*<\/span>/,
    (_, start) => start + sectionLabel('01', copy.projects), 'projects label');

  html = requiredReplace(html, /<section id="experience"[\s\S]*?<\/section>/, section => {
    section = requiredReplace(section, /<span class="text-xs font-mono text-cobalt font-bold tracking-widest uppercase">[^<]*<\/span>/,
      sectionLabel('02', copy.career), 'career label');
    section = requiredReplace(section, 'class="grid grid-cols-1 lg:grid-cols-12 gap-8"', 'class="design-career-grid"', 'career grid');
    const boundary = '<!-- Academic & Leadership -->';
    const parts = section.split(boundary);
    if(parts.length !== 2) throw new Error('Approved design: missing academic boundary');
    let professional = requiredReplace(parts[0], 'class="lg:col-span-5 space-y-4"', 'class="career-professional"', 'professional column');
    professional = professional.replaceAll('class="border border-hairline bg-cardLight p-5 space-y-2 font-mono text-xs"', 'class="career-entry"');
    professional = professional.replaceAll('class="flex justify-between items-start border-b border-hairline pb-2"', 'class="career-entry-header"');
    professional = professional.replace(/(<span class="text-slate-400 text-\[10px\]">)([^<]+) – ([^<]+)(<\/span>)/g,
      (_, open, start, end, close) => `${open}<span class="career-date-part">${lang==='es'?'de ':''}${start}</span> <span class="career-date-part">${lang==='es'?'a':'to'} ${end}</span>${close}`);
    let academic = requiredReplace(parts[1], 'class="lg:col-span-7 space-y-4"', 'class="career-academic"', 'academic column');
    academic = academic.replaceAll('class="border border-hairline bg-cardLight p-5 space-y-3 font-mono text-xs"', 'class="academic-card academic-degree"');
    academic = academic.replaceAll('class="border border-hairline bg-cardLight p-5 space-y-2 font-mono text-xs"', 'class="academic-card"');
    return professional + boundary + academic;
  }, 'career section');

  html = requiredReplace(html, /<section id="contact"[\s\S]*?<\/section>/, section => {
    const title = section.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/)?.[1];
    const email = section.match(/href="mailto:([^\"]+)"/)?.[1];
    const linkedin = html.match(/href="(https:\/\/www\.linkedin\.com\/[^\"]+)"/)?.[1];
    if(!title || !email || !linkedin) throw new Error('Approved design: missing contact content');
    return `<section id="contact" class="design-contact">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="design-contact-grid">
          <div class="design-contact-copy">
            ${sectionLabel('03', copy.contact)}
            <h2>${title}</h2>
          </div>
          <div class="design-contact-actions">
            <span class="design-contact-label">${copy.email}</span>
            <a class="design-contact-email" href="mailto:${email}" aria-label="${email}"><span>${email.replace('@','<wbr>@')}</span>${arrow}</a>
            <div class="design-contact-buttons">
              <button type="button" onclick="copyEmailAction()">${copyIcon}<span>${copy.copy}</span></button>
              <a href="${linkedin}" target="_blank" rel="noopener noreferrer"><span>LinkedIn</span>${arrow}</a>
            </div>
          </div>
        </div>
      </div>
    </section>`;
  }, 'contact section');

  html = naturalDateRanges(naturalCopy(html), lang);
  await writeFile(`dist/${lang}/index.html`, html);
}
await copyFile('source/portfolio-design.css', 'dist/design.css');
await copyFile('source/portfolio-design.js', 'dist/design.js');
console.log('Built the approved bilingual portfolio design with natural punctuation and no hero grid.');
