"use client";

import { useState } from "react";
import {
  Download,
  Trash2,
  ArrowUp,
  ArrowDown,
  FileUp,
  RotateCcw,
} from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { Button, SegmentedControl, ErrorMessage } from "@/components/ui";
import { formatBytes, downloadBlob, bytesToBlob } from "@/lib/utils";
import { loadImage, encodeImage } from "@/lib/image";

type Item = { id: string; file: File; url: string };
type PageSize = "fit" | "a4";

export default function JpgToPdf() {
  const [items, setItems] = useState<Item[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("fit");
  const [building, setBuilding] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Blob | null>(null);

  const addFiles = (files: File[]) => {
    setResult(null);
    setItems((prev) => [
      ...prev,
      ...files.map((file) => ({
        id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
        file,
        url: URL.createObjectURL(file),
      })),
    ]);
  };

  const remove = (id: string) =>
    setItems((prev) => {
      const t = prev.find((i) => i.id === id);
      if (t) URL.revokeObjectURL(t.url);
      return prev.filter((i) => i.id !== id);
    });

  const move = (index: number, dir: -1 | 1) =>
    setItems((prev) => {
      const next = [...prev];
      const t = index + dir;
      if (t < 0 || t >= next.length) return prev;
      [next[index], next[t]] = [next[t], next[index]];
      return next;
    });

  const reset = () => {
    items.forEach((i) => URL.revokeObjectURL(i.url));
    setItems([]);
    setResult(null);
    setError("");
  };

  const build = async () => {
    if (items.length === 0) return;
    setBuilding(true);
    setError("");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const pdf = await PDFDocument.create();
      const A4 = { w: 595.28, h: 841.89 };

      for (const item of items) {
        let bytes: ArrayBuffer;
        let isPng = false;
        if (item.file.type === "image/png") {
          bytes = await item.file.arrayBuffer();
          isPng = true;
        } else if (item.file.type === "image/jpeg") {
          bytes = await item.file.arrayBuffer();
        } else {
          // Convert WebP/BMP/etc. to JPEG first.
          const img = await loadImage(item.file);
          const jpg = await encodeImage(img, "image/jpeg", 0.92);
          bytes = await jpg.arrayBuffer();
        }
        const embedded = isPng
          ? await pdf.embedPng(bytes)
          : await pdf.embedJpg(bytes);

        if (pageSize === "fit") {
          const page = pdf.addPage([embedded.width, embedded.height]);
          page.drawImage(embedded, {
            x: 0,
            y: 0,
            width: embedded.width,
            height: embedded.height,
          });
        } else {
          const page = pdf.addPage([A4.w, A4.h]);
          const margin = 28;
          const maxW = A4.w - margin * 2;
          const maxH = A4.h - margin * 2;
          const scale = Math.min(maxW / embedded.width, maxH / embedded.height);
          const w = embedded.width * scale;
          const h = embedded.height * scale;
          page.drawImage(embedded, {
            x: (A4.w - w) / 2,
            y: (A4.h - h) / 2,
            width: w,
            height: h,
          });
        }
      }
      const out = await pdf.save();
      setResult(bytesToBlob(out, "application/pdf"));
    } catch (e) {
      setError(
        e instanceof Error
          ? `Could not build PDF: ${e.message}`
          : "Something went wrong. Please try again."
      );
    } finally {
      setBuilding(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      {items.length === 0 ? (
        <DropZone
          acceptedTypes={["image/jpeg", "image/png", "image/webp", "image/bmp"]}
          acceptedLabel="JPG, PNG, WebP, BMP"
          multiple
          maxSizeMB={50}
          onFilesAccepted={addFiles}
        />
      ) : (
        <>
          <div className="mb-4 rounded-xl border border-border bg-background p-4">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-text-muted">
              Page size
            </p>
            <SegmentedControl<PageSize>
              value={pageSize}
              onChange={setPageSize}
              options={[
                { value: "fit", label: "Fit to image" },
                { value: "a4", label: "A4 page" },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-lg border border-border bg-background"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.file.name}
                  className="aspect-square w-full bg-white object-contain"
                />
                <div className="flex items-center justify-between p-2">
                  <span className="font-mono text-xs text-text-muted">
                    {index + 1}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      className="rounded p-1 text-text-muted hover:text-text-primary disabled:opacity-30"
                      aria-label="Move up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => move(index, 1)}
                      disabled={index === items.length - 1}
                      className="rounded p-1 text-text-muted hover:text-text-primary disabled:opacity-30"
                      aria-label="Move down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => remove(item.id)}
                      className="rounded p-1 text-text-muted hover:text-red-400"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <DropZone
              acceptedTypes={["image/jpeg", "image/png", "image/webp", "image/bmp"]}
              acceptedLabel="more images"
              multiple
              maxSizeMB={50}
              onFilesAccepted={addFiles}
              compact
            />
          </div>

          <ErrorMessage message={error} />

          {result ? (
            <div className="mt-5 rounded-xl border border-secondary/30 bg-secondary/5 p-5 text-center">
              <p className="text-lg font-semibold text-secondary">
                ✅ PDF created · {items.length} page
                {items.length > 1 ? "s" : ""}
              </p>
              <p className="mt-1 text-sm text-text-muted">
                {formatBytes(result.size)}
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <Button
                  size="lg"
                  variant="success"
                  icon={Download}
                  onClick={() => downloadBlob(result, `images-${Date.now()}.pdf`)}
                >
                  Download PDF
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
                icon={FileUp}
                loading={building}
                onClick={build}
              >
                {building ? "Building..." : "Create PDF"}
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
