import assert from 'node:assert/strict';
import {readFile, stat} from 'node:fs/promises';
import {basename} from 'node:path';
import vm from 'node:vm';
import {MATERIALS, EXPANDED_PROJECT_IDS, nextZoom, imageDimensions} from './source/project-preview-model.mjs';
import {AREAS,PROJECT_LABELS,LAB_VISUALS,areaProjects,parentView} from './source/project-areas-model.mjs';

assert.equal(parentView('material'),'summary');
assert.equal(parentView('summary'),'selection');
assert.equal(parentView('selection'),null,'Escape closes only from the area chooser');

assert.equal(nextZoom(100,-1),100);
assert.equal(nextZoom(300,1),300);
assert.equal(nextZoom(125,-1),100);
assert.equal(nextZoom(275,1),300);
assert.deepEqual(imageDimensions(1280,905,600,400),{width:566,height:400});
assert.deepEqual(imageDimensions(800,565,1200,800),{width:800,height:565});
assert.deepEqual(imageDimensions(800,565,400,300,200),{width:800,height:565});
assert.deepEqual(imageDimensions(0,565,400,300),{width:0,height:0});
assert.equal(EXPANDED_PROJECT_IDS.length,5);
assert(!EXPANDED_PROJECT_IDS.includes('PRJ-05'),'Legacy dialog eligibility remains separate from the shared area model');
assert.deepEqual(Object.keys(MATERIALS),['PRJ-02','PRJ-03','PRJ-04','PRJ-05','PRJ-06']);
const ids=new Set();
for(const record of Object.values(MATERIALS).flat()) {
  assert(!ids.has(record.id));ids.add(record.id);
  assert.equal(record.type,'image','Only clean visual images are served');
  assert(!record.originalFile,'No raw editable PowerPoint or PDF files are linked');
  for(const lang of ['en','es'])for(const key of ['title','kind','alt'])assert(record[key][lang]);
  const original=await readFile(`source/assets/${basename(record.file)}`);
  assert.deepEqual(await readFile('dist'+record.file),original,'Preserve original document image bytes');
  if(record.pages) {
    assert.equal(record.pages[0],record.file,'Start multi-page documents on the first page');
    for(const page of record.pages) assert.deepEqual(await readFile('dist'+page),await readFile(`source/assets/${basename(page)}`),'Include every rendered document page');
  }
  assert((await stat('dist'+record.thumbnail)).size<250000,'Keep thumbnails lightweight');
}
for(const lang of ['en','es']) {
  const main=await readFile(`dist/${lang}/index.html`,'utf8');
  assert(!main.includes('/preview/'),'No preview assets on the main pages');
  assert.equal((main.match(/src="\/projects\/areas\.js/g)||[]).length,1,'Load the shared area dialog once');
  assert(!main.includes('src="/projects/dialog.js'),'Do not start the superseded dialog');
  assert(!main.includes('window.onload = function() { renderProjects(); };'),'Do not initialize the superseded six-card renderer');
  assert(main.includes('href="/projects/areas.css?v=4"'));
  for(const locale of ['en','es'])assert(main.includes(`href="/${locale}/"`),'Main language links stay on the main portfolio');
  assert(main.includes('href="/projects/dialog.css?v=1"'));
  assert(!main.includes('noindex'),'Keep original main-page metadata');
  const app=[...main.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).find(s=>s.includes('const PROJECTS'));
  const original=JSON.parse(vm.runInNewContext(app+';JSON.stringify(PROJECTS);',{window:{}}));
  const entries=areaProjects([...original].reverse(),lang);
  assert.equal(AREAS.length,3);
  const allIds=AREAS.flatMap(a=>a.projects);
  assert.equal(new Set(allIds).size,10);
  assert.deepEqual(AREAS[2].projects,['LAB-EXERCISE','LAB-FORCE','LAB-MOCAP','LAB-BODY','PRJ-05']);
  for(const p of original){
    assert(allIds.includes(p.id));
    for(const key of ['goal','protocol','outcome','svgType'])assert.equal(entries.get(p.id)[key],p[key],'Preserve project content and visuals');
  }
  assert.equal(entries.get('PRJ-05').title,original.find(p=>p.id==='PRJ-05').labTitle);
  for(const a of AREAS){
    assert(a.title[lang]&&a.contents[lang]&&a.visual.alt[lang]);
    assert(a.visual.src.startsWith('/projects/visuals/'),'Approved artwork is served from the shared project assets');
    assert(a.visual.width<=1400&&a.visual.height>0);
    assert((await stat('dist'+a.visual.src)).size<250000,'Keep area illustrations lightweight');
    assert.deepEqual(await readFile('dist'+a.visual.src),await readFile(`source/project-area-assets/${basename(a.visual.src)}`),'Use the approved transparent artwork without alteration');
    for(const id of a.projects)assert(entries.has(id)&&PROJECT_LABELS[id][lang]);
  }
  for(const id of Object.keys(MATERIALS))assert(allIds.includes(id),'Every existing supporting document stays reachable');
  assert.equal(entries.get('LAB-FORCE').sections.length,2,'Distinguish UCL sessions from the physiotherapy placement');
  assert(entries.get('LAB-FORCE').sections[0].label.includes('UCL'));
  for(const id of ['LAB-EXERCISE','LAB-FORCE','LAB-MOCAP','LAB-BODY'])assert(entries.get(id).sections.every(s=>s.label&&s.body));
  assert.match(entries.get('LAB-BODY').sections[1].body,/TANITA.*DXA/);
  assert.equal(new Set(Object.values(LAB_VISUALS).map(v=>v.src)).size,5,'Every lab experience has distinct artwork');
  for(const [id,visual] of Object.entries(LAB_VISUALS)){
    assert.equal(entries.get(id).visual,visual);
    assert(visual.alt[lang]);
    assert((await stat('dist'+visual.src)).size>0);
    if(visual.src.startsWith('/projects/visuals/'))assert((await stat('dist'+visual.src)).size<250000);
  }
}
const css=await readFile('dist/projects/dialog.css','utf8');
assert(css.includes('prefers-reduced-motion')&&css.includes('forced-colors'));
assert(!css.includes('#projectsGrid'),'Preserve the main project cards');
assert(!css.includes('.project-dialog'),'Leave the Lab dialog styles unchanged');
assert.equal(MATERIALS['PRJ-03'].find(m=>m.id==='orb-placement-reference').pages.length,2);
console.log('PASS: three areas on main routes, ten bilingual entries, distinct lab visuals, selection/project/document return flow, preserved content and clean visual documents, two-page ORB letter, image-fit geometry and bounded zoom.');
