"use client";

import { useEffect, useRef, useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { Button, SegmentedControl, ErrorMessage } from "@/components/ui";
import { downloadBlob } from "@/lib/utils";
import { loadImage } from "@/lib/image";
import { canvasToBlob } from "@/lib/pdfjs";

type Bg = "transparent" | "white" | "custom";

export default function RoundedCorners() {
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [radius, setRadius] = useState(15);
  const [bg, setBg] = useState<Bg>("transparent");
  const [customColor, setCustomColor] = useState("#ffffff");
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
    if (bg !== "transparent") {
      ctx.fillStyle = bg === "white" ? "#ffffff" : customColor;
      ctx.fillRect(0, 0, w, h);
    }
    const r = (Math.min(w, h) * radius) / 100;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.arcTo(w, 0, w, h, r);
    ctx.arcTo(w, h, 0, h, r);
    ctx.arcTo(0, h, 0, 0, r);
    ctx.arcTo(0, 0, w, 0, r);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(source, 0, 0);
  };

  useEffect(() => {
    if (img && previewRef.current) draw(previewRef.current, img);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [img, radius, bg, customColor]);

  const download = async () => {
    if (!img || !file) return;
    const canvas = document.createElement("canvas");
    draw(canvas, img);
    // PNG to preserve transparency unless a solid background is chosen.
    const format = bg === "transparent" ? "image/png" : "image/jpeg";
    const blob = await canvasToBlob(canvas, format, 0.95);
    const ext = format === "image/png" ? "png" : "jpg";
    downloadBlob(blob, `${file.name.replace(/\.[^.]+$/, "")}-rounded.${ext}`);
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
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-text-muted">Corner radius</span>
              <span className="font-mono font-semibold text-text-primary">
                {radius}%
              </span>
            </div>
            <input
              type="range"
              aria-label="Corner radius"
              min={0}
              max={50}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {([
                ["Slight", 8],
                ["Medium", 18],
                ["Heavy", 35],
                ["Circle", 50],
              ] as const).map(([label, val]) => (
                <button
                  key={label}
                  onClick={() => setRadius(val)}
                  className="rounded-md border border-border px-3 py-1.5 text-sm text-text-muted hover:text-text-primary"
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="mb-2 mt-4 font-mono text-xs uppercase tracking-widest text-text-muted">
              Background
            </p>
            <div className="flex items-center gap-2">
              <SegmentedControl<Bg>
                value={bg}
                onChange={setBg}
                options={[
                  { value: "transparent", label: "Transparent" },
                  { value: "white", label: "White" },
                  { value: "custom", label: "Custom" },
                ]}
              />
              {bg === "custom" && (
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded border border-border bg-transparent"
                  aria-label="Background color"
                />
              )}
            </div>
          </div>

          <div className="mt-4 flex justify-center rounded-xl border border-border bg-[length:18px_18px] bg-[conic-gradient(#e7e1d3_90deg,transparent_90deg_180deg,#e7e1d3_180deg_270deg,transparent_270deg)] bg-white p-4">
            <canvas
              ref={previewRef}
              className="max-h-[50vh] w-auto max-w-full"
            />
          </div>

          <ErrorMessage message={error} />

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button size="lg" variant="success" icon={Download} onClick={download}>
              Download
            </Button>
            <Button
              variant="ghost"
              icon={RefreshCw}
              onClick={() => {
                setFile(null);
                setImg(null);
              }}
            >
              Start over
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
