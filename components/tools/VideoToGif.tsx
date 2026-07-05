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
import { Clapperboard } from "lucide-react";

const ACCEPT = ["video/*", ".mp4", ".webm", ".mov", ".mkv", ".avi", ".m4v"];

type Fps = "10" | "15" | "24";
type Width = "320" | "480" | "640";

function baseName(name: string): string {
  return name.replace(/\.[^.]+$/, "");
}

export default function VideoToGif() {
  const [file, setFile] = useState<File | null>(null);
  const [fps, setFps] = useState<Fps>("15");
  const [width, setWidth] = useState<Width>("480");
  const { status, loadPct, pct, error, result, run, reset } = useFfmpegJob();

  const busy = status === "loading" || status === "processing";

  const start = () => {
    if (!file) return;
    run(file, {
      outputExt: "gif",
      outputMime: "image/gif",
      outName: `${baseName(file.name)}.gif`,
      // Single-pass, high-quality GIF: generate a palette and apply it in one
      // filtergraph via split, which looks far better than the default palette.
      args: (input, output) => [
        "-i", input,
        "-vf",
        `fps=${fps},scale=${width}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`,
        "-loop", "0",
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
              <div className="space-y-4 rounded-xl border border-border bg-surface p-5">
                <div>
                  <p className="mb-2 text-sm font-medium text-text-primary">
                    Frame rate
                  </p>
                  <SegmentedControl
                    value={fps}
                    onChange={setFps}
                    options={[
                      { value: "10", label: "10 fps (small)" },
                      { value: "15", label: "15 fps" },
                      { value: "24", label: "24 fps (smooth)" },
                    ]}
                  />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-text-primary">
                    Width
                  </p>
                  <SegmentedControl
                    value={width}
                    onChange={setWidth}
                    options={[
                      { value: "320", label: "320px" },
                      { value: "480", label: "480px" },
                      { value: "640", label: "640px" },
                    ]}
                  />
                </div>
                <p className="text-xs text-text-muted">
                  Tip: trim your clip to a few seconds first — GIFs grow quickly
                  with length and frame rate.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button icon={Clapperboard} size="lg" onClick={start}>
                  Make GIF
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
              resultVerb="GIF created"
            />
          )}
        </>
      )}
    </div>
  );
}
