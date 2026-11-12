import {readFileSync} from 'node:fs';
import {optimizedImage} from './optimized-image.mjs';
export function celonisVisual(lang,deliveryWidth=1400){
 const img=optimizedImage('celonis-catheter-learning',1400,deliveryWidth);
 const paper=optimizedImage('celonis-kpi-paper',1400,deliveryWidth);
 const logo=readFileSync(new URL('./assets/celonis-logo.svg',import.meta.url),'utf8').match(/<path\b[^>]*\/>/g).join('').replace(/class="s0"/g,'fill="#ffffff"').replace(/ id="[^"]*"/g,'');
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 330">
 <svg x="20" y="20" width="600" height="270" viewBox="0 0 1747 900">
 <defs>
 <clipPath id="catheter-only"><rect width="1333" height="900"/></clipPath>
 <clipPath id="kpi-paper-only"><path d="M1428 215L1706 223L1629 644L1337 634Z"/></clipPath>
 </defs>
 <g transform="translate(-40 0)">
 <image href="${img}" width="1747" height="900" clip-path="url(#catheter-only)"/>
 </g>
 <g transform="translate(1522 430) scale(1.15) translate(-1522 -430)">
 <image href="${paper}" width="1747" height="900" clip-path="url(#kpi-paper-only)"/>
 </g>
 </svg>
 <g transform="translate(27 256) scale(.0932)" shape-rendering="geometricPrecision">${logo}</g>
 </svg>`;
}
