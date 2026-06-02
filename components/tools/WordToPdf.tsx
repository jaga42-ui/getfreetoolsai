"use client";

import { useState } from "react";
import { Download, Trash2, RefreshCw, FileType, Package } from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { Button } from "@/components/ui";
import { formatBytes, downloadBlob } from "@/lib/utils";
import { zipFiles } from "@/lib/zip";

type Item = {
  id: string;
  file: File;
  status: "pending" | "done" | "error";
  blob?: Blob;
  outName?: string;
  error?: string;
};

export default function WordToPdf() {
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);

  const add = (files: File[]) =>
    setItems((p) => [
      ...p,
      ...files.map((file) => ({
        id: `${file.name}-${Math.random().toString(36).slice(2)}`,
        file,
        status: "pending" as const,
      })),
    ]);
  const remove = (id: string) =>
    setItems((p) => p.filter((i) => i.id !== id));
  const reset = () => setItems([]);

  const convertOne = async (file: File): Promise<Blob> => {
    const mammoth = await import("mammoth");
    const arrayBuffer = await file.arrayBuffer();
    const { value: html } = await mammoth.convertToHtml({ arrayBuffer });

    const container = document.createElement("div");
    container.style.cssText =
      "position:fixed;left:-99999px;top:0;width:760px;padding:48px;background:#ffffff;color:#111111;font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.6;";
    container.innerHTML =
      html ||
      "<p>(This document appears to be empty or in an unsupported format.)</p>";
    document.body.appendChild(container);

    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(container, {
        scale: 2,
        backgroundColor: "#ffffff",
        windowWidth: 760,
      });
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgW = pageW;
      const imgH = (canvas.height / canvas.width) * imgW;
      const imgData = canvas.toDataURL("image/jpeg", 0.92);

      let heightLeft = imgH;
      let position = 0;
      pdf.addImage(imgData, "JPEG", 0, position, imgW, imgH);
      heightLeft -= pageH;
      while (heightLeft > 0) {
        position = heightLeft - imgH;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgW, imgH);
        heightLeft -= pageH;
      }
      return pdf.output("blob");
    } finally {
      document.body.removeChild(container);
    }
  };

  const convertAll = async () => {
    setBusy(true);
    const pending = items.filter((i) => i.status !== "done");
    for (const item of pending) {
      try {
        const blob = await convertOne(item.file);
        const outName = `${item.file.name.replace(/\.(docx?|DOCX?)$/, "")}-converted.pdf`;
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? { ...i, status: "done", blob, outName, error: undefined }
              : i
          )
        );
      } catch {
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  status: "error",
                  error:
                    "Could not convert this file. Make sure it's a valid .docx (legacy .doc isn't supported).",
                }
              : i
          )
        );
      }
    }
    setBusy(false);
  };

  const downloadZip = async () => {
    const done = items.filter((i) => i.blob && i.outName);
    downloadBlob(
      await zipFiles(done.map((i) => ({ name: i.outName!, blob: i.blob! }))),
      `word-to-pdf-${Date.now()}.zip`
    );
  };

  const doneCount = items.filter((i) => i.status === "done").length;

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      {items.length === 0 ? (
        <DropZone
          acceptedTypes={[
            ".docx",
            ".doc",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ]}
          acceptedLabel="DOCX (Word) files"
          multiple
          maxSizeMB={50}
          onFilesAccepted={add}
        />
      ) : (
        <>
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-xl border border-border bg-background p-3"
              >
                <FileType className="h-5 w-5 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text-primary">
                    {item.outName ?? item.file.name}
                  </p>
                  <p className="text-xs text-text-muted">
                    {formatBytes(item.file.size)}
                    {item.blob && (
                      <>
                        {" → "}
                        <span className="font-semibold text-secondary">
                          {formatBytes(item.blob.size)}
                        </span>
                      </>
                    )}
                  </p>
                  {item.status === "error" && (
                    <p className="text-xs text-red-400">{item.error}</p>
                  )}
                </div>
                {item.status === "done" && item.blob && (
                  <Button
                    variant="outline"
                    icon={Download}
                    onClick={() => downloadBlob(item.blob!, item.outName!)}
                  >
                    Download
                  </Button>
                )}
                <button
                  onClick={() => remove(item.id)}
                  className="rounded-lg p-2 text-text-muted hover:bg-surface hover:text-red-400"
                  aria-label="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <DropZone
              acceptedTypes={[
                ".docx",
                ".doc",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              ]}
              acceptedLabel="more Word files"
              multiple
              maxSizeMB={50}
              onFilesAccepted={add}
              compact
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button size="lg" icon={FileType} loading={busy} onClick={convertAll}>
              {busy
                ? "Converting..."
                : `Convert ${items.length} file${items.length > 1 ? "s" : ""}`}
            </Button>
            {doneCount > 1 && (
              <Button variant="success" icon={Package} onClick={downloadZip}>
                Download all as ZIP
              </Button>
            )}
            <Button variant="ghost" icon={RefreshCw} onClick={reset}>
              Start over
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
