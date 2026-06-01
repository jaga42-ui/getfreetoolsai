"use client";

import { useState } from "react";
import { Download, Image as ImageIcon, RotateCcw, Package } from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { Button, SegmentedControl, ErrorMessage } from "@/components/ui";
import { ProgressBar } from "@/components/ProgressBar";
import { formatBytes, downloadBlob, parsePageRanges } from "@/lib/utils";
import { getPdfjs, renderPageToCanvas, canvasToBlob } from "@/lib/pdfjs";
import { zipFiles } from "@/lib/zip";

type Quality = "low" | "medium" | "high" | "max";
const QUALITY_SCALE: Record<Quality, number> = {
  low: 1,
  medium: 1.5,
  high: 2.2,
  max: 3.2,
};

type PageImage = { page: number; blob: Blob; url: string };

export default function PdfToJpg() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [quality, setQuality] = useState<Quality>("high");
  const [allPages, setAllPages] = useState(true);
  const [ranges, setRanges] = useState("");
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<PageImage[]>([]);

  const onFile = async (files: File[]) => {
    const f = files[0];
    setFile(f);
    setError("");
    setImages([]);
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
    images.forEach((i) => URL.revokeObjectURL(i.url));
    setFile(null);
    setPageCount(null);
    setImages([]);
    setError("");
    setRanges("");
    setProgress(0);
  };

  const baseName = file ? file.name.replace(/\.pdf$/i, "") : "page";

  const convert = async () => {
    if (!file || !pageCount) return;
    setProcessing(true);
    setError("");
    setImages([]);
    setProgress(0);
    try {
      const pdfjs = await getPdfjs();
      const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() })
        .promise;

      let targetPages: number[];
      if (allPages) {
        targetPages = Array.from({ length: pageCount }, (_, i) => i + 1);
      } else {
        targetPages = parsePageRanges(ranges, pageCount);
        if (targetPages.length === 0) {
          setError('Enter pages to convert, e.g. "1,3,5-8".');
          setProcessing(false);
          return;
        }
      }

      const scale = QUALITY_SCALE[quality];
      const results: PageImage[] = [];
      for (let idx = 0; idx < targetPages.length; idx++) {
        const pageNum = targetPages[idx];
        const page = await doc.getPage(pageNum);
        const canvas = await renderPageToCanvas(page, scale);
        const blob = await canvasToBlob(canvas, "image/jpeg", 0.92);
        results.push({
          page: pageNum,
          blob,
          url: URL.createObjectURL(blob),
        });
        setProgress(Math.round(((idx + 1) / targetPages.length) * 100));
      }
      setImages(results);
    } catch (e) {
      setError(
        e instanceof Error
          ? `Conversion failed: ${e.message}`
          : "Something went wrong. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  const downloadZip = async () => {
    const zip = await zipFiles(
      images.map((i) => ({ name: `${baseName}-page-${i.page}.jpg`, blob: i.blob }))
    );
    downloadBlob(zip, `${baseName}-images-${Date.now()}.zip`);
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
            <ImageIcon className="h-5 w-5 shrink-0 text-text-muted" />
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

          {images.length === 0 && (
            <div className="mt-4 space-y-4 rounded-xl border border-border bg-background p-4">
              <div>
                <p className="mb-2 font-mono text-xs uppercase tracking-widest text-text-muted">
                  Pages
                </p>
                <SegmentedControl<"all" | "some">
                  value={allPages ? "all" : "some"}
                  onChange={(v) => setAllPages(v === "all")}
                  options={[
                    { value: "all", label: "All pages" },
                    { value: "some", label: "Specific pages" },
                  ]}
                />
                {!allPages && (
                  <input
                    value={ranges}
                    onChange={(e) => setRanges(e.target.value)}
                    placeholder="e.g. 1,3,5-8"
                    className="mt-3 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/60 focus:border-primary focus:outline-none"
                  />
                )}
              </div>
              <div>
                <p className="mb-2 font-mono text-xs uppercase tracking-widest text-text-muted">
                  Quality
                </p>
                <SegmentedControl<Quality>
                  value={quality}
                  onChange={setQuality}
                  options={[
                    { value: "low", label: "Low" },
                    { value: "medium", label: "Medium" },
                    { value: "high", label: "High" },
                    { value: "max", label: "Max" },
                  ]}
                />
              </div>
            </div>
          )}

          <ErrorMessage message={error} />

          {processing && (
            <div className="mt-5">
              <ProgressBar
                value={progress}
                label={`Rendering pages... ${progress}%`}
              />
            </div>
          )}

          {images.length > 0 ? (
            <div className="mt-5">
              <p className="text-center text-lg font-semibold text-secondary">
                ✅ Converted {images.length} page
                {images.length > 1 ? "s" : ""}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {images.map((img) => (
                  <div
                    key={img.page}
                    className="overflow-hidden rounded-lg border border-border bg-background"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={`Page ${img.page}`}
                      className="aspect-[3/4] w-full bg-white object-contain"
                    />
                    <div className="flex items-center justify-between p-2">
                      <span className="text-xs text-text-muted">
                        Page {img.page}
                      </span>
                      <button
                        onClick={() =>
                          downloadBlob(img.blob, `${baseName}-page-${img.page}.jpg`)
                        }
                        className="rounded-md p-1.5 text-text-muted hover:bg-surface hover:text-text-primary"
                        aria-label="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <Button variant="success" icon={Package} onClick={downloadZip}>
                  Download all as ZIP
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
                  icon={ImageIcon}
                  onClick={convert}
                  disabled={!pageCount}
                >
                  Convert to JPG
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
