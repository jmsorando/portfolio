import {readFile,writeFile,mkdir,copyFile,readdir} from 'node:fs/promises';
import {glucoseVisual} from './source/glucose-visual.mjs';
import {labVisual} from './source/lab-visual.mjs';
import {celonisVisual} from './source/celonis-visual.mjs';
import {pharmaVisual} from './source/pharmamiku-visual.mjs';

const prepared=JSON.parse(await readFile('source/assets/responsive/manifest.json','utf8'));
await mkdir('dist/assets/responsive',{recursive:true});
for(const file of await readdir('source/assets/responsive')) {
  if(file.endsWith('.webp'))await copyFile('source/assets/responsive/'+file,'dist/assets/responsive/'+file);
}
const compositions=[
  ['glucose-ensemble',1280,660,glucoseVisual],
  ['human-performance-lab',1400,Math.round(1400*901/1746),labVisual],
  ...['en','es'].flatMap(lang=>[
    [`celonis-${lang}`,1400,722,width=>celonisVisual(lang,width)],
    [`pharmamiku-${lang}`,1900,828,width=>pharmaVisual(lang,width)]
  ])
];
for(const [name,width,height,render] of compositions) {
  const variants=[];
  for(const size of [480,800]) {
    const src=`/assets/responsive/${name}-${size}.svg`;
    await writeFile('dist'+src,render(size));
    variants.push({src,width:size});
  }
  const src=`/assets/${name}.svg`;
  variants.push({src,width});
  prepared.images[src]={width,height,variants};
}
const documentDimensions={};
for(const file of Object.keys(prepared.documents)) {
  const png=await readFile('dist'+file);
  documentDimensions[file]={width:png.readUInt32BE(16),height:png.readUInt32BE(20)};
}
await writeFile('dist/projects/image-manifest.mjs',`export const IMAGES=${JSON.stringify(prepared.images)};\nexport const DOCUMENT_IMAGES=${JSON.stringify(prepared.documents)};\nexport const DOCUMENT_DIMENSIONS=${JSON.stringify(documentDimensions)};\n`);
await copyFile('source/image-delivery.mjs','dist/projects/image-delivery.mjs');
await copyFile('source/popup-image-loading.mjs','dist/projects/popup-image-loading.mjs');
console.log('Built responsive project images and pixel-exact document delivery copies.');
