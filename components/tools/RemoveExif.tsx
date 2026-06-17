"use client";

import { useState } from "react";
import { Download, RotateCcw, ShieldOff, MapPin } from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { Button, ErrorMessage, SuccessHeader } from "@/components/ui";
import { formatBytes, downloadBlob } from "@/lib/utils";
import { loadImage, encodeResized, formatFromMime, EXT } from "@/lib/image";

/** Quick check for a JPEG EXIF/GPS marker so we can tell the user what we found. */
async function inspectMetadata(file: File): Promise<{
  hasExif: boolean;
  hasGps: boolean;
}> {
  if (file.type !== "image/jpeg") return { hasExif: false, hasGps: false };
  const buf = new Uint8Array(await file.arrayBuffer());
  let hasExif = false;
  let hasGps = false;
  // Scan APP1 segments for the "Exif" tag and a GPS IFD pointer (0x8825).
  for (let i = 0; i < buf.length - 6; i++) {
    if (buf[i] === 0xff && buf[i + 1] === 0xe1) {
      if (
        buf[i + 4] === 0x45 &&
        buf[i + 5] === 0x78 &&
        buf[i + 6] === 0x69 &&
        buf[i + 7] === 0x66
      ) {
        hasExif = true;
      }
    }
    if (buf[i] === 0x88 && buf[i + 1] === 0x25) hasGps = true;
  }
  return { hasExif, hasGps };
}

export default function RemoveExif() {
  const [file, setFile] = useState<File | null>(null);
  const [meta, setMeta] = useState<{ hasExif: boolean; hasGps: boolean } | null>(
    null
  );
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob } | null>(null);

  const onFile = async (files: File[]) => {
    const f = files[0];
    setError("");
    setResult(null);
    setFile(f);
    setMeta(null);
    try {
      setMeta(await inspectMetadata(f));
    } catch {
      setMeta({ hasExif: false, hasGps: false });
    }
  };

  const reset = () => {
    setFile(null);
    setMeta(null);
    setResult(null);
    setError("");
  };

  const strip = async () => {
    if (!file) return;
    setProcessing(true);
    setError("");
    try {
      const img = await loadImage(file);
      const format = formatFromMime(file.type);
      // Re-encoding through canvas drops every metadata block (EXIF, GPS, etc.).
      const blob = await encodeResized(
        img,
        img.naturalWidth,
        img.naturalHeight,
        format,
        0.95
      );
      setResult({ blob });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const outName = file
    ? `${file.name.replace(/\.[^.]+$/, "")}-clean.${EXT[formatFromMime(file.type)]}`
    : "clean.jpg";

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
          <div className="flex items-center gap-4 rounded-xl border border-border bg-background p-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text-primary">
                {file.name}
              </p>
              <p className="text-xs text-text-muted">{formatBytes(file.size)}</p>
            </div>
          </div>

          {!result && meta && (
            <div className="mt-4 rounded-xl border border-border bg-background p-4 text-sm">
              {meta.hasExif || meta.hasGps ? (
                <div className="flex items-start gap-2 text-orange-400">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    This photo contains embedded metadata
                    {meta.hasGps ? ", including GPS location data" : ""}. We’ll
                    strip it all out.
                  </span>
                </div>
              ) : (
                <p className="text-text-muted">
                  No EXIF/GPS metadata was detected, but re-saving guarantees a
                  clean, metadata-free copy.
                </p>
              )}
            </div>
          )}

          <ErrorMessage message={error} />

          {result ? (
            <div className="mt-5 rounded-xl border border-secondary/30 bg-secondary/5 p-5 text-center">
              <SuccessHeader>Metadata removed</SuccessHeader>
              <p className="mt-1 text-sm text-text-muted">
                All EXIF, GPS and camera data has been stripped.{" "}
                {formatBytes(file.size)} → {formatBytes(result.blob.size)}
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <Button
                  size="lg"
                  variant="success"
                  icon={Download}
                  onClick={() => downloadBlob(result.blob, outName)}
                >
                  Download clean image
                </Button>
                <Button variant="ghost" icon={RotateCcw} onClick={reset}>
                  Process another file
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                icon={ShieldOff}
                loading={processing}
                onClick={strip}
              >
                Remove metadata
              </Button>
              <Button variant="ghost" icon={RotateCcw} onClick={reset}>
                Start over
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
