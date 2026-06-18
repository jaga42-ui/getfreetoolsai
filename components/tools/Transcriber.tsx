"use client";

import { useEffect, useRef, useState } from "react";
import { Download, RotateCcw, Captions, FileText, Copy, Check } from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { Button, ErrorMessage } from "@/components/ui";
import { AiLoader } from "@/components/AiLoader";
import { formatBytes, downloadBlob } from "@/lib/utils";

type Chunk = { timestamp: [number, number | null]; text: string };
type WorkerMsg =
  | { type: "progress"; data: { status: string; file?: string; progress?: number } }
  | { type: "status"; data: string }
  | { type: "done"; data: { text: string; chunks?: Chunk[] } }
  | { type: "error"; data: string };

type Phase = "idle" | "decoding" | "loading" | "transcribing" | "done" | "error";

/** Decode any audio/video file to 16 kHz mono PCM, which is what Whisper expects. */
async function decodeTo16kMono(file: File): Promise<Float32Array> {
  const buf = await file.arrayBuffer();
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  const ctx = new Ctor({ sampleRate: 16000 });
  try {
    const decoded = await ctx.decodeAudioData(buf);
    if (decoded.numberOfChannels === 1) return decoded.getChannelData(0).slice();
    // Average channels to mono.
    const a = decoded.getChannelData(0);
    const b = decoded.getChannelData(1);
    const out = new Float32Array(a.length);
    for (let i = 0; i < a.length; i++) out[i] = (a[i] + b[i]) / 2;
    return out;
  } finally {
    ctx.close();
  }
}

function secToSrtTime(s: number): string {
  const ms = Math.floor((s % 1) * 1000);
  const total = Math.floor(s);
  const hh = String(Math.floor(total / 3600)).padStart(2, "0");
  const mm = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const ss = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss},${String(ms).padStart(3, "0")}`;
}

function buildSrt(chunks: Chunk[]): string {
  return chunks
    .map((c, i) => {
      const start = c.timestamp[0] ?? 0;
      const end = c.timestamp[1] ?? start + 2;
      return `${i + 1}\n${secToSrtTime(start)} --> ${secToSrtTime(end)}\n${c.text.trim()}\n`;
    })
    .join("\n");
}

export default function Transcriber() {
  const [file, setFile] = useState<File | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [status, setStatus] = useState("");
  const [text, setText] = useState("");
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => () => workerRef.current?.terminate(), []);

  const reset = () => {
    workerRef.current?.terminate();
    workerRef.current = null;
    setFile(null);
    setPhase("idle");
    setStatus("");
    setText("");
    setChunks([]);
    setError("");
  };

  const onFile = async (files: File[]) => {
    const f = files[0];
    setFile(f);
    setError("");
    setText("");
    setChunks([]);
    setPhase("decoding");
    setStatus("Reading the audio…");

    let audio: Float32Array;
    try {
      audio = await decodeTo16kMono(f);
    } catch {
      setError("Couldn't read the audio from this file. Try an MP3, WAV, M4A, or an MP4/WebM with an audio track.");
      setPhase("error");
      return;
    }

    setPhase("loading");
    setStatus("Setting up the AI model — one time only, then it's instant…");

    const worker = new Worker(new URL("./whisper.worker.ts", import.meta.url), {
      type: "module",
    });
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent<WorkerMsg>) => {
      const msg = e.data;
      if (msg.type === "progress") {
        if (typeof msg.data.progress === "number" && msg.data.progress > 0) {
          setStatus(`Downloading the AI model… ${Math.round(msg.data.progress)}%`);
        }
      } else if (msg.type === "status" && msg.data === "transcribing") {
        setPhase("transcribing");
        setStatus("Transcribing your audio…");
      } else if (msg.type === "done") {
        setText(msg.data.text?.trim() ?? "");
        setChunks(Array.isArray(msg.data.chunks) ? msg.data.chunks : []);
        setPhase("done");
        worker.terminate();
        workerRef.current = null;
      } else if (msg.type === "error") {
        setError(`Transcription failed: ${msg.data}`);
        setPhase("error");
        worker.terminate();
        workerRef.current = null;
      }
    };
    worker.onerror = () => {
      setError("The transcription engine failed to start in this browser.");
      setPhase("error");
    };

    // Transferable: hand the audio buffer to the worker without a copy.
    worker.postMessage({ audio }, [audio.buffer]);
  };

  const base = file ? file.name.replace(/\.[^.]+$/, "") : "transcript";
  const working = phase === "decoding" || phase === "loading" || phase === "transcribing";

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="mb-5 flex items-start gap-3 rounded-xl border border-secondary/40 bg-secondary/10 p-4">
        <Captions className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
        <p className="text-sm text-text-primary">
          <span className="font-semibold text-secondary">Your audio never leaves your browser.</span>{" "}
          Transcription runs on your device; the AI model is downloaded once, then cached.
        </p>
      </div>

      {!file ? (
        <DropZone
          acceptedTypes={["audio/*", "video/*", ".mp3", ".wav", ".m4a", ".ogg", ".mp4", ".webm", ".mov"]}
          acceptedLabel="audio or video (MP3, WAV, M4A, MP4, WebM)"
          maxSizeMB={200}
          onFilesAccepted={onFile}
        />
      ) : (
        <>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
            <FileText className="h-5 w-5 shrink-0 text-text-muted" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text-primary">{file.name}</p>
              <p className="text-xs text-text-muted">{formatBytes(file.size)}</p>
            </div>
            {!working && (
              <Button variant="ghost" icon={RotateCcw} onClick={reset}>
                New file
              </Button>
            )}
          </div>

          {working && (
            <div className="mt-4 rounded-xl border border-border bg-background">
              <AiLoader status={status} />
            </div>
          )}

          <ErrorMessage message={error} />

          {phase === "done" && (
            <div className="mt-4 space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-widest text-text-muted">
                    Transcript
                  </span>
                  <button
                    type="button"
                    onClick={copyText}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-text-primary hover:border-text-muted/50"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-secondary" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={text || "(no speech detected)"}
                  className="h-48 w-full resize-y rounded-lg border border-border bg-surface p-3 text-sm leading-relaxed text-text-primary focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  size="lg"
                  variant="success"
                  icon={Download}
                  onClick={() => downloadBlob(new Blob([text], { type: "text/plain" }), `${base}.txt`)}
                >
                  Download .txt
                </Button>
                {chunks.length > 0 && (
                  <Button
                    size="lg"
                    icon={Download}
                    onClick={() =>
                      downloadBlob(
                        new Blob([buildSrt(chunks)], { type: "text/plain" }),
                        `${base}.srt`
                      )
                    }
                  >
                    Download subtitles (.srt)
                  </Button>
                )}
                <Button variant="ghost" icon={RotateCcw} onClick={reset}>
                  Transcribe another
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
