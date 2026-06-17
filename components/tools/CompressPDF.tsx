"use client";

import { useEffect, useState } from "react";
import { Download, RotateCcw, FileArchive, FileText, Info } from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { Button, SegmentedControl, ErrorMessage, SuccessHeader } from "@/components/ui";
import { ProgressBar } from "@/components/ProgressBar";
import { formatBytes, downloadBlob, bytesToBlob } from "@/lib/utils";
import { getPdfjs, renderPageToCanvas, canvasToBlob } from "@/lib/pdfjs";
import { usePersistentState, useToolShortcuts } from "@/lib/hooks";

type Level = "low" | "medium" | "high";
type Mode = "level" | "target";
const SETTINGS: Record<Level, { scale: number; quality: number; label: string }> =
  {
    low: { scale: 1.0, quality: 0.5, label: "Smallest file" },
    medium: { scale: 1.3, quality: 0.65, label: "Balanced" },
    high: { scale: 1.7, quality: 0.82, label: "Best quality" },
  };

export default function CompressPDF({
  defaultTargetKB,
}: {
  defaultTargetKB?: number;
} = {}) {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [mode, setMode] = usePersistentState<Mode>("gft:pdf-compress:mode", "level");
  const [level, setLevel] = usePersistentState<Level>("gft:pdf-compress:level", "medium");
  const [targetKB, setTargetKB] = usePersistentState("gft:pdf-compress:targetKB", 500);
  const [processing, setProcessing] = useState(false);

  // Long-tail landing pages (e.g. /pdf/compress/100kb) pre-arm target mode.
  useEffect(() => {
    if (defaultTargetKB != null) {
      setMode("target");
      setTargetKB(defaultTargetKB);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<Blob | null>(null);

  const onFile = async (files: File[]) => {
    const f = files[0];
    setError("");
    setResult(null);
    setFile(f);
    setPageCount(null);
    try {
      const pdfjs = await getPdfjs();
      const doc = await pdfjs.getDocument({ data: await f.arrayBuffer() })
        .promise;
      setPageCount(doc.numPages);
    } catch {
      setError("Could not read this PDF. It may be corrupted or encrypted.");
    }
  };

  const reset = () => {
    setFile(null);
    setPageCount(null);
    setResult(null);
    setError("");
    setProgress(0);
    setStatusText("");
  };

  const compress = async () => {
    if (!file || !pageCount) return;
    setProcessing(true);
    setError("");
    setProgress(0);
    try {
      const pdfjs = await getPdfjs();
      const { PDFDocument } = await import("pdf-lib");
      const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() })
        .promise;

      if (mode === "level") {
        const out = await PDFDocument.create();
        const { scale, quality } = SETTINGS[level];
        for (let p = 1; p <= pageCount; p++) {
          setStatusText(`Compressing page ${p} of ${pageCount}...`);
          const page = await doc.getPage(p);
          const canvas = await renderPageToCanvas(page, scale);
          const jpg = await canvasToBlob(canvas, "image/jpeg", quality);
          const embedded = await out.embedJpg(await jpg.arrayBuffer());
          const viewport = page.getViewport({ scale: 1 });
          const newPage = out.addPage([viewport.width, viewport.height]);
          newPage.drawImage(embedded, {
            x: 0,
            y: 0,
            width: viewport.width,
            height: viewport.height,
          });
          setProgress(Math.round((p / pageCount) * 100));
        }
        const bytes = await out.save();
        setResult(bytesToBlob(bytes, "application/pdf"));
      } else {
        // Target size: render pages once, then binary-search a single JPEG
        // quality that brings the total under the requested size.
        const targetBytes = Math.max(20, targetKB) * 1024;
        const scale = 1.5;
        const canvases: HTMLCanvasElement[] = [];
        const dims: { w: number; h: number }[] = [];
        for (let p = 1; p <= pageCount; p++) {
          setStatusText(`Rendering page ${p} of ${pageCount}...`);
          const page = await doc.getPage(p);
          canvases.push(await renderPageToCanvas(page, scale));
          const vp = page.getViewport({ scale: 1 });
          dims.push({ w: vp.width, h: vp.height });
          setProgress(Math.round((p / pageCount) * 40));
        }

        const encodeAll = async (q: number) => {
          const blobs: Blob[] = [];
          let sum = 0;
          for (const c of canvases) {
            const b = await canvasToBlob(c, "image/jpeg", q);
            blobs.push(b);
            sum += b.size;
          }
          return { blobs, sum };
        };

        // Reserve ~6% for PDF structure overhead.
        const budget = targetBytes * 0.94;
        let lo = 0.18;
        let hi = 0.95;
        let best: Blob[] | null = null;
        setStatusText("Tuning quality to hit your target size...");
        for (let i = 0; i < 7; i++) {
          const mid = (lo + hi) / 2;
          const { blobs, sum } = await encodeAll(mid);
          if (sum <= budget) {
            best = blobs;
            lo = mid;
          } else {
            hi = mid;
          }
          setProgress(40 + Math.round(((i + 1) / 7) * 45));
        }
        // If even the lowest quality overshoots, use it anyway (best effort).
        if (!best) best = (await encodeAll(lo)).blobs;

        setStatusText("Building PDF...");
        const out = await PDFDocument.create();
        for (let i = 0; i < best.length; i++) {
          const embedded = await out.embedJpg(await best[i].arrayBuffer());
          const { w, h } = dims[i];
          const pg = out.addPage([w, h]);
          pg.drawImage(embedded, { x: 0, y: 0, width: w, height: h });
        }
        const bytes = await out.save();
        setProgress(100);
        setResult(bytesToBlob(bytes, "application/pdf"));
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? `Compression failed: ${e.message}`
          : "Something went wrong. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  useToolShortcuts({
    onRun: compress,
    onReset: reset,
    runEnabled: !!file && !!pageCount && !processing && !result,
  });

  const savings =
    file && result
      ? Math.round((1 - result.size / file.size) * 100)
      : null;
  const outName = file ? `compressed-${file.name}` : "compressed.pdf";

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

          {!result && !processing && (
            <>
              <div className="mt-4 rounded-xl border border-border bg-background p-4">
                <p className="mb-3 font-mono text-xs uppercase tracking-widest text-text-muted">
                  Compression
                </p>
                <SegmentedControl<Mode>
                  value={mode}
                  onChange={setMode}
                  options={[
                    { value: "level", label: "By level" },
                    { value: "target", label: "Target size" },
                  ]}
                />

                {mode === "level" ? (
                  <div className="mt-4">
                    <SegmentedControl<Level>
                      value={level}
                      onChange={setLevel}
                      options={[
                        { value: "low", label: "Low" },
                        { value: "medium", label: "Medium" },
                        { value: "high", label: "High" },
                      ]}
                    />
                    <p className="mt-3 text-xs text-text-muted">
                      {SETTINGS[level].label}
                    </p>
                  </div>
                ) : (
                  <div className="mt-4">
                    <div className="flex items-center gap-3">
                      <label className="text-sm text-text-muted">
                        Target size
                      </label>
                      <input
                        type="number"
                        min={20}
                        step={50}
                        value={targetKB}
                        onChange={(e) =>
                          setTargetKB(Math.max(20, Number(e.target.value) || 0))
                        }
                        className="w-28 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
                      />
                      <span className="text-sm font-medium text-text-primary">
                        KB
                      </span>
                    </div>
                    <p className="mt-3 text-xs text-text-muted">
                      We tune image quality to get as close as possible to your
                      target. Very small targets may not be reachable.
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-sky-500/30 bg-sky-500/5 p-4 text-sm text-text-primary">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
                <span>
                  This works best on scanned or image-heavy PDFs. Pages are
                  re-rendered as compressed images, so text becomes
                  non-selectable in the output.
                </span>
              </div>
            </>
          )}

          <ErrorMessage message={error} />

          {processing && (
            <div className="mt-5">
              <ProgressBar value={progress} label={statusText} />
            </div>
          )}

          {result ? (
            <div className="mt-5 rounded-xl border border-secondary/30 bg-secondary/5 p-5 text-center">
              <SuccessHeader>Compressed</SuccessHeader>
              <p className="mt-1 text-sm text-text-muted">
                {formatBytes(file.size)} →{" "}
                <span className="font-semibold text-secondary">
                  {formatBytes(result.size)}
                </span>
                {savings != null && savings > 0 && (
                  <span className="ml-1 text-secondary">(−{savings}%)</span>
                )}
              </p>
              {savings != null && savings <= 0 && (
                <p className="mt-1 text-xs text-text-muted">
                  This PDF was already well-optimised — try a lower level or
                  keep the original.
                </p>
              )}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <Button
                  size="lg"
                  variant="success"
                  icon={Download}
                  onClick={() => downloadBlob(result, outName)}
                >
                  Download PDF
                </Button>
                <Button variant="ghost" icon={RotateCcw} onClick={reset}>
                  Process another file
                </Button>
              </div>
            </div>
          ) : (
            !processing && (
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Button
                  size="lg"
                  icon={FileArchive}
                  onClick={compress}
                  disabled={!pageCount}
                >
                  Compress PDF
                </Button>
                <Button variant="ghost" icon={RotateCcw} onClick={reset}>
                  Start over
                </Button>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
}
