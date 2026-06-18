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

async function download(rel) {
  const dest = join(MODEL_DIR, rel);
  if (existsSync(dest) && statSync(dest).size > 0) return statSync(dest).size;
  mkdirSync(dirname(dest), { recursive: true });
  const res = await fetch(`${HF}/${rel}`);
  if (!res.ok || !res.body) throw new Error(`${rel} -> ${res.status}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
  return statSync(dest).size;
}

let total = 0;
for (const rel of MODEL_FILES) {
  try {
    total += await download(rel);
  } catch (e) {
    console.error(`! failed ${rel}: ${e.message}`);
    process.exitCode = 1;
  }
}
console.log(
  `whisper assets ready: ${VENDOR} (lib+wasm) + ${MODEL_DIR} model ` +
    `(${(total / 1048576).toFixed(1)}MB)`
);
