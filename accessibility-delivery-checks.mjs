import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {MATERIALS} from './source/project-preview-model.mjs';
import {TRANSCRIPTS} from './dist/projects/transcripts.mjs';

assert.deepEqual(Object.keys(TRANSCRIPTS).sort(),Object.values(MATERIALS).flat().map(m=>m.id).sort());
for(const [id,html] of Object.entries(TRANSCRIPTS)){
  assert.equal(html,await readFile(`source/transcripts/${id}.html`,'utf8'));
  assert.match(html,/<h3>/);
  assert(!/<script|on\w+=|javascript:/i.test(html));
  assert.equal((html.match(/<table>/g)||[]).length,(html.match(/<caption>/g)||[]).length,'Each table needs a caption');
  assert(!/<th>/.test(html),'Table headers need explicit scope');
}
for(const lang of ['en','es']){
  const html=await readFile(`dist/${lang}/index.html`,'utf8');
  assert(!html.includes('cdn.tailwindcss.com'));
  assert(!html.includes('tailwind.config'));
  assert.match(html,/href="\/tailwind.css\?v=1"/);
  assert.match(html,/class="motion-toggle" hidden/);
}
const css=await readFile('dist/tailwind.css','utf8');
for(const selector of ['.flex{','.grid{','.bg-cardLight{','.hover\\:border-cobalt:hover{','.sm\\:text-3xl{'])assert(css.includes(selector),`Missing utility ${selector}`);

const code=await readFile('source/visual-pack.js','utf8');
async function motionHarness({reduced=false,stored=false,blockedStorage=false,observer=true}={}){
  const listeners={};const changes=[];const intervals=new Map();let count=0;
  const classes=()=>{const values=new Set();return {toggle(c,on){on?values.add(c):values.delete(c);},add(c){values.add(c)},remove(c){values.delete(c)},contains(c){return values.has(c)}}};
  const button={hidden:true,disabled:false,addEventListener(type,fn){listeners[type]=fn}};
  const body={classList:classes()};
  const slides=Array.from({length:4},()=>({style:{},classList:classes(),querySelector(){return {getAttribute(){return '/assets/image.webp'}}}}));
  const hero={querySelector(){return {setAttribute(){}}}};
  const media={matches:reduced,addEventListener(type,fn){changes.push(fn)}};
  const Observer=class{constructor(callback){this.callback=callback}observe(target){this.callback([{target,isIntersecting:true}])}unobserve(){}disconnect(){}};
  const context={window:observer?{IntersectionObserver:Observer}:{},matchMedia:q=>q.includes('reduced')?media:{matches:false,addEventListener(){}},
    document:{hidden:false,documentElement:{lang:'es'},body,querySelector:s=>s==='.motion-toggle'?button:s==='.hero-illustration'?hero:null,querySelectorAll:s=>s==='.hero-sport-slide'?slides:[],addEventListener(){}},
    sessionStorage:{getItem(){if(blockedStorage)throw Error('blocked');return String(stored)},setItem(k,v){if(blockedStorage)throw Error('blocked');stored=v==='true'}},
    Image:class{decode(){return Promise.resolve()}},setInterval(fn){const id=++count;intervals.set(id,fn);return id},clearInterval:id=>intervals.delete(id),setTimeout(){return ++count},clearTimeout(){}};
  vm.runInNewContext(code,context);await new Promise(resolve=>setImmediate(resolve));
  return {body,button,intervals,slides,click:()=>listeners.click(),change(value){media.matches=value;changes.forEach(fn=>fn())}};
}
const motion=await motionHarness();
assert.equal(motion.intervals.size,1);motion.click();
assert.equal(motion.intervals.size,0);assert(motion.body.classList.contains('motion-paused'));
assert.equal(motion.button.textContent,'Reanudar animaciones');
assert.equal(motion.slides.filter(s=>s.style.visibility==='visible').length,1);
motion.change(true);assert(motion.button.disabled);assert.equal(motion.intervals.size,0);
motion.change(false);assert(!motion.button.disabled);assert.equal(motion.intervals.size,0,'System changes preserve user pause');
motion.click();assert.equal(motion.intervals.size,1);
const reducedMotion=await motionHarness({reduced:true});assert.equal(reducedMotion.intervals.size,0);assert(reducedMotion.button.disabled);
const restored=await motionHarness({stored:true});assert.equal(restored.intervals.size,0);
const fallback=await motionHarness({blockedStorage:true,observer:false});fallback.click();assert.equal(fallback.intervals.size,0);assert(!fallback.button.hidden);
console.log('PASS: all eight semantic transcripts, local Tailwind utilities, pause/resume timers, persisted pause, reduced-motion priority and browser fallbacks.');
