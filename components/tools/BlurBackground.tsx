"use client";

import { useEffect, useRef, useState } from "react";
import { Download, RotateCcw, Aperture, CheckCircle2 } from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { Button, ErrorMessage } from "@/components/ui";
import { ProgressBar } from "@/components/ProgressBar";
import { formatBytes, downloadBlob } from "@/lib/utils";
import { loadImage } from "@/lib/image";
import { useToolShortcuts } from "@/lib/hooks";
import { useHandoffIntake, blobToFile } from "@/lib/handoff";
import { ChainResults } from "@/components/ChainResults";
import { AiLoader } from "@/components/AiLoader";
import { imglyConfig, warmImglyModel } from "@/lib/imgly";

export default function BlurBackground() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [error, setError] = useState("");
  const [cutout, setCutout] = useState<Blob | null>(null);
  const [strength, setStrength] = useState(12);
  const [finalUrl, setFinalUrl] = useState<string | null>(null);
  const finalBlobRef = useRef<Blob | null>(null);

  const onFile = (files: File[]) => {
    setError("");
    setCutout(null);
    setFinalUrl(null);
    setFile(files[0]);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(files[0]));
    warmImglyModel();
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
    setStatusText("Setting up the AI model — one time only, then it's instant…");
    try {
      const { removeBackground } = await import("@imgly/background-removal");
      const blob = await removeBackground(file, {
        ...imglyConfig(),
        output: { format: "image/png", quality: 0.9 },
        progress: (key: string, current: number, total: number) => {
          const pct = total ? Math.round((current / total) * 100) : 0;
          const isModel = key.includes("fetch") || key.includes("model");
          setStatusText(
            isModel
              ? "Preparing the AI model — one time only, then it's instant…"
              : "Finding the subject so the background can be blurred…"
          );
          setProgress(pct);
        },
      });
      setCutout(blob);
      setProgress(100);
    } catch (e) {
      setError(
        e instanceof Error
          ? `Could not process image: ${e.message}`
          : "Something went wrong. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  // Composite: blurred original behind, sharp subject on top. Recomputes when
  // the cutout or blur strength changes.
  useEffect(() => {
    if (!cutout || !file) return;
    let cancelled = false;
    (async () => {
      try {
        const [original, subject] = await Promise.all([
          loadImage(file),
          loadImage(cutout),
        ]);
        const w = original.naturalWidth;
        const h = original.naturalHeight;
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        // Blur the background. Scale the source up slightly so the blur doesn't
        // bleed transparent edges in from the canvas border.
        const overscan = 1 + Math.min(strength, 40) / 100;
        const ow = w * overscan;
        const oh = h * overscan;
        ctx.filter = `blur(${strength}px)`;
        ctx.drawImage(original, -(ow - w) / 2, -(oh - h) / 2, ow, oh);
        ctx.filter = "none";
        // Sharp subject on top.
        ctx.drawImage(subject, 0, 0, w, h);
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
  }, [cutout, strength]);

  const outName = file
    ? `${file.name.replace(/\.[^.]+$/, "")}-blurred-bg.png`
    : "blurred-bg.png";

  useHandoffIntake(onFile);
  useToolShortcuts({
    onRun: run,
    onReset: reset,
    runEnabled: !!file && !cutout && !processing,
  });

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
                <CheckCircle2 className="h-3.5 w-3.5" /> Background blurred
              </p>
              <BeforeAfterSlider before={previewUrl} after={finalUrl} />
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
                <div className="flex max-h-72 min-h-[8rem] items-center justify-center rounded-lg border border-border bg-background">
                  {processing ? (
                    <AiLoader status={statusText} />
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
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-text-muted">Blur strength</span>
                <span className="font-mono text-xs text-text-primary">
                  {strength}px
                </span>
              </div>
              <input
                type="range"
                aria-label="Blur strength"
                min={2}
                max={40}
                value={strength}
                onChange={(e) => setStrength(Number(e.target.value))}
                className="w-full accent-primary"
              />

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
                current="/image/blur-background"
              />
            </div>
          ) : (
            !processing && (
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Button size="lg" icon={Aperture} onClick={run}>
                  Blur background
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
