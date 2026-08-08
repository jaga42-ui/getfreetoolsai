"use client";

import { useRef, useState } from "react";
import {
  ScanText,
  RotateCcw,
  FileText,
  Copy,
  Check,
  Download,
  FileType2,
  Lock,
  Loader2,
  CheckCircle2,
  Table2,
  Hash,
  Type,
  Gauge,
  Code2,
  FileCode,
  FileSearch,
  ImageIcon,
} from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { Button, ErrorMessage } from "@/components/ui";
import { formatBytes, downloadBlob } from "@/lib/utils";
import { getPdfjs, renderPageToCanvas, canvasToBlob } from "@/lib/pdfjs";
import { loadImage } from "@/lib/image";
import {
  reconstruct,
  docToHtml,
  docStats,
  fullHtmlDocument,
  wordDocument,
  htmlToPlainText,
  htmlToMarkdown,
  type OcrBlock,
  type DocNode,
} from "@/lib/ocr";
import type { OcrWordBox } from "@/lib/searchablePdf";
import { recognizedFromTesseractData } from "@/lib/ocr/providers/tesseract";
import { analyzePage } from "@/lib/ocr/layout";
import { toHtml } from "@/lib/ocr/serialize";
import { documentStats } from "@/lib/ocr/document";
import type { Page as ModelPage } from "@/lib/ocr/types";

const LANGUAGES = [
  { value: "eng", label: "English" },
  { value: "hin", label: "Hindi" },
  { value: "ben", label: "Bengali" },
  { value: "ori", label: "Odia" },
  { value: "tam", label: "Tamil" },
  { value: "tel", label: "Telugu" },
  { value: "mar", label: "Marathi" },
  { value: "guj", label: "Gujarati" },
  { value: "pan", label: "Punjabi" },
  { value: "ara", label: "Arabic" },
  { value: "fra", label: "French" },
  { value: "spa", label: "Spanish" },
  { value: "deu", label: "German" },
];

type PageResult = {
  page: number;
  confidence: number;
  doc: DocNode[];
  html: string;
  preview: string;
  words: OcrWordBox[];
  cw: number;
  ch: number;
  /** Present when the enhanced pipeline produced this page. */
  modelPage?: ModelPage;
};

function thumbnail(src: HTMLCanvasElement): string {
  const scale = Math.min(1, 520 / src.width);
  const c = document.createElement("canvas");
  c.width = Math.round(src.width * scale);
  c.height = Math.round(src.height * scale);
  c.getContext("2d")!.drawImage(src, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", 0.7);
}

function flattenWords(blocks: OcrBlock[] | null): OcrWordBox[] {
  const out: OcrWordBox[] = [];
  for (const b of blocks ?? [])
    for (const p of b.paragraphs ?? [])
      for (const l of p.lines ?? [])
        for (const w of l.words ?? [])
          if (w.text?.trim())
            out.push({ text: w.text, x0: w.bbox.x0, y0: w.bbox.y0, x1: w.bbox.x1, y1: w.bbox.y1 });
  return out;
}

async function imageToCanvas(file: File): Promise<HTMLCanvasElement> {
  const img = await loadImage(file);
  const w0 = img.naturalWidth || img.width;
  const h0 = img.naturalHeight || img.height;
  const scale = Math.min(2, Math.max(1, 1500 / w0));
  const c = document.createElement("canvas");
  c.width = Math.round(w0 * scale);
  c.height = Math.round(h0 * scale);
  c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
  return c;
}

function Stat({ icon: Icon, label, value }: { icon: typeof Type; label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="flex items-center gap-1.5 text-text-muted">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-[11px] uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-1 font-display text-xl font-medium text-text-primary">{value}</p>
    </div>
  );
}

export default function OcrStudio({ mode = "pdf" }: { mode?: "pdf" | "image" }) {
  const isPdf = mode === "pdf";
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [lang, setLang] = useState("eng");
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [statusText, setStatusText] = useState("");
  const [results, setResults] = useState<PageResult[]>([]);
  const [scanPreview, setScanPreview] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [copied, setCopied] = useState(false);
  /**
   * Enhanced pipeline: geometry-driven layout analysis (column detection,
   * reading order, table reconstruction) instead of trusting the OCR engine's
   * raster block order.
   *
   * DEFAULT OFF, deliberately. The analysis is covered by unit tests, but every
   * one of those tests feeds it synthetic geometry — it has not yet been run
   * against real Tesseract output on a real scan. Its thresholds (gutter width,
   * heading ratio, table cell gap) are therefore unvalidated, and a mis-tuned
   * threshold would make the common single-column case WORSE than the current
   * behaviour, not better. Flip this to `true` once it has been checked against
   * real documents; the legacy path stays until then.
   */
  const [enhanced, setEnhanced] = useState(false);

  const editedRef = useRef<Record<number, string>>({});
  const imagePngRef = useRef<ArrayBuffer | null>(null);

  const onFile = async (files: File[]) => {
    const f = files[0];
    reset();
    setFile(f);
    if (isPdf) {
      try {
        const pdfjs = await getPdfjs();
        const docp = await pdfjs.getDocument({ data: await f.arrayBuffer() }).promise;
        setPageCount(docp.numPages);
      } catch {
        setError("Could not read this PDF. It may be corrupted or encrypted.");
      }
    } else {
      setPageCount(1);
    }
  };

  function reset() {
    setFile(null);
    setPageCount(null);
    setResults([]);
    setError("");
    setStatusText("");
    setProcessing(false);
    setDone(false);
    setScanPreview(null);
    setElapsed(0);
    editedRef.current = {};
    imagePngRef.current = null;
  }

  const stats = (() => {
    let words = 0, tables = 0, headings = 0, confSum = 0;
    for (const r of results) {
      if (r.modelPage) {
        // Counted from the structured model, which knows about tables and
        // heading levels that the legacy DocNode list cannot express.
        const s = documentStats({
          metadata: {
            kind: "generic", kindConfidence: 0,
            languages: [lang], providerId: "tesseract",
          },
          pages: [r.modelPage],
        });
        words += s.words; tables += s.tables; headings += s.headings;
      } else {
        const s = docStats(r.doc);
        words += s.words; tables += s.tables; headings += s.headings;
      }
      confSum += r.confidence;
    }
    const avgConf = results.length ? Math.round(confSum / results.length) : 0;
    const speed = elapsed > 0 ? (results.length / (elapsed / 1000)).toFixed(2) : "0";
    return { words, tables, headings, avgConf, speed };
  })();

  const runOcr = async () => {
    if (!file || !pageCount) return;
    setProcessing(true); setDone(false); setError(""); setResults([]);
    const start = Date.now();
    let worker: Awaited<ReturnType<typeof import("tesseract.js").createWorker>> | null = null;
    try {
      const { createWorker } = await import("tesseract.js");
      setStatusText("Warming up the OCR engine…");
      worker = await createWorker(lang);
      const collected: PageResult[] = [];

      const recognisePage = async (canvas: HTMLCanvasElement, p: number) => {
        const preview = thumbnail(canvas);
        setScanPreview(preview);
        const { data } = await worker!.recognize(canvas, {}, { blocks: true });
        const blocks = (data.blocks as unknown as OcrBlock[]) ?? null;
        const doc = reconstruct(blocks, data.text);

        let html: string;
        let modelPage: ModelPage | undefined;
        if (enhanced) {
          const recognized = recognizedFromTesseractData(
            data, p - 1, canvas.width, canvas.height
          );
          modelPage = analyzePage(recognized);
          html = toHtml(
            {
              metadata: {
                kind: "generic", kindConfidence: 0,
                languages: [lang], providerId: "tesseract",
              },
              pages: [modelPage],
            },
            { markLowConfidence: true }
          );
        } else {
          html = docToHtml(doc, true);
        }

        const res: PageResult = {
          page: p, confidence: Math.round(data.confidence), doc, html, preview,
          words: flattenWords(blocks), cw: canvas.width, ch: canvas.height, modelPage,
        };
        editedRef.current[p] = html;
        collected.push(res);
        setResults([...collected]);
        setElapsed(Date.now() - start);
      };

      if (isPdf) {
        const pdfjs = await getPdfjs();
        const docp = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
        for (let p = 1; p <= pageCount; p++) {
          setStatusText(`Analyzing layout · page ${p} of ${pageCount}`);
          const page = await docp.getPage(p);
          await recognisePage(await renderPageToCanvas(page, 2), p);
        }
      } else {
        setStatusText("Analyzing layout · your image");
        const canvas = await imageToCanvas(file);
        imagePngRef.current = await (await canvasToBlob(canvas, "image/png")).arrayBuffer();
        await recognisePage(canvas, 1);
      }

      setScanPreview(null); setDone(true); setStatusText("Document reconstructed");
    } catch (e) {
      setError(e instanceof Error ? `OCR failed: ${e.message}` : "Something went wrong. Please try again.");
    } finally {
      if (worker) await worker.terminate();
      setProcessing(false);
    }
  };

  const baseName = file ? file.name.replace(/\.[^.]+$/, "") : "ocr";
  const stripMarks = (h: string) => h.replace(/<mark[^>]*>([\s\S]*?)<\/mark>/g, "$1");
  const pageBody = (r: PageResult) => stripMarks(editedRef.current[r.page] ?? r.html);
  const combinedBody = () => results.map((r) => `<section>${pageBody(r)}</section>`).join("\n<hr/>\n");

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(results.map((r) => htmlToPlainText(pageBody(r))).join("\n\n"));
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    } catch { setError("Copy failed — select and copy manually."); }
  };
  const exportTxt = () => downloadBlob(new Blob([results.map((r) => htmlToPlainText(pageBody(r))).join("\n\n")], { type: "text/plain;charset=utf-8" }), `${baseName}.txt`);
  const exportMd = () => downloadBlob(new Blob([results.map((r) => htmlToMarkdown(pageBody(r))).join("\n\n")], { type: "text/markdown;charset=utf-8" }), `${baseName}.md`);
  const exportHtml = () => downloadBlob(new Blob([fullHtmlDocument(combinedBody(), baseName)], { type: "text/html;charset=utf-8" }), `${baseName}.html`);
  const exportWord = () => downloadBlob(new Blob([wordDocument(combinedBody(), baseName)], { type: "application/msword" }), `${baseName}.doc`);

  const [building, setBuilding] = useState(false);
  const exportSearchable = async () => {
    if (!file || !results.length) return;
    setBuilding(true);
    try {
      const lib = await import("@/lib/searchablePdf");
      let blob: Blob;
      if (isPdf) {
        blob = await lib.searchablePdfFromOriginal(
          await file.arrayBuffer(),
          results.map((r) => ({ words: r.words, cw: r.cw, ch: r.ch }))
        );
      } else {
        const r = results[0];
        blob = await lib.searchablePdfFromImagePng(imagePngRef.current!, r.words, r.cw, r.ch);
      }
      downloadBlob(blob, `${baseName}-searchable.pdf`);
    } catch (e) {
      setError(e instanceof Error ? `Could not build searchable PDF: ${e.message}` : "Searchable PDF export failed.");
    } finally {
      setBuilding(false);
    }
  };

  const steps: { label: string; state: "done" | "active" | "idle" }[] = [
    { label: isPdf ? "File uploaded" : "Image uploaded", state: file ? "done" : "idle" },
    { label: isPdf ? "Pages detected" : "Image prepared", state: pageCount ? "done" : "idle" },
    { label: "Extracting & reconstructing", state: done ? "done" : processing ? "active" : "idle" },
    { label: "Ready to export", state: done ? "done" : "idle" },
  ];

  const accepted = isPdf
    ? { types: [".pdf", "application/pdf"], label: "a scanned or image-based PDF" }
    : { types: ["image/jpeg", "image/png", "image/webp"], label: "a JPG, PNG or WebP image" };

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="mb-5 flex items-start gap-3 rounded-xl border border-secondary/40 bg-secondary/10 p-4">
        <Lock className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
        <p className="text-sm text-text-primary">
          <span className="font-semibold text-secondary">100% Private — OCR runs entirely in your browser.</span>{" "}
          Your {isPdf ? "document" : "image"} is never uploaded to any server, and is discarded the moment you close the tab.
        </p>
      </div>

      {!file ? (
        <DropZone acceptedTypes={accepted.types} acceptedLabel={accepted.label} maxSizeMB={isPdf ? 100 : 50} onFilesAccepted={onFile} />
      ) : (
        <>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
            {isPdf ? <FileText className="h-5 w-5 shrink-0 text-text-muted" /> : <ImageIcon className="h-5 w-5 shrink-0 text-text-muted" />}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text-primary">{file.name}</p>
              <p className="text-xs text-text-muted">{isPdf && pageCount != null ? `${pageCount} pages · ` : ""}{formatBytes(file.size)}</p>
            </div>
          </div>

          {!processing && !done && (
            <div className="mt-4 rounded-xl border border-border bg-background p-4">
              <label htmlFor="ocr-language" className="font-mono text-xs uppercase tracking-widest text-text-muted">Document language</label>
              <select id="ocr-language" value={lang} onChange={(e) => setLang(e.target.value)} className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none">
                {LANGUAGES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
              <label className="mt-3 flex cursor-pointer items-start gap-2 text-sm text-text-muted">
                <input
                  type="checkbox"
                  checked={enhanced}
                  onChange={(e) => setEnhanced(e.target.checked)}
                  disabled={processing}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-primary"
                />
                <span>
                  <span className="font-medium text-text-primary">
                    Preserve layout
                  </span>{" "}
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-primary">
                    Beta
                  </span>{" "}
                  — detect columns, reading order and tables from the page
                  geometry rather than the engine&apos;s raw output. Best on
                  multi-column pages and documents with tables.
                </span>
              </label>
            </div>
          )}

          <ErrorMessage message={error} onRetry={error ? runOcr : undefined} />

          {(processing || done) && (
            <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
              <div className="rounded-xl border border-border bg-background p-4">
                <p className="font-mono text-xs uppercase tracking-widest text-text-muted">Pipeline</p>
                <ul className="mt-3 space-y-2.5">
                  {steps.map((s) => (
                    <li key={s.label} className="flex items-center gap-2.5 text-sm">
                      {s.state === "done" ? <CheckCircle2 className="h-4 w-4 text-secondary" />
                        : s.state === "active" ? <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        : <span className="h-4 w-4 rounded-full border border-border" />}
                      <span className={s.state === "idle" ? "text-text-muted" : "text-text-primary"}>{s.label}</span>
                    </li>
                  ))}
                </ul>
                {statusText && <p className="mt-3 text-xs text-text-muted">{statusText}</p>}
                {scanPreview && (
                  <div className="relative mt-3 overflow-hidden rounded-lg border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={scanPreview} alt="Scanning page" className="block w-full opacity-90" />
                    <span className="ocr-scan-line" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Stat icon={isPdf ? FileText : ImageIcon} label={isPdf ? "Pages" : "Image"} value={isPdf ? `${results.length}/${pageCount}` : (results.length ? "Done" : "…")} />
                <Stat icon={Type} label="Words" value={stats.words.toLocaleString()} />
                <Stat icon={Gauge} label="Confidence" value={`${stats.avgConf}%`} />
                <Stat icon={Table2} label="Tables" value={stats.tables} />
                <Stat icon={Hash} label="Headings" value={stats.headings} />
                <Stat icon={ScanText} label="Speed" value={`${stats.speed} p/s`} />
              </div>
            </div>
          )}

          {done && (
            <p className="mt-5 flex animate-fade-in items-start gap-1.5 text-[15px] font-medium text-secondary">
              <Check className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden="true" />
              <span>
                {isPdf ? `${results.length} page${results.length > 1 ? "s" : ""} reconstructed` : "Image reconstructed"} · {stats.words.toLocaleString()} words
                {stats.tables > 0 ? ` · ${stats.tables} table${stats.tables > 1 ? "s" : ""} recovered` : ""} · {stats.avgConf}% confidence
              </span>
            </p>
          )}

          {results.length > 0 && (
            <div className="mt-4 space-y-4">
              {results.map((r) => (
                <div key={r.page} className="animate-fade-in rounded-xl border border-border bg-background p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-widest text-text-muted">{isPdf ? `Page ${r.page}` : "Result"}</span>
                    <span className={`text-xs font-medium ${r.confidence >= 80 ? "text-secondary" : r.confidence >= 60 ? "text-orange-500" : "text-red-500"}`}>{r.confidence}% confidence</span>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <p className="mb-1.5 text-[11px] uppercase tracking-wider text-text-muted">Original</p>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={r.preview} alt="Original" className="w-full rounded-lg border border-border" />
                    </div>
                    <div>
                      <p className="mb-1.5 text-[11px] uppercase tracking-wider text-text-muted">Editable result · click to fix</p>
                      <div
                        className="ocr-output max-h-[60vh] overflow-y-auto rounded-lg border border-border bg-surface p-3 text-sm text-text-primary"
                        contentEditable suppressContentEditableWarning spellCheck
                        onInput={(e) => { editedRef.current[r.page] = e.currentTarget.innerHTML; }}
                        dangerouslySetInnerHTML={{ __html: r.html || "<p>(no text detected)</p>" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {done && results.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <Button variant="success" icon={copied ? Check : Copy} onClick={copyText}>{copied ? "Copied!" : "Copy text"}</Button>
              <Button variant="primary" icon={FileSearch} loading={building} onClick={exportSearchable}>Searchable PDF</Button>
              <Button variant="outline" icon={FileType2} onClick={exportWord}>Word (.doc)</Button>
              <Button variant="outline" icon={Code2} onClick={exportHtml}>.html</Button>
              <Button variant="outline" icon={FileCode} onClick={exportMd}>.md</Button>
              <Button variant="outline" icon={Download} onClick={exportTxt}>.txt</Button>
              <Button variant="ghost" icon={RotateCcw} onClick={reset}>New file</Button>
            </div>
          )}

          {!processing && !done && (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button size="lg" icon={ScanText} onClick={runOcr} disabled={!pageCount}>Reconstruct {isPdf ? "document" : "image"}</Button>
              <Button variant="ghost" icon={RotateCcw} onClick={reset}>Start over</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
