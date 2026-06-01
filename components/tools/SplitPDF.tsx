"use client";

import { useState } from "react";
import { Download, Scissors, RotateCcw, FileText, Package } from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { Button, SegmentedControl, ErrorMessage } from "@/components/ui";
import {
  formatBytes,
  downloadBlob,
  parsePageRanges,
  bytesToBlob,
} from "@/lib/utils";
import { zipFiles } from "@/lib/zip";

type Mode = "extract" | "everyN" | "individual";
type Output = { name: string; blob: Blob };

export default function SplitPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [mode, setMode] = useState<Mode>("extract");
  const [ranges, setRanges] = useState("");
  const [everyN, setEveryN] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [outputs, setOutputs] = useState<Output[]>([]);

  const onFile = async (files: File[]) => {
    const f = files[0];
    setError("");
    setOutputs([]);
    setFile(f);
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
    setOutputs([]);
    setError("");
    setRanges("");
  };

  const baseName = file ? file.name.replace(/\.pdf$/i, "") : "split";

  const buildPdf = async (
    srcBytes: ArrayBuffer,
    pageIndices: number[]
  ): Promise<Blob> => {
    const { PDFDocument } = await import("pdf-lib");
    const src = await PDFDocument.load(srcBytes, { ignoreEncryption: true });
    const out = await PDFDocument.create();
    const copied = await out.copyPages(src, pageIndices);
    copied.forEach((p) => out.addPage(p));
    const bytes = await out.save();
    return bytesToBlob(bytes, "application/pdf");
  };

  const run = async () => {
    if (!file || !pageCount) return;
    setProcessing(true);
    setError("");
    setOutputs([]);
    try {
      const srcBytes = await file.arrayBuffer();
      const results: Output[] = [];

      if (mode === "extract") {
        const pages = parsePageRanges(ranges, pageCount);
        if (pages.length === 0) {
          setError('Enter pages to extract, e.g. "1,3,5-8,12".');
          setProcessing(false);
          return;
        }
        const blob = await buildPdf(
          srcBytes.slice(0),
          pages.map((p) => p - 1)
        );
        results.push({ name: `${baseName}-pages.pdf`, blob });
      } else if (mode === "everyN") {
        const n = Math.max(1, everyN);
        let part = 1;
        for (let start = 0; start < pageCount; start += n) {
          const indices: number[] = [];
          for (let i = start; i < Math.min(start + n, pageCount); i++)
            indices.push(i);
          const blob = await buildPdf(srcBytes.slice(0), indices);
          results.push({ name: `${baseName}-part-${part}.pdf`, blob });
          part++;
        }
      } else {
        for (let i = 0; i < pageCount; i++) {
          const blob = await buildPdf(srcBytes.slice(0), [i]);
          results.push({ name: `${baseName}-page-${i + 1}.pdf`, blob });
        }
      }
      setOutputs(results);
    } catch (e) {
      setError(
        e instanceof Error
          ? `Could not split: ${e.message}`
          : "Something went wrong. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  const downloadZip = async () => {
    const zip = await zipFiles(outputs);
    downloadBlob(zip, `${baseName}-split-${Date.now()}.zip`);
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

          {outputs.length === 0 && (
            <div className="mt-4 rounded-xl border border-border bg-background p-4">
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-text-muted">
                Split mode
              </p>
              <SegmentedControl<Mode>
                value={mode}
                onChange={setMode}
                options={[
                  { value: "extract", label: "Extract pages" },
                  { value: "everyN", label: "Every N pages" },
                  { value: "individual", label: "Each page separately" },
                ]}
              />

              {mode === "extract" && (
                <div className="mt-4">
                  <label className="text-sm text-text-muted">
                    Pages to extract
                  </label>
                  <input
                    value={ranges}
                    onChange={(e) => setRanges(e.target.value)}
                    placeholder="e.g. 1,3,5-8,12"
                    className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/60 focus:border-primary focus:outline-none"
                  />
                  <p className="mt-1.5 text-xs text-text-muted">
                    Use commas and ranges. Pages 1–{pageCount ?? "?"} available.
                  </p>
                </div>
              )}

              {mode === "everyN" && (
                <div className="mt-4 flex items-center gap-3">
                  <label className="text-sm text-text-muted">
                    Split every
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={pageCount ?? undefined}
                    value={everyN}
                    onChange={(e) =>
                      setEveryN(Math.max(1, Number(e.target.value) || 1))
                    }
                    className="w-24 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
                  />
                  <span className="text-sm text-text-primary">pages</span>
                </div>
              )}

              {mode === "individual" && (
                <p className="mt-4 text-sm text-text-muted">
                  Each of the {pageCount ?? ""} pages becomes its own PDF,
                  delivered as a ZIP.
                </p>
              )}
            </div>
          )}

          <ErrorMessage message={error} />

          {outputs.length > 0 ? (
            <div className="mt-5 rounded-xl border border-secondary/30 bg-secondary/5 p-5">
              <p className="text-center text-lg font-semibold text-secondary">
                ✅ Split into {outputs.length} file
                {outputs.length > 1 ? "s" : ""}
              </p>
              <div className="mt-4 max-h-60 space-y-2 overflow-y-auto">
                {outputs.map((o, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg border border-border bg-background p-2.5"
                  >
                    <FileText className="h-4 w-4 shrink-0 text-text-muted" />
                    <span className="min-w-0 flex-1 truncate text-sm text-text-primary">
                      {o.name}
                    </span>
                    <span className="text-xs text-text-muted">
                      {formatBytes(o.blob.size)}
                    </span>
                    <button
                      onClick={() => downloadBlob(o.blob, o.name)}
                      className="rounded-md p-1.5 text-text-muted hover:bg-surface hover:text-text-primary"
                      aria-label="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                {outputs.length > 1 && (
                  <Button variant="success" icon={Package} onClick={downloadZip}>
                    Download all as ZIP
                  </Button>
                )}
                {outputs.length === 1 && (
                  <Button
                    variant="success"
                    icon={Download}
                    onClick={() => downloadBlob(outputs[0].blob, outputs[0].name)}
                  >
                    Download PDF
                  </Button>
                )}
                <Button variant="ghost" icon={RotateCcw} onClick={reset}>
                  Process another file
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                icon={Scissors}
                loading={processing}
                onClick={run}
                disabled={!pageCount}
              >
                {processing ? "Splitting..." : "Split PDF"}
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
