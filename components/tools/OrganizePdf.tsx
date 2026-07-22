"use client";

import { useState, useRef } from "react";
import {
  Download,
  RotateCw,
  Trash2,
  RotateCcw,
  Save,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { Button, ErrorMessage, SuccessHeader } from "@/components/ui";
import { formatBytes, downloadBlob, bytesToBlob } from "@/lib/utils";
import { getPdfjs, renderPageToCanvas } from "@/lib/pdfjs";
import { cn } from "@/lib/utils";

type Page = { id: string; srcIndex: number; rot: number; thumb: string };

export default function OrganizePdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(0);
  const [total, setTotal] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ name: string; blob: Blob } | null>(null);
  const srcBytes = useRef<ArrayBuffer | null>(null);
  const dragFrom = useRef<number | null>(null);

  const baseName = file ? file.name.replace(/\.pdf$/i, "") : "document";

  const onFile = async (files: File[]) => {
    const f = files[0];
    setError("");
    setResult(null);
    setPages([]);
    setFile(f);
    setLoading(true);
    setLoaded(0);
    try {
      const buf = await f.arrayBuffer();
      srcBytes.current = buf;
      const pdfjs = await getPdfjs();
      const doc = await pdfjs.getDocument({ data: buf.slice(0) }).promise;
      setTotal(doc.numPages);
      const next: Page[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        // Small thumbnail: target ~150px wide.
        const base = page.getViewport({ scale: 1 });
        const canvas = await renderPageToCanvas(page, 150 / base.width);
        next.push({
          id: `${i}-${Math.random().toString(36).slice(2, 7)}`,
          srcIndex: i - 1,
          rot: 0,
          thumb: canvas.toDataURL("image/jpeg", 0.7),
        });
        setLoaded(i);
        page.cleanup();
      }
      setPages(next);
    } catch {
      setError("Could not read this PDF. It may be corrupted or password-protected.");
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPages([]);
    setResult(null);
    setError("");
    srcBytes.current = null;
  };

  const rotate = (id: string) =>
    setPages((ps) => ps.map((p) => (p.id === id ? { ...p, rot: (p.rot + 90) % 360 } : p)));
  const remove = (id: string) => setPages((ps) => ps.filter((p) => p.id !== id));

  const moveBy = (index: number, delta: number) =>
    setPages((ps) => {
      const to = index + delta;
      if (to < 0 || to >= ps.length) return ps;
      const copy = [...ps];
      const [item] = copy.splice(index, 1);
      copy.splice(to, 0, item);
      return copy;
    });

  const onDrop = (toIndex: number) => {
    const from = dragFrom.current;
    dragFrom.current = null;
    if (from === null || from === toIndex) return;
    setPages((ps) => {
      const copy = [...ps];
      const [item] = copy.splice(from, 1);
      copy.splice(toIndex, 0, item);
      return copy;
    });
  };

  const save = async () => {
    if (!srcBytes.current || pages.length === 0) return;
    setProcessing(true);
    setError("");
    try {
      const { PDFDocument, degrees } = await import("pdf-lib");
      const src = await PDFDocument.load(srcBytes.current.slice(0), {
        ignoreEncryption: true,
      });
      const out = await PDFDocument.create();
      const copied = await out.copyPages(
        src,
        pages.map((p) => p.srcIndex)
      );
      copied.forEach((page, i) => {
        if (pages[i].rot) {
          const cur = page.getRotation().angle;
          page.setRotation(degrees((cur + pages[i].rot) % 360));
        }
        out.addPage(page);
      });
      const bytes = await out.save();
      setResult({
        name: `${baseName}-organized.pdf`,
        blob: bytesToBlob(bytes, "application/pdf"),
      });
    } catch (e) {
      setError(
        e instanceof Error ? `Could not save: ${e.message}` : "Something went wrong."
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      {!file ? (
        <DropZone
          acceptedTypes={[".pdf", "application/pdf"]}
          acceptedLabel="a PDF file"
          maxSizeMB={100}
          onFilesAccepted={onFile}
        />
      ) : loading ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden="true" />
          <p className="text-sm text-text-primary">
            Loading pages… {loaded}/{total || "?"}
          </p>
        </div>
      ) : result ? (
        <div className="rounded-xl border border-secondary/30 bg-secondary/5 p-6 text-center">
          <SuccessHeader>Your PDF is ready</SuccessHeader>
          <p className="mt-2 text-sm text-text-muted">
            {pages.length} page{pages.length === 1 ? "" : "s"} · {formatBytes(result.blob.size)}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="success"
              icon={Download}
              onClick={() => downloadBlob(result.blob, result.name)}
            >
              Download PDF
            </Button>
            <Button variant="outline" onClick={() => setResult(null)}>
              Keep editing
            </Button>
            <Button variant="ghost" icon={RotateCcw} onClick={reset}>
              New file
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-text-muted">
              <span className="font-medium text-text-primary">{pages.length}</span>{" "}
              page{pages.length === 1 ? "" : "s"} · drag to reorder, or use the
              arrows
            </p>
            <button
              onClick={reset}
              className="text-xs text-text-muted transition-colors hover:text-primary"
            >
              Choose a different file
            </button>
          </div>

          <ErrorMessage message={error} />

          {pages.length === 0 ? (
            <p className="py-8 text-center text-sm text-text-muted">
              All pages removed. <button onClick={reset} className="text-primary underline">Start over</button>.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {pages.map((p, i) => (
                <div
                  key={p.id}
                  draggable
                  onDragStart={() => (dragFrom.current = i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onDrop(i)}
                  className={cn(
                    "group relative flex flex-col overflow-hidden rounded-lg border border-border bg-background",
                    "cursor-grab active:cursor-grabbing"
                  )}
                >
                  <div className="flex aspect-[3/4] items-center justify-center overflow-hidden bg-white p-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.thumb}
                      alt={`Page ${i + 1}`}
                      draggable={false}
                      className="max-h-full max-w-full object-contain shadow-sm transition-transform"
                      style={{ transform: `rotate(${p.rot}deg)` }}
                    />
                  </div>
                  <div className="flex items-center justify-between border-t border-border px-2 py-1.5">
                    <span className="text-xs font-medium text-text-muted">
                      {i + 1}
                    </span>
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => moveBy(i, -1)}
                        disabled={i === 0}
                        aria-label={`Move page ${i + 1} left`}
                        className="rounded p-1 text-text-muted hover:bg-surface hover:text-text-primary disabled:opacity-30"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => moveBy(i, 1)}
                        disabled={i === pages.length - 1}
                        aria-label={`Move page ${i + 1} right`}
                        className="rounded p-1 text-text-muted hover:bg-surface hover:text-text-primary disabled:opacity-30"
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => rotate(p.id)}
                        aria-label={`Rotate page ${i + 1}`}
                        className="rounded p-1 text-text-muted hover:bg-surface hover:text-primary"
                      >
                        <RotateCw className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => remove(p.id)}
                        aria-label={`Delete page ${i + 1}`}
                        className="rounded p-1 text-text-muted hover:bg-surface hover:text-[#c0563a]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              icon={Save}
              loading={processing}
              onClick={save}
              disabled={pages.length === 0}
            >
              {processing ? "Saving..." : "Save PDF"}
            </Button>
            <Button variant="ghost" icon={RotateCcw} onClick={reset}>
              Start over
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
