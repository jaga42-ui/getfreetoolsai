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
import { Minimize2 } from "lucide-react";

const ACCEPT = ["video/*", ".mp4", ".webm", ".mov", ".mkv", ".avi", ".m4v"];

type Quality = "high" | "balanced" | "small";
type Res = "keep" | "1080" | "720" | "480";

const CRF: Record<Quality, number> = { high: 23, balanced: 28, small: 33 };

function baseName(name: string): string {
  return name.replace(/\.[^.]+$/, "");
}

export default function VideoCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<Quality>("balanced");
  const [res, setRes] = useState<Res>("keep");
  const { status, loadPct, pct, error, result, run, reset } = useFfmpegJob();

  const busy = status === "loading" || status === "processing";

  const start = () => {
    if (!file) return;
    run(file, {
      outputExt: "mp4",
      outputMime: "video/mp4",
      outName: `${baseName(file.name)}-compressed.mp4`,
      args: (input, output) => {
        const scale = res === "keep" ? [] : ["-vf", `scale=-2:${res}`];
        return [
          "-i", input,
          "-c:v", "libx264",
          "-crf", String(CRF[quality]),
          "-preset", "veryfast",
          ...scale,
          "-c:a", "aac",
          "-b:a", "128k",
          "-movflags", "+faststart",
          output,
        ];
      },
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
          maxSizeMB={500}
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
                    Quality
                  </p>
                  <SegmentedControl
                    value={quality}
                    onChange={setQuality}
                    options={[
                      { value: "high", label: "High quality" },
                      { value: "balanced", label: "Balanced" },
                      { value: "small", label: "Smallest file" },
                    ]}
                  />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-text-primary">
                    Resolution
                  </p>
                  <SegmentedControl
                    value={res}
                    onChange={setRes}
                    options={[
                      { value: "keep", label: "Keep original" },
                      { value: "1080", label: "1080p" },
                      { value: "720", label: "720p" },
                      { value: "480", label: "480p" },
                    ]}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button icon={Minimize2} size="lg" onClick={start}>
                  Compress video
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
              resultVerb="Compressed"
            />
          )}
        </>
      )}
    </div>
  );
}
