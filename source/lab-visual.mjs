import {optimizedImage} from './optimized-image.mjs';

// Reposition the two existing cutouts without regenerating their artwork.
export function labVisual(deliveryWidth=1400){
 const image=optimizedImage('human-performance-lab',1400,deliveryWidth);
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1746 901">
 <defs><image id="lab-artwork" href="${image}" width="1746" height="901"/><clipPath id="mask"><rect width="830" height="901"/></clipPath><clipPath id="treadmill"><rect x="830" width="916" height="901"/></clipPath></defs>
 <g transform="translate(-95 0) translate(460 455) scale(1.06) translate(-460 -455)"><use href="#lab-artwork" clip-path="url(#mask)"/></g>
 <g transform="translate(95 0) translate(1220 455) scale(1.06) translate(-1220 -455)"><use href="#lab-artwork" clip-path="url(#treadmill)"/></g>
 </svg>`;
}
