import {readFile,writeFile,copyFile} from 'node:fs/promises';

// Promote the reviewed transition markup before cloning the review routes.
await copyFile('source/section-transitions.css','dist/transitions.css');
for(const lang of ['en','es']) {
  let html=await readFile(`dist/${lang}/index.html`,'utf8');
  html=html.replace('class="academic-identities ', 'class="section-transitions academic-identities ');
  html=html.replace('</head>','<link rel="stylesheet" href="/transitions.css?v=1"></head>');
  html=html.replace('/hero-scroll.js?v=2','/hero-scroll.js?v=3');
  html=html.replace(/(<section id="experience"[\s\S]*?)<div class="border-b border-hairline pb-4">/,
    '$1<div class="border-b border-hairline pb-4" data-section-transition="career">');
  html=html.replace('<section id="contact" class="design-contact">',`<section id="contact" class="design-contact">
      <div class="transition-contact-edge max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-hidden="true"><span class="transition-contact-line" data-section-transition="line"></span></div>`);
  html=html.replace('class="design-contact-copy"','class="design-contact-copy" data-section-transition="copy"');
  html=html.replace('class="design-contact-actions"','class="design-contact-actions" data-section-transition="actions"');
  if((html.match(/data-section-transition=/g)||[]).length!==4) throw new Error(`Approved transitions: missing targets in ${lang}`);
  await writeFile(`dist/${lang}/index.html`,html);
}
console.log('Applied the approved editorial transitions to both main languages.');
