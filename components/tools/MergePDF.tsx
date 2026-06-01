"use client";

import { useState } from "react";
import {
  Download,
  Trash2,
  ArrowUp,
  ArrowDown,
  Combine,
  RotateCcw,
  FileText,
  GripVertical,
} from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { Button, ErrorMessage } from "@/components/ui";
import { formatBytes, downloadBlob, bytesToBlob } from "@/lib/utils";

type Item = {
  id: string;
  file: File;
  size: number;
  pages: number | null;
};

export default function MergePDF() {
  const [items, setItems] = useState<Item[]>([]);
  const [merging, setMerging] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ blob: Blob; pages: number } | null>(
    null
  );
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const addFiles = async (files: File[]) => {
    setError("");
    setResult(null);
    const { PDFDocument } = await import("pdf-lib");
    const newItems: Item[] = [];
    for (const file of files) {
      let pages: number | null = null;
      try {
        const bytes = await file.arrayBuffer();
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        pages = doc.getPageCount();
      } catch {
        pages = null;
      }
      newItems.push({
        id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
        file,
        size: file.size,
        pages,
      });
    }
    setItems((prev) => [...prev, ...newItems]);
  };

  const move = (index: number, dir: -1 | 1) => {
    setItems((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const reorderTo = (from: number, to: number) => {
    setItems((prev) => {
      if (from === to) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const remove = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  const reset = () => {
    setItems([]);
    setResult(null);
    setError("");
  };

  const merge = async () => {
    if (items.length < 2) {
      setError("Add at least two PDF files to merge.");
      return;
    }
    setMerging(true);
    setError("");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const merged = await PDFDocument.create();
      for (const item of items) {
        const bytes = await item.file.arrayBuffer();
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const copied = await merged.copyPages(doc, doc.getPageIndices());
        copied.forEach((p) => merged.addPage(p));
      }
      const out = await merged.save();
      const blob = bytesToBlob(out, "application/pdf");
      setResult({ blob, pages: merged.getPageCount() });
    } catch (e) {
      setError(
        e instanceof Error
          ? `Could not merge: ${e.message}`
          : "Something went wrong. Please try again."
      );
    } finally {
      setMerging(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      {items.length === 0 ? (
        <DropZone
          acceptedTypes={[".pdf", "application/pdf"]}
          acceptedLabel="PDF files"
          multiple
          maxSizeMB={200}
          onFilesAccepted={addFiles}
        />
      ) : (
        <>
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-text-muted">
            {items.length} file{items.length > 1 ? "s" : ""} · drag or use arrows
            to set merge order
          </p>
          <div className="space-y-2">
            {items.map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragIndex !== null) reorderTo(dragIndex, index);
                  setDragIndex(null);
                }}
                className="flex items-center gap-3 rounded-xl border border-border bg-background p-3"
              >
                <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-text-muted" />
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 font-mono text-xs font-bold text-primary">
                  {index + 1}
                </span>
                <FileText className="h-5 w-5 shrink-0 text-text-muted" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text-primary">
                    {item.file.name}
                  </p>
                  <p className="text-xs text-text-muted">
                    {item.pages != null ? `${item.pages} pages · ` : ""}
                    {formatBytes(item.size)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="rounded-md p-1.5 text-text-muted hover:bg-surface hover:text-text-primary disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => move(index, 1)}
                    disabled={index === items.length - 1}
                    className="rounded-md p-1.5 text-text-muted hover:bg-surface hover:text-text-primary disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => remove(item.id)}
                    className="rounded-md p-1.5 text-text-muted hover:bg-surface hover:text-red-400"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <DropZone
              acceptedTypes={[".pdf", "application/pdf"]}
              acceptedLabel="more PDF files"
              multiple
              maxSizeMB={200}
              onFilesAccepted={addFiles}
              compact
            />
          </div>

          <ErrorMessage message={error} />

          {result ? (
            <div className="mt-5 rounded-xl border border-secondary/30 bg-secondary/5 p-5 text-center">
              <p className="text-lg font-semibold text-secondary">
                ✅ Merged successfully
              </p>
              <p className="mt-1 text-sm text-text-muted">
                {items.length} files combined · {result.pages} pages ·{" "}
                {formatBytes(result.blob.size)}
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <Button
                  size="lg"
                  variant="success"
                  icon={Download}
                  onClick={() =>
                    downloadBlob(result.blob, `merged-${Date.now()}.pdf`)
                  }
                >
                  Download merged PDF
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
                icon={Combine}
                loading={merging}
                onClick={merge}
              >
                {merging ? "Merging..." : "Merge all"}
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
