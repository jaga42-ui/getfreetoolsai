"use client";

import { useState } from "react";
import { Download, FileMinus2, RotateCcw, FileText } from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { Button, ErrorMessage, SuccessHeader } from "@/components/ui";
import {
  formatBytes,
  downloadBlob,
  parsePageRanges,
  bytesToBlob,
} from "@/lib/utils";
import { useToolShortcuts } from "@/lib/hooks";

export default function DeletePdfPages() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [remove, setRemove] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ name: string; blob: Blob; kept: number } | null>(null);

  const onFile = async (files: File[]) => {
    const f = files[0];
    setError("");
    setResult(null);
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
    setResult(null);
    setError("");
    setRemove("");
  };

  const baseName = file ? file.name.replace(/\.pdf$/i, "") : "document";

  const run = async () => {
    if (!file || !pageCount) return;
    setError("");
    const toRemove = new Set(parsePageRanges(remove, pageCount));
    if (toRemove.size === 0) {
      setError('Enter the pages to remove, e.g. "2,5-7,10".');
      return;
    }
    if (toRemove.size >= pageCount) {
      setError("That would remove every page. Leave at least one page.");
      return;
    }
    setProcessing(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const src = await PDFDocument.load(await file.arrayBuffer(), {
        ignoreEncryption: true,
      });
      const keep: number[] = [];
      for (let i = 0; i < pageCount; i++) if (!toRemove.has(i + 1)) keep.push(i);
      const out = await PDFDocument.create();
      const copied = await out.copyPages(src, keep);
      copied.forEach((p) => out.addPage(p));
      const bytes = await out.save();
      setResult({
        name: `${baseName}-pages-removed.pdf`,
        blob: bytesToBlob(bytes, "application/pdf"),
        kept: keep.length,
      });
    } catch (e) {
      setError(
        e instanceof Error
          ? `Could not process: ${e.message}`
          : "Something went wrong. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  useToolShortcuts({
    onRun: run,
    onReset: reset,
    runEnabled: !!file && !!pageCount && !processing && !result,
  });

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
            <div className="mt-4 rounded-xl border border-border bg-background p-4">
              <label className="text-sm text-text-muted">Pages to remove</label>
              <input
                value={remove}
                onChange={(e) => setRemove(e.target.value)}
                placeholder="e.g. 2,5-7,10"
                className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/60 focus:border-primary focus:outline-none"
              />
              <p className="mt-1.5 text-xs text-text-muted">
                Use commas and ranges. Pages 1–{pageCount ?? "?"} available; the
                rest are kept in order.
              </p>
            </div>
          )}

          <ErrorMessage message={error} />

          {result ? (
            <div className="mt-5 rounded-xl border border-secondary/30 bg-secondary/5 p-5 text-center">
              <SuccessHeader>
                Done — {result.kept} page{result.kept === 1 ? "" : "s"} kept
              </SuccessHeader>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <Button
                  variant="success"
                  icon={Download}
                  onClick={() => downloadBlob(result.blob, result.name)}
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
                icon={FileMinus2}
                loading={processing}
                onClick={run}
                disabled={!pageCount}
              >
                {processing ? "Removing..." : "Remove pages"}
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
