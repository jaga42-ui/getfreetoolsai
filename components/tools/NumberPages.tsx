"use client";

import { useState } from "react";
import { Download, RefreshCw, FileText, Hash } from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { Button, SegmentedControl, ErrorMessage } from "@/components/ui";
import { formatBytes, downloadBlob, bytesToBlob } from "@/lib/utils";

type Pos =
  | "bottom-center"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "top-right"
  | "top-left";
type Fmt = "n" | "page-n" | "n-of-total" | "dash";

const COLORS = { black: [0, 0, 0], grey: [0.5, 0.5, 0.5] } as const;

export default function NumberPages() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [position, setPosition] = useState<Pos>("bottom-center");
  const [format, setFormat] = useState<Fmt>("n");
  const [start, setStart] = useState(1);
  const [fontSize, setFontSize] = useState(12);
  const [color, setColor] = useState<"black" | "grey">("black");
  const [skipFirst, setSkipFirst] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Blob | null>(null);

  const onFile = async (files: File[]) => {
    const f = files[0];
    setFile(f);
    setError("");
    setResult(null);
    setPageCount(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.load(await f.arrayBuffer(), {
        ignoreEncryption: true,
      });
      setPageCount(doc.getPageCount());
    } catch {
      setError("Could not read this PDF. It may be corrupted or encrypted.");
    }
  };

  const reset = () => {
    setFile(null);
    setPageCount(null);
    setResult(null);
    setError("");
  };

  const label = (n: number, total: number) => {
    if (format === "page-n") return `Page ${n}`;
    if (format === "n-of-total") return `${n} of ${total}`;
    if (format === "dash") return `- ${n} -`;
    return `${n}`;
  };

  const run = async () => {
    if (!file || !pageCount) return;
    setBusy(true);
    setError("");
    try {
      const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer(), {
        ignoreEncryption: true,
      });
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const pages = doc.getPages();
      const numbered = skipFirst ? pages.length - 1 : pages.length;
      const [cr, cg, cb] = COLORS[color];
      pages.forEach((page, idx) => {
        if (skipFirst && idx === 0) return;
        const num = start + (skipFirst ? idx - 1 : idx);
        const text = label(num, start + numbered - 1);
        const { width, height } = page.getSize();
        const tw = font.widthOfTextAtSize(text, fontSize);
        const margin = 28;
        let x = (width - tw) / 2;
        if (position.includes("right")) x = width - tw - margin;
        if (position.includes("left")) x = margin;
        const y = position.startsWith("bottom")
          ? margin
          : height - margin - fontSize;
        page.drawText(text, { x, y, size: fontSize, font, color: rgb(cr, cg, cb) });
      });
      const bytes = await doc.save();
      setResult(bytesToBlob(bytes, "application/pdf"));
    } catch (e) {
      setError(
        e instanceof Error
          ? `Could not add page numbers: ${e.message}`
          : "Something went wrong. Please try again."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      {!file ? (
        <DropZone
          acceptedTypes={[".pdf", "application/pdf"]}
          acceptedLabel="a PDF file"
          maxSizeMB={200}
          onFilesAccepted={onFile}
        />
      ) : (
        <>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
            <FileText className="h-5 w-5 shrink-0 text-text-muted" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text-primary">
                {file.name}
              </p>
              <p className="text-xs text-text-muted">
                {pageCount != null ? `${pageCount} pages · ` : ""}
                {formatBytes(file.size)}
              </p>
            </div>
          </div>

          {!result && (
            <div className="mt-4 space-y-4 rounded-xl border border-border bg-background p-4">
              <div>
                <p className="mb-2 font-mono text-xs uppercase tracking-widest text-text-muted">
                  Position
                </p>
                <SegmentedControl<Pos>
                  value={position}
                  onChange={setPosition}
                  options={[
                    { value: "bottom-center", label: "Bottom C" },
                    { value: "bottom-right", label: "Bottom R" },
                    { value: "bottom-left", label: "Bottom L" },
                    { value: "top-center", label: "Top C" },
                    { value: "top-right", label: "Top R" },
                    { value: "top-left", label: "Top L" },
                  ]}
                />
              </div>
              <div>
                <p className="mb-2 font-mono text-xs uppercase tracking-widest text-text-muted">
                  Format
                </p>
                <SegmentedControl<Fmt>
                  value={format}
                  onChange={setFormat}
                  options={[
                    { value: "n", label: "1" },
                    { value: "page-n", label: "Page 1" },
                    { value: "n-of-total", label: "1 of N" },
                    { value: "dash", label: "- 1 -" },
                  ]}
                />
              </div>
              <div className="flex flex-wrap items-end gap-4">
                <label className="text-sm">
                  <span className="mb-1 block text-text-muted">Start at</span>
                  <input
                    type="number"
                    min={0}
                    value={start}
                    onChange={(e) => setStart(Number(e.target.value) || 1)}
                    className="w-24 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
                  />
                </label>
                <label className="text-sm">
                  <span className="mb-1 block text-text-muted">Font size</span>
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
                  >
                    {[8, 10, 12, 14].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm">
                  <span className="mb-1 block text-text-muted">Color</span>
                  <SegmentedControl<"black" | "grey">
                    value={color}
                    onChange={setColor}
                    options={[
                      { value: "black", label: "Black" },
                      { value: "grey", label: "Grey" },
                    ]}
                  />
                </label>
              </div>
              <label className="flex items-center gap-2 text-sm text-text-primary">
                <input
                  type="checkbox"
                  checked={skipFirst}
                  onChange={(e) => setSkipFirst(e.target.checked)}
                  className="h-4 w-4 accent-primary"
                />
                Skip first page (for cover pages)
              </label>
            </div>
          )}

          <ErrorMessage message={error} />

          {result ? (
            <div className="mt-5 rounded-xl border border-secondary/30 bg-secondary/5 p-5 text-center">
              <p className="text-lg font-semibold text-secondary">
                ✅ Page numbers added
              </p>
              <p className="mt-1 text-sm text-text-muted">
                {formatBytes(result.size)}
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <Button
                  size="lg"
                  variant="success"
                  icon={Download}
                  onClick={() =>
                    downloadBlob(result, `numbered-${file.name}`)
                  }
                >
                  Download PDF
                </Button>
                <Button variant="ghost" icon={RefreshCw} onClick={reset}>
                  Process another file
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                icon={Hash}
                loading={busy}
                onClick={run}
                disabled={!pageCount}
              >
                {busy ? "Adding..." : "Add page numbers"}
              </Button>
              <Button variant="ghost" icon={RefreshCw} onClick={reset}>
                Start over
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
