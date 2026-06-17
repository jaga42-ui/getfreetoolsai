"use client";

import { useState } from "react";
import {
  FileType2,
  RotateCcw,
  FileText,
  Download,
  Copy,
  Check,
  Info,
} from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { Button, ErrorMessage, SuccessHeader } from "@/components/ui";
import { ProgressBar } from "@/components/ProgressBar";
import { formatBytes, downloadBlob } from "@/lib/utils";
import { getPdfjs } from "@/lib/pdfjs";
import { textToDocxBlob } from "@/lib/docx";

type TextItem = { str: string; transform: number[] };

export default function PdfToWord() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [error, setError] = useState("");
  const [text, setText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const onFile = async (files: File[]) => {
    const f = files[0];
    setError("");
    setText(null);
    setFile(f);
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
    setText(null);
    setError("");
    setProgress(0);
    setStatusText("");
  };

  const baseName = file ? file.name.replace(/\.pdf$/i, "") : "document";

  const extract = async () => {
    if (!file || !pageCount) return;
    setProcessing(true);
    setError("");
    setProgress(0);
    try {
      const pdfjs = await getPdfjs();
      const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() })
        .promise;
      const allPages: string[] = [];
      for (let p = 1; p <= pageCount; p++) {
        setStatusText(`Extracting page ${p} of ${pageCount}...`);
        const page = await doc.getPage(p);
        const content = await page.getTextContent();
        const items = content.items as TextItem[];
        let lastY: number | null = null;
        let line = "";
        const lines: string[] = [];
        for (const it of items) {
          if (!("str" in it)) continue;
          const y = it.transform[5];
          if (lastY !== null && Math.abs(y - lastY) > 3) {
            lines.push(line.trimEnd());
            line = "";
          }
          line += it.str;
          lastY = y;
        }
        if (line.trim()) lines.push(line.trimEnd());
        allPages.push(lines.join("\n"));
        setProgress(Math.round((p / pageCount) * 100));
      }
      const joined = allPages.join("\n\n");
      if (!joined.trim()) {
        setError(
          "No selectable text found. This looks like a scanned PDF — try the PDF OCR tool instead."
        );
        setProcessing(false);
        return;
      }
      setText(joined);
      setStatusText("Complete!");
    } catch (e) {
      setError(
        e instanceof Error
          ? `Extraction failed: ${e.message}`
          : "Something went wrong. Please try again."
      );
    } finally {
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
          acceptedTypes={[".pdf", "application/pdf"]}
          acceptedLabel="a text-based PDF"
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
              <p className="text-xs text-text-muted">
                {pageCount != null ? `${pageCount} pages · ` : ""}
                {formatBytes(file.size)}
              </p>
            </div>
          </div>

          {text === null && !processing && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-sky-500/30 bg-sky-500/5 p-4 text-sm text-text-primary">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
              <span>
                This extracts the editable text from your PDF. Complex layouts
                and images aren’t preserved. For scanned PDFs, use the PDF OCR
                tool instead.
              </span>
            </div>
          )}

          <ErrorMessage message={error} />

          {processing && (
            <div className="mt-5">
              <ProgressBar value={progress} label={statusText} />
            </div>
          )}

          {text !== null && (
            <div className="mt-5">
              <SuccessHeader>
                Text extracted from {pageCount} page
                {pageCount && pageCount > 1 ? "s" : ""}
              </SuccessHeader>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={10}
                className="mt-3 w-full rounded-xl border border-border bg-background p-3 text-sm text-text-primary focus:border-primary focus:outline-none"
              />
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button
                  size="lg"
                  variant="success"
                  icon={FileType2}
                  onClick={async () =>
                    downloadBlob(await textToDocxBlob(text), `${baseName}.docx`)
                  }
                >
                  Download .docx
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
                  icon={copied ? Check : Copy}
                  onClick={copyText}
                >
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button variant="ghost" icon={RotateCcw} onClick={reset}>
                  Process another file
                </Button>
              </div>
            </div>
          )}

          {text === null && !processing && (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                icon={FileType2}
                onClick={extract}
                disabled={!pageCount}
              >
                Convert to Word
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
