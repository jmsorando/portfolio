// Speculative requests are limited to user intent; never preload every document.
export function createImageWarmer({createImage=()=>new Image(),connection,limit=16}={}) {
  const recent=new Map();
  return function warm({src,srcset='',sizes=''}) {
    if(!src||connection?.saveData||/^(slow-)?2g$/.test(connection?.effectiveType||''))return;
    const key=[src,srcset,sizes].join('|');
    if(recent.has(key))return;
    recent.set(key,true);
    while(recent.size>limit)recent.delete(recent.keys().next().value);
    const image=createImage();image.decoding='async';image.fetchPriority='low';
    image.onerror=()=>{recent.delete(key);image.onload=image.onerror=null;};
    image.onload=()=>{image.onload=image.onerror=null;};
    if(sizes)image.sizes=sizes;
    if(srcset)image.srcset=srcset;
    image.src=src;
  };
}

// Decode off-screen, then replace the preview atomically. A stale page request
// must never overwrite a newly selected page or a closed/reopened dialog.
export function loadDocumentImage({preview,full,original,onDisplay,onError,createImage=()=>new Image()}) {
  let cancelled=false,fullReady=false;
  const pending=[];
  function request(src,isFull) {
    const image=createImage();pending.push(image);
    image.decoding='async';image.fetchPriority=isFull?'high':'auto';
    image.onload=async()=>{
      try { if(image.decode)await image.decode(); } catch { /* onload still guarantees a usable image */ }
      if(cancelled||(!isFull&&fullReady))return;
      if(isFull)fullReady=true;
      onDisplay({src,width:image.naturalWidth,height:image.naturalHeight,full:isFull});
    };
    image.onerror=()=>{
      if(cancelled||!isFull)return;
      if(original&&src!==original)request(original,true);
      else onError();
    };
    image.src=src;
  }
  if(preview&&preview!==full)request(preview,false);
  request(full,true);
  return ()=>{cancelled=true;for(const image of pending)image.onload=image.onerror=null;};
}
