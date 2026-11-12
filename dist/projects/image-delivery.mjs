import {IMAGES, DOCUMENT_IMAGES, DOCUMENT_DIMENSIONS} from './image-manifest.mjs?v=5';

// Width hints describe the existing layout; the browser chooses for viewport + DPR.
export const AREA_SIZES='(min-width: 1280px) 390px, (min-width: 1024px) calc((100vw - 112px) / 3), (min-width: 768px) calc((100vw - 88px) / 2), calc(100vw - 64px)';
export const DETAIL_SIZES='(min-width: 1344px) 612px, (min-width: 1024px) calc((100vw - 168px) * .52), calc(100vw - 80px)';
export function selectionSizes(count) {
  return count===2
    ? '(min-width: 1344px) 596px, (min-width: 768px) calc((100vw - 152px) / 2), calc(100vw - 80px)'
    : '(min-width: 1344px) 389px, (min-width: 1024px) calc((100vw - 176px) / 3), (min-width: 768px) calc((100vw - 152px) / 2), calc(100vw - 80px)';
}
export function responsiveMarkup(markup, sizes, loading='lazy') {
  return markup.replace(/<img\b[^>]*>/g, tag=>{
    const url=tag.match(/\bsrc="([^"]+)"/)?.[1]?.split('?')[0];
    const record=IMAGES[url];
    if(!record)return tag;
    tag=tag.replace(/\s(?:src|srcset|sizes|width|height|loading|decoding)="[^"]*"/g,'');
    const srcset=record.variants.map(v=>`${v.src} ${v.width}w`).join(', ');
    return tag.replace(/\/?\s*>$/,` src="${record.variants[0].src}" srcset="${srcset}" sizes="${sizes}" width="${record.width}" height="${record.height}" loading="${loading}" decoding="async">`);
  });
}
// Same pixels and resolution as the source PNG; originals remain downloadable.
export function documentSource(url) { return DOCUMENT_IMAGES[url] || url; }
export function documentDimensions(url) { return DOCUMENT_DIMENSIONS[url]; }
