/**
 * Social video output formats and the ffmpeg filtergraph that produces them.
 *
 * Pure data + string building, kept out of the component so the filtergraph is
 * unit-testable. A malformed graph fails deep inside ffmpeg.wasm with a log
 * that `humanError` flattens to "something went wrong", so a bug here is
 * expensive to diagnose from the UI — assert it here instead.
 */

export type PresetId =
  | "reel"
  | "square"
  | "portrait"
  | "landscape"
  | "youtube-short"
  | "twitter";

export type VideoPreset = {
  id: PresetId;
  label: string;
  ratio: string;
  w: number;
  h: number;
  note: string;
};

/**
 * Target sizes, not just ratios. A 9:16 output at 1080x1920 is what every
 * short-form platform actually wants; exporting the right *shape* at the wrong
 * *resolution* is the usual reason an upload comes back looking soft.
 */
export const VIDEO_PRESETS: VideoPreset[] = [
  { id: "reel", label: "Reels / TikTok / Shorts", ratio: "9:16", w: 1080, h: 1920, note: "Full-screen vertical — the format all three short-form feeds use." },
  { id: "square", label: "Square post", ratio: "1:1", w: 1080, h: 1080, note: "Safe everywhere. Crops the least from landscape footage of the three vertical options." },
  { id: "portrait", label: "Feed portrait", ratio: "4:5", w: 1080, h: 1350, note: "The tallest an in-feed post can go — takes more screen than square without being a Reel." },
  { id: "landscape", label: "YouTube / landscape", ratio: "16:9", w: 1920, h: 1080, note: "Standard widescreen for long-form video." },
  { id: "youtube-short", label: "YouTube Short", ratio: "9:16", w: 1080, h: 1920, note: "Same frame as Reels; kept separate so the exported filename says what it is." },
  { id: "twitter", label: "X / Twitter", ratio: "16:9", w: 1280, h: 720, note: "720p keeps the file small enough to avoid a re-encode on upload." },
];

export type Fit = "crop" | "blur";

/**
 * Build the ffmpeg filtergraph for one target frame.
 *
 * `crop` fills the frame and throws away the overflow. `blur` keeps the whole
 * picture and fills the empty space with a blurred, zoomed copy of itself —
 * the standard way to put landscape footage into a vertical feed without
 * black bars or losing the sides.
 *
 * The blurred layer is scaled down to an eighth before `gblur` and back up
 * afterwards. Blurring at full resolution is the single slowest thing this tool
 * could do in WebAssembly, and downscaling first is visually indistinguishable
 * because the result is blurred anyway.
 */
export function filterGraph(fit: Fit, w: number, h: number): string[] {
  if (fit === "crop") {
    return [
      "-vf",
      `scale=${w}:${h}:force_original_aspect_ratio=increase,crop=${w}:${h}`,
    ];
  }

  // An eighth of the target, rounded to an even number. The /8 factor is what
  // keeps this affordable in WebAssembly; rounding even is belt-and-braces for
  // filters that dislike odd intermediates.
  const bw = Math.round(w / 16) * 2;
  const bh = Math.round(h / 16) * 2;
  return [
    "-filter_complex",
    `[0:v]split[a][b];` +
      `[a]scale=${bw}:${bh}:force_original_aspect_ratio=increase,crop=${bw}:${bh},gblur=sigma=6,scale=${w}:${h}[bg];` +
      `[b]scale=${w}:${h}:force_original_aspect_ratio=decrease[fg];` +
      `[bg][fg]overlay=(W-w)/2:(H-h)/2[v]`,
    "-map",
    "[v]",
    // Audio is optional -- a silent clip must not fail the whole job.
    "-map",
    "0:a?",
  ];
}

/** Strip the extension so the export can be renamed `<name>-1080x1920.mp4`. */
export function baseName(name: string): string {
  return name.replace(/\.[^.]+$/, "");
}
