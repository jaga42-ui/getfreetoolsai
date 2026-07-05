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
import { Music } from "lucide-react";

const ACCEPT = ["video/*", "audio/*", ".mp4", ".webm", ".mov", ".mkv", ".avi", ".m4v", ".mp3", ".wav", ".m4a"];

type Bitrate = "128" | "192" | "320";

function baseName(name: string): string {
  return name.replace(/\.[^.]+$/, "");
}

export default function VideoToMp3() {
  const [file, setFile] = useState<File | null>(null);
  const [bitrate, setBitrate] = useState<Bitrate>("192");
  const { status, loadPct, pct, error, result, run, reset } = useFfmpegJob();

  const busy = status === "loading" || status === "processing";

  const start = () => {
    if (!file) return;
    run(file, {
      outputExt: "mp3",
      outputMime: "audio/mpeg",
      outName: `${baseName(file.name)}.mp3`,
      args: (input, output) => [
        "-i", input,
        "-vn",
        "-c:a", "libmp3lame",
        "-b:a", `${bitrate}k`,
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
          acceptedLabel="MP4, MOV, WebM, MKV, M4A, WAV"
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
              <div className="rounded-xl border border-border bg-surface p-5">
                <p className="mb-2 text-sm font-medium text-text-primary">
                  MP3 quality
                </p>
                <SegmentedControl
                  value={bitrate}
                  onChange={setBitrate}
                  options={[
                    { value: "128", label: "128 kbps" },
                    { value: "192", label: "192 kbps" },
                    { value: "320", label: "320 kbps" },
                  ]}
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <Button icon={Music} size="lg" onClick={start}>
                  Extract MP3
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
              resultVerb="Audio extracted"
            />
          )}
        </>
      )}
    </div>
  );
}
