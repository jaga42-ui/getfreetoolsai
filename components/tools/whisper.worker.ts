/// <reference lib="webworker" />
// Web Worker that runs Whisper speech-to-text fully in the browser via
// transformers.js. Keeping inference off the main thread means the UI stays
// responsive while a clip is transcribed. The model downloads once (from the
// Hugging Face CDN) and is cached; the audio itself never leaves the device.
import {
  pipeline,
  env,
  type AutomaticSpeechRecognitionPipeline,
} from "@huggingface/transformers";

// We don't ship a local copy of the model (yet) — fetch it from the hub once.
env.allowLocalModels = false;

type IncomingMessage = {
  audio: Float32Array;
  language?: string;
};

type ProgressItem = { status: string; file?: string; progress?: number };

let transcriber: AutomaticSpeechRecognitionPipeline | null = null;

async function getTranscriber(): Promise<AutomaticSpeechRecognitionPipeline> {
  if (transcriber) return transcriber;
  const hasWebGPU =
    typeof navigator !== "undefined" &&
    "gpu" in navigator &&
    (navigator as unknown as { gpu?: unknown }).gpu != null;
  transcriber = (await pipeline(
    "automatic-speech-recognition",
    "onnx-community/whisper-base",
    {
      device: hasWebGPU ? "webgpu" : "wasm",
      dtype: hasWebGPU ? "fp16" : "q8",
      progress_callback: (p: ProgressItem) =>
        self.postMessage({ type: "progress", data: p }),
    }
  )) as AutomaticSpeechRecognitionPipeline;
  return transcriber;
}

self.addEventListener("message", async (event: MessageEvent<IncomingMessage>) => {
  const { audio, language } = event.data;
  try {
    const asr = await getTranscriber();
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
});
