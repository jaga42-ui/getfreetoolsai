// Self-hosts the single-threaded ffmpeg.wasm core so the video tools never
// depend on a third-party CDN (unpkg) at runtime — same privacy guarantee as
// the Whisper/imgly self-hosting. Runs on pre(dev|build).
//
// We ship the ESM core (dist/esm) on purpose: @ffmpeg/ffmpeg loads its worker
// as a `type: "module"` worker, which cannot use importScripts and instead does
// `await import(coreURL)` — so the core must be an ES module. Single-threaded
// (no -mt) means no SharedArrayBuffer, so we do NOT need cross-origin isolation
// (COOP/COEP) headers, which would break AdSense.
import { mkdirSync, copyFileSync, existsSync, statSync } from "fs";
import { join } from "path";

const OUT = "public/ffmpeg";
// [sourcePath, destName]. The ESM core (loaded via native import() in the
// worker) + our hand-written static worker that sidesteps webpack's import shim.
const FILES = [
  ["node_modules/@ffmpeg/core/dist/esm/ffmpeg-core.js", "ffmpeg-core.js"],
  ["node_modules/@ffmpeg/core/dist/esm/ffmpeg-core.wasm", "ffmpeg-core.wasm"],
  ["scripts/ffmpeg-worker.js", "gft-worker.js"],
];

mkdirSync(OUT, { recursive: true });

let copied = 0;
let total = 0;
for (const [src, name] of FILES) {
  const dest = join(OUT, name);
  if (!existsSync(src)) {
    console.warn(`! ffmpeg asset missing ${src}`);
    continue;
  }
  total += statSync(src).size;
  // Skip if an identical-size copy already exists.
  if (existsSync(dest) && statSync(dest).size === statSync(src).size) continue;
  copyFileSync(src, dest);
  copied++;
}

console.log(
  `ffmpeg assets ready: ${OUT} (${FILES.length} files, ${(total / 1048576).toFixed(1)}MB` +
    `${copied ? `, ${copied} copied` : ", cached"})`
);
