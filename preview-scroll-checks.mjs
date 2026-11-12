import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';

const code = await readFile('source/hero-scroll.js', 'utf8');
function page({reduce=false, supportsObserver=true, includeAbout=true,editorial=false,hash='#top'}={}) {
  const events = {}, documentEvents = {}, frames = [], nodes = [];
  let context, intersection, mutation;
  function node(id, y=0, height=40) {
    const classes = new Set(), handlers = {}, attributes = {};
    const item = {id, y, height, children:[], style:{}, handlers, attributes,
      classList:{contains:c=>classes.has(c),add:c=>classes.add(c),remove:c=>classes.delete(c)},
      contains(target){return target===this || this.children.some(child=>child.contains(target));},
      getBoundingClientRect(){return {top:this.y-context.scrollY,height:this.height};},
      addEventListener(type,fn){handlers[type]=fn;},
      removeEventListener(type,fn){if(handlers[type]===fn)delete handlers[type];},
      getAttribute(k){return attributes[k]??null;},
      setAttribute(k,v){attributes[k]=v;}, removeAttribute(k){delete attributes[k];},
      querySelector(){return null;}, querySelectorAll(){return [];}
    };
    nodes.push(item); return item;
  }
  const root=node('root'); root.scrollHeight=6000;
  const body=node('top'); body.classList.add('hero-experiment');
  if(editorial)body.classList.add('section-transitions');
  const header=node('header',0,88), progress=node('progress');
  const ids=['about','projects','experience','contact'].filter(id=>includeAbout||id!=='about');
  const positions={about:500,projects:1000,experience:2000,contact:3000};
  const sections=ids.map(id=>node(id,positions[id]));
  const nav=ids.map(id=>Object.assign(node('link-'+id),{hash:'#'+id}));
  const headings=sections.map(section=>{
    const block=node('heading-'+section.id,section.y+40), title=node('h2-'+section.id,section.y+45);
    title.parentElement=block; block.children.push(title); section.children.push(block);
    section.querySelector=()=>title; return block;
  });
  const transitionTargets=[];
  if(editorial) {
    const career=headings[ids.indexOf('experience')], copy=headings[ids.indexOf('contact')];
    const line=node('contact-line',3000,1), actions=node('contact-actions',4400,200);
    for(const [element,type] of [[career,'career'],[line,'line'],[copy,'copy'],[actions,'actions']]) {
      element.setAttribute('data-section-transition',type);
      transitionTargets.push(element);
    }
    sections.find(section=>section.id==='contact').children.push(line,actions);
  }
  const cards=Array.from({length:6},(_,i)=>node('card-'+i,1500+i*100));
  sections.find(section=>section.id==='projects').children.push(...cards);
  const grid=node('projectsGrid');
  const languages=[Object.assign(node('es'),{href:'https://example.test/preview/hero/es/#experience'})];
  header.querySelector=()=>progress; header.querySelectorAll=()=>nav;
  const media={matches:reduce,addEventListener(type,fn){this.change=fn;}};
  const document={body,documentElement:root,activeElement:body,
    querySelector:()=>header,
    querySelectorAll(selector){
      if(selector==='[data-language]')return languages;
      if(selector==='[data-section-transition]')return transitionTargets;
      if(selector==='#projectsGrid .project-card')return cards;
      return nodes.filter(n=>n.classList.contains(selector.slice(1)));
    },
    getElementById:id=>nodes.find(n=>n.id===id),
    addEventListener:(type,fn)=>documentEvents[type]=fn
  };
  context={document,location:{hash,search:'',origin:'https://example.test'},innerHeight:900,scrollY:0,URL,
    matchMedia:()=>media,requestAnimationFrame:fn=>{frames.push(fn);return frames.length;},
    addEventListener:(type,fn)=>events[type]=fn,
    MutationObserver:class {constructor(fn){mutation=fn;}observe(){}},
    ResizeObserver:class {observe(){}}
  };
  if(supportsObserver)context.IntersectionObserver=class {
    constructor(fn){intersection=fn;}observe(){}unobserve(){}
  };
  context.window=context;
  vm.runInNewContext(code,context);
  const flush=()=>{while(frames.length)frames.shift()();};
  flush();
  return {context,events,documentEvents,sections,nav,headings,cards,languages,root,progress,media,transitionTargets,
    flush,node,intersection:entries=>intersection(entries),mutate:()=>mutation()};
}
const normal=page();
assert.equal(normal.cards.filter(c=>c.classList.contains('scroll-reveal-pending')).length,6);
assert.equal(normal.nav.some(n=>n.attributes['aria-current']),false);
assert.equal(normal.root.style.scrollPaddingTop,'104px');
normal.intersection([{target:normal.cards[0],isIntersecting:true}]);
assert.equal(normal.cards[0].classList.contains('scroll-reveal-pending'),false);
normal.documentEvents.focusin({target:normal.cards[1]});
assert.equal(normal.cards[1].classList.contains('scroll-reveal-pending'),false);
assert.equal(normal.cards[1].classList.contains('scroll-reveal-enter'),false);
normal.context.scrollY=2000; normal.events.scroll(); normal.flush();
assert.equal(normal.nav[2].attributes['aria-current'],'location');
assert.equal(normal.context.location.hash,'#top');
assert.equal(normal.languages[0].href,'/preview/hero/es/#experience');
normal.context.scrollY=5099.5; normal.events.scroll(); normal.flush();
assert.equal(normal.nav[3].attributes['aria-current'],'location');
assert.equal(normal.progress.style.transform,'scaleX(1)');
normal.root.scrollHeight=7000; normal.documentEvents.toggle(); normal.flush();
assert.notEqual(normal.progress.style.transform,'scaleX(1)');
normal.media.matches=true; normal.media.change();
assert.equal(normal.cards.some(c=>c.classList.contains('scroll-reveal-pending')),false);
for(const options of [{reduce:true},{supportsObserver:false}]) {
  const fallback=page(options);
  assert.equal(fallback.cards.some(c=>c.classList.contains('scroll-reveal-pending')),false);
  fallback.context.scrollY=3000; fallback.events.scroll(); fallback.flush();
  assert.equal(fallback.nav[3].attributes['aria-current'],'location');
}
const dynamic=page();
const late=dynamic.node('late-card',1700); dynamic.cards.push(late); dynamic.mutate();
assert.equal(late.classList.contains('scroll-reveal-pending'),true);
dynamic.context.location.hash='#projects'; dynamic.events.hashchange();
assert.equal(dynamic.cards[0].classList.contains('scroll-reveal-pending'),false);
assert.equal(dynamic.headings[2].classList.contains('scroll-reveal-pending'),true);
console.log('PASS: active sections, anchors, progress resizing, keyboard reveals, late cards, reduced motion and observer fallback.');

const about=page();
about.context.scrollY=500;about.events.scroll();about.flush();
assert.equal(about.nav[0].attributes['aria-current'],'location');
assert.equal(about.languages[0].href,'/preview/hero/es/#about');
about.context.location.hash='#about';about.events.hashchange();
assert.equal(about.headings[0].classList.contains('scroll-reveal-pending'),false);
const main=page({includeAbout:false});
assert.equal(main.nav.some(n=>n.attributes['aria-current']),false);
main.context.scrollY=1000;main.events.scroll();main.flush();
assert.equal(main.nav[0].attributes['aria-current'],'location');
assert.equal(main.languages[0].href,'/preview/hero/es/#projects');
main.context.scrollY=5100;main.events.scroll();main.flush();
assert.equal(main.nav[2].attributes['aria-current'],'location');
assert.equal(main.progress.style.transform,'scaleX(1)');
console.log('PASS: navigation, language switching and progress without About.');

const editorial=page({editorial:true,includeAbout:false});
const [career,line,copy,actions]=editorial.transitionTargets;
assert(editorial.transitionTargets.every(n=>n.classList.contains('scroll-reveal-pending')));
editorial.intersection([{target:career,isIntersecting:true}]);
career.handlers.animationend({animationName:'transition-line-enter'});
assert(career.classList.contains('scroll-reveal-enter'),'The line cannot cut the heading sequence short');
career.handlers.animationend({animationName:'transition-title-enter'});
assert(!career.classList.contains('scroll-reveal-enter'));
editorial.intersection([{target:career,isIntersecting:true}]);
assert(!career.classList.contains('scroll-reveal-enter'),'An entered heading never replays');
editorial.intersection([{target:copy,isIntersecting:true}]);
assert(actions.classList.contains('scroll-reveal-pending'),'Stacked contact actions wait for their own visibility');
editorial.documentEvents.focusin({target:copy});
assert(!copy.classList.contains('scroll-reveal-enter'),'Focus completes an in-progress transition');
editorial.documentEvents.focusin({target:actions});
assert(!actions.classList.contains('scroll-reveal-pending')&&!actions.classList.contains('scroll-reveal-enter'));
editorial.context.scrollY=3500;editorial.events.scroll();editorial.flush();
assert(!line.classList.contains('scroll-reveal-pending'),'Fast scrolling past the line cannot leave it hidden');
for(const options of [{reduce:true},{supportsObserver:false},{hash:'#contact'}]) {
  const staticPage=page({editorial:true,...options});
  for(const n of staticPage.transitionTargets.filter(n=>options.hash?n.getAttribute('data-section-transition')!=='career':true)) {
    assert(!n.classList.contains('scroll-reveal-pending')&&!n.classList.contains('scroll-reveal-enter'));
  }
}
const motionToggle=page({editorial:true});
motionToggle.intersection([{target:motionToggle.transitionTargets[0],isIntersecting:true}]);
motionToggle.media.matches=true;motionToggle.media.change();
assert(motionToggle.transitionTargets.every(n=>!n.classList.contains('scroll-reveal-pending')&&!n.classList.contains('scroll-reveal-enter')));
console.log('PASS: editorial sequence completion, one-time entry, independent contact blocks, focus, fast scroll, anchors and reduced-motion fallback.');
