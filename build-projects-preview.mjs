import {readFile, writeFile, mkdir, copyFile} from 'node:fs/promises';
import {basename} from 'node:path';
import {MATERIALS} from './source/project-preview-model.mjs';
import {AREAS,LAB_VISUALS} from './source/project-areas-model.mjs';

for (const lang of ['en', 'es']) {
  let html = await readFile(`dist/${lang}/index.html`, 'utf8');
  html = html.replace('</head>', '<link rel="stylesheet" href="/projects/dialog.css?v=1"><link rel="stylesheet" href="/projects/areas.css?v=4"><link rel="modulepreload" href="/projects/areas-model.mjs?v=11"><link rel="modulepreload" href="/projects/model.mjs?v=9"><link rel="modulepreload" href="/projects/image-delivery.mjs?v=5"><link rel="modulepreload" href="/projects/image-manifest.mjs?v=5"><link rel="modulepreload" href="/projects/popup-image-loading.mjs?v=1"><script type="module" src="/projects/areas.js?v=13"></script></head>');
  if(!html.includes('window.onload = function() { renderProjects(); };')) throw new Error('Project renderer entry point changed');
  html = html.replace('window.onload = function() { renderProjects(); };', '// The shared areas module renders projects.');
  await writeFile(`dist/${lang}/index.html`, html);
}
await mkdir('dist/projects', {recursive:true});
for (const [source, output] of [['project-preview.css','dialog.css'], ['project-preview-model.mjs','model.mjs']]) {
  await copyFile(`source/${source}`, `dist/projects/${output}`);
}
await mkdir('dist/projects/visuals', {recursive:true});
for(const visual of new Map(AREAS.map(area=>[area.visual.src,area.visual])).values()) {
  await copyFile(`source/project-area-assets/${basename(visual.src)}`, `dist${visual.src}`);
}
for(const visual of Object.values(LAB_VISUALS)) {
  if(visual.src.startsWith('/projects/visuals/'))await copyFile(`source/project-area-assets/${basename(visual.src)}`,`dist${visual.src}`);
}
for(const [source,output] of [['project-areas.js','areas.js'],['project-areas.css','areas.css']]) {
  await copyFile(`source/${source}`,`dist/projects/${output}`);
}
await copyFile('source/project-areas-model.mjs','dist/projects/areas-model.mjs');
await mkdir('dist/projects/materials', {recursive:true});
for (const record of Object.values(MATERIALS).flat()) {
  await copyFile(`source/assets/${basename(record.file)}`, `dist${record.file}`);
  await copyFile(`source/assets/optimized/${basename(record.thumbnail)}`, `dist${record.thumbnail}`);
  for(const page of record.pages||[]) await copyFile(`source/assets/${basename(page)}`, `dist${page}`);
}
console.log('Built three areas and the visual project chooser on both homepages.');
