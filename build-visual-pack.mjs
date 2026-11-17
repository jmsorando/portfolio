import {readFile,writeFile,copyFile} from 'node:fs/promises';
const files=['mesh-cycle.png','mesh-run.jpg','mesh-box.jpg','mesh-football.png','mesh-celebrate.png'];
// Frame visible artwork rather than the original landscape canvas margins.
// All sports fit the runner's ~1080px visual envelope, centred at (660,630).
// Extra breathing room preserves hands, wheels, feet and the football.
const sportFrames=[
  {file:'mesh-run.jpg',viewBox:'310 40 920 910'},
  {file:'mesh-cycle.png',viewBox:'155 35 1200 925'},
  {file:'mesh-box.jpg',viewBox:'285 20 1000 940'},
  {file:'mesh-football.png',viewBox:'95 75 1350 875'}
];
for(const name of files)await copyFile(`source/assets/${name}`,`dist/assets/${name}`);
for(const name of ['visual-pack.css','visual-pack.js'])await copyFile(`source/${name}`,`dist/${name}`);
for(const lang of ['en','es']){
  let html=await readFile(`dist/${lang}/index.html`,'utf8');
  html=html.replace(/<svg class="hero-runner"[\s\S]*?<\/svg>/,svg=>{
    svg=svg.replace(/<desc id="figure-desc">[^<]*<\/desc>/,`<desc id="figure-desc">${lang==='es'?'Siluetas deportivas de malla azul que alternan entre carrera, ciclismo, boxeo y fútbol.':'Blue wireframe sports figures alternating between running, cycling, boxing and football.'}</desc>`);
    // Replace both the previous raster and its manually drawn pose overlay.
    svg=svg.replace(/<image[\s\S]*<\/svg>/,'</svg>');
    const frames=sportFrames.map(({file,viewBox},i)=>`<g class="hero-sport-slide${i===0?' is-active':''}" aria-hidden="true"><svg x="120" y="90" width="1080" height="1080" viewBox="${viewBox}" preserveAspectRatio="xMidYMid meet"><image href="/assets/${file}" width="1536" height="1024"/></svg></g>`).join('');
    return svg.replace('</svg>',`${frames}</svg>`);
  });
  html=html.replace(/(<section id="projects"[\s\S]*?<\/h2>)/,`$1<svg class="ecg" viewBox="0 0 600 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path class="ecg-track" d="M0,60 H140 q10,-14 20,0 h30 l6,-4 10,-40 10,60 8,-22 6,6 h40 q12,16 24,0 H600"/><path class="ecg-pulse" pathLength="100" d="M0,60 H140 q10,-14 20,0 h30 l6,-4 10,-40 10,60 8,-22 6,6 h40 q12,16 24,0 H600"/></svg>`);
  html=html.replace('/assets/hero-runner-cobalt.png" type="image/png"','/assets/mesh-run.jpg" type="image/jpeg"');
  // Recolour the supplied artwork at render time: discard the light canvas,
  // preserve the mesh opacity and use the same light blue as the project accents.
  html=html.replace(/(<section id="contact"[\s\S]*?)(\s*<\/div>\s*<\/section>)/,`$1
        <figure class="contact-mesh" aria-hidden="true">
          <svg viewBox="480 20 670 960" xmlns="http://www.w3.org/2000/svg" focusable="false">
            <defs><filter id="contact-mesh-blue" color-interpolation-filters="sRGB" x="0" y="0" width="100%" height="100%">
              <feColorMatrix type="matrix" values="0 0 0 0 0.576 0 0 0 0 0.773 0 0 0 0 0.992 -0.625 -2.125 -0.25 0 2.875"/>
            </filter></defs>
            <image href="/assets/mesh-celebrate.png" width="1536" height="1024" filter="url(#contact-mesh-blue)"/>
          </svg>
        </figure>$2`);
  html=html.replace('</head>','<link rel="stylesheet" href="/visual-pack.css?v=9"><script src="/visual-pack.js?v=5" defer></script></head>');
  await writeFile(`dist/${lang}/index.html`,html);
}
console.log('Built decorative movement figures, signal and progressive heading reveals.');


