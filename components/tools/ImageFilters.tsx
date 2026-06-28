"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Download, RefreshCw, RotateCcw } from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { Button, ErrorMessage } from "@/components/ui";
import { downloadBlob } from "@/lib/utils";
import { loadImage, formatFromMime, EXT } from "@/lib/image";
import { canvasToBlob } from "@/lib/pdfjs";

const PRESETS: { name: string; filter: string }[] = [
  { name: "Original", filter: "" },
  { name: "Grayscale", filter: "grayscale(1)" },
  { name: "Sepia", filter: "sepia(0.75)" },
  { name: "Vintage", filter: "sepia(0.4) contrast(1.1) saturate(1.3)" },
  { name: "Cool", filter: "hue-rotate(-20deg) saturate(1.2)" },
  { name: "Warm", filter: "sepia(0.25) saturate(1.4) brightness(1.05)" },
  { name: "Fade", filter: "contrast(0.85) brightness(1.1) saturate(0.8)" },
  { name: "Vivid", filter: "saturate(1.6) contrast(1.15)" },
  { name: "Matte", filter: "contrast(0.9) brightness(1.05) saturate(0.9)" },
  { name: "High Contrast", filter: "contrast(1.5)" },
  { name: "Soft", filter: "brightness(1.1) contrast(0.95) blur(0.4px)" },
  { name: "Dark", filter: "brightness(0.75) contrast(1.2)" },
  { name: "Bright", filter: "brightness(1.25) saturate(1.1)" },
  { name: "Dramatic", filter: "contrast(1.4) saturate(1.3) brightness(0.95)" },
];

export default function ImageFilters() {
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [origUrl, setOrigUrl] = useState<string | null>(null);
  const [preset, setPreset] = useState("");
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [blur, setBlur] = useState(0);
  const [hue, setHue] = useState(0);
  const [error, setError] = useState("");
  const previewRef = useRef<HTMLCanvasElement>(null);

  const filter = useMemo(() => {
    const parts = [preset];
    parts.push(`brightness(${1 + brightness / 100})`);
    parts.push(`contrast(${1 + contrast / 100})`);
    parts.push(`saturate(${1 + saturation / 100})`);
    if (blur > 0) parts.push(`blur(${blur}px)`);
    if (hue > 0) parts.push(`hue-rotate(${hue}deg)`);
    return parts.filter(Boolean).join(" ");
  }, [preset, brightness, contrast, saturation, blur, hue]);

  const onFile = async (files: File[]) => {
    setError("");
    setFile(files[0]);
    if (origUrl) URL.revokeObjectURL(origUrl);
    setOrigUrl(URL.createObjectURL(files[0]));
    try {
      setImg(await loadImage(files[0]));
    } catch {
      setError("Could not load this image.");
    }
  };

  const resetAdjust = () => {
    setPreset("");
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setBlur(0);
    setHue(0);
  };

  const render = (canvas: HTMLCanvasElement, source: HTMLImageElement) => {
    canvas.width = source.naturalWidth;
    canvas.height = source.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.filter = filter || "none";
    ctx.drawImage(source, 0, 0);
    ctx.filter = "none";
  };

  useEffect(() => {
    if (img && previewRef.current) render(previewRef.current, img);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [img, filter]);

  const download = async () => {
    if (!img || !file) return;
    const canvas = document.createElement("canvas");
    render(canvas, img);
    const format = formatFromMime(file.type);
    const blob = await canvasToBlob(canvas, format, 0.95);
    downloadBlob(
      blob,
      `${file.name.replace(/\.[^.]+$/, "")}-filtered.${EXT[format]}`
    );
  };

  const slider = (
    label: string,
    value: number,
    set: (n: number) => void,
    min: number,
    max: number
  ) => (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-text-muted">{label}</span>
        <span className="font-mono text-xs text-text-primary">{value}</span>
      </div>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        className="w-full accent-primary"
      />
    </div>
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
          {origUrl ? (
            <div>
              <BeforeAfterSlider
                before={origUrl}
                afterNode={
                  <canvas
                    ref={previewRef}
                    className="block max-h-[45vh] w-full object-contain"
                  />
                }
                beforeLabel="Original"
                afterLabel="Filtered"
              />
              <p className="mt-2 text-center text-xs text-text-muted">
                Drag the slider to compare — original vs your edits.
              </p>
            </div>
          ) : (
            <div className="flex justify-center rounded-xl border border-border bg-background p-4">
              <canvas
                ref={previewRef}
                className="max-h-[45vh] w-auto max-w-full rounded-lg"
              />
            </div>
          )}

          <div className="mt-4">
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-text-muted">
              Presets
            </p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  aria-pressed={preset === p.filter}
                  onClick={() => setPreset(p.filter)}
                  className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                    preset === p.filter
                      ? "border-primary bg-primary/10 text-text-primary"
                      : "border-border text-text-muted hover:text-text-primary"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-4 rounded-xl border border-border bg-background p-4 sm:grid-cols-2">
            {slider("Brightness", brightness, setBrightness, -100, 100)}
            {slider("Contrast", contrast, setContrast, -100, 100)}
            {slider("Saturation", saturation, setSaturation, -100, 100)}
            {slider("Hue", hue, setHue, 0, 360)}
            {slider("Blur", blur, setBlur, 0, 20)}
          </div>

          <ErrorMessage message={error} />

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button size="lg" variant="success" icon={Download} onClick={download}>
              Download
            </Button>
            <Button variant="outline" icon={RotateCcw} onClick={resetAdjust}>
              Reset filters
            </Button>
            <Button
              variant="ghost"
              icon={RefreshCw}
              onClick={() => {
                if (origUrl) URL.revokeObjectURL(origUrl);
                setOrigUrl(null);
                setFile(null);
                setImg(null);
                resetAdjust();
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
