"use client";

import { useCallback, useRef, useState } from "react";
import { Download, RotateCcw, Loader2, Film } from "lucide-react";
import { transcode, type LoadProgress } from "@/lib/ffmpeg";
import { downloadBlob, formatBytes } from "@/lib/utils";
import { Button, SuccessHeader, ErrorMessage } from "@/components/ui";

export type JobBuild = {
  args: (input: string, output: string) => string[];
  outputExt: string;
  outputMime: string;
  /** Download filename for the result. */
  outName: string;
};

type Status = "idle" | "loading" | "processing" | "done" | "error";

/** Turn an ffmpeg failure + logs into something a user can act on. */
function humanError(reason: string, log: string): string {
  const hay = `${reason}\n${log}`;
  if (/out of memory|memory access|Aborted|abort\(|maximum call/i.test(hay)) {
    return "Ran out of memory for a file this large. Try a shorter clip, a lower resolution, or a desktop browser.";
  }
  if (/Invalid data|does not contain|Unknown encoder|No such file|Decoder|moov atom|Error opening|empty file/i.test(hay)) {
    return "Couldn't process that file — it may use an unsupported codec or be corrupted. Try a different file or format.";
  }
  return "Something went wrong processing your file. Try again, or try a different file.";
}

/**
 * Encapsulates the ffmpeg lifecycle for a single-input video/audio operation:
 * one-time core download, per-op progress, result Blob, and error handling.
 */
export function useFfmpegJob() {
  const [status, setStatus] = useState<Status>("idle");
  const [loadPct, setLoadPct] = useState(0);
  const [pct, setPct] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ blob: Blob; name: string } | null>(null);
  const logs = useRef<string[]>([]);

  const run = useCallback(async (file: File, build: JobBuild) => {
    setError("");
    setResult(null);
    setPct(0);
    setLoadPct(0);
    setStatus("loading");
    logs.current = [];
    try {
      const blob = await transcode({
        file,
        args: build.args,
        outputExt: build.outputExt,
        outputMime: build.outputMime,
        onDownload: (p: LoadProgress) => setLoadPct(p.ratio),
        onProgress: (r) => {
          setStatus("processing");
          setPct(r);
        },
        onLog: (line) => {
          logs.current.push(line);
          if (logs.current.length > 80) logs.current.shift();
        },
      });
      setResult({ blob, name: build.outName });
      setStatus("done");
    } catch (e) {
      // The ffmpeg worker rejects with a string, not an Error, so normalise.
      const reason =
        typeof e === "string" ? e : e instanceof Error ? e.message : String(e);
      const tail = logs.current.slice(-25).join("\n");
      // Privacy-safe diagnostics: ffmpeg reason + stderr only, never file bytes.
      console.error("[video-tool] ffmpeg failed:", reason, tail ? `\n${tail}` : "");
      setError(humanError(reason, logs.current.join("\n")));
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setResult(null);
    setError("");
    setPct(0);
    setLoadPct(0);
  }, []);

  return { status, loadPct, pct, error, result, run, reset };
}

/** Progress panel shown while ffmpeg is downloading or processing. */
export function FfmpegProgress({
  status,
  loadPct,
  pct,
}: {
  status: Status;
  loadPct: number;
  pct: number;
}) {
  if (status !== "loading" && status !== "processing") return null;
  const loading = status === "loading";
  const value = loading ? loadPct : pct;
  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <div className="flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden="true" />
        <p className="text-sm font-medium text-text-primary">
          {loading
            ? "Loading the video engine (one-time ~31 MB download)…"
            : "Processing your video on your device…"}
        </p>
      </div>
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-background">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-200"
          style={{ width: `${Math.round(Math.max(0.02, value) * 100)}%` }}
          role="progressbar"
          aria-valuenow={Math.round(value * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <p className="mt-2 text-xs text-text-muted">
        {loading
          ? `${Math.round(loadPct * 100)}% — cached after the first run`
          : pct > 0
          ? `${Math.round(pct * 100)}%`
          : "Starting…"}
      </p>
    </div>
  );
}

/** Result panel with size delta + download. */
export function VideoResult({
  result,
  originalSize,
  onReset,
  resultVerb = "Done",
}: {
  result: { blob: Blob; name: string };
  originalSize: number;
  onReset: () => void;
  resultVerb?: string;
}) {
  const newSize = result.blob.size;
  const smaller = originalSize > 0 && newSize < originalSize;
  const pctChange =
    originalSize > 0 ? Math.round((1 - newSize / originalSize) * 100) : 0;
  return (
    <div className="rounded-xl border border-secondary/30 bg-secondary/[0.05] p-6 text-center">
      <SuccessHeader>{resultVerb}</SuccessHeader>
      <p className="mt-3 text-sm text-text-muted">
        {formatBytes(originalSize)} <span aria-hidden>→</span>{" "}
        <span className="font-semibold text-text-primary">
          {formatBytes(newSize)}
        </span>
        {smaller && pctChange > 0 && (
          <span className="ml-2 rounded-full bg-secondary/15 px-2 py-0.5 text-xs font-medium text-secondary">
            {pctChange}% smaller
          </span>
        )}
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <Button
          icon={Download}
          variant="success"
          size="lg"
          onClick={() => downloadBlob(result.blob, result.name)}
        >
          Download
        </Button>
        <Button icon={RotateCcw} variant="outline" onClick={onReset}>
          Do another
        </Button>
      </div>
    </div>
  );
}

/** Small file summary chip shown once a file is chosen. */
export function FilePill({ file }: { file: File }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3">
      <Film className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-text-primary">{file.name}</p>
        <p className="text-xs text-text-muted">{formatBytes(file.size)}</p>
      </div>
    </div>
  );
}

export { ErrorMessage };
