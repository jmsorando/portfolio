import {optimizedImage} from './optimized-image.mjs';
export function glucoseVisual(deliveryWidth=1280){
const img=optimizedImage('glucose-cgm-meal-refined',1280,deliveryWidth);
const arm=optimizedImage('glucose-cgm-arm-darker',1280,deliveryWidth);
// Move the original cutouts apart without changing their scale or proportions.
return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 330">
<defs>
<clipPath id="meal"><rect x="280" width="360" height="215"/></clipPath>
<clipPath id="arm"><path d="M0 0H280V215H640V330H0Z"/></clipPath>
</defs>
<g transform="translate(-8 16)"><image href="${arm}" width="640" height="330" preserveAspectRatio="xMidYMid meet" clip-path="url(#arm)"/></g>
<g transform="translate(8 -16)"><image href="${img}" width="640" height="330" preserveAspectRatio="xMidYMid meet" clip-path="url(#meal)"/></g>
</svg>`;
}

