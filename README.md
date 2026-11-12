# José Miguel Sorando — Portfolio

Static bilingual portfolio (`/en/` and `/es/`) presenting work across sport and exercise science, health technology, wearable validation, and artificial intelligence.

## Development

Edit English content in `source/template.html` and its paired Spanish translations in `source/es.json`, then run:

```bash
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
- No phone number, analytics scripts, tracking cookies, or third-party telemetry are included.
