"use client";

import { useState } from "react";
import { Download, Trash2, Package, RotateCcw, Smartphone } from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { Button } from "@/components/ui";
import { formatBytes, downloadBlob } from "@/lib/utils";
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

export default function HeicToJpg() {
  const [items, setItems] = useState<Item[]>([]);
  const [quality, setQuality] = useState(85);
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
      const t = prev.find((i) => i.id === id);
      if (t?.previewUrl) URL.revokeObjectURL(t.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  const reset = () => {
    items.forEach((i) => i.previewUrl && URL.revokeObjectURL(i.previewUrl));
    setItems([]);
  };

  const convertAll = async () => {
    setProcessing(true);
    const heic2any = (await import("heic2any")).default;
    const pending = items.filter((i) => i.status !== "done");
    for (const item of pending) {
      try {
        const converted = await heic2any({
          blob: item.file,
          toType: "image/jpeg",
          quality: quality / 100,
        });
        const blob = Array.isArray(converted) ? converted[0] : converted;
        const base = item.file.name.replace(/\.(heic|heif)$/i, "");
        const outName = `${base}.jpg`;
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
                    "Could not convert this file. Make sure it is a valid HEIC/HEIF image.",
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
    downloadBlob(zip, `heic-to-jpg-${Date.now()}.zip`);
  };

  const doneCount = items.filter((i) => i.status === "done").length;

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      {items.length === 0 ? (
        <DropZone
          acceptedTypes={[".heic", ".heif", "image/heic", "image/heif"]}
          acceptedLabel="HEIC, HEIF"
          multiple
          maxSizeMB={50}
          onFilesAccepted={addFiles}
        />
      ) : (
        <>
          <div className="rounded-xl border border-border bg-background p-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-text-muted">JPG quality</span>
              <span className="font-mono font-semibold text-text-primary">
                {quality}%
              </span>
            </div>
            <input
              type="range"
              min={60}
              max={100}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div className="mt-4 space-y-3">
            {items.map((item) => (
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
                    <Smartphone className="h-5 w-5 text-text-muted" />
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
                    onClick={() => downloadBlob(item.resultBlob!, item.outName!)}
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
            ))}
          </div>

          <div className="mt-4">
            <DropZone
              acceptedTypes={[".heic", ".heif", "image/heic", "image/heif"]}
              acceptedLabel="more HEIC files"
              multiple
              maxSizeMB={50}
              onFilesAccepted={addFiles}
              compact
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              icon={Smartphone}
              loading={processing}
              onClick={convertAll}
            >
              {processing
                ? "Converting..."
                : `Convert ${items.length} file${items.length > 1 ? "s" : ""}`}
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
