"use client";

import { useState } from "react";
import { DropZone } from "@/components/DropZone";
import { Button, SegmentedControl } from "@/components/ui";
import {
  useFfmpegJob,
  FfmpegProgress,
  VideoResult,
  FilePill,
  ErrorMessage,
} from "@/components/tools/video/shared";
import { Crop } from "lucide-react";
import {
  VIDEO_PRESETS,
  filterGraph,
  baseName,
  type PresetId,
  type Fit,
} from "@/lib/videoFormats";

const ACCEPT = ["video/*", ".mp4", ".webm", ".mov", ".mkv", ".avi", ".m4v"];

export default function VideoSocialFormat() {
  const [file, setFile] = useState<File | null>(null);
  const [presetId, setPresetId] = useState<PresetId>("reel");
  const [fit, setFit] = useState<Fit>("crop");
  const { status, loadPct, pct, error, result, run, reset } = useFfmpegJob();

  const preset = VIDEO_PRESETS.find((p) => p.id === presetId) ?? VIDEO_PRESETS[0];
  const busy = status === "loading" || status === "processing";

  const start = () => {
    if (!file) return;
    run(file, {
      outputExt: "mp4",
      outputMime: "video/mp4",
      outName: `${baseName(file.name)}-${preset.w}x${preset.h}.mp4`,
      args: (input, output) => [
        "-i", input,
        ...filterGraph(fit, preset.w, preset.h),
        "-c:v", "libx264",
        "-crf", "23",
        "-preset", "veryfast",
        // Chrome and Safari both refuse odd-dimension H.264, and every preset
        // here is even, but yuv420p is what makes the file play on phones.
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "128k",
        "-movflags", "+faststart",
        output,
      ],
    });
  };

  const clearAll = () => {
    setFile(null);
    reset();
  };

  return (
    <div className="space-y-5">
      {!file && (
        <DropZone
          acceptedTypes={ACCEPT}
          acceptedLabel="MP4, WebM, MOV, MKV, AVI"
          maxSizeMB={300}
          onFilesAccepted={(files) => {
            setFile(files[0]);
            reset();
          }}
        />
      )}

      {file && (
        <>
          <FilePill file={file} />

          {status === "idle" && (
            <>
              <div className="space-y-5 rounded-xl border border-border bg-surface p-5">
                <div>
                  <p className="mb-2 text-sm font-medium text-text-primary">Format</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {VIDEO_PRESETS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPresetId(p.id)}
                        aria-pressed={p.id === presetId}
                        className={`rounded-lg border px-3 py-2.5 text-left transition-colors ${
                          p.id === presetId
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        <span className="block text-sm font-medium text-text-primary">
                          {p.label}
                        </span>
                        <span className="mt-0.5 block font-mono text-xs text-text-muted">
                          {p.ratio} · {p.w}×{p.h}
                        </span>
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-text-muted">
                    {preset.note}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-text-primary">
                    How to fit the picture
                  </p>
                  <SegmentedControl
                    value={fit}
                    onChange={setFit}
                    options={[
                      { value: "crop", label: "Crop to fill" },
                      { value: "blur", label: "Blurred background" },
                    ]}
                  />
                  <p className="mt-2 text-xs leading-relaxed text-text-muted">
                    {fit === "crop"
                      ? "Fills the frame and trims the overflow. Best when the subject is centred — check nothing important sits near the edges."
                      : "Keeps the whole picture and fills the space with a blurred copy of itself. The usual way to put landscape footage into a vertical feed without black bars."}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button icon={Crop} size="lg" onClick={start}>
                  Resize video
                </Button>
                <Button variant="ghost" onClick={clearAll}>
                  Choose a different file
                </Button>
              </div>
            </>
          )}

          {busy && <FfmpegProgress status={status} loadPct={loadPct} pct={pct} />}

          {status === "error" && (
            <>
              <ErrorMessage message={error} onRetry={start} />
              <Button variant="ghost" onClick={clearAll}>
                Choose a different file
              </Button>
            </>
          )}

          {status === "done" && result && (
            <VideoResult
              result={result}
              originalSize={file.size}
              onReset={clearAll}
              resultVerb="Video resized"
            />
          )}
        </>
      )}
    </div>
  );
}
