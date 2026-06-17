"use client";

import { useState } from "react";
import {
  Download,
  RotateCcw,
  RotateCw,
  FileText,
  RefreshCw,
} from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { Button, SegmentedControl, ErrorMessage, SuccessHeader } from "@/components/ui";
import { formatBytes, downloadBlob, bytesToBlob, parsePageRanges } from "@/lib/utils";

type Angle = 90 | 180 | 270;

export default function RotatePDF() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [angle, setAngle] = useState<Angle>(90);
  const [allPages, setAllPages] = useState(true);
  const [ranges, setRanges] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Blob | null>(null);

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
    setRanges("");
  };

  const rotate = async () => {
    if (!file || !pageCount) return;
    setProcessing(true);
    setError("");
    try {
      const { PDFDocument, degrees } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer(), {
        ignoreEncryption: true,
      });
      let targets: number[];
      if (allPages) {
        targets = Array.from({ length: pageCount }, (_, i) => i + 1);
      } else {
        targets = parsePageRanges(ranges, pageCount);
        if (targets.length === 0) {
          setError('Enter pages to rotate, e.g. "1,3,5-8".');
          setProcessing(false);
          return;
        }
      }
      const pages = doc.getPages();
      for (const p of targets) {
        const page = pages[p - 1];
        const current = page.getRotation().angle;
        page.setRotation(degrees((current + angle) % 360));
      }
      const out = await doc.save();
      setResult(bytesToBlob(out, "application/pdf"));
    } catch (e) {
      setError(
        e instanceof Error
          ? `Could not rotate: ${e.message}`
          : "Something went wrong. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  const outName = file ? `rotated-${file.name}` : "rotated.pdf";

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
                  Rotation
                </p>
                <SegmentedControl<string>
                  value={String(angle)}
                  onChange={(v) => setAngle(Number(v) as Angle)}
                  options={[
                    { value: "90", label: "90° ⟳" },
                    { value: "180", label: "180°" },
                    { value: "270", label: "90° ⟲" },
                  ]}
                />
              </div>
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
            </div>
          )}

          <ErrorMessage message={error} />

          {result ? (
            <div className="mt-5 rounded-xl border border-secondary/30 bg-secondary/5 p-5 text-center">
              <SuccessHeader>Pages rotated</SuccessHeader>
              <p className="mt-1 text-sm text-text-muted">
                {formatBytes(result.size)}
              </p>
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
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                icon={RotateCw}
                loading={processing}
                onClick={rotate}
                disabled={!pageCount}
              >
                {processing ? "Rotating..." : "Rotate PDF"}
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
