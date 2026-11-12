import {MATERIALS, nextZoom, imageDimensions} from '/projects/model.mjs?v=9';
import {AREAS, PROJECT_LABELS, areaProjects, parentView} from './areas-model.mjs?v=11';
import {responsiveMarkup, AREA_SIZES, DETAIL_SIZES, selectionSizes, documentSource,documentDimensions} from '/projects/image-delivery.mjs?v=5';
import {createImageWarmer,loadDocumentImage} from '/projects/popup-image-loading.mjs?v=1';

const lang = document.documentElement.lang === 'es' ? 'es' : 'en';
const copy = {
 en:{close:'Close',back:'Back to project',goal:'Goal',protocol:'Protocol',outcome:'Outcome',materials:'Supporting materials',fit:'Fit',zoomIn:'Zoom in',zoomOut:'Zoom out',original:'Open original',loading:'Loading document…',error:'The document could not be displayed.',pdf:'If the PDF does not appear, open the original.',visit:'Visit website',viewer:'Document viewer',zoom:'Image zoom'},
 es:{close:'Cerrar',back:'Volver al proyecto',goal:'Objetivo',protocol:'Protocolo',outcome:'Resultado',materials:'Material complementario',fit:'Ajustar',zoomIn:'Ampliar',zoomOut:'Reducir',original:'Abrir original',loading:'Cargando documento…',error:'No se ha podido mostrar el documento.',pdf:'Si el PDF no aparece, abre el original.',visit:'Visitar sitio web',viewer:'Visor de documentos',zoom:'Ampliación de imagen'}
}[lang];
const pageCopy=lang==='es'?{previous:'Página anterior',next:'Página siguiente',page:'Página'}:{previous:'Previous page',next:'Next page',page:'Page'};
const backToSelection=lang==='es'?'Volver a los proyectos':'Back to projects';
const escape = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const grid = document.getElementById('projectsGrid');
const projectsById = areaProjects(PROJECTS, lang);
const areasById = new Map(AREAS.map(area=>[area.id,area]));
let area;
const dialog = document.createElement('dialog');
dialog.className = 'project-preview-dialog project-areas-dialog';
dialog.setAttribute('aria-labelledby','pp-title');
dialog.innerHTML = `<div class="pa-header"><div class="pp-bar"><button type="button" class="pp-back" hidden>← ${copy.back}</button><button type="button" class="pp-close"><span>${copy.close}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6L18 18M18 6L6 18"/></svg></button></div></div><div class="pp-content" id="pa-panel"></div>`;
document.body.append(dialog);
const content = dialog.querySelector('.pp-content');
const closeButton = dialog.querySelector('.pp-close');
const backButton = dialog.querySelector('.pp-back');
let project, opener, previousOverflow, mode = 'selection', summaryScroll = 0, materialButton, summaryNodes, zoom = 100;
let selectionNodes, selectionScroll=0, selectionButton;
let documentImage, stage, resizeObserver, resizeFallback, outsideStart = false;
let cancelDocumentLoad,documentFullReady=false,documentNaturalSize;
const warmImage=createImageWarmer({connection:navigator.connection});

function cleanupViewer() {
  cancelDocumentLoad?.();cancelDocumentLoad=null;documentFullReady=false;documentNaturalSize=null;
  resizeObserver?.disconnect(); resizeObserver = null;
  if (resizeFallback) window.removeEventListener('resize',resizeFallback);
  resizeFallback = null;
  if (documentImage) { documentImage.onload = null; documentImage.onerror = null; }
  documentImage = null; stage = null;
  content.querySelector('object')?.remove();
}
function materialsMarkup(p) {
  const records = MATERIALS[p.id] || [];
  if (!records.length) return '';
  return `<section class="pp-materials" aria-labelledby="pp-material-title"><h3 id="pp-material-title">${copy.materials}</h3><div class="pp-material-grid">${records.map(m=>`<button class="pp-material" type="button" data-material="${m.id}"><img src="${m.thumbnail}" alt="" width="${m.thumbnailWidth||480}" height="${m.thumbnailHeight||340}" loading="lazy" decoding="async"><span>${escape(m.title[lang])}</span><small>${escape(m.kind[lang])}</small></button>`).join('')}</div></section>`;
}
function projectVisual(p, sizes=DETAIL_SIZES, loading='eager') {
  const markup=p.visual
    ? `<div class="project-visual pa-lab-visual"><img src="${escape(p.visual.src)}" alt="${escape(p.visual.alt[lang])}" loading="${loading}" decoding="async"></div>`
    : getProjectBanner(p);
  return responsiveMarkup(markup,sizes,loading);
}
function setView(next) {
  mode=next;dialog.dataset.view=next;
  backButton.hidden=next==='selection';
  backButton.textContent=`← ${next==='material'?copy.back:backToSelection}`;
  content.classList.toggle('pp-viewer',next==='material');
  content.classList.toggle('pa-selection',next==='selection');
}
function renderSelection() {
  setView('selection');
  content.innerHTML=`<h2 id="pp-title" tabindex="-1">${escape(area.title[lang])}</h2><div class="pa-project-grid${area.projects.length===2?' pa-pair':''}">${area.projects.map((id,index)=>{
    const p=projectsById.get(id),title=p.sections||id==='PRJ-05'?PROJECT_LABELS[id][lang]:p.title;
    return `<article class="pa-project-tile"><div class="pa-tile-visual" aria-hidden="true">${projectVisual(p,selectionSizes(area.projects.length),index<2?'eager':'lazy')}</div><h3><button type="button" class="pa-project-button" data-project="${id}">${escape(title)}</button></h3></article>`;
  }).join('')}</div>`;
}
function renderSummary() {
  const facts=project.sections||['goal','protocol','outcome'].map(key=>({label:copy[key],body:project[key]}));
  content.innerHTML = `<div class="pp-layout"><div class="pp-visual">${projectVisual(project)}</div><div class="pp-copy"><h2 id="pp-title" tabindex="-1">${escape(project.title)}</h2><div class="pp-facts">${facts.map(f=>`<section><h3>${escape(f.label)}</h3><p>${escape(f.body)}</p></section>`).join('')}</div>${project.externalUrl?`<a class="pp-external" href="${escape(project.externalUrl)}" target="_blank" rel="noopener noreferrer">${copy.visit} ↗</a>`:''}</div></div>${materialsMarkup(project)}`;
  content.querySelectorAll('[data-material]').forEach(button=>button.addEventListener('click',()=>openMaterial(MATERIALS[project.id].find(m=>m.id===button.dataset.material),button)));
  // The surrounding title identifies the concept; keep existing brand/logo alternatives.
  content.querySelectorAll('.pp-visual img').forEach(img=>{img.loading='eager';img.fetchPriority='high';});
}
function selectProject(id, button) {
  if(mode!=='selection'||!area.projects.includes(id))return;
  selectionScroll=dialog.scrollTop;selectionButton=button;
  selectionNodes=document.createDocumentFragment();
  while(content.firstChild)selectionNodes.append(content.firstChild);
  cleanupViewer(); summaryNodes = null; summaryScroll = 0; materialButton = null; zoom = 100;
  setView('summary');project=projectsById.get(id);
  renderSummary();
  dialog.scrollTop=0;
  content.querySelector('#pp-title').focus({preventScroll:true});
}
function openArea(selectedArea, button) {
  area=selectedArea;opener=button;
  selectionNodes=null;selectionScroll=0;selectionButton=null;project=null;
  renderSelection();
  previousOverflow=document.body.style.overflow;
  document.body.style.overflow='hidden';
  dialog.showModal(); dialog.scrollTop=0;content.querySelector('#pp-title').focus({preventScroll:true});
}
function returnToSelection() {
  if(mode!=='summary')return;
  cleanupViewer();setView('selection');
  content.replaceChildren(selectionNodes);selectionNodes=null;
  dialog.scrollTop=selectionScroll;selectionButton?.focus({preventScroll:true});
}
function returnToProject() {
  if(mode!=='material') return;
  cleanupViewer();setView('summary');
  content.replaceChildren(summaryNodes); summaryNodes=null;
  dialog.scrollTop=summaryScroll;
  materialButton?.focus({preventScroll:true});
}
function updateImage(resetScroll=false) {
  if (!documentImage?.naturalWidth || !stage) return;
  const size=imageDimensions(documentNaturalSize?.width||documentImage.naturalWidth,documentNaturalSize?.height||documentImage.naturalHeight,stage.clientWidth-26,stage.clientHeight-26,zoom);
  documentImage.style.width=size.width+'px'; documentImage.style.height=size.height+'px';
  content.querySelector('.pp-zoom').textContent=zoom+'%';
  content.querySelector('[data-zoom="out"]').disabled=!documentFullReady||zoom<=100;
  content.querySelector('[data-zoom="in"]').disabled=!documentFullReady||zoom>=300;
  if(resetScroll){stage.scrollTop=0;stage.scrollLeft=0;}
}
function openMaterial(record, button) {
  if(!record) return;
  summaryScroll=dialog.scrollTop; materialButton=button;
  summaryNodes=document.createDocumentFragment();
  while(content.firstChild) summaryNodes.append(content.firstChild);
  setView('material');zoom=100;
  const imageControls=record.type==='image'?`<button class="pp-control" type="button" data-zoom="fit">${copy.fit}</button><button class="pp-control" type="button" data-zoom="out" aria-label="${copy.zoomOut}" disabled>−</button><output class="pp-zoom" aria-label="${copy.zoom}" aria-live="polite">100%</output><button class="pp-control" type="button" data-zoom="in" aria-label="${copy.zoomIn}">+</button>`:'';
  const pages=record.pages||[record.file];let pageIndex=0;
  const pageControls=pages.length>1?`<div class="pp-toolbar"><button class="pp-control" type="button" data-page="previous" aria-label="${pageCopy.previous}" disabled>←</button><output class="pp-zoom pp-page-count" aria-label="${pageCopy.page}" aria-live="polite">1 / ${pages.length}</output><button class="pp-control" type="button" data-page="next" aria-label="${pageCopy.next}">→</button></div>`:'';
  content.innerHTML=`<h2 id="pp-title">${escape(record.title[lang])}</h2><div class="pp-toolbar">${imageControls}<a class="pp-original" href="${record.originalFile||record.file}" target="_blank" rel="noopener noreferrer">${copy.original} ↗</a></div>${pageControls}<p class="pp-status" role="status">${copy.loading}</p><div class="pp-stage" role="region" tabindex="0" aria-label="${copy.viewer}"></div>`;
  dialog.scrollTop=0;backButton.focus({preventScroll:true});stage=content.querySelector('.pp-stage');
  const status=content.querySelector('.pp-status');
  let imageFailed=false;
  function fail() { imageFailed=true;status.textContent=copy.error;stage.hidden=!documentImage?.naturalWidth;stage.setAttribute('aria-busy','false');content.querySelectorAll('[data-zoom]').forEach(b=>b.disabled=true); }
  if(record.type==='pdf') {
    status.textContent=copy.pdf;
    const object=document.createElement('object');object.type='application/pdf';object.data=record.file;object.setAttribute('aria-label',record.title[lang]);
    const fallback=document.createElement('a');fallback.href=record.file;fallback.target='_blank';fallback.rel='noopener noreferrer';fallback.textContent=copy.original;
    object.append(fallback);object.addEventListener('error',fail);stage.append(object);return;
  }
  const canvas=document.createElement('div');canvas.className='pp-canvas';stage.append(canvas);
  const img=document.createElement('img');documentImage=img;img.className='pp-document';img.alt=record.alt[lang];img.decoding='async';
  img.onerror=fail;canvas.append(img);
  content.querySelectorAll('[data-zoom]').forEach(control=>control.addEventListener('click',()=>{zoom=control.dataset.zoom==='fit'?100:nextZoom(zoom,control.dataset.zoom==='in'?1:-1);updateImage(control.dataset.zoom==='fit');}));
  resizeFallback=()=>updateImage();
  if(typeof ResizeObserver==='function'){resizeObserver=new ResizeObserver(resizeFallback);resizeObserver.observe(stage);}else window.addEventListener('resize',resizeFallback);
  function showPage(index) {
    cancelDocumentLoad?.();documentFullReady=false;imageFailed=false;
    pageIndex=Math.max(0,Math.min(pages.length-1,index));zoom=100;
    documentNaturalSize=documentDimensions(pages[pageIndex]);
    status.textContent=copy.loading;stage.hidden=false;img.hidden=true;img.onload=null;
    stage.setAttribute('aria-busy','true');
    content.querySelector('.pp-zoom').textContent='100%';
    content.querySelectorAll('[data-zoom]').forEach(control=>control.disabled=true);
    if(pages.length>1){
      content.querySelector('.pp-page-count').textContent=`${pageIndex+1} / ${pages.length}`;
      const previous=content.querySelector('[data-page="previous"]'),next=content.querySelector('[data-page="next"]');
      previous.disabled=pageIndex===0;next.disabled=pageIndex===pages.length-1;
      if(document.activeElement===previous&&previous.disabled)next.focus({preventScroll:true});
      if(document.activeElement===next&&next.disabled)previous.focus({preventScroll:true});
      img.alt=`${record.alt[lang]} ${pageCopy.page} ${pageIndex+1} / ${pages.length}`;
    }
    cancelDocumentLoad=loadDocumentImage({
      preview:pageIndex===0?record.thumbnail:null,
      full:documentSource(pages[pageIndex]),original:pages[pageIndex],onError:fail,
      onDisplay:({src,full})=>{
        img.onload=()=>{
          documentFullReady=full;img.hidden=false;stage.hidden=false;
          status.textContent=imageFailed?copy.error:full?'':copy.loading;
          stage.setAttribute('aria-busy',String(!full&&!imageFailed));
          content.querySelector('[data-zoom="fit"]').disabled=!full;
          img.dataset.resolution=full?'full':'preview';updateImage(true);
        };
        img.src=src;
      }
    });
  }
  content.querySelectorAll('[data-page]').forEach(control=>control.addEventListener('click',()=>showPage(pageIndex+(control.dataset.page==='next'?1:-1))));
  showPage(0);
}

closeButton.addEventListener('click',()=>dialog.close());
function goBack() {
  const target=parentView(mode);
  if(target==='summary')returnToProject();
  else if(target==='selection')returnToSelection();
}
backButton.addEventListener('click',goBack);
dialog.addEventListener('keydown',event=>{
  if(event.key!=='Tab')return;
  const stops=[...dialog.querySelectorAll('button:not(:disabled),a[href],object,[tabindex]')].filter(el=>el.tabIndex>=0&&el.getClientRects().length>0);
  const first=stops[0],last=stops.at(-1);
  if(!first){event.preventDefault();closeButton.focus();return;}
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
});
dialog.addEventListener('cancel',event=>{if(parentView(mode)){event.preventDefault();goBack();}});
const outside=event=>{const r=dialog.getBoundingClientRect();return event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom;};
dialog.addEventListener('pointerdown',event=>{outsideStart=event.target===dialog&&outside(event);});
dialog.addEventListener('click',event=>{if(outsideStart&&event.target===dialog&&outside(event))dialog.close();outsideStart=false;});
dialog.addEventListener('close',()=>{cleanupViewer();content.replaceChildren();summaryNodes=null;selectionNodes=null;selectionButton=null;materialButton=null;mode='selection';zoom=100;document.body.style.overflow=previousOverflow;opener?.focus({preventScroll:true});});

content.addEventListener('click',event=>{
  const button=event.target.closest('[data-project]');
  if(button)selectProject(button.dataset.project,button);
});

function warmVisual(markup) {
  const template=document.createElement('template');template.innerHTML=markup;
  template.content.querySelectorAll('img').forEach(img=>warmImage({src:img.getAttribute('src'),srcset:img.getAttribute('srcset')||'',sizes:img.getAttribute('sizes')||''}));
}
function warmTarget(target) {
  if(target.matches('[data-area]')) {
    const selected=areasById.get(target.dataset.area);
    selected.projects.slice(0,2).forEach(id=>warmVisual(projectVisual(projectsById.get(id),selectionSizes(selected.projects.length))));
  } else if(target.matches('[data-project]')) {
    warmVisual(projectVisual(projectsById.get(target.dataset.project)));
  } else if(target.matches('[data-material]')) {
    const record=(MATERIALS[project?.id]||[]).find(m=>m.id===target.dataset.material);
    if(record?.type==='image')warmImage({src:documentSource(record.file)});
  }
}
function prepareOnIntent(root,selector) {
  let timer;
  root.addEventListener('pointerover',event=>{
    const target=event.target.closest(selector);
    if(!target||event.pointerType!=='mouse'||target.contains(event.relatedTarget))return;
    clearTimeout(timer);timer=setTimeout(()=>warmTarget(target),120);
  });
  root.addEventListener('pointerout',event=>{if(!event.target.closest(selector)?.contains(event.relatedTarget))clearTimeout(timer);});
  root.addEventListener('focusin',event=>{const target=event.target.closest(selector);if(target)warmTarget(target);});
}
prepareOnIntent(grid,'[data-area]');
prepareOnIntent(content,'[data-project],[data-material]');

// Shared area renderer; the original six-card renderer is not initialized.
grid.replaceChildren();
for(const a of AREAS){
  const card=document.createElement('div');
  card.className='project-card project-card-compact border border-hairline bg-cardLight flex flex-col overflow-hidden hover:border-cobalt transition-colors group';
  card.dataset.area=a.id;
  card.innerHTML=`<div class="project-visual area-visual">${responsiveMarkup(`<img src="${escape(a.visual.src)}" alt="${escape(a.visual.alt[lang])}">`,AREA_SIZES)}</div><div class="p-5"><h3><button type="button" class="project-open" aria-haspopup="dialog" aria-describedby="area-${a.id}-contents">${escape(a.title[lang])}</button></h3><p class="area-contents" id="area-${a.id}-contents">${escape(a.contents[lang])}</p></div>`;
  grid.append(card);
}
grid.addEventListener('click',event=>{
  const card=event.target.closest('[data-area]');if(!card)return;
  const a=areasById.get(card.dataset.area);if(!a)return;
  openArea(a,card.querySelector('.project-open'));
});
