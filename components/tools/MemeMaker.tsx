"use client";

import { useEffect, useRef, useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { Button, ErrorMessage } from "@/components/ui";
import { downloadBlob } from "@/lib/utils";
import { loadImage } from "@/lib/image";
import { canvasToBlob } from "@/lib/pdfjs";

export default function MemeMaker() {
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [top, setTop] = useState("TOP TEXT");
  const [bottom, setBottom] = useState("BOTTOM TEXT");
  const [size, setSize] = useState(9);
  const [error, setError] = useState("");
  const previewRef = useRef<HTMLCanvasElement>(null);

  const onFile = async (files: File[]) => {
    setError("");
    setFile(files[0]);
    try {
      setImg(await loadImage(files[0]));
    } catch {
      setError("Could not load this image.");
    }
  };

  const drawText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, fontPx: number, maxWidth: number) => {
    if (!text.trim()) return;
    ctx.font = `bold ${fontPx}px Impact, "Arial Black", system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.lineJoin = "round";
    ctx.lineWidth = Math.max(2, fontPx / 12);
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#ffffff";
    const value = text.toUpperCase();
    ctx.strokeText(value, x, y, maxWidth);
    ctx.fillText(value, x, y, maxWidth);
  };

  const draw = (canvas: HTMLCanvasElement, source: HTMLImageElement) => {
    const w = source.naturalWidth;
    const h = source.naturalHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(source, 0, 0);
    const fontPx = Math.max(16, (w * size) / 100);
    const pad = fontPx * 0.5;
    const maxWidth = w * 0.94;
    ctx.textBaseline = "top";
    drawText(ctx, top, w / 2, pad, fontPx, maxWidth);
    ctx.textBaseline = "bottom";
    drawText(ctx, bottom, w / 2, h - pad, fontPx, maxWidth);
  };

  useEffect(() => {
    if (img && previewRef.current) draw(previewRef.current, img);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [img, top, bottom, size]);

  const download = async () => {
    if (!img || !file) return;
    const canvas = document.createElement("canvas");
    draw(canvas, img);
    const blob = await canvasToBlob(canvas, "image/png", 0.95);
    downloadBlob(blob, `${file.name.replace(/\.[^.]+$/, "")}-meme.png`);
  };

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      {!file ? (
        <DropZone
          acceptedTypes={["image/jpeg", "image/png", "image/webp"]}
          acceptedLabel="JPG, PNG, WebP"
          maxSizeMB={50}
          onFilesAccepted={onFile}
        />
      ) : (
        <>
          <div className="rounded-xl border border-border bg-background p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm text-text-muted">
                Top text
                <input value={top} onChange={(e) => setTop(e.target.value)} className="mt-1 block w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none" />
              </label>
              <label className="text-sm text-text-muted">
                Bottom text
                <input value={bottom} onChange={(e) => setBottom(e.target.value)} className="mt-1 block w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none" />
              </label>
            </div>
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-sm"><span className="text-text-muted">Text size</span><span className="font-mono text-text-primary">{size}%</span></div>
              <input type="range" min={4} max={18} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full accent-primary" />
            </div>
          </div>

          <div className="mt-4 flex justify-center rounded-xl border border-border bg-background p-4">
            <canvas ref={previewRef} className="max-h-[50vh] w-auto max-w-full rounded" />
          </div>

          <ErrorMessage message={error} />

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button size="lg" variant="success" icon={Download} onClick={download}>Download meme</Button>
            <Button variant="ghost" icon={RefreshCw} onClick={() => { setFile(null); setImg(null); }}>Start over</Button>
          </div>
        </>
      )}
    </div>
  );
}
