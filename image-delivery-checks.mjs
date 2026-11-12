import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {IMAGES,DOCUMENT_IMAGES} from './dist/projects/image-manifest.mjs';
import {responsiveMarkup,documentSource,AREA_SIZES,DETAIL_SIZES} from './dist/projects/image-delivery.mjs';
import {AREAS,LAB_VISUALS} from './source/project-areas-model.mjs';
import {MATERIALS} from './source/project-preview-model.mjs';

for(const [source,record] of Object.entries(IMAGES)) {
  const originalSize=(await stat('dist'+source)).size;
  assert(record.width>0&&record.height>0);
  assert.equal(record.variants.at(-1).src,source,'Full-size approved artwork remains available');
  let previous=0;
  for(const variant of record.variants){
    assert(variant.width>previous);previous=variant.width;
    assert((await stat('dist'+variant.src)).size<=originalSize,'Responsive delivery is no heavier than the original');
  }
  const markup=responsiveMarkup(`<img src="${source}?v=old" alt="Original description" loading="lazy">`,DETAIL_SIZES,'eager');
  assert(markup.includes('alt="Original description"'));
  assert(markup.includes('srcset=')&&markup.includes('decoding="async"')&&markup.includes('loading="eager"'));
  assert(markup.includes(`width="${record.width}" height="${record.height}"`));
  assert.equal((markup.match(/\ssrc=/g)||[]).length,1);
}
for(const {visual} of AREAS)assert(IMAGES[visual.src]);
for(const visual of Object.values(LAB_VISUALS))assert(IMAGES[visual.src]);
assert(AREA_SIZES.includes('768px')&&DETAIL_SIZES.includes('1024px'));
assert.equal(responsiveMarkup('<img src="/assets/orb-logo.svg" alt="ORB">',AREA_SIZES),'<img src="/assets/orb-logo.svg" alt="ORB">','Vector logos remain intact');
for(const [original,copy] of Object.entries(DOCUMENT_IMAGES)){
  assert((await stat('dist'+copy)).size<(await stat('dist'+original)).size);
  assert.equal(documentSource(original),copy);
}
for(const record of Object.values(MATERIALS).flat())for(const page of record.pages||[record.file])assert(DOCUMENT_IMAGES[page],'Optimize every original document image');
assert.equal(documentSource('/future.pdf'),'/future.pdf');
const lab=await readFile('dist/assets/human-performance-lab.svg','utf8');
assert.equal((lab.match(/data:image\/webp;base64/g)||[]).length,1,'Shared mask/treadmill raster is embedded once');
assert.equal((lab.match(/<use href="#lab-artwork"/g)||[]).length,2);
for(const lang of ['en','es']){
  const html=await readFile(`dist/${lang}/index.html`,'utf8');
  assert(html.includes('as="image" href="/assets/hero-runner-simple.webp" type="image/webp" fetchpriority="high"'));
  assert(!/<link[^>]+rel="preload"[^>]+materials/.test(html),'Full documents are not downloaded on homepage load');
}
console.log('PASS: responsive widths, preserved artwork/alt text, smaller delivery files, retained originals, demand-loaded documents and deduplicated SVG raster.');
