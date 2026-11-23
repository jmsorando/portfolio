# José Miguel Sorando — Portfolio

Static bilingual portfolio (`/en/` and `/es/`) presenting work across sport and exercise science, health technology, wearable validation, and artificial intelligence.

## Development

Edit English content in `source/template.html` and its paired Spanish translations in `source/es.json`, then run:

```bash
npm ci
npm run build
npm run check
```

Preview locally from the `dist` directory:

```bash
python -m http.server 4173 --directory dist
```

Then visit `http://localhost:4173/en/` or `http://localhost:4173/es/`.

## Privacy & Design Notes

- All project charts and smartwatch traces are conceptual illustrations, not participant measurements.
- Supporting project posters, certificates, and reference pages are delivered as clean WebP/PNG visuals inside the in-page viewer without exposing raw editable `.pptx` or `.pdf` files.
- The viewer also provides original-language HTML reading alternatives in `source/transcripts/`. Tables preserve printed values, including inconsistencies in the originals; chart descriptions are labelled separately. The tiny chart labels in the PharmaMiku source image cannot be transcribed reliably and are explicitly identified as such.
- Tailwind 3.4.17 is compiled locally using `tailwind.config.cjs`, after the bilingual pages are generated. The scan includes JavaScript templates; no Tailwind CDN script runs in visitors' browsers.
- The hero motion control pauses decorative animations and figure rotation, remembers the choice for the browser session and honours the system's reduced-motion preference.
- No phone number, analytics scripts, tracking cookies, or third-party telemetry are included.
