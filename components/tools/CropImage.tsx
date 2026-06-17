"use client";

import { useCallback, useRef, useState } from "react";
import { Download, RotateCcw, Crop as CropIcon } from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { Button, SegmentedControl, ErrorMessage, SuccessHeader } from "@/components/ui";
import { formatBytes, downloadBlob } from "@/lib/utils";
import { formatFromMime, EXT, type OutputFormat } from "@/lib/image";
import { useToolShortcuts } from "@/lib/hooks";
import { useHandoffIntake, blobToFile } from "@/lib/handoff";
import { ChainResults } from "@/components/ChainResults";

type Rect = { x: number; y: number; w: number; h: number };
type Handle = "move" | "nw" | "ne" | "sw" | "se";
type AspectKey = "free" | "1:1" | "4:3" | "16:9";

const ASPECTS: Record<AspectKey, number | null> = {
  free: null,
  "1:1": 1,
  "4:3": 4 / 3,
  "16:9": 16 / 9,
};

export default function CropImage() {
  const [file, setFile] = useState<File | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Rect>({ x: 0, y: 0, w: 0, h: 0 });
  const [aspect, setAspect] = useState<AspectKey>("free");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);

  const imgRef = useRef<HTMLImageElement>(null);
  const drag = useRef<{ handle: Handle; startX: number; startY: number; orig: Rect } | null>(
    null
  );

  const onFile = (files: File[]) => {
    const f = files[0];
    setError("");
    setResult(null);
    setFile(f);
    setSrc(URL.createObjectURL(f));
  };

  const reset = () => {
    if (src) URL.revokeObjectURL(src);
    if (result) URL.revokeObjectURL(result.url);
    setFile(null);
    setSrc(null);
    setResult(null);
    setError("");
  };

  const onImgLoad = () => {
    const img = imgRef.current;
    if (!img) return;
    const w = img.clientWidth;
    const h = img.clientHeight;
    setCrop({ x: w * 0.1, y: h * 0.1, w: w * 0.8, h: h * 0.8 });
  };

  const applyAspect = (key: AspectKey) => {
    setAspect(key);
    const img = imgRef.current;
    const ratio = ASPECTS[key];
    if (!img || !ratio) return;
    const cw = img.clientWidth;
    const ch = img.clientHeight;
    let w = cw * 0.8;
    let h = w / ratio;
    if (h > ch * 0.9) {
      h = ch * 0.8;
      w = h * ratio;
    }
    setCrop({ x: (cw - w) / 2, y: (ch - h) / 2, w, h });
  };

  const onPointerDown = (handle: Handle) => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { handle, startX: e.clientX, startY: e.clientY, orig: crop };
  };

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const d = drag.current;
    const img = imgRef.current;
    if (!d || !img) return;
    const maxW = img.clientWidth;
    const maxH = img.clientHeight;
    const ratio = ASPECTS[aspect];
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    let { x, y, w, h } = d.orig;
    const MIN = 24;

    if (d.handle === "move") {
      x = Math.min(Math.max(0, d.orig.x + dx), maxW - w);
      y = Math.min(Math.max(0, d.orig.y + dy), maxH - h);
    } else {
      // Resize from a corner.
      const right = d.orig.x + d.orig.w;
      const bottom = d.orig.y + d.orig.h;
      if (d.handle === "se") {
        w = Math.max(MIN, Math.min(d.orig.w + dx, maxW - d.orig.x));
        h = ratio ? w / ratio : Math.max(MIN, Math.min(d.orig.h + dy, maxH - d.orig.y));
      } else if (d.handle === "sw") {
        w = Math.max(MIN, Math.min(d.orig.w - dx, right));
        h = ratio ? w / ratio : Math.max(MIN, Math.min(d.orig.h + dy, maxH - d.orig.y));
        x = right - w;
      } else if (d.handle === "ne") {
        w = Math.max(MIN, Math.min(d.orig.w + dx, maxW - d.orig.x));
        h = ratio ? w / ratio : Math.max(MIN, Math.min(d.orig.h - dy, bottom));
        y = bottom - h;
      } else if (d.handle === "nw") {
        w = Math.max(MIN, Math.min(d.orig.w - dx, right));
        h = ratio ? w / ratio : Math.max(MIN, Math.min(d.orig.h - dy, bottom));
        x = right - w;
        y = bottom - h;
      }
      // Clamp ratio-driven height inside bounds.
      if (y < 0) { h += y; y = 0; }
      if (y + h > maxH) h = maxH - y;
      if (x < 0) { w += x; x = 0; }
      if (x + w > maxW) w = maxW - x;
    }
    setCrop({ x, y, w, h });
  }, [aspect]);

  const onPointerUp = () => {
    drag.current = null;
  };

  const doCrop = async () => {
    const img = imgRef.current;
    if (!img || !file) return;
    try {
      const scale = img.naturalWidth / img.clientWidth;
      const sx = Math.round(crop.x * scale);
      const sy = Math.round(crop.y * scale);
      const sw = Math.round(crop.w * scale);
      const sh = Math.round(crop.h * scale);
      const canvas = document.createElement("canvas");
      canvas.width = sw;
      canvas.height = sh;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("no ctx");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, sw, sh);
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      const format: OutputFormat = formatFromMime(file.type);
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("export failed"))),
          format,
          0.92
        )
      );
      setResult({ blob, url: URL.createObjectURL(blob) });
    } catch {
      setError("Could not crop this image. Please try again.");
    }
  };

  const outName = file
    ? `${file.name.replace(/\.[^.]+$/, "")}-cropped.${EXT[formatFromMime(file.type)]}`
    : "cropped.jpg";

  useHandoffIntake(onFile);
  useToolShortcuts({
    onRun: doCrop,
    onReset: reset,
    runEnabled: !!file && !result,
  });

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      {!file ? (
        <DropZone
          acceptedTypes={["image/jpeg", "image/png", "image/webp", "image/bmp"]}
          acceptedLabel="JPG, PNG, WebP, BMP"
          maxSizeMB={50}
          onFilesAccepted={onFile}
        />
      ) : result ? (
        <div className="rounded-xl border border-secondary/30 bg-secondary/5 p-5 text-center">
          <SuccessHeader>Cropped</SuccessHeader>
          <p className="mt-1 text-sm text-text-muted">
            {formatBytes(result.blob.size)}
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={result.url}
            alt="Cropped"
            className="mx-auto mt-4 max-h-64 rounded-lg border border-border"
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
            <Button variant="ghost" icon={RotateCcw} onClick={reset}>
              Process another file
            </Button>
          </div>
          <ChainResults
            getFiles={() => [blobToFile(result.blob, outName)]}
            count={1}
            current="/image/crop"
          />
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-text-muted">
              Aspect ratio
            </p>
            <SegmentedControl<AspectKey>
              value={aspect}
              onChange={applyAspect}
              options={[
                { value: "free", label: "Free" },
                { value: "1:1", label: "1:1" },
                { value: "4:3", label: "4:3" },
                { value: "16:9", label: "16:9" },
              ]}
            />
          </div>

          <div
            className="relative mx-auto w-fit touch-none select-none"
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={src!}
              alt="To crop"
              onLoad={onImgLoad}
              className="max-h-[60vh] w-auto max-w-full select-none rounded-lg"
              draggable={false}
            />
            {/* Crop selection */}
            <div
              onPointerDown={onPointerDown("move")}
              className="absolute cursor-move border-2 border-primary shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"
              style={{ left: crop.x, top: crop.y, width: crop.w, height: crop.h }}
            >
              {(["nw", "ne", "sw", "se"] as Handle[]).map((h) => (
                <span
                  key={h}
                  onPointerDown={onPointerDown(h)}
                  className="absolute h-4 w-4 rounded-full border-2 border-white bg-primary"
                  style={{
                    cursor: h === "nw" || h === "se" ? "nwse-resize" : "nesw-resize",
                    left: h.includes("w") ? -8 : undefined,
                    right: h.includes("e") ? -8 : undefined,
                    top: h.includes("n") ? -8 : undefined,
                    bottom: h.includes("s") ? -8 : undefined,
                  }}
                />
              ))}
            </div>
          </div>

          <ErrorMessage message={error} />

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button size="lg" icon={CropIcon} onClick={doCrop}>
              Crop image
            </Button>
            <Button variant="ghost" icon={RotateCcw} onClick={reset}>
              Start over
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
