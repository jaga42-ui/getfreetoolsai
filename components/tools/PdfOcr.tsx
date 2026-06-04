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
} from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { Button, ErrorMessage } from "@/components/ui";
import { formatBytes, downloadBlob } from "@/lib/utils";
import { getPdfjs, renderPageToCanvas } from "@/lib/pdfjs";
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
};

function thumbnail(src: HTMLCanvasElement): string {
  const maxW = 520;
  const scale = Math.min(1, maxW / src.width);
  const c = document.createElement("canvas");
  c.width = Math.round(src.width * scale);
  c.height = Math.round(src.height * scale);
  c.getContext("2d")!.drawImage(src, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", 0.7);
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

export default function PdfOcr() {
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

  const editedRef = useRef<Record<number, string>>({});

  const onFile = async (files: File[]) => {
    const f = files[0];
    reset();
    setFile(f);
    try {
      const pdfjs = await getPdfjs();
      const docp = await pdfjs.getDocument({ data: await f.arrayBuffer() }).promise;
      setPageCount(docp.numPages);
    } catch {
      setError("Could not read this PDF. It may be corrupted or encrypted.");
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
  }

  const stats = (() => {
    let words = 0, tables = 0, headings = 0, confSum = 0;
    for (const r of results) {
      const s = docStats(r.doc);
      words += s.words; tables += s.tables; headings += s.headings; confSum += r.confidence;
    }
    const avgConf = results.length ? Math.round(confSum / results.length) : 0;
    const speed = elapsed > 0 ? (results.length / (elapsed / 1000)).toFixed(2) : "0";
    return { words, tables, headings, avgConf, speed };
  })();

  const runOcr = async () => {
    if (!file || !pageCount) return;
    setProcessing(true);
    setDone(false);
    setError(""); setResults([]);
    const start = Date.now();
    let worker: Awaited<ReturnType<typeof import("tesseract.js").createWorker>> | null = null;
    try {
      const pdfjs = await getPdfjs();
      const { createWorker } = await import("tesseract.js");
      setStatusText("Warming up the OCR engine…");
      worker = await createWorker(lang);

      const docp = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
      const collected: PageResult[] = [];

      for (let p = 1; p <= pageCount; p++) {
        setStatusText(`Analyzing layout · page ${p} of ${pageCount}`);
        const page = await docp.getPage(p);
        const canvas = await renderPageToCanvas(page, 2);
        const preview = thumbnail(canvas);
        setScanPreview(preview);

        const { data } = await worker.recognize(canvas, {}, { blocks: true });
        const blocks = (data.blocks as unknown as OcrBlock[]) ?? null;
        const doc = reconstruct(blocks, data.text);
        const html = docToHtml(doc, true);
        const res: PageResult = { page: p, confidence: Math.round(data.confidence), doc, html, preview };
        editedRef.current[p] = html;
        collected.push(res);
        setResults([...collected]);
        setElapsed(Date.now() - start);
      }
      setScanPreview(null);
      setDone(true);
      setStatusText("Document reconstructed");
    } catch (e) {
      setError(e instanceof Error ? `OCR failed: ${e.message}` : "Something went wrong. Please try again.");
    } finally {
      if (worker) await worker.terminate();
      setProcessing(false);
    }
  };

  const baseName = file ? file.name.replace(/\.pdf$/i, "") : "ocr";
  const stripMarks = (h: string) => h.replace(/<mark[^>]*>([\s\S]*?)<\/mark>/g, "$1");
  const pageBody = (r: PageResult) => stripMarks(editedRef.current[r.page] ?? r.html);
  const combinedBody = () => results.map((r) => `<section>${pageBody(r)}</section>`).join("\n<hr/>\n");

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(results.map((r) => htmlToPlainText(pageBody(r))).join("\n\n"));
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    } catch { setError("Copy failed — select and copy manually."); }
  };
  const exportTxt = () =>
    downloadBlob(new Blob([results.map((r) => htmlToPlainText(pageBody(r))).join("\n\n")], { type: "text/plain;charset=utf-8" }), `${baseName}.txt`);
  const exportMd = () =>
    downloadBlob(new Blob([results.map((r) => htmlToMarkdown(pageBody(r))).join("\n\n")], { type: "text/markdown;charset=utf-8" }), `${baseName}.md`);
  const exportHtml = () =>
    downloadBlob(new Blob([fullHtmlDocument(combinedBody(), baseName)], { type: "text/html;charset=utf-8" }), `${baseName}.html`);
  const exportWord = () =>
    downloadBlob(new Blob([wordDocument(combinedBody(), baseName)], { type: "application/msword" }), `${baseName}.doc`);

  const steps: { label: string; state: "done" | "active" | "idle" }[] = [
    { label: "File uploaded", state: file ? "done" : "idle" },
    { label: "Pages detected", state: pageCount ? "done" : "idle" },
    { label: "Extracting & reconstructing", state: done ? "done" : processing ? "active" : "idle" },
    { label: "Ready to export", state: done ? "done" : "idle" },
  ];

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="mb-5 flex items-start gap-3 rounded-xl border border-secondary/40 bg-secondary/10 p-4">
        <Lock className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
        <p className="text-sm text-text-primary">
          <span className="font-semibold text-secondary">100% Private — OCR runs entirely in your browser.</span>{" "}
          Your document is never uploaded to any server, and is discarded the moment you close the tab.
        </p>
      </div>

      {!file ? (
        <DropZone acceptedTypes={[".pdf", "application/pdf"]} acceptedLabel="a scanned or image-based PDF" maxSizeMB={100} onFilesAccepted={onFile} />
      ) : (
        <>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
            <FileText className="h-5 w-5 shrink-0 text-text-muted" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text-primary">{file.name}</p>
              <p className="text-xs text-text-muted">{pageCount != null ? `${pageCount} pages · ` : ""}{formatBytes(file.size)}</p>
            </div>
          </div>

          {!processing && !done && (
            <div className="mt-4 rounded-xl border border-border bg-background p-4">
              <label className="font-mono text-xs uppercase tracking-widest text-text-muted">Document language</label>
              <select value={lang} onChange={(e) => setLang(e.target.value)} className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none">
                {LANGUAGES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
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
                <Stat icon={FileText} label="Pages" value={`${results.length}/${pageCount}`} />
                <Stat icon={Type} label="Words" value={stats.words.toLocaleString()} />
                <Stat icon={Gauge} label="Confidence" value={`${stats.avgConf}%`} />
                <Stat icon={Table2} label="Tables" value={stats.tables} />
                <Stat icon={Hash} label="Headings" value={stats.headings} />
                <Stat icon={ScanText} label="Speed" value={`${stats.speed} p/s`} />
              </div>
            </div>
          )}

          {done && (
            <p className="mt-5 text-[15px] font-medium text-secondary">
              ✓ {results.length} page{results.length > 1 ? "s" : ""} reconstructed · {stats.words.toLocaleString()} words
              {stats.tables > 0 ? ` · ${stats.tables} table${stats.tables > 1 ? "s" : ""} recovered` : ""} · {stats.avgConf}% confidence
            </p>
          )}

          {results.length > 0 && (
            <div className="mt-4 space-y-4">
              {results.map((r) => (
                <div key={r.page} className="rounded-xl border border-border bg-background p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-widest text-text-muted">Page {r.page}</span>
                    <span className={`text-xs font-medium ${r.confidence >= 80 ? "text-secondary" : r.confidence >= 60 ? "text-orange-500" : "text-red-500"}`}>{r.confidence}% confidence</span>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <p className="mb-1.5 text-[11px] uppercase tracking-wider text-text-muted">Original</p>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={r.preview} alt={`Page ${r.page} original`} className="w-full rounded-lg border border-border" />
                    </div>
                    <div>
                      <p className="mb-1.5 text-[11px] uppercase tracking-wider text-text-muted">Editable result · click to fix</p>
                      <div
                        className="ocr-output max-h-[60vh] overflow-y-auto rounded-lg border border-border bg-surface p-3 text-sm text-text-primary"
                        contentEditable
                        suppressContentEditableWarning
                        spellCheck
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
              <Button variant="outline" icon={Download} onClick={exportTxt}>.txt</Button>
              <Button variant="outline" icon={FileCode} onClick={exportMd}>.md</Button>
              <Button variant="outline" icon={Code2} onClick={exportHtml}>.html</Button>
              <Button variant="outline" icon={FileType2} onClick={exportWord}>Word (.doc)</Button>
              <Button variant="ghost" icon={RotateCcw} onClick={reset}>New file</Button>
            </div>
          )}

          {!processing && !done && (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button size="lg" icon={ScanText} onClick={runOcr} disabled={!pageCount}>Reconstruct document</Button>
              <Button variant="ghost" icon={RotateCcw} onClick={reset}>Start over</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
