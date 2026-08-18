/**
 * Pipeline orchestration: raster pages in, DocumentModel out.
 *
 * The behaviour that matters most here is per-page isolation. The previous
 * implementation wrapped its whole page loop in a single try/catch, so one bad
 * page aborted the entire run — a 100-page scan with a corrupt page 7 returned
 * nothing at all. Section 24 of the brief calls that out explicitly. Here every
 * page is attempted independently and a failure becomes a `failedPage` entry in
 * the model, so the other 99 pages still come back and the UI can offer a retry
 * for just the one.
 */

import { analyzePage, type LayoutOptions } from "./layout";
import { buildDocument } from "./document";
import { OcrPageError, type OCRProvider, type RecognizedPage } from "./provider";
import type { TableOptions } from "./table";
import { preprocessCanvas } from "./preprocessCanvas";
import { failedPage, type DocumentModel, type Page } from "./types";

/** Coarse stage names, so the UI can show what is happening rather than a bare %. */
export type PipelineStage =
  | "preparing"
  | "preprocessing"
  | "recognizing"
  | "analyzing"
  | "assembling"
  | "done";

export interface PipelineProgress {
  stage: PipelineStage;
  /** Overall completion, 0..1. */
  fraction: number;
  /** 0-based page currently being worked on, when applicable. */
  pageIndex?: number;
  totalPages?: number;
  note?: string;
}

export type ProgressListener = (p: PipelineProgress) => void;

/** A page raster the pipeline should process. */
export interface PageSource {
  index: number;
  /** Produces the raster lazily, so a 100-page PDF is not all in memory. */
  render: () => Promise<HTMLCanvasElement>;
  /**
   * Pre-extracted native text, when the source already had a real text layer.
   * When present the page skips OCR entirely — faster and exact.
   */
  native?: RecognizedPage;
}

export interface PipelineOptions {
  provider: OCRProvider;
  languages: string[];
  fileName?: string;
  layout?: Partial<LayoutOptions>;
  table?: Partial<TableOptions>;
  signal?: AbortSignal;
  /**
   * Clean each page before recognition (deskew, contrast, denoise).
   *
   * Off by default. Measured on a real degraded scan: a mildly skewed page
   * gains nothing meaningful (0.979 -> 0.983, inside noise), but a page with
   * crushed contrast and speckle goes from Tesseract returning an EMPTY string
   * to a clean read. So it is worth having and not worth paying for on every
   * page — the caller decides, and the analysis is cheap enough to run first.
   */
  preprocess?: boolean;
  onProgress?: ProgressListener;
  /** Called as each page finishes, so the UI can stream results. */
  onPage?: (page: Page) => void;
}

/** Convert one recognized page into an analyzed page. */
export function analyzeRecognized(
  recognized: RecognizedPage,
  layout?: Partial<LayoutOptions>,
  table?: Partial<TableOptions>
): Page {
  return analyzePage(recognized, layout, table);
}

/**
 * Run the full pipeline over a set of page sources.
 *
 * Pages are processed sequentially. That is deliberate for now: Tesseract holds
 * one worker with one loaded language model, and parallelising against a single
 * worker just queues internally while multiplying peak memory. A worker pool is
 * a Phase 12 concern and the interface here already returns pages individually
 * so it can change without touching callers.
 */
export async function runPipeline(
  sources: PageSource[],
  opts: PipelineOptions
): Promise<DocumentModel> {
  const { provider, languages, signal, onProgress, onPage } = opts;
  const started = Date.now();
  const total = sources.length;
  const pages: Page[] = [];

  const report = (stage: PipelineStage, fraction: number, extra: Partial<PipelineProgress> = {}) =>
    onProgress?.({ stage, fraction, totalPages: total, ...extra });

  report("preparing", 0, { note: "Loading the recognition engine" });
  await provider.init(languages, (f, note) => report("preparing", f * 0.05, { note }));

  for (let i = 0; i < sources.length; i++) {
    const source = sources[i];
    if (signal?.aborted) break;

    // Base fraction: 5% for init, the remaining 95% spread across pages.
    const base = 0.05 + (i / Math.max(1, total)) * 0.95;
    const span = 0.95 / Math.max(1, total);

    try {
      let recognized: RecognizedPage;
      // Rotation applied by preprocessing, recorded on the page so the UI can
      // explain why the output no longer matches the original orientation.
      let appliedRotation = 0;

      if (source.native) {
        // A real text layer already exists — do not re-OCR it. Doing so is
        // both slower and strictly lossier than reading what is there.
        report("recognizing", base, {
          pageIndex: source.index,
          note: "Reading the existing text layer",
        });
        recognized = source.native;
      } else {
        let canvas = await source.render();
        let deskewedBy = 0;

        if (opts.preprocess) {
          report("preprocessing", base, {
            pageIndex: source.index,
            note: "Cleaning up the scan",
          });
          const cleaned = preprocessCanvas(canvas);
          canvas = cleaned.canvas;
          deskewedBy = cleaned.plan.ops.includes("deskew") ? cleaned.plan.deskewAngle : 0;
        }

        report("recognizing", base, { pageIndex: source.index, note: "Recognizing text" });
        recognized = await provider.recognize(
          { image: canvas, pageIndex: source.index, languages, signal },
          (f) => report("recognizing", base + f * span * 0.7, { pageIndex: source.index })
        );
        appliedRotation = deskewedBy;
      }

      report("analyzing", base + span * 0.8, {
        pageIndex: source.index,
        note: "Analyzing layout",
      });
      const page = analyzeRecognized(recognized, opts.layout, opts.table);
      if (source.native) page.source = "native";
      if (appliedRotation) page.rotation = appliedRotation;

      pages.push(page);
      onPage?.(page);
    } catch (err) {
      // Isolation: record the failure and keep going.
      const message =
        err instanceof OcrPageError || err instanceof Error
          ? err.message
          : "Unknown error";
      const failed = failedPage(source.index, 0, 0, message);
      pages.push(failed);
      onPage?.(failed);
    }
  }

  report("assembling", 0.98, { note: "Assembling document" });
  const doc = buildDocument({
    pages,
    providerId: provider.id,
    languages,
    fileName: opts.fileName,
    processingMs: Date.now() - started,
  });

  report("done", 1, { note: "Complete" });
  return doc;
}

/**
 * Retry a single page and splice the result into an existing document.
 * Returns a new model; the input is not mutated.
 */
export async function retryPage(
  doc: DocumentModel,
  source: PageSource,
  opts: PipelineOptions
): Promise<DocumentModel> {
  const { provider, languages, signal } = opts;
  await provider.init(languages);

  let replacement: Page;
  try {
    const canvas = await source.render();
    const recognized = await provider.recognize({
      image: canvas,
      pageIndex: source.index,
      languages,
      signal,
    });
    replacement = analyzeRecognized(recognized, opts.layout, opts.table);
  } catch (err) {
    replacement = failedPage(
      source.index,
      0,
      0,
      err instanceof Error ? err.message : "Unknown error"
    );
  }

  const pages = doc.pages.map((p) => (p.index === source.index ? replacement : p));
  return { ...doc, pages };
}
