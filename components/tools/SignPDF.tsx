"use client";

import { useEffect, useRef, useState } from "react";
import {
  Download,
  RefreshCw,
  FileText,
  Signature,
  Eraser,
  ChevronLeft,
  ChevronRight,
  Move,
} from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { Button, SegmentedControl, ErrorMessage, SuccessHeader } from "@/components/ui";
import { formatBytes, downloadBlob, bytesToBlob } from "@/lib/utils";
import { getPdfjs, renderPageToCanvas, canvasToBlob } from "@/lib/pdfjs";

type Tab = "draw" | "type";

type Sig = { dataUrl: string; aspect: number }; // aspect = width / height
type PageView = { url: string; pdfW: number; pdfH: number };
/** Position as fractions of the page (top-left origin) so it survives resizing. */
type Box = { xPct: number; yPct: number; wPct: number };

const TYPE_FONTS = [
  { label: "Signature", css: '"Brush Script MT", "Segoe Script", cursive' },
  { label: "Casual", css: '"Snell Roundhand", "Bradley Hand", cursive' },
  { label: "Formal", css: '"Apple Chancery", "Edwardian Script ITC", cursive' },
];

export default function SignPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pages, setPages] = useState<Record<number, PageView>>({});
  const [loadingPage, setLoadingPage] = useState(false);

  const [tab, setTab] = useState<Tab>("draw");
  const [penColor, setPenColor] = useState("#0b3d91");
  const [typeText, setTypeText] = useState("");
  const [fontIdx, setFontIdx] = useState(0);

  const [sig, setSig] = useState<Sig | null>(null);
  const [box, setBox] = useState<Box>({ xPct: 0.55, yPct: 0.8, wPct: 0.3 });

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Blob | null>(null);

  const padCanvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<{ clear: () => void; isEmpty: () => boolean; toDataURL: (t?: string) => string } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // ---- file intake ----
  const onFile = async (files: File[]) => {
    const f = files[0];
    setFile(f);
    setError("");
    setResult(null);
    setPages({});
    setPageIndex(0);
    try {
      const pdfjs = await getPdfjs();
      const doc = await pdfjs.getDocument({ data: await f.arrayBuffer() }).promise;
      setNumPages(doc.numPages);
      await renderPage(0, f);
    } catch {
      setError("Could not read this PDF. It may be corrupted or password-protected.");
    }
  };

  const renderPage = async (idx: number, f: File) => {
    if (pages[idx]) return;
    setLoadingPage(true);
    try {
      const pdfjs = await getPdfjs();
      const doc = await pdfjs.getDocument({ data: await f.arrayBuffer() }).promise;
      const page = await doc.getPage(idx + 1);
      const viewport = page.getViewport({ scale: 1 });
      const canvas = await renderPageToCanvas(page, 1.5);
      const blob = await canvasToBlob(canvas, "image/jpeg", 0.85);
      const url = URL.createObjectURL(blob);
      setPages((p) => ({
        ...p,
        [idx]: { url, pdfW: viewport.width, pdfH: viewport.height },
      }));
    } catch {
      setError("Could not render this page.");
    } finally {
      setLoadingPage(false);
    }
  };

  const goToPage = async (idx: number) => {
    if (idx < 0 || idx >= numPages || !file) return;
    setPageIndex(idx);
    if (!pages[idx]) await renderPage(idx, file);
  };

  // ---- signature pad ----
  useEffect(() => {
    if (tab !== "draw" || !padCanvasRef.current) return;
    let pad: { clear: () => void; isEmpty: () => boolean; toDataURL: (t?: string) => string; off?: () => void } | null = null;
    let cancelled = false;
    (async () => {
      const mod = await import("signature_pad");
      if (cancelled || !padCanvasRef.current) return;
      const SignaturePad = mod.default;
      const canvas = padCanvasRef.current;
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      const ctx = canvas.getContext("2d");
      ctx?.scale(ratio, ratio);
      pad = new SignaturePad(canvas, { penColor, minWidth: 1, maxWidth: 2.8 });
      padRef.current = pad;
    })();
    return () => {
      cancelled = true;
      pad?.off?.();
      padRef.current = null;
    };
    // re-init when switching to the draw tab
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // keep pen colour in sync without re-instantiating
  useEffect(() => {
    const pad = padRef.current as { penColor?: string } | null;
    if (pad) pad.penColor = penColor;
  }, [penColor]);

  const clearPad = () => padRef.current?.clear();

  const useDrawnSignature = () => {
    const pad = padRef.current;
    if (!pad || pad.isEmpty()) {
      setError("Draw your signature first.");
      return;
    }
    const dataUrl = pad.toDataURL("image/png");
    measureAndSet(dataUrl);
  };

  const useTypedSignature = () => {
    if (!typeText.trim()) {
      setError("Type your name first.");
      return;
    }
    const pad = 24;
    const fontPx = 96;
    const probe = document.createElement("canvas");
    const pctx = probe.getContext("2d")!;
    pctx.font = `${fontPx}px ${TYPE_FONTS[fontIdx].css}`;
    const w = Math.ceil(pctx.measureText(typeText).width) + pad * 2;
    const h = Math.ceil(fontPx * 1.5) + pad;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.font = `${fontPx}px ${TYPE_FONTS[fontIdx].css}`;
    ctx.fillStyle = penColor;
    ctx.textBaseline = "middle";
    ctx.fillText(typeText, pad, h / 2);
    measureAndSet(canvas.toDataURL("image/png"));
  };

  const measureAndSet = (dataUrl: string) => {
    setError("");
    const img = new Image();
    img.onload = () => {
      const aspect = img.naturalWidth / img.naturalHeight || 3;
      setSig({ dataUrl, aspect });
      setBox({ xPct: 0.55, yPct: 0.78, wPct: 0.3 });
    };
    img.src = dataUrl;
  };

  // ---- drag & resize the placed signature ----
  const dragState = useRef<{
    mode: "move" | "resize";
    startX: number;
    startY: number;
    orig: Box;
    rect: DOMRect;
  } | null>(null);

  const onPointerDown = (mode: "move" | "resize") => (e: React.PointerEvent) => {
    if (!stageRef.current) return;
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragState.current = {
      mode,
      startX: e.clientX,
      startY: e.clientY,
      orig: box,
      rect: stageRef.current.getBoundingClientRect(),
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const ds = dragState.current;
    if (!ds || !sig) return;
    const dxPct = (e.clientX - ds.startX) / ds.rect.width;
    const dyPct = (e.clientY - ds.startY) / ds.rect.height;
    if (ds.mode === "move") {
      const x = clamp(ds.orig.xPct + dxPct, 0, 1 - ds.orig.wPct);
      const boxHPct = boxHeightPct(ds.orig.wPct, ds.rect);
      const y = clamp(ds.orig.yPct + dyPct, 0, 1 - boxHPct);
      setBox({ ...ds.orig, xPct: x, yPct: y });
    } else {
      const w = clamp(ds.orig.wPct + dxPct, 0.08, 1 - ds.orig.xPct);
      setBox({ ...ds.orig, wPct: w });
    }
  };

  const onPointerUp = () => {
    dragState.current = null;
  };

  // pixel height of the signature box as a fraction of stage height
  const boxHeightPct = (wPct: number, rect: DOMRect) => {
    if (!sig) return 0;
    const wPx = wPct * rect.width;
    const hPx = wPx / sig.aspect;
    return hPx / rect.height;
  };

  // ---- apply ----
  const run = async () => {
    if (!file || !sig) return;
    setBusy(true);
    setError("");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer(), {
        ignoreEncryption: true,
      });
      const png = await doc.embedPng(sig.dataUrl);
      const page = doc.getPages()[pageIndex];
      const { width: pw, height: ph } = page.getSize();
      const sigW = box.wPct * pw;
      const sigH = sigW / sig.aspect;
      const x = box.xPct * pw;
      // box.yPct is from the top; pdf origin is bottom-left.
      const y = ph - box.yPct * ph - sigH;
      page.drawImage(png, { x, y, width: sigW, height: sigH });
      const bytes = await doc.save();
      setResult(bytesToBlob(bytes, "application/pdf"));
    } catch (e) {
      setError(
        e instanceof Error
          ? `Could not sign this PDF: ${e.message}`
          : "Something went wrong. Please try again."
      );
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    Object.values(pages).forEach((p) => URL.revokeObjectURL(p.url));
    setFile(null);
    setPages({});
    setNumPages(0);
    setPageIndex(0);
    setSig(null);
    setTypeText("");
    setResult(null);
    setError("");
  };

  const outName = file ? `signed-${file.name}` : "signed.pdf";
  const view = pages[pageIndex];

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      {!file ? (
        <DropZone
          acceptedTypes={[".pdf", "application/pdf"]}
          acceptedLabel="a PDF file"
          maxSizeMB={100}
          onFilesAccepted={onFile}
        />
      ) : result ? (
        <div className="rounded-xl border border-secondary/30 bg-secondary/5 p-5 text-center">
          <SuccessHeader>Signature added</SuccessHeader>
          <p className="mt-1 text-sm text-text-muted">{formatBytes(result.size)}</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              variant="success"
              icon={Download}
              onClick={() => downloadBlob(result, outName)}
            >
              Download signed PDF
            </Button>
            <Button variant="ghost" icon={RefreshCw} onClick={reset}>
              Sign another file
            </Button>
          </div>
        </div>
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

          {/* Signature builder */}
          {!sig && (
            <div className="mt-4 space-y-4 rounded-xl border border-border bg-background p-4">
              <SegmentedControl<Tab>
                value={tab}
                onChange={setTab}
                options={[
                  { value: "draw", label: "Draw" },
                  { value: "type", label: "Type" },
                ]}
              />

              {tab === "draw" ? (
                <>
                  <canvas
                    ref={padCanvasRef}
                    className="h-40 w-full touch-none rounded-lg border border-dashed border-border bg-surface"
                  />
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-text-muted">
                      Ink
                      <input
                        type="color"
                        value={penColor}
                        onChange={(e) => setPenColor(e.target.value)}
                        className="h-8 w-10 cursor-pointer rounded border border-border bg-transparent"
                        aria-label="Ink colour"
                      />
                    </label>
                    <Button variant="ghost" icon={Eraser} onClick={clearPad}>
                      Clear
                    </Button>
                    <Button icon={Signature} onClick={useDrawnSignature}>
                      Use signature
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <input
                    value={typeText}
                    onChange={(e) => setTypeText(e.target.value)}
                    placeholder="Type your name"
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
                  />
                  <div
                    className="flex min-h-[5rem] items-center justify-center rounded-lg border border-dashed border-border bg-surface px-4"
                    style={{ font: `64px ${TYPE_FONTS[fontIdx].css}`, color: penColor }}
                  >
                    <span className="truncate">{typeText || "Preview"}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <SegmentedControl<string>
                      value={String(fontIdx)}
                      onChange={(v) => setFontIdx(Number(v))}
                      options={TYPE_FONTS.map((f, i) => ({
                        value: String(i),
                        label: f.label,
                      }))}
                    />
                    <label className="flex items-center gap-2 text-sm text-text-muted">
                      Ink
                      <input
                        type="color"
                        value={penColor}
                        onChange={(e) => setPenColor(e.target.value)}
                        className="h-8 w-10 cursor-pointer rounded border border-border bg-transparent"
                        aria-label="Ink colour"
                      />
                    </label>
                  </div>
                  <Button icon={Signature} onClick={useTypedSignature}>
                    Use signature
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Placement stage */}
          {sig && (
            <div className="mt-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <p className="flex items-center gap-1.5 text-sm text-text-muted">
                  <Move className="h-4 w-4" /> Drag to position · drag the corner to resize
                </p>
                {numPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => goToPage(pageIndex - 1)}
                      disabled={pageIndex === 0}
                      className="rounded-md border border-border p-1.5 text-text-muted hover:text-text-primary disabled:opacity-40"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="font-mono text-xs text-text-primary">
                      Page {pageIndex + 1} / {numPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => goToPage(pageIndex + 1)}
                      disabled={pageIndex === numPages - 1}
                      className="rounded-md border border-border p-1.5 text-text-muted hover:text-text-primary disabled:opacity-40"
                      aria-label="Next page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <div
                ref={stageRef}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                className="relative mx-auto w-full select-none overflow-hidden rounded-lg border border-border bg-surface"
                style={{ touchAction: "none" }}
              >
                {view ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={view.url}
                    alt={`Page ${pageIndex + 1}`}
                    className="block w-full"
                    draggable={false}
                  />
                ) : (
                  <div className="flex h-80 items-center justify-center text-sm text-text-muted">
                    {loadingPage ? "Rendering page…" : "Loading…"}
                  </div>
                )}

                {view && (
                  <div
                    onPointerDown={onPointerDown("move")}
                    className="absolute cursor-move rounded-sm ring-2 ring-primary/70"
                    style={{
                      left: `${box.xPct * 100}%`,
                      top: `${box.yPct * 100}%`,
                      width: `${box.wPct * 100}%`,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={sig.dataUrl}
                      alt="Your signature"
                      className="pointer-events-none block w-full"
                      draggable={false}
                    />
                    <span
                      onPointerDown={onPointerDown("resize")}
                      className="absolute -bottom-1.5 -right-1.5 h-4 w-4 cursor-nwse-resize rounded-full border-2 border-white bg-primary"
                      aria-label="Resize signature"
                    />
                  </div>
                )}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <label className="flex flex-1 items-center gap-3 text-sm text-text-muted">
                  Size
                  <input
                    type="range"
                    min={8}
                    max={70}
                    value={Math.round(box.wPct * 100)}
                    onChange={(e) =>
                      setBox((b) => ({
                        ...b,
                        wPct: clamp(Number(e.target.value) / 100, 0.08, 1 - b.xPct),
                      }))
                    }
                    className="w-full max-w-xs accent-primary"
                    aria-label="Signature size"
                  />
                </label>
                <Button variant="ghost" onClick={() => setSig(null)}>
                  Change signature
                </Button>
              </div>
            </div>
          )}

          <ErrorMessage message={error} />

          {sig && (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button size="lg" icon={Signature} loading={busy} onClick={run}>
                {busy ? "Applying…" : "Place signature"}
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

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
