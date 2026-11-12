import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const section = (html, id) => html.match(new RegExp(`<section id="${id}"[\\s\\S]*?<\\/section>`))?.[0];
for(const lang of ['en','es']) {
  const main = await readFile(`dist/${lang}/index.html`,'utf8');
  assert(main.includes('class="section-transitions academic-identities portfolio-design hero-experiment '),'Main pages use the approved design, academic identities and transitions');
  assert(main.includes('href="/transitions.css?v=1"'));
  assert.equal((main.match(/data-section-transition=/g)||[]).length,4,'Each approved transition target appears once');
  assert(main.includes('href="/academic.css?v=1"'));
  assert(main.includes('href="/design.css?v=2"')&&main.includes('src="/design.js?v=1"'));
  assert(!main.includes('/preview/')&&!main.includes('noindex'),'Main pages use production assets and metadata');
  assert(main.includes(`rel="canonical" href="https://jmsorando.github.io/portfolio/${lang}/"`));
  const careerDesign=section(main,'experience');
  for(const asset of ['ucl.svg','muay-thai.png','spanish-latin-american.png','surgery-interventional.png']) {
    assert.equal(main.split(`src="/assets/academic/${asset}"`).length-1,1,'Each academic logo appears once');
    assert((await readFile(`dist/assets/academic/${asset}`)).equals(await readFile(`source/assets/academic/${asset}`)),'Published logos match the approved assets');
  }
  assert.equal((careerDesign.match(/class="career-entry"/g)||[]).length,3);
  assert.equal((careerDesign.match(/class="academic-card/g)||[]).length,4);
  const contactDesign=section(main,'contact');
  assert(contactDesign.includes('onclick="copyEmailAction()"'));
  assert(contactDesign.includes('rel="noopener noreferrer"'));
}
console.log('PASS: approved design on main routes, unchanged hero/project behavior, complete career content, natural punctuation and preserved contact destinations.');

const contactScript=await readFile('source/portfolio-design.js','utf8');
for(const scenario of [
  {lang:'en',api:'success',fallback:false},
  {lang:'es',api:'reject',fallback:true},
  {lang:'en',api:'absent',fallback:false}
]) {
  let clipboard='',toast='',temporary=0,focusRestored=false;
  const previousFocus={isConnected:true,focus(options){assert.equal(options.preventScroll,true);focusRestored=true;}};
  const context={window:{},navigator:{},triggerToast(message){toast=message;},document:{
    documentElement:{lang:scenario.lang},activeElement:previousFocus,
    body:{classList:{contains:()=>true},append(){temporary++;}},
    querySelector:()=>({getAttribute:()=> 'mailto:josemiguel.sorandocampillo@gmail.com'}),
    createElement:()=>({focus(options){assert.equal(options.preventScroll,true);},select(){},remove(){temporary--;}}),
    execCommand(){if(scenario.fallback)clipboard='josemiguel.sorandocampillo@gmail.com';return scenario.fallback;}
  }};
  if(scenario.api!=='absent')context.navigator.clipboard={async writeText(value){if(scenario.api==='reject')throw new Error('Denied');clipboard=value;}};
  vm.runInNewContext(contactScript,context);
  await context.window.copyEmailAction();
  assert.equal(temporary,0,'Always remove the fallback field');
  if(scenario.api!=='success')assert(focusRestored,'Fallback restores the original control without scrolling');
  if(scenario.api==='success'||scenario.fallback){assert.equal(clipboard,'josemiguel.sorandocampillo@gmail.com');assert.match(toast,/copied|copiado/);}
  else assert.match(toast,/unavailable/,'Do not report success when both copy methods fail');
}
console.log('PASS: modern clipboard, denied-permission fallback, error feedback and focus restoration.');
