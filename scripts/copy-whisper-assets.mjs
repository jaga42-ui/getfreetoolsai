// Self-hosts the Whisper transcription stack so /audio/transcribe never depends
// on a third-party CDN at runtime (transformers.js was loaded from jsdelivr and
// the model from Hugging Face). Copies:
//   1. the transformers.js web ESM bundle + its onnxruntime wasm  -> public/vendor/transformers
//   2. the whisper-base q8 (quantized) model + tokenizer/config    -> public/models/onnx-community/whisper-base
// Runs on pre(dev|build). The model files are downloaded once from Hugging Face
// and then cached locally; re-runs skip anything already present.
import {
  mkdirSync,
  copyFileSync,
  existsSync,
  statSync,
  createWriteStream,
  rmSync,
} from "fs";
import { dirname, join } from "path";
import { Readable } from "stream";
import { pipeline } from "stream/promises";

// ---- 1. transformers.js library + onnxruntime wasm ----
// (resolved relative to the project root, where npm scripts run)
const distDir = "node_modules/@huggingface/transformers/dist";
const VENDOR = "public/vendor/transformers";
mkdirSync(VENDOR, { recursive: true });
// transformers.min.js is the self-contained webpack ESM bundle (onnxruntime is
// bundled in; no bare imports), unlike transformers.web.min.js which expects a
// bundler to resolve onnxruntime. The jsep wasm is fetched at runtime alongside.
const LIB_FILES = [
  "transformers.min.js",
  "ort-wasm-simd-threaded.jsep.wasm",
  "ort-wasm-simd-threaded.jsep.mjs",
];
for (const f of LIB_FILES) {
  const src = join(distDir, f);
  const dest = join(VENDOR, f);
  if (!existsSync(src)) {
    console.warn(`! transformers dist missing ${f}`);
    continue;
  }
  if (existsSync(dest) && statSync(dest).size === statSync(src).size) continue;
  copyFileSync(src, dest);
}

// ---- 2. whisper-base q8 model ----
const REPO = "onnx-community/whisper-base";
const HF = `https://huggingface.co/${REPO}/resolve/main`;
const MODEL_DIR = join("public/models", REPO);
const MODEL_FILES = [
  "config.json",
  "generation_config.json",
  "preprocessor_config.json",
  "tokenizer.json",
  "tokenizer_config.json",
  "special_tokens_map.json",
  "added_tokens.json",
  "vocab.json",
  "merges.txt",
  "normalizer.json",
  "onnx/encoder_model_quantized.onnx",
  "onnx/decoder_model_merged_quantized.onnx",
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchOnce(rel, dest) {
  mkdirSync(dirname(dest), { recursive: true });
  const res = await fetch(`${HF}/${rel}`);
  if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
  try {
    await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
  } catch (e) {
    // Clean up any truncated file so a retry / next build re-downloads it
    // (otherwise the size>0 check below would skip a broken partial file).
    try { rmSync(dest, { force: true }); } catch {}
    throw e;
  }
  return statSync(dest).size;
}

// Retry transient failures (HF's CDN occasionally drops connections at build
// time — "fetch failed"). Exponential-ish backoff over a few attempts.
async function download(rel) {
  const dest = join(MODEL_DIR, rel);
  if (existsSync(dest) && statSync(dest).size > 0) return statSync(dest).size;
  const attempts = 5;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fetchOnce(rel, dest);
    } catch (e) {
      if (i === attempts) throw e;
      console.warn(`  retry ${i}/${attempts} ${rel}: ${e.message}`);
      await sleep(1000 * 2 ** (i - 1)); // 1s, 2s, 4s, 8s
    }
  }
  return 0;
}

let total = 0;
const failures = [];
for (const rel of MODEL_FILES) {
  try {
    total += await download(rel);
  } catch (e) {
    failures.push(rel);
    console.error(`! failed ${rel} after retries: ${e.message}`);
  }
}

if (failures.length) {
  // Don't fail the whole production build because a third-party download
  // flaked — that would block deploys of completely unrelated changes. The
  // transcription tool degrades (model 404s) until the next build re-fetches;
  // everything else ships. Surface it loudly so it's visible in build logs.
  console.warn(
    `\n⚠️  Whisper model incomplete — ${failures.length} file(s) failed to download ` +
      `(${failures.join(", ")}). /audio/transcribe may not work until a later build ` +
      `re-fetches them. NOT failing the build.\n`
  );
}
console.log(
  `whisper assets ready: ${VENDOR} (lib+wasm) + ${MODEL_DIR} model ` +
    `(${(total / 1048576).toFixed(1)}MB)`
);
