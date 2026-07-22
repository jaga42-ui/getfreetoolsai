"use client";

import { useEffect, useRef, useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { Button, SegmentedControl, ErrorMessage } from "@/components/ui";
import { CopyButton } from "@/components/tools/text/shared";
import { downloadBlob } from "@/lib/utils";
import { loadImage } from "@/lib/image";
import { canvasToBlob } from "@/lib/pdfjs";
import { zipFiles } from "@/lib/zip";

type Bg = "transparent" | "white" | "custom";

const PNG_TARGETS: { size: number; name: string }[] = [
  { size: 16, name: "favicon-16x16.png" },
  { size: 32, name: "favicon-32x32.png" },
  { size: 48, name: "favicon-48x48.png" },
  { size: 180, name: "apple-touch-icon.png" },
  { size: 192, name: "android-chrome-192x192.png" },
  { size: 512, name: "android-chrome-512x512.png" },
];
const ICO_SIZES = [16, 32, 48];

const HTML_SNIPPET = `<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">`;

/** Render the source image, contained and centred, onto a square canvas. */
function renderSquare(
  img: HTMLImageElement,
  size: number,
  bg: Bg,
  color: string
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  if (bg !== "transparent") {
    ctx.fillStyle = bg === "white" ? "#ffffff" : color;
    ctx.fillRect(0, 0, size, size);
  }
  const scale = Math.min(size / img.naturalWidth, size / img.naturalHeight);
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
  return canvas;
}

/** Assemble a multi-resolution .ico from PNG-encoded entries. */
function buildIco(entries: { size: number; bytes: Uint8Array }[]): Blob {
  const header = 6;
  const dirEntry = 16;
  const offsets: number[] = [];
  let offset = header + dirEntry * entries.length;
  for (const e of entries) {
    offsets.push(offset);
    offset += e.bytes.length;
  }
  const buf = new ArrayBuffer(offset);
  const view = new DataView(buf);
  const bytes = new Uint8Array(buf);
  view.setUint16(0, 0, true); // reserved
  view.setUint16(2, 1, true); // type: icon
  view.setUint16(4, entries.length, true); // count
  entries.forEach((e, i) => {
    const p = header + dirEntry * i;
    view.setUint8(p, e.size >= 256 ? 0 : e.size); // width
    view.setUint8(p + 1, e.size >= 256 ? 0 : e.size); // height
    view.setUint8(p + 2, 0); // palette
    view.setUint8(p + 3, 0); // reserved
    view.setUint16(p + 4, 1, true); // planes
    view.setUint16(p + 6, 32, true); // bit depth
    view.setUint32(p + 8, e.bytes.length, true); // size
    view.setUint32(p + 12, offsets[i], true); // offset
    bytes.set(e.bytes, offsets[i]);
  });
  return new Blob([buf], { type: "image/x-icon" });
}

export default function FaviconGenerator() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [bg, setBg] = useState<Bg>("transparent");
  const [color, setColor] = useState("#ffffff");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const previewRef = useRef<HTMLCanvasElement>(null);

  const onFile = async (files: File[]) => {
    setError("");
    try {
      setImg(await loadImage(files[0]));
    } catch {
      setError("Could not load this image.");
    }
  };

  useEffect(() => {
    if (img && previewRef.current) {
      const c = renderSquare(img, 128, bg, color);
      const dst = previewRef.current;
      dst.width = 128;
      dst.height = 128;
      dst.getContext("2d")!.drawImage(c, 0, 0);
    }
  }, [img, bg, color]);

  const generate = async () => {
    if (!img) return;
    setBusy(true);
    setError("");
    try {
      const files: { name: string; blob: Blob }[] = [];
      for (const t of PNG_TARGETS) {
        const blob = await canvasToBlob(
          renderSquare(img, t.size, bg, color),
          "image/png"
        );
        files.push({ name: t.name, blob });
      }
      const icoEntries = [];
      for (const size of ICO_SIZES) {
        const blob = await canvasToBlob(
          renderSquare(img, size, bg, color),
          "image/png"
        );
        icoEntries.push({ size, bytes: new Uint8Array(await blob.arrayBuffer()) });
      }
      files.push({ name: "favicon.ico", blob: buildIco(icoEntries) });
      const zip = await zipFiles(files);
      downloadBlob(zip, "favicons.zip");
    } catch {
      setError("Something went wrong generating the favicons.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      {!img ? (
        <DropZone
          acceptedTypes={["image/jpeg", "image/png", "image/webp", "image/svg+xml"]}
          acceptedLabel="PNG, JPG, WebP, SVG — square works best"
          maxSizeMB={20}
          onFilesAccepted={onFile}
        />
      ) : (
        <>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="flex flex-col items-center gap-3">
              <div className="rounded-xl border border-border bg-[length:16px_16px] bg-[conic-gradient(#e7e1d3_90deg,transparent_90deg_180deg,#e7e1d3_180deg_270deg,transparent_270deg)] bg-white p-3">
                <canvas ref={previewRef} className="h-32 w-32" />
              </div>
              <div className="flex items-center gap-2">
                {/* live small previews at real favicon scale */}
                <FaviconSample img={img} size={32} bg={bg} color={color} />
                <FaviconSample img={img} size={16} bg={bg} color={color} />
              </div>
            </div>

            <div className="flex-1">
              <p className="mb-1.5 block text-sm text-text-muted">Background</p>
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
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-9 w-12 cursor-pointer rounded border border-border bg-transparent"
                    aria-label="Background color"
                  />
                )}
              </div>
              <p className="mt-4 text-sm text-text-muted">
                The ZIP includes <strong className="text-text-primary">favicon.ico</strong>{" "}
                (16/32/48), PNGs at 16–512px and an Apple touch icon. Add this to
                your <code>&lt;head&gt;</code>:
              </p>
              <pre className="mt-2 overflow-x-auto rounded-lg border border-border bg-background p-3 font-mono text-[11px] leading-relaxed text-text-primary">
                {HTML_SNIPPET}
              </pre>
              <CopyButton text={HTML_SNIPPET} label="Copy HTML" className="mt-2" />
            </div>
          </div>

          <ErrorMessage message={error} />

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              variant="success"
              icon={Download}
              onClick={generate}
              loading={busy}
            >
              {busy ? "Generating…" : "Download favicon pack"}
            </Button>
            <Button variant="ghost" icon={RefreshCw} onClick={() => setImg(null)}>
              Start over
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

function FaviconSample({
  img,
  size,
  bg,
  color,
}: {
  img: HTMLImageElement;
  size: number;
  bg: Bg;
  color: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const c = renderSquare(img, size, bg, color);
    ref.current.width = size;
    ref.current.height = size;
    ref.current.getContext("2d")!.drawImage(c, 0, 0);
  }, [img, size, bg, color]);
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="rounded border border-border bg-white p-1">
        <canvas ref={ref} style={{ width: size, height: size }} />
      </div>
      <span className="text-[10px] text-text-muted">{size}px</span>
    </div>
  );
}
