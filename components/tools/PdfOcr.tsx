"use client";

import { useState } from "react";
import {
  ScanText,
  RotateCcw,
  FileText,
  Copy,
  Check,
  Download,
  FileType2,
  Lock,
} from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { Button, ErrorMessage } from "@/components/ui";
import { ProgressBar } from "@/components/ProgressBar";
import { formatBytes, downloadBlob } from "@/lib/utils";
import { getPdfjs, renderPageToCanvas } from "@/lib/pdfjs";
import { textToDocxBlob } from "@/lib/docx";

const LANGUAGES = [
  { value: "eng", label: "English" },
  { value: "hin", label: "Hindi" },
  { value: "ara", label: "Arabic" },
  { value: "fra", label: "French" },
  { value: "spa", label: "Spanish" },
  { value: "auto", label: "Auto-detect" },
];

type PageResult = { page: number; text: string; confidence: number };

export default function PdfOcr() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [lang, setLang] = useState("eng");
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<PageResult[]>([]);
  const [copied, setCopied] = useState(false);

  const onFile = async (files: File[]) => {
    const f = files[0];
    setFile(f);
    setError("");
    setResults([]);
    setPageCount(null);
    try {
      const pdfjs = await getPdfjs();
      const doc = await pdfjs.getDocument({ data: await f.arrayBuffer() })
        .promise;
      setPageCount(doc.numPages);
    } catch {
      setError("Could not read this PDF. It may be corrupted or encrypted.");
    }
  };

  const reset = () => {
    setFile(null);
    setPageCount(null);
    setResults([]);
    setError("");
    setProgress(0);
    setStatusText("");
  };

  const fullText = results.map((r) => r.text.trim()).join("\n\n");
  const baseName = file ? file.name.replace(/\.pdf$/i, "") : "ocr";

  const runOcr = async () => {
    if (!file || !pageCount) return;
    setProcessing(true);
    setError("");
    setResults([]);
    setProgress(0);
    let worker: Awaited<ReturnType<typeof import("tesseract.js").createWorker>> | null =
      null;
    try {
      const pdfjs = await getPdfjs();
      const { createWorker } = await import("tesseract.js");
      const ocrLang = lang === "auto" ? "eng" : lang;

      setStatusText("Loading OCR engine...");
      worker = await createWorker(ocrLang);

      const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() })
        .promise;

      const collected: PageResult[] = [];
      for (let p = 1; p <= pageCount; p++) {
        setStatusText(`Processing page ${p} of ${pageCount}...`);
        const page = await doc.getPage(p);
        const canvas = await renderPageToCanvas(page, 2);
        const { data } = await worker.recognize(canvas);
        collected.push({
          page: p,
          text: data.text,
          confidence: Math.round(data.confidence),
        });
        setResults([...collected]);
        setProgress(Math.round((p / pageCount) * 100));
      }
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
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Copy failed. Select the text manually and copy.");
    }
  };

  const downloadTxt = () => {
    downloadBlob(
      new Blob([fullText], { type: "text/plain;charset=utf-8" }),
      `${baseName}.txt`
    );
  };

  const downloadDocx = async () => {
    const blob = await textToDocxBlob(fullText);
    downloadBlob(blob, `${baseName}.docx`);
  };

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      {/* Prominent privacy badge */}
      <div className="mb-5 flex items-start gap-3 rounded-xl border border-secondary/40 bg-secondary/10 p-4">
        <Lock className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
        <p className="text-sm text-text-primary">
          <span className="font-semibold text-secondary">
            100% Private — OCR runs entirely in your browser.
          </span>{" "}
          Your document is NEVER sent to any server. Not even ours.
        </p>
      </div>

      {!file ? (
        <DropZone
          acceptedTypes={[".pdf", "application/pdf"]}
          acceptedLabel="a scanned or image-based PDF"
          maxSizeMB={100}
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
              <p className="text-xs text-text-muted">
                {pageCount != null ? `${pageCount} pages · ` : ""}
                {formatBytes(file.size)}
              </p>
            </div>
          </div>

          {results.length === 0 && !processing && (
            <div className="mt-4 rounded-xl border border-border bg-background p-4">
              <label className="font-mono text-xs uppercase tracking-widest text-text-muted">
                Document language
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
              {lang === "auto" && (
                <p className="mt-2 text-xs text-text-muted">
                  Auto-detect uses the English engine, which handles most Latin
                  scripts. For best results with other languages, pick it
                  explicitly.
                </p>
              )}
            </div>
          )}

          <ErrorMessage message={error} onRetry={error ? runOcr : undefined} />

          {processing && (
            <div className="mt-5">
              <ProgressBar value={progress} label={statusText} />
            </div>
          )}

          {results.length > 0 && (
            <div className="mt-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-lg font-semibold text-secondary">
                  ✅ Extracted text from {results.length} page
                  {results.length > 1 ? "s" : ""}
                </p>
              </div>

              {/* Per-page preview with confidence */}
              <div className="mt-3 max-h-[420px] space-y-3 overflow-y-auto rounded-xl border border-border bg-background p-3">
                {results.map((r) => (
                  <div key={r.page}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-mono text-xs uppercase tracking-widest text-text-muted">
                        Page {r.page}
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          r.confidence >= 80
                            ? "text-secondary"
                            : r.confidence >= 60
                            ? "text-orange-400"
                            : "text-red-400"
                        }`}
                      >
                        {r.confidence}% confidence
                      </span>
                    </div>
                    <pre className="whitespace-pre-wrap break-words rounded-lg bg-surface p-3 text-sm text-text-primary">
                      {r.text.trim() || "(no text detected)"}
                    </pre>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button
                  variant="success"
                  icon={copied ? Check : Copy}
                  onClick={copyText}
                >
                  {copied ? "Copied!" : "Copy text"}
                </Button>
                <Button variant="outline" icon={Download} onClick={downloadTxt}>
                  Download .txt
                </Button>
                <Button
                  variant="outline"
                  icon={FileType2}
                  onClick={downloadDocx}
                >
                  Download .docx
                </Button>
                <Button variant="ghost" icon={RotateCcw} onClick={reset}>
                  Process another file
                </Button>
              </div>
            </div>
          )}

          {results.length === 0 && !processing && (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                icon={ScanText}
                onClick={runOcr}
                disabled={!pageCount}
              >
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
