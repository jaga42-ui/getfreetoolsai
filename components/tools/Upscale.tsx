"use client";

import { useState } from "react";
import { Download, RefreshCw, Sparkles, Info } from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { Button, SegmentedControl, ErrorMessage } from "@/components/ui";
import { formatBytes, downloadBlob } from "@/lib/utils";
import { loadImage, formatFromMime, EXT } from "@/lib/image";
import { canvasToBlob } from "@/lib/pdfjs";

type Scale = 2 | 3 | 4;

export default function Upscale() {
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [scale, setScale] = useState<Scale>(2);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    blob: Blob;
    url: string;
    w: number;
    h: number;
  } | null>(null);

  const onFile = async (files: File[]) => {
    setError("");
    setResult(null);
    setFile(files[0]);
    try {
      setImg(await loadImage(files[0]));
    } catch {
      setError("Could not load this image.");
    }
  };

  const reset = () => {
    if (result) URL.revokeObjectURL(result.url);
    setFile(null);
    setImg(null);
    setResult(null);
    setError("");
  };

  const upscale = async () => {
    if (!img || !file) return;
    setBusy(true);
    setError("");
    try {
      // Progressive 2x steps with high-quality smoothing approximate Lanczos.
      let src: HTMLCanvasElement | HTMLImageElement = img;
      let curW = img.naturalWidth;
      let curH = img.naturalHeight;
      const targetW = img.naturalWidth * scale;
      const targetH = img.naturalHeight * scale;
      while (curW < targetW) {
        const nextW = Math.min(curW * 2, targetW);
        const nextH = Math.round((nextW / curW) * curH);
        const c = document.createElement("canvas");
        c.width = nextW;
        c.height = nextH;
        const ctx = c.getContext("2d")!;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(src, 0, 0, nextW, nextH);
        src = c;
        curW = nextW;
        curH = nextH;
      }
      const finalCanvas =
        src instanceof HTMLCanvasElement
          ? src
          : (() => {
              const c = document.createElement("canvas");
              c.width = targetW;
              c.height = targetH;
              c.getContext("2d")!.drawImage(src, 0, 0, targetW, targetH);
              return c;
            })();
      const format = formatFromMime(file.type);
      const blob = await canvasToBlob(finalCanvas, format, 0.95);
      setResult({
        blob,
        url: URL.createObjectURL(blob),
        w: finalCanvas.width,
        h: finalCanvas.height,
      });
    } catch {
      setError("Something went wrong. Try a smaller image or lower scale.");
    } finally {
      setBusy(false);
    }
  };

  const outName = file
    ? `${file.name.replace(/\.[^.]+$/, "")}-upscaled.${EXT[formatFromMime(file.type)]}`
    : "upscaled.png";

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      {!file ? (
        <DropZone
          acceptedTypes={["image/jpeg", "image/png", "image/webp"]}
          acceptedLabel="JPG, PNG, WebP"
          maxSizeMB={20}
          onFilesAccepted={onFile}
        />
      ) : (
        <>
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-text-muted">
              Scale factor
            </p>
            <SegmentedControl<string>
              value={String(scale)}
              onChange={(v) => setScale(Number(v) as Scale)}
              options={[
                { value: "2", label: "2×" },
                { value: "3", label: "3×" },
                { value: "4", label: "4×" },
              ]}
            />
            {img && (
              <p className="mt-3 text-sm text-text-muted">
                {img.naturalWidth} × {img.naturalHeight}px →{" "}
                <span className="font-semibold text-text-primary">
                  {img.naturalWidth * scale} × {img.naturalHeight * scale}px
                </span>
              </p>
            )}
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-xl border border-sky-500/30 bg-sky-500/5 p-4 text-sm text-text-primary">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
            <span>
              This uses high-quality mathematical upscaling. For AI-powered
              upscaling, results may vary on very low-resolution images.
            </span>
          </div>

          <ErrorMessage message={error} />

          {result ? (
            <div className="mt-5 rounded-xl border border-secondary/30 bg-secondary/5 p-5 text-center">
              <p className="text-lg font-semibold text-secondary">
                ✅ Upscaled to {result.w} × {result.h}px
              </p>
              <p className="mt-1 text-sm text-text-muted">
                {formatBytes(file.size)} → {formatBytes(result.blob.size)}
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.url}
                alt="Upscaled preview"
                className="mx-auto mt-4 max-h-72 rounded-lg border border-border"
              />
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <Button
                  size="lg"
                  variant="success"
                  icon={Download}
                  onClick={() => downloadBlob(result.blob, outName)}
                >
                  Download
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
                icon={Sparkles}
                loading={busy}
                onClick={upscale}
                disabled={!img}
              >
                {busy ? "Upscaling..." : `Upscale ${scale}×`}
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
