# GetFreeToolsAI

Free online PDF & image tools. No signup, no limits, no uploads — every tool
runs **100% in the browser**, so files never leave the user's device.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (custom dark theme)
- `pdf-lib` · `pdfjs-dist` · `tesseract.js` · `heic2any` ·
  `browser-image-compression` · `jszip`
- Lucide icons · deploys on Vercel

All heavy libraries are lazy-loaded with `next/dynamic` (`ssr: false`) so the
homepage and shared bundle stay tiny (~87 kB First Load JS).

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

`predev` / `prebuild` copy the pinned `pdfjs-dist` web worker into `/public`
(`scripts/copy-pdf-worker.mjs`) so it is served as a static module worker.

```bash
npm run build && npm run start   # production
```

## Tools implemented (all 17)

### PDF
| Tool | Route | Library |
| --- | --- | --- |
| Compress PDF | `/pdf/compress` | pdfjs-dist + pdf-lib (rasterize & re-encode) |
| Merge PDF | `/pdf/merge` | pdf-lib |
| Split PDF | `/pdf/split` | pdf-lib |
| PDF to JPG | `/pdf/pdf-to-jpg` | pdfjs-dist |
| JPG to PDF | `/pdf/jpg-to-pdf` | pdf-lib |
| Unlock PDF | `/pdf/unlock` | pdfjs-dist + pdf-lib |
| Rotate PDF | `/pdf/rotate` | pdf-lib |
| PDF to Word | `/pdf/pdf-to-word` | pdfjs-dist (text layer) → .docx |
| PDF OCR | `/pdf/ocr` | pdfjs-dist + tesseract.js |

### Image
| Tool | Route | Library |
| --- | --- | --- |
| Compress Image to exact KB | `/image/compress` | canvas (binary-search to target) |
| HEIC to JPG | `/image/heic-to-jpg` | heic2any |
| Background Remover | `/image/background-remover` | @imgly/background-removal — **self-hosted** ISNet model |
| Convert Image | `/image/convert` | canvas + custom BMP encoder |
| Resize Image | `/image/resize` | canvas |
| Crop Image | `/image/crop` | canvas (drag-to-select) |
| Remove EXIF | `/image/remove-exif` | canvas re-encode (strips metadata) |
| Image to Text | `/image/image-to-text` | tesseract.js |

> **Background Remover — fully self-hosted & bulletproof:** the high-quality
> ISNet (`medium`) model and the ONNX-Runtime wasm are copied out of
> `@imgly/background-removal-data` into `/public/imgly` at build time
> (`scripts/copy-imgly-assets.mjs`, ~123 MB, git-ignored) and loaded from your
> own origin via `publicPath`. **No third-party CDN, no version drift, works
> offline** after the first load, and the image never leaves the browser. The
> tool also composites the cutout onto transparent / white / black / custom
> backgrounds. (OCR still fetches its language models from a CDN on demand.)
>
> Because the model assets are ~123 MB of static files, the Vercel build copies
> them from `node_modules` during `prebuild` — they are not committed to git.

## Project layout

- `app/` — routes; each tool page exports SEO metadata and lazy-loads its client component.
- `components/` — shared UI (Navbar, Footer, DropZone, ToolCard, ToolScaffold, etc.)
- `components/tools/` — the per-tool client components (all processing logic).
- `lib/` — helpers (`tools.ts` registry, `image.ts`, `pdfjs.ts`, `docx.ts`, `zip.ts`, `utils.ts`).
