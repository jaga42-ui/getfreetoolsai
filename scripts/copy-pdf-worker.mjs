// Copies the pinned pdfjs-dist worker into /public so it can be served as a
// static module worker. This avoids webpack/Terser trying to minify the .mjs
// worker (which fails because it contains top-level import/export).
import { copyFileSync, mkdirSync } from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const src = require.resolve("pdfjs-dist/build/pdf.worker.min.mjs");

mkdirSync("public", { recursive: true });
copyFileSync(src, "public/pdf.worker.min.mjs");
console.log(`Copied ${src} -> public/pdf.worker.min.mjs`);
