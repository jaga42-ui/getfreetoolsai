/// <reference lib="webworker" />
// Whisper speech-to-text in a Web Worker. transformers.js is loaded from a CDN
// at runtime (webpackIgnore) rather than bundled, so the heavy onnxruntime-web
// engine never goes through our bundler — this sidesteps a known webpack
// integration wall and keeps the app bundle small. The model + engine download
// once and are cached; the audio itself never leaves the device.

// Annotated as `string` (not a literal) so TypeScript treats the dynamic import
// as runtime-only and doesn't try to resolve the URL as a module.
const TRANSFORMERS_CDN: string =
  "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3/+esm";

type ProgressItem = { status: string; file?: string; progress?: number };
type AsrOutput = {
  text: string;
  chunks?: { timestamp: [number, number | null]; text: string }[];
};
type Asr = (audio: Float32Array, opts: Record<string, unknown>) => Promise<AsrOutput>;
type TransformersModule = {
  pipeline: (task: string, model: string, opts: Record<string, unknown>) => Promise<Asr>;
  env: { allowLocalModels: boolean };
};

let asrPromise: Promise<Asr> | null = null;

function getAsr(): Promise<Asr> {
  if (asrPromise) return asrPromise;
  asrPromise = (async () => {
    const mod = (await import(/* webpackIgnore: true */ TRANSFORMERS_CDN)) as TransformersModule;
    mod.env.allowLocalModels = false;
    const hasWebGPU =
      typeof navigator !== "undefined" &&
      "gpu" in navigator &&
      (navigator as unknown as { gpu?: unknown }).gpu != null;
    return mod.pipeline(
      "automatic-speech-recognition",
      "onnx-community/whisper-base",
      {
        device: hasWebGPU ? "webgpu" : "wasm",
        dtype: hasWebGPU ? "fp16" : "q8",
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
