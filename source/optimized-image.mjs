import {readFileSync} from 'node:fs';

// Preserve SVG text and paths; only its embedded raster artwork is compressed.
// Embedded images keep these SVGs self-contained when used in <img> elements.
export function optimizedImage(name, width, deliveryWidth = width) {
 const path=deliveryWidth<width?`responsive/${name}-${deliveryWidth}.webp`:`optimized/${name}-${width}.webp`;
 return 'data:image/webp;base64,' + readFileSync(new URL(`./assets/${path}`, import.meta.url)).toString('base64');
}
