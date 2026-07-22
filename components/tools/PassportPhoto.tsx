"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Download, RefreshCw, Grid2x2 } from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { Button, SegmentedControl, ErrorMessage } from "@/components/ui";
import { downloadBlob } from "@/lib/utils";
import { loadImage } from "@/lib/image";
import { canvasToBlob } from "@/lib/pdfjs";

const DPI = 300;
const mmToPx = (mm: number) => Math.round((mm / 25.4) * DPI);

type Preset = { id: string; label: string; w: number; h: number };
const PRESETS: Preset[] = [
  { id: "in", label: "India / Schengen (35×45mm)", w: 35, h: 45 },
  { id: "us", label: "US visa & passport (2×2in)", w: 51, h: 51 },
  { id: "uk", label: "UK / EU (35×45mm)", w: 35, h: 45 },
  { id: "ca", label: "Canada (50×70mm)", w: 50, h: 70 },
  { id: "cn", label: "China visa (33×48mm)", w: 33, h: 48 },
];

type Bg = "white" | "lightblue" | "custom";
const BG_HEX: Record<Bg, string> = {
  white: "#ffffff",
  lightblue: "#dbe7f2",
  custom: "#ffffff",
};

type Sheet = "4x6" | "a4";
const SHEETS: Record<Sheet, { w: number; h: number; label: string }> = {
  "4x6": { w: mmToPx(101.6), h: mmToPx(152.4), label: '4×6"' },
  a4: { w: mmToPx(210), h: mmToPx(297), label: "A4" },
};

export default function PassportPhoto() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [presetId, setPresetId] = useState("in");
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [bg, setBg] = useState<Bg>("white");
  const [customColor, setCustomColor] = useState("#ffffff");
  const [sheet, setSheet] = useState<Sheet>("4x6");
  const [error, setError] = useState("");
  const previewRef = useRef<HTMLCanvasElement>(null);

  const preset = useMemo(
    () => PRESETS.find((p) => p.id === presetId)!,
    [presetId]
  );
  const bgColor = bg === "custom" ? customColor : BG_HEX[bg];

  const onFile = async (files: File[]) => {
    setError("");
    setZoom(1);
    setPanX(0);
    setPanY(0);
    try {
      setImg(await loadImage(files[0]));
    } catch {
      setError("Could not load this image.");
    }
  };

  const renderPhoto = (): HTMLCanvasElement | null => {
    if (!img) return null;
    const wPx = mmToPx(preset.w);
    const hPx = mmToPx(preset.h);
    const canvas = document.createElement("canvas");
    canvas.width = wPx;
    canvas.height = hPx;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, wPx, hPx);
    const cover = Math.max(wPx / img.naturalWidth, hPx / img.naturalHeight);
    const scale = cover * zoom;
    const drawW = img.naturalWidth * scale;
    const drawH = img.naturalHeight * scale;
    // pan sliders (-100..100) move within the overflow area.
    const maxPanX = Math.max(0, (drawW - wPx) / 2);
    const maxPanY = Math.max(0, (drawH - hPx) / 2);
    const dx = (wPx - drawW) / 2 + (panX / 100) * maxPanX;
    const dy = (hPx - drawH) / 2 + (panY / 100) * maxPanY;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, dx, dy, drawW, drawH);
    return canvas;
  };

  useEffect(() => {
    const c = renderPhoto();
    if (c && previewRef.current) {
      previewRef.current.width = c.width;
      previewRef.current.height = c.height;
      previewRef.current.getContext("2d")!.drawImage(c, 0, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [img, presetId, zoom, panX, panY, bg, customColor]);

  const downloadSingle = async () => {
    const c = renderPhoto();
    if (!c) return;
    const blob = await canvasToBlob(c, "image/png");
    downloadBlob(blob, `passport-${preset.w}x${preset.h}mm.png`);
  };

  const downloadSheet = async () => {
    const photo = renderPhoto();
    if (!photo) return;
    const s = SHEETS[sheet];
    const margin = mmToPx(5);
    const gap = mmToPx(3);
    const canvas = document.createElement("canvas");
    canvas.width = s.w;
    canvas.height = s.h;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, s.w, s.h);
    const cols = Math.max(1, Math.floor((s.w - 2 * margin + gap) / (photo.width + gap)));
    const rows = Math.max(1, Math.floor((s.h - 2 * margin + gap) / (photo.height + gap)));
    ctx.strokeStyle = "#cccccc";
    ctx.lineWidth = 1;
    for (let r = 0; r < rows; r++) {
      for (let col = 0; col < cols; col++) {
        const x = margin + col * (photo.width + gap);
        const y = margin + r * (photo.height + gap);
        ctx.drawImage(photo, x, y);
        ctx.strokeRect(x + 0.5, y + 0.5, photo.width, photo.height);
      }
    }
    const blob = await canvasToBlob(canvas, "image/png");
    downloadBlob(blob, `passport-sheet-${sheet}.png`);
  };

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      {!img ? (
        <DropZone
          acceptedTypes={["image/jpeg", "image/png", "image/webp"]}
          acceptedLabel="JPG, PNG, WebP — a clear front-facing photo"
          maxSizeMB={30}
          onFilesAccepted={onFile}
        />
      ) : (
        <>
          <div className="flex flex-col gap-5 sm:flex-row">
            <div className="flex justify-center">
              <div className="rounded-xl border border-border bg-background p-3">
                <canvas
                  ref={previewRef}
                  className="max-h-[46vh] w-auto rounded"
                  style={{ maxWidth: 240 }}
                />
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <label className="block text-sm">
                <span className="mb-1 block text-text-muted">Photo size</span>
                <select
                  value={presetId}
                  onChange={(e) => setPresetId(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
                >
                  {PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </label>

              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-text-muted">Zoom</span>
                  <span className="font-mono text-text-primary">
                    {zoom.toFixed(1)}×
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.05}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-primary"
                  aria-label="Zoom"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="mb-1 block text-sm text-text-muted">
                    Move horizontally
                  </span>
                  <input
                    type="range"
                    min={-100}
                    max={100}
                    value={panX}
                    onChange={(e) => setPanX(Number(e.target.value))}
                    className="w-full accent-primary"
                    aria-label="Move horizontally"
                  />
                </div>
                <div>
                  <span className="mb-1 block text-sm text-text-muted">
                    Move vertically
                  </span>
                  <input
                    type="range"
                    min={-100}
                    max={100}
                    value={panY}
                    onChange={(e) => setPanY(Number(e.target.value))}
                    className="w-full accent-primary"
                    aria-label="Move vertically"
                  />
                </div>
              </div>

              <div>
                <span className="mb-1.5 block text-sm text-text-muted">
                  Background
                </span>
                <div className="flex items-center gap-2">
                  <SegmentedControl<Bg>
                    value={bg}
                    onChange={setBg}
                    options={[
                      { value: "white", label: "White" },
                      { value: "lightblue", label: "Light blue" },
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
                <p className="mt-1.5 text-xs text-text-muted">
                  Background fills only the area your photo doesn&apos;t cover —
                  to swap a busy backdrop first, use the Background Remover.
                </p>
              </div>
            </div>
          </div>

          <ErrorMessage message={error} />

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button size="lg" variant="success" icon={Download} onClick={downloadSingle}>
              Download photo
            </Button>
            <div className="flex items-center gap-2">
              <SegmentedControl<Sheet>
                value={sheet}
                onChange={setSheet}
                options={[
                  { value: "4x6", label: SHEETS["4x6"].label },
                  { value: "a4", label: SHEETS.a4.label },
                ]}
              />
              <Button variant="outline" icon={Grid2x2} onClick={downloadSheet}>
                Print sheet
              </Button>
            </div>
            <Button variant="ghost" icon={RefreshCw} onClick={() => setImg(null)}>
              Start over
            </Button>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-text-muted">
            Output is {preset.w}×{preset.h}mm at {DPI} DPI. The print sheet tiles
            multiple copies with cut lines so you can print at home or a shop.
          </p>
        </>
      )}
    </div>
  );
}
