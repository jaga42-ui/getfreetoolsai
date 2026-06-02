"use client";

import { useState } from "react";
import {
  Download,
  Trash2,
  ArrowUp,
  ArrowDown,
  FileUp,
  RefreshCw,
  Package,
} from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { Button, SegmentedControl, ErrorMessage } from "@/components/ui";
import { downloadBlob, bytesToBlob } from "@/lib/utils";
import { loadImage, encodeImage } from "@/lib/image";
import { zipFiles } from "@/lib/zip";
import type { PDFDocument, PDFImage } from "pdf-lib";

type Item = { id: string; file: File; url: string };
type PageSize = "fit" | "a4" | "letter";
type Orient = "portrait" | "landscape";
type Margin = "none" | "small" | "medium";
type Output = "merge" | "individual";

const SIZES = {
  a4: { w: 595.28, h: 841.89 },
  letter: { w: 612, h: 792 },
};
const MARGINS = { none: 0, small: 24, medium: 48 };

export default function PngToPdf() {
  const [items, setItems] = useState<Item[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("fit");
  const [orient, setOrient] = useState<Orient>("portrait");
  const [margin, setMargin] = useState<Margin>("small");
  const [output, setOutput] = useState<Output>("merge");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const add = (files: File[]) =>
    setItems((p) => [
      ...p,
      ...files.map((file) => ({
        id: `${file.name}-${Math.random().toString(36).slice(2)}`,
        file,
        url: URL.createObjectURL(file),
      })),
    ]);
  const remove = (id: string) =>
    setItems((p) => {
      const t = p.find((i) => i.id === id);
      if (t) URL.revokeObjectURL(t.url);
      return p.filter((i) => i.id !== id);
    });
  const move = (i: number, d: -1 | 1) =>
    setItems((p) => {
      const n = [...p];
      const t = i + d;
      if (t < 0 || t >= n.length) return p;
      [n[i], n[t]] = [n[t], n[i]];
      return n;
    });
  const reset = () => {
    items.forEach((i) => URL.revokeObjectURL(i.url));
    setItems([]);
    setError("");
  };

  const embedImage = async (
    pdf: PDFDocument,
    file: File
  ): Promise<PDFImage> => {
    if (file.type === "image/png")
      return pdf.embedPng(await file.arrayBuffer());
    if (file.type === "image/jpeg")
      return pdf.embedJpg(await file.arrayBuffer());
    const img = await loadImage(file);
    const jpg = await encodeImage(img, "image/jpeg", 0.92);
    return pdf.embedJpg(await jpg.arrayBuffer());
  };

  const placeOnPage = (pdf: PDFDocument, embedded: PDFImage) => {
    const m = MARGINS[margin];
    if (pageSize === "fit") {
      const page = pdf.addPage([
        embedded.width + m * 2,
        embedded.height + m * 2,
      ]);
      page.drawImage(embedded, {
        x: m,
        y: m,
        width: embedded.width,
        height: embedded.height,
      });
      return;
    }
    let { w, h } = SIZES[pageSize];
    if (orient === "landscape") [w, h] = [h, w];
    const page = pdf.addPage([w, h]);
    const maxW = w - m * 2;
    const maxH = h - m * 2;
    const scale = Math.min(maxW / embedded.width, maxH / embedded.height);
    const iw = embedded.width * scale;
    const ih = embedded.height * scale;
    page.drawImage(embedded, {
      x: (w - iw) / 2,
      y: (h - ih) / 2,
      width: iw,
      height: ih,
    });
  };

  const run = async () => {
    if (items.length === 0) return;
    setBusy(true);
    setError("");
    try {
      const { PDFDocument } = await import("pdf-lib");
      if (output === "merge") {
        const pdf = await PDFDocument.create();
        for (const item of items) {
          const embedded = await embedImage(pdf, item.file);
          placeOnPage(pdf, embedded);
        }
        const bytes = await pdf.save();
        downloadBlob(
          bytesToBlob(bytes, "application/pdf"),
          `images-${Date.now()}.pdf`
        );
      } else {
        const outputs: { name: string; blob: Blob }[] = [];
        for (const item of items) {
          const pdf = await PDFDocument.create();
          const embedded = await embedImage(pdf, item.file);
          placeOnPage(pdf, embedded);
          const bytes = await pdf.save();
          outputs.push({
            name: `${item.file.name.replace(/\.[^.]+$/, "")}.pdf`,
            blob: bytesToBlob(bytes, "application/pdf"),
          });
        }
        if (outputs.length === 1) downloadBlob(outputs[0].blob, outputs[0].name);
        else downloadBlob(await zipFiles(outputs), `pdfs-${Date.now()}.zip`);
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? `Could not build PDF: ${e.message}`
          : "Something went wrong. Please try again."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      {items.length === 0 ? (
        <DropZone
          acceptedTypes={["image/png", "image/jpeg", "image/webp", "image/bmp", "image/gif"]}
          acceptedLabel="PNG, JPG, WebP, BMP, GIF"
          multiple
          maxSizeMB={50}
          onFilesAccepted={add}
        />
      ) : (
        <>
          <div className="mb-4 grid gap-4 rounded-xl border border-border bg-background p-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-widest text-text-muted">
                Page size
              </p>
              <SegmentedControl<PageSize>
                value={pageSize}
                onChange={setPageSize}
                options={[
                  { value: "fit", label: "Fit" },
                  { value: "a4", label: "A4" },
                  { value: "letter", label: "Letter" },
                ]}
              />
            </div>
            {pageSize !== "fit" && (
              <div>
                <p className="mb-2 font-mono text-xs uppercase tracking-widest text-text-muted">
                  Orientation
                </p>
                <SegmentedControl<Orient>
                  value={orient}
                  onChange={setOrient}
                  options={[
                    { value: "portrait", label: "Portrait" },
                    { value: "landscape", label: "Landscape" },
                  ]}
                />
              </div>
            )}
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-widest text-text-muted">
                Margin
              </p>
              <SegmentedControl<Margin>
                value={margin}
                onChange={setMargin}
                options={[
                  { value: "none", label: "None" },
                  { value: "small", label: "Small" },
                  { value: "medium", label: "Medium" },
                ]}
              />
            </div>
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-widest text-text-muted">
                Output
              </p>
              <SegmentedControl<Output>
                value={output}
                onChange={setOutput}
                options={[
                  { value: "merge", label: "One PDF" },
                  { value: "individual", label: "Per image" },
                ]}
              />
            </div>
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
              acceptedTypes={["image/png", "image/jpeg", "image/webp", "image/bmp", "image/gif"]}
              acceptedLabel="more images"
              multiple
              maxSizeMB={50}
              onFilesAccepted={add}
              compact
            />
          </div>

          <ErrorMessage message={error} />

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              icon={output === "merge" ? FileUp : Package}
              loading={busy}
              onClick={run}
            >
              {busy ? "Building..." : "Create PDF"}
            </Button>
            <Button variant="ghost" icon={RefreshCw} onClick={reset}>
              Start over
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
