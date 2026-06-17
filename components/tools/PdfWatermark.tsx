"use client";

import { useState } from "react";
import { Download, RefreshCw, FileText, Stamp } from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { Button, SegmentedControl, ErrorMessage, SuccessHeader } from "@/components/ui";
import { formatBytes, downloadBlob, bytesToBlob } from "@/lib/utils";

type Type = "text" | "image";
type Pos = "center" | "tile" | "top-right" | "bottom-left";

function hexToRgb(hex: string): [number, number, number] {
  const m = hex.replace("#", "");
  return [
    parseInt(m.slice(0, 2), 16) / 255,
    parseInt(m.slice(2, 4), 16) / 255,
    parseInt(m.slice(4, 6), 16) / 255,
  ];
}

export default function PdfWatermark() {
  const [file, setFile] = useState<File | null>(null);
  const [wmType, setWmType] = useState<Type>("text");
  const [text, setText] = useState("CONFIDENTIAL");
  const [fontSize, setFontSize] = useState(48);
  const [color, setColor] = useState("#ff0000");
  const [opacity, setOpacity] = useState(30);
  const [rotation, setRotation] = useState(45);
  const [position, setPosition] = useState<Pos>("center");
  const [wmImage, setWmImage] = useState<File | null>(null);
  const [imgScale, setImgScale] = useState(40);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Blob | null>(null);

  const onFile = (files: File[]) => {
    setFile(files[0]);
    setError("");
    setResult(null);
  };
  const reset = () => {
    setFile(null);
    setResult(null);
    setError("");
    setWmImage(null);
  };

  const run = async () => {
    if (!file) return;
    if (wmType === "image" && !wmImage) {
      setError("Please upload a watermark image.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const { PDFDocument, StandardFonts, degrees, rgb } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer(), {
        ignoreEncryption: true,
      });
      const pages = doc.getPages();
      const font =
        wmType === "text"
          ? await doc.embedFont(StandardFonts.HelveticaBold)
          : null;
      let embedded: Awaited<ReturnType<typeof doc.embedPng>> | null = null;
      if (wmType === "image" && wmImage) {
        const bytes = await wmImage.arrayBuffer();
        embedded =
          wmImage.type === "image/png"
            ? await doc.embedPng(bytes)
            : await doc.embedJpg(bytes);
      }
      const [cr, cg, cb] = hexToRgb(color);

      for (const page of pages) {
        const { width, height } = page.getSize();
        if (wmType === "text" && font) {
          const tw = font.widthOfTextAtSize(text, fontSize);
          const drawAt = (x: number, y: number) =>
            page.drawText(text, {
              x,
              y,
              size: fontSize,
              font,
              color: rgb(cr, cg, cb),
              opacity: opacity / 100,
              rotate: degrees(rotation),
            });
          if (position === "tile") {
            const stepX = tw + 120;
            const stepY = fontSize + 120;
            for (let y = 0; y < height + stepY; y += stepY)
              for (let x = -tw; x < width; x += stepX) drawAt(x, y);
          } else if (position === "top-right") {
            drawAt(width - tw - 40, height - fontSize - 40);
          } else if (position === "bottom-left") {
            drawAt(40, 40);
          } else {
            drawAt((width - tw) / 2, height / 2);
          }
        } else if (embedded) {
          const w = (width * imgScale) / 100;
          const h = (w / embedded.width) * embedded.height;
          const place = (x: number, y: number) =>
            page.drawImage(embedded!, { x, y, width: w, height: h, opacity: opacity / 100 });
          if (position === "top-right") place(width - w - 30, height - h - 30);
          else if (position === "bottom-left") place(30, 30);
          else place((width - w) / 2, (height - h) / 2);
        }
      }
      const bytes = await doc.save();
      setResult(bytesToBlob(bytes, "application/pdf"));
    } catch (e) {
      setError(
        e instanceof Error
          ? `Could not add watermark: ${e.message}`
          : "Something went wrong. Please try again."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      {!file ? (
        <DropZone
          acceptedTypes={[".pdf", "application/pdf"]}
          acceptedLabel="a PDF file"
          maxSizeMB={200}
          onFilesAccepted={onFile}
        />
      ) : (
        <>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
            <FileText className="h-5 w-5 shrink-0 text-text-muted" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text-primary">
                {file.name}
              </p>
              <p className="text-xs text-text-muted">{formatBytes(file.size)}</p>
            </div>
          </div>

          {!result && (
            <div className="mt-4 space-y-4 rounded-xl border border-border bg-background p-4">
              <SegmentedControl<Type>
                value={wmType}
                onChange={setWmType}
                options={[
                  { value: "text", label: "Text watermark" },
                  { value: "image", label: "Image watermark" },
                ]}
              />

              {wmType === "text" ? (
                <>
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Watermark text"
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
                  />
                  <div className="flex flex-wrap items-end gap-4">
                    <label className="text-sm">
                      <span className="mb-1 block text-text-muted">Font size</span>
                      <input
                        type="number"
                        min={10}
                        max={120}
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value) || 48)}
                        className="w-24 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
                      />
                    </label>
                    <label className="text-sm">
                      <span className="mb-1 block text-text-muted">Colour</span>
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="h-10 w-12 cursor-pointer rounded border border-border bg-transparent"
                      />
                    </label>
                  </div>
                </>
              ) : (
                <div>
                  <DropZone
                    acceptedTypes={["image/png", "image/jpeg"]}
                    acceptedLabel="a PNG or JPG logo"
                    maxSizeMB={10}
                    onFilesAccepted={(f) => setWmImage(f[0])}
                    compact
                  />
                  {wmImage && (
                    <p className="mt-2 text-xs text-text-muted">
                      Watermark: {wmImage.name}
                    </p>
                  )}
                  <div className="mt-3">
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-text-muted">Size</span>
                      <span className="font-mono text-xs text-text-primary">
                        {imgScale}%
                      </span>
                    </div>
                    <input
                      type="range"
                      aria-label="Watermark size"
                      min={10}
                      max={80}
                      value={imgScale}
                      onChange={(e) => setImgScale(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>
              )}

              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-text-muted">Opacity</span>
                  <span className="font-mono text-xs text-text-primary">
                    {opacity}%
                  </span>
                </div>
                <input
                  type="range"
                  aria-label="Opacity"
                  min={5}
                  max={100}
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              {wmType === "text" && (
                <div>
                  <p className="mb-2 font-mono text-xs uppercase tracking-widest text-text-muted">
                    Rotation
                  </p>
                  <SegmentedControl<string>
                    value={String(rotation)}
                    onChange={(v) => setRotation(Number(v))}
                    options={[
                      { value: "0", label: "0°" },
                      { value: "45", label: "45°" },
                      { value: "-45", label: "-45°" },
                      { value: "90", label: "90°" },
                    ]}
                  />
                </div>
              )}

              <div>
                <p className="mb-2 font-mono text-xs uppercase tracking-widest text-text-muted">
                  Position
                </p>
                <SegmentedControl<Pos>
                  value={position}
                  onChange={setPosition}
                  options={[
                    { value: "center", label: "Center" },
                    ...(wmType === "text"
                      ? [{ value: "tile" as Pos, label: "Tile" }]
                      : []),
                    { value: "top-right", label: "Top-right" },
                    { value: "bottom-left", label: "Bottom-left" },
                  ]}
                />
              </div>
            </div>
          )}

          <ErrorMessage message={error} />

          {result ? (
            <div className="mt-5 rounded-xl border border-secondary/30 bg-secondary/5 p-5 text-center">
              <SuccessHeader>Watermark added</SuccessHeader>
              <p className="mt-1 text-sm text-text-muted">
                {formatBytes(result.size)}
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <Button
                  size="lg"
                  variant="success"
                  icon={Download}
                  onClick={() => downloadBlob(result, `watermarked-${file.name}`)}
                >
                  Download PDF
                </Button>
                <Button variant="ghost" icon={RefreshCw} onClick={reset}>
                  Process another file
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button size="lg" icon={Stamp} loading={busy} onClick={run}>
                {busy ? "Applying..." : "Add watermark"}
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
