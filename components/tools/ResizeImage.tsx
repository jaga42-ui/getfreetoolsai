"use client";

import { useState } from "react";
import { Download, RotateCcw, Maximize2, Link2, Link2Off } from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { Button, SegmentedControl, ErrorMessage } from "@/components/ui";
import { formatBytes, downloadBlob } from "@/lib/utils";
import { loadImage, encodeResized, formatFromMime, EXT } from "@/lib/image";

type Mode = "px" | "percent";

export default function ResizeImage() {
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [mode, setMode] = useState<Mode>("px");
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [percent, setPercent] = useState(50);
  const [lockAspect, setLockAspect] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{
    blob: Blob;
    url: string;
    w: number;
    h: number;
  } | null>(null);

  const onFile = async (files: File[]) => {
    const f = files[0];
    setError("");
    setResult(null);
    setFile(f);
    try {
      const image = await loadImage(f);
      setImg(image);
      setWidth(image.naturalWidth);
      setHeight(image.naturalHeight);
    } catch {
      setError("Could not load this image.");
    }
  };

  const reset = () => {
    if (result) URL.revokeObjectURL(result.url);
    setFile(null);
    setImg(null);
    setResult(null);
    setError("");
  };

  const onWidth = (val: number) => {
    setWidth(val);
    if (lockAspect && img) {
      setHeight(Math.round((val / img.naturalWidth) * img.naturalHeight));
    }
  };
  const onHeight = (val: number) => {
    setHeight(val);
    if (lockAspect && img) {
      setWidth(Math.round((val / img.naturalHeight) * img.naturalWidth));
    }
  };

  const resize = async () => {
    if (!img || !file) return;
    setProcessing(true);
    setError("");
    try {
      let targetW: number;
      let targetH: number;
      if (mode === "percent") {
        targetW = Math.round((img.naturalWidth * percent) / 100);
        targetH = Math.round((img.naturalHeight * percent) / 100);
      } else {
        targetW = width;
        targetH = height;
      }
      if (targetW < 1 || targetH < 1) {
        setError("Enter valid dimensions greater than zero.");
        setProcessing(false);
        return;
      }
      const format = formatFromMime(file.type);
      const blob = await encodeResized(img, targetW, targetH, format, 0.92);
      setResult({
        blob,
        url: URL.createObjectURL(blob),
        w: targetW,
        h: targetH,
      });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const outName = file
    ? `${file.name.replace(/\.[^.]+$/, "")}-resized.${EXT[formatFromMime(file.type)]}`
    : "resized.jpg";

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      {!file ? (
        <DropZone
          acceptedTypes={["image/jpeg", "image/png", "image/webp", "image/bmp"]}
          acceptedLabel="JPG, PNG, WebP, BMP"
          maxSizeMB={50}
          onFilesAccepted={onFile}
        />
      ) : (
        <>
          <div className="flex items-center gap-4 rounded-xl border border-border bg-background p-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text-primary">
                {file.name}
              </p>
              <p className="text-xs text-text-muted">
                {img ? `${img.naturalWidth} × ${img.naturalHeight}px · ` : ""}
                {formatBytes(file.size)}
              </p>
            </div>
          </div>

          {!result && (
            <div className="mt-4 rounded-xl border border-border bg-background p-4">
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-text-muted">
                Resize by
              </p>
              <SegmentedControl<Mode>
                value={mode}
                onChange={setMode}
                options={[
                  { value: "px", label: "Pixels" },
                  { value: "percent", label: "Percentage" },
                ]}
              />

              {mode === "px" ? (
                <div className="mt-4 flex flex-wrap items-end gap-3">
                  <label className="text-sm">
                    <span className="mb-1 block text-text-muted">Width (px)</span>
                    <input
                      type="number"
                      min={1}
                      value={width}
                      onChange={(e) => onWidth(Number(e.target.value) || 0)}
                      className="w-28 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
                    />
                  </label>
                  <button
                    onClick={() => setLockAspect((l) => !l)}
                    className="mb-1 rounded-lg border border-border p-2 text-text-muted hover:text-text-primary"
                    title={lockAspect ? "Aspect ratio locked" : "Aspect ratio unlocked"}
                  >
                    {lockAspect ? (
                      <Link2 className="h-4 w-4 text-primary" />
                    ) : (
                      <Link2Off className="h-4 w-4" />
                    )}
                  </button>
                  <label className="text-sm">
                    <span className="mb-1 block text-text-muted">Height (px)</span>
                    <input
                      type="number"
                      min={1}
                      value={height}
                      onChange={(e) => onHeight(Number(e.target.value) || 0)}
                      className="w-28 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
                    />
                  </label>
                </div>
              ) : (
                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-text-muted">Scale</span>
                    <span className="font-mono font-semibold text-text-primary">
                      {percent}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={200}
                    value={percent}
                    onChange={(e) => setPercent(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                  {img && (
                    <p className="mt-2 text-xs text-text-muted">
                      New size:{" "}
                      {Math.round((img.naturalWidth * percent) / 100)} ×{" "}
                      {Math.round((img.naturalHeight * percent) / 100)}px
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          <ErrorMessage message={error} />

          {result ? (
            <div className="mt-5 rounded-xl border border-secondary/30 bg-secondary/5 p-5 text-center">
              <p className="text-lg font-semibold text-secondary">
                ✅ Resized to {result.w} × {result.h}px
              </p>
              <p className="mt-1 text-sm text-text-muted">
                {formatBytes(file.size)} → {formatBytes(result.blob.size)}
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.url}
                alt="Resized preview"
                className="mx-auto mt-4 max-h-64 rounded-lg border border-border"
              />
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <Button
                  size="lg"
                  variant="success"
                  icon={Download}
                  onClick={() => downloadBlob(result.blob, outName)}
                >
                  Download
                </Button>
                <Button variant="ghost" icon={RotateCcw} onClick={reset}>
                  Process another file
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                icon={Maximize2}
                loading={processing}
                onClick={resize}
                disabled={!img}
              >
                Resize image
              </Button>
              <Button variant="ghost" icon={RotateCcw} onClick={reset}>
                Start over
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
