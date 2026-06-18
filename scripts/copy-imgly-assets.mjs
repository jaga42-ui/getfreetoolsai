// Self-hosts the @imgly/background-removal model + wasm so the Background
// Remover never depends on an external CDN (works offline, no "failed to fetch").
// Copies resources.json + only the content-hashed chunks for the resources we
// actually use into /public/imgly. Run on pre(dev|build).
import { createRequire } from "module";
import { mkdirSync, copyFileSync, writeFileSync, existsSync, statSync } from "fs";
import { dirname, join } from "path";

const require = createRequire(import.meta.url);
const manifestPath = require.resolve(
  "@imgly/background-removal-data/dist/resources.json"
);
const dataDir = dirname(manifestPath);
const manifest = require("@imgly/background-removal-data/dist/resources.json");

const OUT = "public/imgly";

// Resources to self-host: the model we use + every onnxruntime-web wasm build
// the browser might select. Modern onnxruntime-web (the version imgly ships)
// prefers the `.jsep` SIMD builds; omitting them caused those to 404 at runtime
// and cascade into fallback fetches for resources we don't use. We list the
// non-jsep CPU builds too so older/locked-down browsers still resolve locally.
const KEEP = [
  "/models/medium",
  "/onnxruntime-web/ort-wasm.wasm",
  "/onnxruntime-web/ort-wasm-simd.wasm",
  "/onnxruntime-web/ort-wasm-threaded.wasm",
  "/onnxruntime-web/ort-wasm-simd-threaded.wasm",
  "/onnxruntime-web/ort-wasm-simd.jsep.wasm",
  "/onnxruntime-web/ort-wasm-simd-threaded.jsep.wasm",
];

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "resources.json"), JSON.stringify(manifest));

const hashes = new Set();
for (const key of KEEP) {
  const entry = manifest[key];
  if (!entry) {
    console.warn(`! manifest missing ${key}`);
    continue;
  }
  for (const c of entry.chunks) hashes.add(c.hash);
}

let copied = 0;
let bytes = 0;
let skipped = 0;
for (const hash of hashes) {
  const dest = join(OUT, hash);
  const srcFile = join(dataDir, hash);
  if (existsSync(dest) && statSync(dest).size === statSync(srcFile).size) {
    skipped++;
    bytes += statSync(dest).size;
    continue;
  }
  copyFileSync(srcFile, dest);
  copied++;
  bytes += statSync(dest).size;
}

console.log(
  `imgly assets ready in ${OUT}: ${copied} copied, ${skipped} cached, ${(
    bytes / 1048576
  ).toFixed(1)}MB total (${hashes.size} chunks)`
);
