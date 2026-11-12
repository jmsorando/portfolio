import {glucoseVisual} from './source/glucose-visual.mjs';
import {labVisual} from './source/lab-visual.mjs';
import {celonisVisual} from './source/celonis-visual.mjs';
import {readFile,writeFile,mkdir,copyFile,rm} from 'node:fs/promises';
import {pharmaVisual} from './source/pharmamiku-visual.mjs';

const origin='https://jmsorando.github.io/portfolio';
await rm('dist',{recursive:true,force:true});
let template=(await readFile('source/template.html','utf8')).replace(/\r\n/g,'\n');
const es=JSON.parse(await readFile('source/es.json','utf8'));
template=template.replace('href="refinements.css"','href="/refinements.css?v=project-dialog-3"');
template=template.replace('<body class=', '<body id="top" class=');
template=template.replace('href="#" class="font-display','href="#top" class="font-display');
template=template.replace("            document.execCommand('copy');\n            document.body.removeChild(el);\n            triggerToast(\"Email copied to clipboard: \" + email);", "            const copied = document.execCommand('copy');\n            document.body.removeChild(el);\n            triggerToast(copied ? \"Email copied to clipboard: \" + email : \"Copy unavailable. Please select the email address above.\");");
const keys=Object.keys(es).sort((a,b)=>b.length-a.length);
for(const key of keys)if(!template.includes(key))throw new Error(`Translation source missing: ${key}`);
const pattern=new RegExp(keys.map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'g');
const metadata={
 en:{description:'José Miguel Sorando Campillo: sport and exercise science, health technology, wearable validation, and artificial intelligence.',language:'Language',skip:'Skip to projects'},
 es:{description:'José Miguel Sorando Campillo: ciencias del deporte y del ejercicio, tecnología para la salud, validación de wearables e inteligencia artificial.',language:'Idioma',skip:'Saltar a los proyectos'}
};
for(const lang of ['en','es']){
 let html=lang==='es'?template.replace(pattern,match=>es[match]):template;
 html=html.replaceAll('/assets/orb-mouthguard-cutout.png','/assets/orb-mouthguard-cutout.webp')
  .replaceAll('/assets/polar-h10-strap.png','/assets/polar-h10-strap.webp')
  .replace("type === 'glucose' ? 'svg' : 'png'", "type === 'glucose' ? 'svg' : type === 'dresio' ? 'webp' : 'png'")
  .replaceAll('loading="lazy"','loading="lazy" decoding="async"');
 if(lang==='en'){
  html=html.replace('First Class Honors dissertation nominated for UCL Dean\'s Research Prize; investigated physiological, dietary, sleep, and behavioral contributors using SHAP.','First Class dissertation investigating physiological, dietary, sleep, and behavioral contributors using SHAP.');
 }
 html=html.replace('<html lang="en"',`<html lang="${lang}"`);
 const m=metadata[lang];
 html=html.replace('</head>',`<meta name="description" content="${m.description}">
 <meta name="theme-color" content="#FAF9F6">
 <link rel="canonical" href="${origin}/${lang}/">
 <link rel="alternate" hreflang="en" href="${origin}/en/">
 <link rel="alternate" hreflang="es" href="${origin}/es/">
 <link rel="alternate" hreflang="x-default" href="${origin}/en/">
 <link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml">
 <script src="/language.js" defer></script>
 </head>`);
 html=html.replace('    <!-- TOP HEADER',`    <a class="skip-link" href="#projects">${m.skip}</a>\n    <!-- TOP HEADER`);
 html=html.replace('                <!-- Action Links -->',`                <div class="language-picker" role="group" aria-label="${m.language}">
 <a href="/en/" lang="en" hreflang="en" data-language="en" aria-label="English" ${lang==='en'?'aria-current="page"':''}>EN</a><span aria-hidden="true">/</span><a href="/es/" lang="es" hreflang="es" data-language="es" aria-label="Español" ${lang==='es'?'aria-current="page"':''}>ES</a></div>
                <!-- Action Links -->`);
 await mkdir(`dist/${lang}`,{recursive:true});await writeFile(`dist/${lang}/index.html`,html);
}
await copyFile('source/styles.css','dist/refinements.css');
await copyFile('source/language.js','dist/language.js');
await copyFile('source/favicon.svg','dist/favicon.svg');
await writeFile('dist/index.html',`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>José Miguel Sorando Campillo</title><meta http-equiv="refresh" content="0;url=/en/"><script>location.replace('/en/'+location.search+location.hash)</script></head><body><a href="/en/">English</a> · <a href="/es/">Español</a></body></html>`);
console.log(`Built main portfolio in English and Spanish (${keys.length} translation entries).`);

await mkdir('dist/assets',{recursive:true});
await writeFile('dist/assets/glucose-ensemble.svg',glucoseVisual());
await writeFile('dist/assets/human-performance-lab.svg',labVisual());
for(const lang of ['en','es']) await writeFile(`dist/assets/pharmamiku-${lang}.svg`,pharmaVisual(lang));
for(const lang of ['en','es']) await writeFile(`dist/assets/celonis-${lang}.svg`,celonisVisual(lang));
for(const name of ['dresio-logo.png','orb-logo.svg']) await copyFile(`source/assets/${name}`,`dist/assets/${name}`);
for(const [name,width] of [['orb-mouthguard-cutout',900],['polar-h10-strap',568],['dresio-lunge-two-legs',1280]]) {
 await copyFile(`source/assets/optimized/${name}-${width}.webp`,`dist/assets/${name}.webp`);
}
