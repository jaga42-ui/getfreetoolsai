// Shared, self-hosted ffmpeg.wasm engine for the video/audio tools.
//
// Single-threaded core (see scripts/copy-ffmpeg-assets.mjs) so we never need
// SharedArrayBuffer / cross-origin isolation (which would break AdSense).
// The core is served same-origin from /public/ffmpeg and turned into blob URLs,
// so nothing is fetched from a third-party CDN at runtime — the file the user
// picks is likewise never uploaded; ffmpeg runs entirely in a web worker on
// their device.
//
// Client-only: this imports @ffmpeg/ffmpeg which spawns a Worker, so only ever
// import it from components with `ssr: false`.
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";

const BASE = "/ffmpeg";
const CORE_URL = `${BASE}/ffmpeg-core.js`;
const WASM_URL = `${BASE}/ffmpeg-core.wasm`;
// Self-hosted worker served straight from /public so its `import(coreURL)` runs
// natively — the library's own worker gets webpack-shimmed and fails to load.
// Must be a FULLY-QUALIFIED origin URL: @ffmpeg/ffmpeg resolves it via
// `new URL(classWorkerURL, import.meta.url)`, and webpack inlines import.meta.url
// as a build-machine file:// path, so a root-relative path would resolve wrong.
const classWorkerURL = () =>
  `${window.location.origin}${BASE}/gft-worker.js`;

let instance: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;

export type LoadProgress = { received: number; total: number; ratio: number };

/**
 * Load (once) and return the shared FFmpeg instance. `onDownload` reports the
 * one-time ~31 MB core download so the UI can show a progress bar the first
 * time; subsequent calls resolve instantly.
 */
export async function getFFmpeg(
  onDownload?: (p: LoadProgress) => void
): Promise<FFmpeg> {
  if (instance) return instance;
  if (!loadPromise) {
    loadPromise = (async () => {
      const ff = new FFmpeg();
      const coreURL = await toBlobURL(CORE_URL, "text/javascript");
      const wasmURL = await toBlobURL(
        WASM_URL,
        "application/wasm",
        true,
        (e) =>
          onDownload?.({
            received: e.received,
            total: e.total,
            ratio: e.total > 0 ? e.received / e.total : 0,
          })
      );
      // Point at our static worker so the core's dynamic import isn't rewritten
      // by webpack into a failing module lookup ("Cannot find module 'blob:…'").
      await ff.load({ coreURL, wasmURL, classWorkerURL: classWorkerURL() });
      instance = ff;
      return ff;
    })();
  }
  try {
    return await loadPromise;
  } catch (err) {
    // Allow a retry after a failed load (e.g. transient fetch error).
    loadPromise = null;
    throw err;
  }
}

/** File extension including the leading dot, lowercased; falls back to `.dat`. */
function extOf(name: string): string {
  const m = /\.([A-Za-z0-9]+)$/.exec(name);
  return m ? `.${m[1].toLowerCase()}` : ".dat";
}

export type TranscodeOptions = {
  file: File | Blob;
  /** Build the ffmpeg argument list from the in/out virtual filenames. */
  args: (input: string, output: string) => string[];
  /** Output file extension WITHOUT the dot, e.g. "mp4", "gif", "mp3". */
  outputExt: string;
  /** MIME type for the returned Blob, e.g. "video/mp4". */
  outputMime: string;
  /** 0..1 progress of the current operation. */
  onProgress?: (ratio: number) => void;
  /** Raw ffmpeg log lines (stderr) — useful for surfacing errors. */
  onLog?: (line: string) => void;
  /** Progress of the one-time core download. */
  onDownload?: (p: LoadProgress) => void;
};

/**
 * Run a single ffmpeg operation on one input file and return the result Blob.
 * Handles the virtual-FS write/read and cleans up afterwards.
 */
export async function transcode({
  file,
  args,
  outputExt,
  outputMime,
  onProgress,
  onLog,
  onDownload,
}: TranscodeOptions): Promise<Blob> {
  const ff = await getFFmpeg(onDownload);

  const inName = `input${file instanceof File ? extOf(file.name) : ".dat"}`;
  const outName = `output.${outputExt}`;

  const onProg = ({ progress }: { progress: number }) =>
    onProgress?.(Math.max(0, Math.min(1, progress)));
  const onLogLine = ({ message }: { message: string }) => onLog?.(message);

  ff.on("progress", onProg);
  if (onLog) ff.on("log", onLogLine);

  try {
    await ff.writeFile(inName, await fetchFile(file));
    await ff.exec(args(inName, outName));
    const data = await ff.readFile(outName);
    // Best-effort cleanup so repeated runs don't accumulate in the virtual FS.
    try {
      await ff.deleteFile(inName);
      await ff.deleteFile(outName);
    } catch {
      /* ignore */
    }
    const bytes =
      data instanceof Uint8Array ? data : new TextEncoder().encode(String(data));
    if (bytes.length === 0) {
      throw new Error("ffmpeg produced an empty file — the input may be unsupported or corrupt.");
    }
    return new Blob([bytes as unknown as BlobPart], { type: outputMime });
  } finally {
    ff.off("progress", onProg);
    if (onLog) ff.off("log", onLogLine);
  }
}
