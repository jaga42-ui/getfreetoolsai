"use client";

import { useState, useEffect } from "react";
import { Download, Trash2, Package, RotateCcw, Replace } from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { Button, SegmentedControl } from "@/components/ui";
import { formatBytes, downloadBlob } from "@/lib/utils";
import { loadImage, encodeImage, EXT, type OutputFormat } from "@/lib/image";
import { zipFiles } from "@/lib/zip";
import { usePersistentState, useToolShortcuts } from "@/lib/hooks";
import { useHandoffIntake, blobToFile } from "@/lib/handoff";
import { ChainResults } from "@/components/ChainResults";

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

const FORMATS: { value: OutputFormat; label: string }[] = [
  { value: "image/jpeg", label: "JPG" },
  { value: "image/png", label: "PNG" },
  { value: "image/webp", label: "WebP" },
  { value: "image/bmp", label: "BMP" },
];

export default function ConvertImage({
  defaultFormat,
}: {
  defaultFormat?: OutputFormat;
} = {}) {
  const [items, setItems] = useState<Item[]>([]);
  const [format, setFormat] = usePersistentState<OutputFormat>("gft:img-convert:format", "image/png");
  const [quality, setQuality] = usePersistentState("gft:img-convert:quality", 85);
  const [processing, setProcessing] = useState(false);

  // Long-tail conversion landing pages (e.g. /image/convert/png-to-webp) pre-arm
  // the output format. Runs after the persisted-state load effect, so the
  // landing page's intent wins over a returning user's last-used format.
  useEffect(() => {
    if (defaultFormat) setFormat(defaultFormat);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const supportsQuality = format === "image/jpeg" || format === "image/webp";

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
    // reset previous results so re-converting with a new format works
    items.forEach((i) => i.previewUrl && URL.revokeObjectURL(i.previewUrl));
    const queue = items;
    for (const item of queue) {
      try {
        const img = await loadImage(item.file);
        const blob = await encodeImage(img, format, quality / 100);
        const base = item.file.name.replace(/\.[^.]+$/, "");
        const outName = `${base}.${EXT[format]}`;
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
                  error: "Could not convert this image.",
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
    downloadBlob(zip, `converted-images-${Date.now()}.zip`);
  };

  const doneCount = items.filter((i) => i.status === "done").length;

  useHandoffIntake(addFiles);
  useToolShortcuts({
    onRun: convertAll,
    onReset: reset,
    runEnabled: items.length > 0 && !processing,
  });

  const doneFiles = () =>
    items
      .filter((i) => i.resultBlob && i.outName)
      .map((i) => blobToFile(i.resultBlob!, i.outName!));

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      {items.length === 0 ? (
        <DropZone
          acceptedTypes={[
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/bmp",
            "image/gif",
          ]}
          acceptedLabel="JPG, PNG, WebP, BMP, GIF"
          multiple
          maxSizeMB={50}
          onFilesAccepted={addFiles}
        />
      ) : (
        <>
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-text-muted">
              Convert to
            </p>
            <SegmentedControl<OutputFormat>
              value={format}
              onChange={setFormat}
              options={FORMATS}
            />
            {supportsQuality && (
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-text-muted">Quality</span>
                  <span className="font-mono font-semibold text-text-primary">
                    {quality}%
                  </span>
                </div>
                <input
                  type="range"
                  aria-label="Quality"
                  min={10}
                  max={100}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            )}
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
                    <Replace className="h-5 w-5 text-text-muted" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text-primary">
                    {item.outName ?? item.file.name}
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
              acceptedTypes={[
                "image/jpeg",
                "image/png",
                "image/webp",
                "image/bmp",
                "image/gif",
              ]}
              acceptedLabel="more images"
              multiple
              maxSizeMB={50}
              onFilesAccepted={addFiles}
              compact
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              icon={Replace}
              loading={processing}
              onClick={convertAll}
            >
              {processing
                ? "Converting..."
                : `Convert ${items.length} image${items.length > 1 ? "s" : ""}`}
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

          {doneCount > 0 && (
            <ChainResults
              getFiles={doneFiles}
              count={doneCount}
              current="/image/convert"
            />
          )}
        </>
      )}
    </div>
  );
}
