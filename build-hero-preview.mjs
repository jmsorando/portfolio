import {readFile,writeFile,copyFile} from 'node:fs/promises';
import {binaryRipple} from './source/binary-ripple.mjs';
const headings={
 en:['Sport Science,','Health Technology','Artificial Intelligence'],
 es:['Ciencias del Deporte,','Tecnología para la Salud','Inteligencia Artificial']
};
for(const lang of ['en','es']){
 let html=await readFile('dist/'+lang+'/index.html','utf8');
 const [science,health,ai]=headings[lang];
 html=html.replace('<span class="w-3 h-3 bg-cobalt shrink-0"></span>','<span class="brand-symbol" aria-hidden="true"><svg preserveAspectRatio="none" class="brand-columns shrink-0" width="56" height="20" viewBox="0 0 56 20" fill="currentColor" aria-hidden="true" focusable="false"><rect x="0" y="0" width="5" height="20"/><rect x="11" y="0" width="8" height="20"/><rect x="25" y="0" width="11" height="20"/><rect x="42" y="0" width="14" height="20"/></svg></span>');
 html=html.replace('/assets/hero-runner-quad.png','/assets/hero-runner-simple.webp');
 html=html.replace('</title>','</title><link rel="preload" as="image" href="/assets/hero-runner-simple.webp" type="image/webp" fetchpriority="high">');
 html=html.replace('<body id="top" class="','<body id="top" class="hero-experiment ');
 html=html.replace(/<h1\b[\s\S]*?<\/h1>/, '<h1 class="font-display font-bold text-ink"><span class="hero-title-line">'+science+'</span><span class="hero-title-line">'+health+'</span><span class="hero-title-line">&amp; <span class="ai-heading">'+ai+'</span></span></h1>');
 html=html.replace(/<svg class="hero-runner"[\s\S]*?<\/svg>/, svg=>svg
  .replace(/<g class="technical-frame"[\s\S]*?<\/g>/,'')
  .replace(/<path class="binary-leader"[^>]*\/>/,'')
  .replace(/<g class="binary-annotation"[\s\S]*?<\/g>/,'')
  .replace('<image href=','<image transform="translate(1280 0) scale(-1 1)" href=')
  .replace('A sculpted runner with a wrist smartwatch, tracking landmarks and binary notation.','A grey sculpted mannequin in a sprinting pose.')
  .replace('Un corredor con un reloj inteligente en la muñeca, puntos de seguimiento y notación binaria.','Un maniquí esculpido gris en posición de sprint.'));
 html=html.replace('<script src="/language.js" defer></script>','<script src="/hero-scroll.js?v=2" defer></script>');
 html=html.replace(/(<div class="hero-copy">[\s\S]*?<\/p>)/, '$1<a class="explore-work" href="#projects">'+(lang==='en'?'Explore my work':'Explorar mis proyectos')+' <span aria-hidden="true">↓</span></a>');
 html=html.replace('</header>','<span class="reading-progress" aria-hidden="true"></span></header>');
 html=html.replace('</head>','<link rel="stylesheet" href="/hero.css?v=17"></head>');
 html=html.replace(/(<svg class="hero-runner"[^>]*viewBox=")[^"]*(")/,'$10 0 1440 1320$2');
 html=html.replace(/(<svg class="hero-runner"[\s\S]*?)(<image )/,(_,before,image)=>before+binaryRipple()+image);
 html=html.replace('</head>','<style>@media(max-width:900px){.binary-ground .binary-extra{display:none}.binary-ground text{font-size:22px}}</style></head>');
 await writeFile('dist/'+lang+'/index.html',html);
}
await copyFile('source/hero-experiment.css','dist/hero.css');
await copyFile('source/hero-scroll.js','dist/hero-scroll.js');
await copyFile('source/assets/optimized/hero-runner-simple-1254.webp','dist/assets/hero-runner-simple.webp');
console.log('Built approved English/Spanish homepages.');
