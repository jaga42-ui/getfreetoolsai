"use client";

import { useState } from "react";
import { Download, Trash2, Package, RotateCcw, ImageDown } from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { Button, SegmentedControl } from "@/components/ui";
import { formatBytes, downloadBlob } from "@/lib/utils";
import {
  loadImage,
  encodeImage,
  compressToTargetBytes,
  EXT,
  type OutputFormat,
} from "@/lib/image";
import { zipFiles } from "@/lib/zip";

type Item = {
  id: string;
  file: File;
  originalSize: number;
  status: "pending" | "done" | "error";
  resultBlob?: Blob;
  resultSize?: number;
  previewUrl?: string;
  outName?: string;
  error?: string;
};

type Mode = "target" | "quality";

function outputFormatFor(file: File): OutputFormat {
  return file.type === "image/webp" ? "image/webp" : "image/jpeg";
}

export default function CompressImage() {
  const [items, setItems] = useState<Item[]>([]);
  const [mode, setMode] = useState<Mode>("target");
  const [targetKB, setTargetKB] = useState(200);
  const [quality, setQuality] = useState(70);
  const [processing, setProcessing] = useState(false);

  const addFiles = (files: File[]) => {
    setItems((prev) => [
      ...prev,
      ...files.map((file) => ({
        id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
        file,
        originalSize: file.size,
        status: "pending" as const,
      })),
    ]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  const reset = () => {
    items.forEach((i) => i.previewUrl && URL.revokeObjectURL(i.previewUrl));
    setItems([]);
  };

  const compressAll = async () => {
    setProcessing(true);
    const pending = items.filter((i) => i.status !== "done");
    for (const item of pending) {
      try {
        const img = await loadImage(item.file);
        const format = outputFormatFor(item.file);
        let blob: Blob;
        if (mode === "target") {
          const res = await compressToTargetBytes(
            img,
            targetKB * 1024,
            format
          );
          blob = res.blob;
        } else {
          blob = await encodeImage(img, format, quality / 100);
        }
        const base = item.file.name.replace(/\.[^.]+$/, "");
        const outName = `${base}-compressed.${EXT[format]}`;
        const previewUrl = URL.createObjectURL(blob);
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  status: "done",
                  resultBlob: blob,
                  resultSize: blob.size,
                  previewUrl,
                  outName,
                  error: undefined,
                }
              : i
          )
        );
      } catch (e) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  status: "error",
                  error:
                    e instanceof Error
                      ? e.message
                      : "Something went wrong. Please try again.",
                }
              : i
          )
        );
      }
    }
    setProcessing(false);
  };

  const downloadAllZip = async () => {
    const done = items.filter((i) => i.resultBlob && i.outName);
    const zip = await zipFiles(
      done.map((i) => ({ name: i.outName!, blob: i.resultBlob! }))
    );
    downloadBlob(zip, `compressed-images-${Date.now()}.zip`);
  };

  const doneCount = items.filter((i) => i.status === "done").length;

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      {items.length === 0 ? (
        <DropZone
          acceptedTypes={["image/jpeg", "image/png", "image/webp"]}
          acceptedLabel="JPG, PNG, WebP"
          multiple
          maxSizeMB={50}
          onFilesAccepted={addFiles}
        />
      ) : (
        <>
          {/* Options */}
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-text-muted">
              Compression mode
            </p>
            <SegmentedControl<Mode>
              value={mode}
              onChange={setMode}
              options={[
                { value: "target", label: "Compress to target size" },
                { value: "quality", label: "Compress by quality %" },
              ]}
            />

            {mode === "target" ? (
              <div className="mt-4 flex items-center gap-3">
                <label className="text-sm text-text-muted">Target size</label>
                <input
                  type="number"
                  min={5}
                  value={targetKB}
                  onChange={(e) =>
                    setTargetKB(Math.max(5, Number(e.target.value) || 0))
                  }
                  className="w-28 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
                />
                <span className="text-sm font-medium text-text-primary">KB</span>
              </div>
            ) : (
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-text-muted">Quality</span>
                  <span className="font-mono font-semibold text-text-primary">
                    {quality}%
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={90}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            )}
          </div>

          {/* File list */}
          <div className="mt-4 space-y-3">
            {items.map((item) => {
              const savings =
                item.resultSize != null
                  ? Math.max(
                      0,
                      Math.round(
                        (1 - item.resultSize / item.originalSize) * 100
                      )
                    )
                  : null;
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-xl border border-border bg-background p-3"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface">
                    {item.previewUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.previewUrl}
                        alt={item.file.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageDown className="h-5 w-5 text-text-muted" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text-primary">
                      {item.file.name}
                    </p>
                    <p className="text-xs text-text-muted">
                      {formatBytes(item.originalSize)}
                      {item.resultSize != null && (
                        <>
                          {" → "}
                          <span className="font-semibold text-secondary">
                            {formatBytes(item.resultSize)}
                          </span>
                          {savings != null && savings > 0 && (
                            <span className="ml-1 text-secondary">
                              (−{savings}%)
                            </span>
                          )}
                        </>
                      )}
                    </p>
                    {item.status === "error" && (
                      <p className="text-xs text-red-400">{item.error}</p>
                    )}
                  </div>
                  {item.status === "done" && item.resultBlob && (
                    <Button
                      variant="outline"
                      icon={Download}
                      onClick={() =>
                        downloadBlob(item.resultBlob!, item.outName!)
                      }
                    >
                      Download
                    </Button>
                  )}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="rounded-lg p-2 text-text-muted hover:bg-surface hover:text-red-400"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Add more */}
          <div className="mt-4">
            <DropZone
              acceptedTypes={["image/jpeg", "image/png", "image/webp"]}
              acceptedLabel="JPG, PNG, WebP"
              multiple
              maxSizeMB={50}
              onFilesAccepted={addFiles}
              compact
            />
          </div>

          {/* Actions */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              icon={ImageDown}
              loading={processing}
              onClick={compressAll}
            >
              {processing
                ? "Compressing..."
                : `Compress ${items.length} image${items.length > 1 ? "s" : ""}`}
            </Button>
            {doneCount > 1 && (
              <Button variant="success" icon={Package} onClick={downloadAllZip}>
                Download all as ZIP
              </Button>
            )}
            <Button variant="ghost" icon={RotateCcw} onClick={reset}>
              Start over
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
