"use client";

import { useEffect, useRef, useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { Button, ErrorMessage } from "@/components/ui";
import { downloadBlob } from "@/lib/utils";
import { loadImage } from "@/lib/image";
import { canvasToBlob } from "@/lib/pdfjs";

type Pos =
  | "center"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "tile";

const POSITIONS: { value: Pos; label: string }[] = [
  { value: "top-left", label: "Top left" },
  { value: "top-right", label: "Top right" },
  { value: "center", label: "Center" },
  { value: "bottom-left", label: "Bottom left" },
  { value: "bottom-right", label: "Bottom right" },
  { value: "tile", label: "Tile" },
];

export default function ImageWatermark() {
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [text, setText] = useState("© GetFreeToolsAI");
  const [size, setSize] = useState(6);
  const [opacity, setOpacity] = useState(45);
  const [color, setColor] = useState("#ffffff");
  const [pos, setPos] = useState<Pos>("bottom-right");
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

  const draw = (canvas: HTMLCanvasElement, source: HTMLImageElement) => {
    const w = source.naturalWidth;
    const h = source.naturalHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(source, 0, 0);
    if (!text.trim()) return;

    const fontPx = Math.max(10, (w * size) / 100);
    ctx.font = `600 ${fontPx}px Inter, system-ui, sans-serif`;
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity / 100;
    ctx.textBaseline = "middle";
    const pad = fontPx * 0.7;

    if (pos === "tile") {
      ctx.textAlign = "center";
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(-Math.PI / 6);
      const tw = ctx.measureText(text).width;
      const stepX = Math.max(tw + fontPx * 2, fontPx * 4);
      const stepY = fontPx * 4;
      for (let y = -h; y < h; y += stepY) {
        for (let x = -w; x < w; x += stepX) ctx.fillText(text, x, y);
      }
      ctx.restore();
    } else {
      const tw = ctx.measureText(text).width;
      ctx.textAlign = "left";
      let x = pad;
      let y = h - pad - fontPx / 2;
      if (pos === "center") { x = (w - tw) / 2; y = h / 2; }
      else if (pos === "top-left") { x = pad; y = pad + fontPx / 2; }
      else if (pos === "top-right") { x = w - tw - pad; y = pad + fontPx / 2; }
      else if (pos === "bottom-left") { x = pad; y = h - pad - fontPx / 2; }
      else { x = w - tw - pad; y = h - pad - fontPx / 2; }
      ctx.fillText(text, x, y);
    }
    ctx.globalAlpha = 1;
  };

  useEffect(() => {
    if (img && previewRef.current) draw(previewRef.current, img);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [img, text, size, opacity, color, pos]);

  const download = async () => {
    if (!img || !file) return;
    const canvas = document.createElement("canvas");
    draw(canvas, img);
    const blob = await canvasToBlob(canvas, "image/png", 0.95);
    downloadBlob(blob, `${file.name.replace(/\.[^.]+$/, "")}-watermarked.png`);
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
            <label className="text-sm text-text-muted">
              Watermark text
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="mt-1 block w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
                placeholder="© Your Name"
              />
            </label>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <div className="mb-1 flex justify-between text-sm"><span className="text-text-muted">Size</span><span className="font-mono text-text-primary">{size}%</span></div>
                <input type="range" min={2} max={20} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full accent-primary" />
              </div>
              <div>
                <div className="mb-1 flex justify-between text-sm"><span className="text-text-muted">Opacity</span><span className="font-mono text-text-primary">{opacity}%</span></div>
                <input type="range" min={5} max={100} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full accent-primary" />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <label className="inline-flex items-center gap-2 text-sm text-text-muted">
                Colour
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-9 w-12 cursor-pointer rounded border border-border bg-transparent" aria-label="Watermark colour" />
              </label>
              <div className="flex flex-wrap gap-1.5">
                {POSITIONS.map((p) => (
                  <button key={p.value} onClick={() => setPos(p.value)} className={`rounded-md border px-2.5 py-1.5 text-xs transition-colors ${pos === p.value ? "border-primary bg-primary/10 text-text-primary" : "border-border text-text-muted hover:text-text-primary"}`}>{p.label}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-center rounded-xl border border-border bg-background p-4">
            <canvas ref={previewRef} className="max-h-[50vh] w-auto max-w-full rounded" />
          </div>

          <ErrorMessage message={error} />

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button size="lg" variant="success" icon={Download} onClick={download}>Download PNG</Button>
            <Button variant="ghost" icon={RefreshCw} onClick={() => { setFile(null); setImg(null); }}>Start over</Button>
          </div>
        </>
      )}
    </div>
  );
}
