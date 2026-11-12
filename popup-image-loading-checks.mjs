import assert from 'node:assert/strict';
import {createImageWarmer,loadDocumentImage} from './source/popup-image-loading.mjs';
import {DOCUMENT_DIMENSIONS} from './dist/projects/image-manifest.mjs';
import {readFile} from 'node:fs/promises';

function fakeImages() {
  const images=[];
  return {images,createImage(){
    const image={naturalWidth:2405,naturalHeight:3400,decode:async()=>{},src:''};
    images.push(image);return image;
  }};
}
// A small preview appears first; full resolution replaces it exactly once.
{
  const mock=fakeImages(),shown=[];
  loadDocumentImage({...mock,preview:'thumb',full:'full',onDisplay:x=>shown.push(x),onError:()=>assert.fail('Unexpected failure')});
  await mock.images[0].onload();await mock.images[1].onload();
  assert.deepEqual(shown.map(x=>[x.src,x.full]),[['thumb',false],['full',true]]);
}
// A cached original must not be overwritten by a slower thumbnail.
{
  const mock=fakeImages(),shown=[];
  loadDocumentImage({...mock,preview:'thumb',full:'full',onDisplay:x=>shown.push(x),onError:()=>{}});
  await mock.images[1].onload();await mock.images[0].onload();
  assert.deepEqual(shown.map(x=>x.src),['full']);
}
// Closing or switching pages while decode is pending cannot update stale UI.
{
  const mock=fakeImages(),shown=[];let resolve;
  const cancel=loadDocumentImage({...mock,full:'full',onDisplay:x=>shown.push(x),onError:()=>{}});
  mock.images[0].decode=()=>new Promise(r=>resolve=r);
  const pending=mock.images[0].onload();cancel();resolve();await pending;
  assert.equal(shown.length,0);assert.equal(mock.images[0].onerror,null);
}
// If optimized delivery fails, recover the original image without losing zoom.
{
  const mock=fakeImages(),shown=[];let failures=0;
  loadDocumentImage({...mock,full:'full.webp',original:'original.png',onDisplay:x=>shown.push(x),onError:()=>failures++});
  mock.images[0].onerror();assert.equal(mock.images[1].src,'original.png');
  await mock.images[1].onload();assert.equal(shown[0].full,true);assert.equal(failures,0);
}
// The final failure is reported once; preview failure alone is harmless.
{
  const mock=fakeImages();let failures=0;
  loadDocumentImage({...mock,preview:'thumb',full:'full',onDisplay:()=>{},onError:()=>failures++});
  mock.images[0].onerror();assert.equal(failures,0);
  mock.images[1].onerror();assert.equal(failures,1);
}
// Warming respects reduced-data connections, is bounded and deduplicates requests.
{
  for(const connection of [{saveData:true},{effectiveType:'2g'},{effectiveType:'slow-2g'}]){
    const mock=fakeImages();createImageWarmer({...mock,connection})({src:'full'});assert.equal(mock.images.length,0);
  }
  const mock=fakeImages(),warm=createImageWarmer({...mock,limit:2});
  warm({src:'a',srcset:'a 480w, b 800w',sizes:'400px'});warm({src:'a',srcset:'a 480w, b 800w',sizes:'400px'});
  assert.equal(mock.images.length,1);assert.equal(mock.images[0].fetchPriority,'low');
  assert.equal(mock.images[0].srcset,'a 480w, b 800w');
  mock.images[0].onerror();warm({src:'a',srcset:'a 480w, b 800w',sizes:'400px'});assert.equal(mock.images.length,2);
  warm({src:'b'});warm({src:'c'});warm({src:'a'});assert.equal(mock.images.length,5);
}
for(const [path,size] of Object.entries(DOCUMENT_DIMENSIONS)) {
  const png=await readFile('dist'+path);
  assert.deepEqual(size,{width:png.readUInt32BE(16),height:png.readUInt32BE(20)});
}
const script=await readFile('dist/projects/areas.js','utf8');
assert(script.includes('disabled=!documentFullReady||zoom>=300'),'Zoom never enlarges only the preview');
assert(script.includes('cancelDocumentLoad?.()'),'Page changes and close cancel obsolete callbacks');
console.log('PASS: preview/full resolution sequencing, stale request cancellation, original fallback, intent-only warming, data-saver handling and original document dimensions.');
