"use client";

import { useEffect, useRef, useState } from "react";
import {
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Download,
  RefreshCw,
} from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { Button, ErrorMessage } from "@/components/ui";
import { formatBytes, downloadBlob } from "@/lib/utils";
import { loadImage, formatFromMime, EXT } from "@/lib/image";
import { canvasToBlob } from "@/lib/pdfjs";

export default function FlipRotate() {
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [angle, setAngle] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [error, setError] = useState("");
  const previewRef = useRef<HTMLCanvasElement>(null);

  const onFile = async (files: File[]) => {
    setError("");
    setFile(files[0]);
    setAngle(0);
    setFlipH(false);
    setFlipV(false);
    try {
      setImg(await loadImage(files[0]));
    } catch {
      setError("Could not load this image.");
    }
  };

  const reset = () => {
    setFile(null);
    setImg(null);
    setError("");
  };

  const render = (target: HTMLCanvasElement, source: HTMLImageElement) => {
    const rad = (angle * Math.PI) / 180;
    const sin = Math.abs(Math.sin(rad));
    const cos = Math.abs(Math.cos(rad));
    const w = source.naturalWidth;
    const h = source.naturalHeight;
    const cw = Math.round(w * cos + h * sin);
    const ch = Math.round(w * sin + h * cos);
    target.width = cw;
    target.height = ch;
    const ctx = target.getContext("2d")!;
    const isJpg = formatFromMime(file?.type || "") === "image/jpeg";
    if (isJpg) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, cw, ch);
    }
    ctx.translate(cw / 2, ch / 2);
    ctx.rotate(rad);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(source, -w / 2, -h / 2);
  };

  useEffect(() => {
    if (img && previewRef.current) render(previewRef.current, img);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [img, angle, flipH, flipV]);

  const download = async () => {
    if (!img || !file) return;
    const canvas = document.createElement("canvas");
    render(canvas, img);
    const format = formatFromMime(file.type);
    const blob = await canvasToBlob(canvas, format, 0.95);
    downloadBlob(
      blob,
      `${file.name.replace(/\.[^.]+$/, "")}-rotated.${EXT[format]}`
    );
  };

  const rot = (d: number) => setAngle((a) => ((a + d) % 360 + 360) % 360);

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      {!file ? (
        <DropZone
          acceptedTypes={["image/jpeg", "image/png", "image/webp", "image/gif"]}
          acceptedLabel="JPG, PNG, WebP, GIF"
          maxSizeMB={50}
          onFilesAccepted={onFile}
        />
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" icon={RotateCw} onClick={() => rot(90)}>
              Rotate right
            </Button>
            <Button variant="outline" icon={RotateCcw} onClick={() => rot(-90)}>
              Rotate left
            </Button>
            <Button variant="outline" onClick={() => rot(180)}>
              180°
            </Button>
            <Button
              variant="outline"
              icon={FlipHorizontal}
              onClick={() => setFlipH((v) => !v)}
            >
              Flip H
            </Button>
            <Button
              variant="outline"
              icon={FlipVertical}
              onClick={() => setFlipV((v) => !v)}
            >
              Flip V
            </Button>
          </div>

          <div className="mt-4 rounded-xl border border-border bg-background p-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-text-muted">Custom angle</span>
              <span className="font-mono font-semibold text-text-primary">
                {angle}°
              </span>
            </div>
            <input
              type="range"
              aria-label="Custom angle"
              min={-180}
              max={180}
              value={angle > 180 ? angle - 360 : angle}
              onChange={(e) => setAngle(((Number(e.target.value) % 360) + 360) % 360)}
              className="w-full accent-primary"
            />
          </div>

          <div className="mt-4 flex justify-center rounded-xl border border-border bg-background p-4">
            <canvas
              ref={previewRef}
              className="max-h-[50vh] w-auto max-w-full rounded-lg"
            />
          </div>

          <ErrorMessage message={error} />

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button size="lg" icon={Download} variant="success" onClick={download}>
              Download
            </Button>
            <Button variant="ghost" icon={RefreshCw} onClick={reset}>
              Start over
            </Button>
          </div>
          <p className="mt-3 text-xs text-text-muted">{formatBytes(file.size)} · original</p>
        </>
      )}
    </div>
  );
}
