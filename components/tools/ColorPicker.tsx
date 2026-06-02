"use client";

import { useEffect, useRef, useState } from "react";
import { RefreshCw, Copy, Check } from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { Button, ErrorMessage } from "@/components/ui";
import { loadImage } from "@/lib/image";

type RGB = [number, number, number];

const toHex = ([r, g, b]: RGB) =>
  "#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("").toUpperCase();
const toRgb = ([r, g, b]: RGB) => `rgb(${r}, ${g}, ${b})`;
function toHsl([r, g, b]: RGB) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

export default function ColorPicker() {
  const [file, setFile] = useState<File | null>(null);
  const [picked, setPicked] = useState<RGB | null>(null);
  const [history, setHistory] = useState<RGB[]>([]);
  const [dominant, setDominant] = useState<RGB[]>([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onFile = async (files: File[]) => {
    setError("");
    setFile(files[0]);
    setPicked(null);
    setHistory([]);
    try {
      const img = await loadImage(files[0]);
      const canvas = canvasRef.current!;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
      ctx.drawImage(img, 0, 0);
      setDominant(extractDominant(ctx, img.naturalWidth, img.naturalHeight));
    } catch {
      setError("Could not load this image.");
    }
  };

  const extractDominant = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number
  ): RGB[] => {
    const sw = Math.min(80, w);
    const sh = Math.round((sw / w) * h);
    const tmp = document.createElement("canvas");
    tmp.width = sw;
    tmp.height = sh;
    const tctx = tmp.getContext("2d")!;
    tctx.drawImage(ctx.canvas, 0, 0, sw, sh);
    const data = tctx.getImageData(0, 0, sw, sh).data;
    const counts = new Map<string, { c: RGB; n: number }>();
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 128) continue;
      const r = Math.round(data[i] / 32) * 32;
      const g = Math.round(data[i + 1] / 32) * 32;
      const b = Math.round(data[i + 2] / 32) * 32;
      const key = `${r},${g},${b}`;
      const e = counts.get(key);
      if (e) e.n++;
      else counts.set(key, { c: [r, g, b], n: 1 });
    }
    return Array.from(counts.values())
      .sort((a, b) => b.n - a.n)
      .slice(0, 5)
      .map((e) => e.c);
  };

  const pickAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.floor(((clientY - rect.top) / rect.height) * canvas.height);
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    const d = ctx.getImageData(x, y, 1, 1).data;
    const c: RGB = [d[0], d[1], d[2]];
    setPicked(c);
    setHistory((h) => [c, ...h].slice(0, 10));
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    return () => setFile(null);
  }, []);

  const swatch = (label: string, value: string) => (
    <button
      onClick={() => copy(value)}
      className="flex w-full items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-left text-sm hover:border-primary/50"
    >
      <span>
        <span className="font-mono text-xs uppercase tracking-widest text-text-muted">
          {label}
        </span>
        <span className="block font-mono text-text-primary">{value}</span>
      </span>
      {copied === value ? (
        <Check className="h-4 w-4 text-secondary" />
      ) : (
        <Copy className="h-4 w-4 text-text-muted" />
      )}
    </button>
  );

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
          <div className="flex justify-center rounded-xl border border-border bg-background p-3">
            <canvas
              ref={canvasRef}
              onClick={(e) => pickAt(e.clientX, e.clientY)}
              className="max-h-[45vh] w-auto max-w-full cursor-crosshair rounded-lg"
            />
          </div>
          <p className="mt-2 text-center text-xs text-text-muted">
            Click anywhere on the image to pick a colour
          </p>

          <ErrorMessage message={error} />

          {picked && (
            <div className="mt-4 grid gap-3 sm:grid-cols-[auto_1fr]">
              <div
                className="h-24 w-full rounded-lg border border-border sm:w-24"
                style={{ background: toHex(picked) }}
              />
              <div className="grid gap-2">
                {swatch("HEX", toHex(picked))}
                {swatch("RGB", toRgb(picked))}
                {swatch("HSL", toHsl(picked))}
              </div>
            </div>
          )}

          {dominant.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 font-mono text-xs uppercase tracking-widest text-text-muted">
                Dominant colours
              </p>
              <div className="flex flex-wrap gap-2">
                {dominant.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => copy(toHex(c))}
                    title={toHex(c)}
                    className="flex items-center gap-2 rounded-lg border border-border bg-background px-2 py-1.5 text-xs"
                  >
                    <span
                      className="h-5 w-5 rounded border border-border"
                      style={{ background: toHex(c) }}
                    />
                    <span className="font-mono text-text-primary">{toHex(c)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {history.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 font-mono text-xs uppercase tracking-widest text-text-muted">
                Recent
              </p>
              <div className="flex flex-wrap gap-1.5">
                {history.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setPicked(c)}
                    title={toHex(c)}
                    className="h-7 w-7 rounded border border-border"
                    style={{ background: toHex(c) }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mt-5">
            <Button
              variant="ghost"
              icon={RefreshCw}
              onClick={() => {
                setFile(null);
                setPicked(null);
                setDominant([]);
                setHistory([]);
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
