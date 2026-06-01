"use client";

import { useState } from "react";
import {
  TextCursorInput,
  RotateCcw,
  Copy,
  Check,
  Download,
  FileType2,
} from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { Button, ErrorMessage } from "@/components/ui";
import { ProgressBar } from "@/components/ProgressBar";
import { formatBytes, downloadBlob } from "@/lib/utils";
import { textToDocxBlob } from "@/lib/docx";

const LANGUAGES = [
  { value: "eng", label: "English" },
  { value: "hin", label: "Hindi" },
  { value: "ara", label: "Arabic" },
  { value: "fra", label: "French" },
  { value: "spa", label: "Spanish" },
];

export default function ImageToText() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [lang, setLang] = useState("eng");
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [text, setText] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const onFile = (files: File[]) => {
    const f = files[0];
    setError("");
    setText(null);
    setConfidence(null);
    setFile(f);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const reset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setText(null);
    setConfidence(null);
    setError("");
    setProgress(0);
    setStatusText("");
  };

  const baseName = file ? file.name.replace(/\.[^.]+$/, "") : "image-text";

  const runOcr = async () => {
    if (!file) return;
    setProcessing(true);
    setError("");
    setText(null);
    setProgress(0);
    let worker: Awaited<ReturnType<typeof import("tesseract.js").createWorker>> | null =
      null;
    try {
      const { createWorker } = await import("tesseract.js");
      setStatusText("Loading OCR engine...");
      worker = await createWorker(lang, 1, {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
            setStatusText("Recognizing text...");
          }
        },
      });
      const { data } = await worker.recognize(file);
      setText(data.text);
      setConfidence(Math.round(data.confidence));
      setProgress(100);
      setStatusText("✅ Complete!");
    } catch (e) {
      setError(
        e instanceof Error
          ? `OCR failed: ${e.message}`
          : "Something went wrong. Please try again."
      );
    } finally {
      if (worker) await worker.terminate();
      setProcessing(false);
    }
  };

  const copyText = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Copy failed. Select the text manually and copy.");
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      {!file ? (
        <DropZone
          acceptedTypes={["image/jpeg", "image/png", "image/webp", "image/bmp"]}
          acceptedLabel="JPG, PNG, WebP, BMP"
          maxSizeMB={50}
          onFilesAccepted={onFile}
        />
      ) : (
        <>
          <div className="flex items-center gap-4 rounded-xl border border-border bg-background p-3">
            {previewUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt={file.name}
                className="h-14 w-14 shrink-0 rounded-lg border border-border object-cover"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text-primary">
                {file.name}
              </p>
              <p className="text-xs text-text-muted">{formatBytes(file.size)}</p>
            </div>
          </div>

          {text === null && !processing && (
            <div className="mt-4 rounded-xl border border-border bg-background p-4">
              <label className="font-mono text-xs uppercase tracking-widest text-text-muted">
                Image language
              </label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <ErrorMessage message={error} onRetry={error ? runOcr : undefined} />

          {processing && (
            <div className="mt-5">
              <ProgressBar value={progress} label={statusText} />
            </div>
          )}

          {text !== null && (
            <div className="mt-5">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-secondary">
                  ✅ Text extracted
                </p>
                {confidence != null && (
                  <span
                    className={`text-xs font-medium ${
                      confidence >= 80
                        ? "text-secondary"
                        : confidence >= 60
                        ? "text-orange-400"
                        : "text-red-400"
                    }`}
                  >
                    {confidence}% confidence
                  </span>
                )}
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={10}
                className="mt-3 w-full rounded-xl border border-border bg-background p-3 text-sm text-text-primary focus:border-primary focus:outline-none"
              />
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button
                  variant="success"
                  icon={copied ? Check : Copy}
                  onClick={copyText}
                >
                  {copied ? "Copied!" : "Copy text"}
                </Button>
                <Button
                  variant="outline"
                  icon={Download}
                  onClick={() =>
                    downloadBlob(
                      new Blob([text], { type: "text/plain;charset=utf-8" }),
                      `${baseName}.txt`
                    )
                  }
                >
                  Download .txt
                </Button>
                <Button
                  variant="outline"
                  icon={FileType2}
                  onClick={async () =>
                    downloadBlob(await textToDocxBlob(text), `${baseName}.docx`)
                  }
                >
                  Download .docx
                </Button>
                <Button variant="ghost" icon={RotateCcw} onClick={reset}>
                  Process another file
                </Button>
              </div>
            </div>
          )}

          {text === null && !processing && (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button size="lg" icon={TextCursorInput} onClick={runOcr}>
                Extract text
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
