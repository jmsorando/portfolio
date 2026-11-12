import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {addAcademicIdentity,academicLogos} from './source/academic-identity.mjs';

// Apply the reviewed academic presentation before cloning the review routes.
await mkdir('dist/assets/academic',{recursive:true});
for(const logo of academicLogos) await copyFile(`source/assets/academic/${logo.file}`,`dist/assets/academic/${logo.file}`);
await copyFile('source/academic-identity.css','dist/academic.css');

for(const lang of ['en','es']) {
  let html=addAcademicIdentity(await readFile(`dist/${lang}/index.html`,'utf8'));
  html=html.replace('class="portfolio-design ', 'class="academic-identities portfolio-design ');
  html=html.replace('</head>','<link rel="stylesheet" href="/academic.css?v=1"></head>');
  await writeFile(`dist/${lang}/index.html`,html);
}
console.log('Applied the four approved academic logos to both main languages.');
