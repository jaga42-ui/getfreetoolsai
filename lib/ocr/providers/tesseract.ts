/**
 * Tesseract.js provider adapter.
 *
 * This is the ONLY file in the codebase permitted to know Tesseract's data
 * shapes. Its entire responsibility is translating them into the normalized
 * model. If a second engine is added, it implements the same interface and
 * nothing downstream changes.
 *
 * Note what this deliberately does NOT do: it does not classify headings,
 * order blocks, or detect tables, even though Tesseract exposes a block tree
 * that tempts you to. Tesseract emits blocks in raster order, not reading
 * order, so trusting that tree is exactly the bug that made two-column
 * documents interleave. The tree is passed along as an advisory `hint` and
 * layout analysis decides.
 */

import {
  createIdFactory,
  meanWordConfidence,
  unionBox,
  type BBox,
  type Line,
  type Word,
} from "../types";
import {
  registerProvider,
  OcrPageError,
  type LanguageOption,
  type OCRProvider,
  type ProgressFn,
  type RecognizeInput,
  type RecognizedPage,
} from "../provider";

/* ---- Tesseract's shapes, declared locally so its types stay contained ---- */

interface TessBox {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}
interface TessWord {
  text: string;
  confidence: number;
  bbox: TessBox;
}
interface TessLine {
  text: string;
  bbox: TessBox;
  words?: TessWord[];
  baseline?: { y0?: number; y1?: number };
}
interface TessPara {
  bbox: TessBox;
  lines?: TessLine[];
}
interface TessBlock {
  bbox: TessBox;
  paragraphs?: TessPara[];
}

type TesseractWorker = {
  recognize: (
    image: unknown,
    options: Record<string, unknown>,
    output: Record<string, unknown>
  ) => Promise<{ data: { text: string; confidence: number; blocks?: unknown } }>;
  terminate: () => Promise<void>;
};

/**
 * Languages with a Tesseract traineddata model we actually load.
 *
 * Eight of the thirteen are Indian languages (Hindi, Bengali, Odia, Tamil,
 * Telugu, Marathi, Gujarati, Punjabi). That is not incidental — it is the
 * site's strongest differentiator for its actual audience, so the list is
 * exported for the UI rather than duplicated in a component.
 */
export const TESSERACT_LANGUAGES: LanguageOption[] = [
  { code: "eng", label: "English", script: "Latin" },
  { code: "hin", label: "Hindi", script: "Devanagari" },
  { code: "ben", label: "Bengali", script: "Bengali" },
  { code: "ori", label: "Odia", script: "Odia" },
  { code: "tam", label: "Tamil", script: "Tamil" },
  { code: "tel", label: "Telugu", script: "Telugu" },
  { code: "mar", label: "Marathi", script: "Devanagari" },
  { code: "guj", label: "Gujarati", script: "Gujarati" },
  { code: "pan", label: "Punjabi", script: "Gurmukhi" },
  { code: "ara", label: "Arabic", script: "Arabic" },
  { code: "fra", label: "French", script: "Latin" },
  { code: "spa", label: "Spanish", script: "Latin" },
  { code: "deu", label: "German", script: "Latin" },
];

const toBBox = (b: TessBox): BBox => ({ x0: b.x0, y0: b.y0, x1: b.x1, y1: b.y1 });

/**
 * Convert Tesseract's nested block tree into a flat list of normalized lines.
 *
 * Exported for unit testing: this mapping is the highest-risk part of the
 * adapter and must be verifiable without spinning up a real OCR worker.
 */
export function linesFromTesseractBlocks(blocks: TessBlock[] | null | undefined): {
  lines: Line[];
  regions: { bbox: BBox }[];
} {
  const nextLineId = createIdFactory("l");
  const nextWordId = createIdFactory("w");
  const lines: Line[] = [];
  const regions: { bbox: BBox }[] = [];

  for (const block of blocks ?? []) {
    if (block?.bbox) regions.push({ bbox: toBBox(block.bbox) });
    for (const para of block?.paragraphs ?? []) {
      for (const tline of para?.lines ?? []) {
        const words: Word[] = [];
        for (const tword of tline?.words ?? []) {
          // Tesseract emits whitespace-only words for inter-word gaps; they
          // carry no text and would skew confidence averages downward.
          if (!tword?.text || !tword.text.trim()) continue;
          words.push({
            id: nextWordId(),
            text: tword.text,
            bbox: toBBox(tword.bbox),
            // Clamp: the engine very occasionally reports slightly out-of-range
            // values, and downstream scoring assumes 0..100.
            confidence: Math.max(0, Math.min(100, tword.confidence ?? 0)),
            style: {
              fontSizePx: Math.max(0, tword.bbox.y1 - tword.bbox.y0),
              // Weight/slant are NOT inferable from a bbox. Left undefined
              // rather than guessed — style estimation is Phase 8 and will
              // sample the raster.
            },
          });
        }
        if (!words.length) continue;

        // Prefer the union of word boxes over the engine's line box: the line
        // box sometimes includes trailing whitespace runs, which distorts
        // column clustering downstream.
        const bbox = unionBox(words.map((w) => w.bbox)) ?? toBBox(tline.bbox);
        lines.push({
          id: nextLineId(),
          words,
          bbox,
          baseline: tline?.baseline?.y1,
        });
      }
    }
  }

  return { lines, regions };
}

/**
 * Fallback when the engine returns no structured blocks (very low-quality
 * scans, or an engine build without the block output enabled).
 *
 * Produces one synthetic line per text line with NO geometry, flagged at zero
 * confidence width so layout analysis can tell these apart from real
 * measurements and skip spatial reasoning rather than acting on fake boxes.
 */
export function linesFromPlainText(text: string, pageWidth: number): Line[] {
  const nextLineId = createIdFactory("fl");
  const nextWordId = createIdFactory("fw");
  return text
    .split("\n")
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t, i) => {
      const bbox: BBox = { x0: 0, y0: i * 20, x1: pageWidth, y1: i * 20 + 18 };
      return {
        id: nextLineId(),
        bbox,
        words: [{ id: nextWordId(), text: t, bbox, confidence: 0 }],
      };
    });
}

/**
 * Adapt a raw `worker.recognize()` result into a `RecognizedPage`.
 *
 * Exported so a caller that already owns a Tesseract worker (the existing
 * OcrStudio component does) can feed the new analysis pipeline without being
 * restructured around the provider interface first. Keeping this here means
 * Tesseract's shapes still do not escape this file.
 */
export function recognizedFromTesseractData(
  data: { text?: string; confidence?: number; blocks?: unknown },
  pageIndex: number,
  width: number,
  height: number
): RecognizedPage {
  const { lines, regions } = linesFromTesseractBlocks(data.blocks as TessBlock[] | undefined);
  const finalLines = lines.length ? lines : linesFromPlainText(data.text ?? "", width);
  const allWords = finalLines.flatMap((l) => l.words);
  return {
    pageIndex,
    width,
    height,
    lines: finalLines,
    confidence: allWords.length
      ? meanWordConfidence(allWords)
      : Math.max(0, Math.min(100, data.confidence ?? 0)),
    hints: { regions },
  };
}

class TesseractProvider implements OCRProvider {
  readonly id = "tesseract";
  readonly displayName = "Tesseract (in your browser)";
  readonly runsLocally = true;

  private worker: TesseractWorker | null = null;
  private loadedLanguages = "";

  languages(): LanguageOption[] {
    return TESSERACT_LANGUAGES;
  }

  async init(languages: string[], onProgress?: ProgressFn): Promise<void> {
    const key = languages.join("+");
    if (this.worker && this.loadedLanguages === key) return;
    // Language set changed — the old worker holds the wrong traineddata.
    if (this.worker) await this.terminate();

    onProgress?.(0, "Loading the recognition engine");
    const { createWorker } = await import("tesseract.js");
    this.worker = (await createWorker(key)) as unknown as TesseractWorker;
    this.loadedLanguages = key;
    onProgress?.(1, "Engine ready");
  }

  async recognize(input: RecognizeInput, onProgress?: ProgressFn): Promise<RecognizedPage> {
    const { image, pageIndex, languages, signal } = input;
    if (signal?.aborted) throw new OcrPageError(pageIndex, "Cancelled before start.");

    await this.init(languages, onProgress);
    if (!this.worker) throw new OcrPageError(pageIndex, "OCR engine failed to start.");

    const width = "width" in image ? image.width : 0;
    const height = "height" in image ? image.height : 0;

    try {
      onProgress?.(0.1, "Recognizing text");
      const { data } = await this.worker.recognize(image, {}, { blocks: true });
      if (signal?.aborted) throw new OcrPageError(pageIndex, "Cancelled.");

      const { lines, regions } = linesFromTesseractBlocks(data.blocks as TessBlock[] | undefined);
      // Structured output missing → degrade to text-only rather than failing
      // the page outright.
      const finalLines = lines.length ? lines : linesFromPlainText(data.text ?? "", width);

      const allWords = finalLines.flatMap((l) => l.words);
      onProgress?.(1, "Recognized");

      return {
        pageIndex,
        width,
        height,
        lines: finalLines,
        // Prefer measured word confidence over the engine's page number: it is
        // the same quantity computed consistently across providers.
        confidence: allWords.length
          ? meanWordConfidence(allWords)
          : Math.max(0, Math.min(100, data.confidence ?? 0)),
        hints: { regions },
      };
    } catch (err) {
      if (err instanceof OcrPageError) throw err;
      throw new OcrPageError(
        pageIndex,
        err instanceof Error ? err.message : "Recognition failed.",
        { cause: err }
      );
    }
  }

  async terminate(): Promise<void> {
    const w = this.worker;
    this.worker = null;
    this.loadedLanguages = "";
    if (w) {
      try {
        await w.terminate();
      } catch {
        /* worker already gone — nothing to release */
      }
    }
  }
}

registerProvider("tesseract", () => new TesseractProvider());

export { TesseractProvider };
