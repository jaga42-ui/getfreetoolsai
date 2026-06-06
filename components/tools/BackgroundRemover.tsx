"use client";

import { useEffect, useRef, useState } from "react";
import { Download, RotateCcw, Eraser, CheckCircle2 } from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { Button, ErrorMessage } from "@/components/ui";
import { ProgressBar } from "@/components/ProgressBar";
import { formatBytes, downloadBlob } from "@/lib/utils";
import { loadImage } from "@/lib/image";
import { useToolShortcuts } from "@/lib/hooks";
import { useHandoffIntake, blobToFile } from "@/lib/handoff";
import { ChainResults } from "@/components/ChainResults";

type BgChoice = "transparent" | "white" | "black" | "custom";

export default function BackgroundRemover() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [error, setError] = useState("");
  const [cutout, setCutout] = useState<Blob | null>(null);
  const [bg, setBg] = useState<BgChoice>("transparent");
  const [customColor, setCustomColor] = useState("#6366f1");
  const [finalUrl, setFinalUrl] = useState<string | null>(null);
  const finalBlobRef = useRef<Blob | null>(null);
  const warmedRef = useRef(false);

  const imglyConfig = () => ({
    publicPath: new URL("/imgly/", window.location.origin).toString(),
    model: "medium" as const,
  });

  // Start downloading the AI model the moment a file is chosen — so it's
  // (often) already cached by the time the user clicks "Remove background".
  // Runs in idle time and never blocks interaction.
  const warmModel = () => {
    if (warmedRef.current) return;
    warmedRef.current = true;
    const start = () =>
      import("@imgly/background-removal")
        .then((m) => {
          const preload = (m as { preload?: (c: object) => Promise<unknown> })
            .preload;
          return preload ? preload(imglyConfig()) : undefined;
        })
        .catch(() => {
          warmedRef.current = false; // allow a retry on actual run
        });
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      (window as unknown as {
        requestIdleCallback: (cb: () => void) => void;
      }).requestIdleCallback(start);
    } else {
      setTimeout(start, 200);
    }
  };

  const onFile = (files: File[]) => {
    setError("");
    setCutout(null);
    setFinalUrl(null);
    setFile(files[0]);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(files[0]));
    warmModel();
  };

  const reset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (finalUrl) URL.revokeObjectURL(finalUrl);
    setFile(null);
    setPreviewUrl(null);
    setCutout(null);
    setFinalUrl(null);
    setError("");
    setProgress(0);
    setStatusText("");
  };

  const run = async () => {
    if (!file) return;
    setProcessing(true);
    setError("");
    setProgress(0);
    setStatusText(
      warmedRef.current
        ? "Warming up the AI model…"
        : "Setting up the AI model — one time only, then it's instant…"
    );
    try {
      const { removeBackground } = await import("@imgly/background-removal");
      const blob = await removeBackground(file, {
        // Self-hosted model + wasm — no external CDN, works offline.
        ...imglyConfig(),
        output: { format: "image/png", quality: 0.9 },
        progress: (key: string, current: number, total: number) => {
          const pct = total ? Math.round((current / total) * 100) : 0;
          const isModel = key.includes("fetch") || key.includes("model");
          setStatusText(
            isModel
              ? "Preparing the AI model — one time only, then it's instant…"
              : "Analyzing your image and cutting out the subject…"
          );
          setProgress(pct);
        },
      });
      setCutout(blob);
      setProgress(100);
    } catch (e) {
      setError(
        e instanceof Error
          ? `Could not remove background: ${e.message}`
          : "Something went wrong. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  // Re-composite whenever the cutout or background choice changes.
  useEffect(() => {
    if (!cutout) return;
    let cancelled = false;
    (async () => {
      try {
        if (bg === "transparent") {
          if (cancelled) return;
          if (finalUrl) URL.revokeObjectURL(finalUrl);
          finalBlobRef.current = cutout;
          setFinalUrl(URL.createObjectURL(cutout));
          return;
        }
        const img = await loadImage(cutout);
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle =
          bg === "white" ? "#ffffff" : bg === "black" ? "#000000" : customColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const blob = await new Promise<Blob>((res, rej) =>
          canvas.toBlob((b) => (b ? res(b) : rej(new Error("fail"))), "image/png")
        );
        if (cancelled) return;
        if (finalUrl) URL.revokeObjectURL(finalUrl);
        finalBlobRef.current = blob;
        setFinalUrl(URL.createObjectURL(blob));
      } catch {
        /* ignore composite errors */
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cutout, bg, customColor]);

  const outName = file
    ? `${file.name.replace(/\.[^.]+$/, "")}-no-bg.png`
    : "no-bg.png";

  useHandoffIntake(onFile);
  useToolShortcuts({
    onRun: run,
    onReset: reset,
    runEnabled: !!file && !cutout && !processing,
  });

  const checker =
    "bg-white bg-[conic-gradient(#e7e1d3_90deg,transparent_90deg_180deg,#e7e1d3_180deg_270deg,transparent_270deg)] bg-[length:18px_18px]";

  const swatches: { key: BgChoice; label: string; style?: string }[] = [
    { key: "transparent", label: "Transparent" },
    { key: "white", label: "White" },
    { key: "black", label: "Black" },
    { key: "custom", label: "Custom" },
  ];

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      {!file ? (
        <DropZone
          acceptedTypes={["image/jpeg", "image/png", "image/webp"]}
          acceptedLabel="JPG, PNG, WebP"
          maxSizeMB={30}
          onFilesAccepted={onFile}
        />
      ) : (
        <>
          {finalUrl && previewUrl ? (
            <div className="animate-fade-in">
              <p className="mb-2 flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-secondary">
                <CheckCircle2 className="h-3.5 w-3.5" /> Background removed
              </p>
              <BeforeAfterSlider
                before={previewUrl}
                after={finalUrl}
                checkered={bg === "transparent"}
              />
              <p className="mt-2 text-center text-xs text-text-muted">
                Drag the slider to compare the original and the result
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 font-mono text-xs uppercase tracking-widest text-text-muted">
                  Original
                </p>
                {previewUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt="Original"
                    className="max-h-72 w-full rounded-lg border border-border object-contain"
                  />
                )}
              </div>
              <div>
                <p className="mb-2 font-mono text-xs uppercase tracking-widest text-text-muted">
                  Result
                </p>
                <div
                  className={`flex max-h-72 min-h-[8rem] items-center justify-center rounded-lg border border-border ${checker}`}
                >
                  {processing ? (
                    <div className="flex w-full flex-col items-center gap-3 p-6">
                      <div className="skeleton h-36 w-full max-w-[13rem] rounded-lg" />
                      <span className="text-center text-xs text-text-muted">
                        {statusText || "Working…"}
                      </span>
                    </div>
                  ) : (
                    <span className="p-6 text-sm text-text-muted">
                      Result will appear here
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          <ErrorMessage message={error} onRetry={error ? run : undefined} />

          {processing && (
            <div className="mt-5">
              <ProgressBar value={progress} label={statusText} />
            </div>
          )}

          {cutout ? (
            <div className="mt-5">
              <p className="mb-2 font-mono text-xs uppercase tracking-widest text-text-muted">
                Background
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {swatches.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setBg(s.key)}
                    className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                      bg === s.key
                        ? "border-primary bg-primary/10 text-text-primary"
                        : "border-border text-text-muted hover:text-text-primary"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
                {bg === "custom" && (
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="h-9 w-12 cursor-pointer rounded border border-border bg-transparent"
                    aria-label="Custom background color"
                  />
                )}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button
                  size="lg"
                  variant="success"
                  icon={Download}
                  onClick={() =>
                    finalBlobRef.current &&
                    downloadBlob(finalBlobRef.current, outName)
                  }
                >
                  Download PNG
                  {finalBlobRef.current
                    ? ` · ${formatBytes(finalBlobRef.current.size)}`
                    : ""}
                </Button>
                <Button variant="ghost" icon={RotateCcw} onClick={reset}>
                  Process another file
                </Button>
              </div>

              <ChainResults
                getFiles={() =>
                  finalBlobRef.current
                    ? [blobToFile(finalBlobRef.current, outName)]
                    : []
                }
                count={finalUrl ? 1 : 0}
                current="/image/background-remover"
              />
            </div>
          ) : (
            !processing && (
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Button size="lg" icon={Eraser} onClick={run}>
                  Remove background
                </Button>
                <Button variant="ghost" icon={RotateCcw} onClick={reset}>
                  Start over
                </Button>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
}
