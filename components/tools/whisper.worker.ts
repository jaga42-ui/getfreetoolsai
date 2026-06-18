/// <reference lib="webworker" />
// Whisper speech-to-text in a Web Worker. The transformers.js engine, the
// onnxruntime wasm, AND the whisper-base model are all self-hosted under our
// own origin (/vendor/transformers and /models, populated by
// scripts/copy-whisper-assets.mjs). Nothing is fetched from a third-party CDN
// at runtime, and the audio itself never leaves the device. The library is
// still loaded via a runtime dynamic import (webpackIgnore) so onnxruntime
// never goes through our bundler.

// Self-hosted, same-origin URLs. Built from self.location.origin so they're
// absolute (and so TypeScript treats the import as runtime-only).
const ORIGIN = self.location.origin;
const TRANSFORMERS_URL: string = `${ORIGIN}/vendor/transformers/transformers.min.js`;

type ProgressItem = { status: string; file?: string; progress?: number };
type AsrOutput = {
  text: string;
  chunks?: { timestamp: [number, number | null]; text: string }[];
};
type Asr = (audio: Float32Array, opts: Record<string, unknown>) => Promise<AsrOutput>;
type TransformersModule = {
  pipeline: (task: string, model: string, opts: Record<string, unknown>) => Promise<Asr>;
  env: {
    allowRemoteModels: boolean;
    allowLocalModels: boolean;
    localModelPath: string;
    backends: { onnx: { wasm: { wasmPaths: string } } };
  };
};

let asrPromise: Promise<Asr> | null = null;

function getAsr(): Promise<Asr> {
  if (asrPromise) return asrPromise;
  asrPromise = (async () => {
    const mod = (await import(/* webpackIgnore: true */ TRANSFORMERS_URL)) as TransformersModule;
    // Resolve the model + wasm from our own origin only.
    mod.env.allowRemoteModels = false;
    mod.env.allowLocalModels = true;
    mod.env.localModelPath = `${ORIGIN}/models/`;
    mod.env.backends.onnx.wasm.wasmPaths = `${ORIGIN}/vendor/transformers/`;

    const hasWebGPU =
      typeof navigator !== "undefined" &&
      "gpu" in navigator &&
      (navigator as unknown as { gpu?: unknown }).gpu != null;
    return mod.pipeline(
      "automatic-speech-recognition",
      "onnx-community/whisper-base",
      {
        device: hasWebGPU ? "webgpu" : "wasm",
        // We self-host the q8 (quantized) weights only, which run on both the
        // wasm and WebGPU execution providers.
        dtype: "q8",
        progress_callback: (p: ProgressItem) =>
          self.postMessage({ type: "progress", data: p }),
      }
    );
  })();
  return asrPromise;
}

self.addEventListener(
  "message",
  async (event: MessageEvent<{ audio: Float32Array; language?: string }>) => {
    const { audio, language } = event.data;
    try {
      const asr = await getAsr();
      self.postMessage({ type: "status", data: "transcribing" });
      const output = await asr(audio, {
        return_timestamps: true,
        chunk_length_s: 30,
        stride_length_s: 5,
        language: language || undefined,
        task: "transcribe",
      });
      self.postMessage({ type: "done", data: output });
    } catch (err) {
      self.postMessage({
        type: "error",
        data: err instanceof Error ? err.message : String(err),
      });
    }
  }
);
