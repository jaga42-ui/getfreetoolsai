/**
 * The normalized document model.
 *
 * Everything downstream of an OCR engine — layout analysis, reading order,
 * table reconstruction, the editor, every exporter — reads and writes THIS
 * shape and nothing else. No Tesseract type, no pdf.js type, and no future
 * cloud-provider type may appear beyond the provider adapter that produces it.
 *
 * That boundary is the whole point. The previous implementation passed
 * Tesseract's own `blocks` array directly into reconstruction, so the engine's
 * data shape (and its quirks, like emitting blocks in raster order rather than
 * reading order) leaked into every consumer and made the engine impossible to
 * swap.
 *
 * Coordinate convention: pixels in *page analysis space*, origin top-left,
 * y increasing downward — matching canvas and every raster OCR engine. PDF's
 * bottom-left origin conversion happens only in the PDF exporters.
 */

/** Axis-aligned box in page analysis space (top-left origin, y down). */
export interface BBox {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export const boxWidth = (b: BBox) => b.x1 - b.x0;
export const boxHeight = (b: BBox) => b.y1 - b.y0;
export const boxArea = (b: BBox) => Math.max(0, boxWidth(b)) * Math.max(0, boxHeight(b));
export const boxCenterX = (b: BBox) => (b.x0 + b.x1) / 2;
export const boxCenterY = (b: BBox) => (b.y0 + b.y1) / 2;

/** Smallest box containing all inputs. Returns null for an empty list. */
export function unionBox(boxes: BBox[]): BBox | null {
  if (!boxes.length) return null;
  let { x0, y0, x1, y1 } = boxes[0];
  for (let i = 1; i < boxes.length; i++) {
    const b = boxes[i];
    if (b.x0 < x0) x0 = b.x0;
    if (b.y0 < y0) y0 = b.y0;
    if (b.x1 > x1) x1 = b.x1;
    if (b.y1 > y1) y1 = b.y1;
  }
  return { x0, y0, x1, y1 };
}

/** Fraction of the *vertical* extent shared by two boxes (0..1). */
export function verticalOverlap(a: BBox, b: BBox): number {
  const top = Math.max(a.y0, b.y0);
  const bottom = Math.min(a.y1, b.y1);
  const shared = bottom - top;
  if (shared <= 0) return 0;
  return shared / Math.min(boxHeight(a), boxHeight(b));
}

/** Fraction of the *horizontal* extent shared by two boxes (0..1). */
export function horizontalOverlap(a: BBox, b: BBox): number {
  const left = Math.max(a.x0, b.x0);
  const right = Math.min(a.x1, b.x1);
  const shared = right - left;
  if (shared <= 0) return 0;
  return shared / Math.min(boxWidth(a), boxWidth(b));
}

/**
 * Estimated text style.
 *
 * Every field is optional and the whole struct carries its own `confidence`,
 * because a raster OCR engine does not know the original font — it can only
 * infer from glyph geometry. Exporters must degrade gracefully when a field is
 * absent rather than inventing a default that looks authoritative.
 */
export interface TextStyle {
  /** Estimated rendered size in page pixels (not points). */
  fontSizePx?: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  /** CSS colour, when it can be sampled from the source raster. */
  color?: string;
  /** Category only — the exact family is not recoverable from a raster. */
  fontFamily?: "serif" | "sans" | "mono" | "unknown";
  align?: "left" | "center" | "right" | "justify";
  /** Confidence in this *style estimate*, 0..1. Distinct from OCR confidence. */
  confidence?: number;
}

/** A single recognized word — the atom that carries OCR confidence. */
export interface Word {
  id: string;
  text: string;
  bbox: BBox;
  /** 0..100, normalized across providers. */
  confidence: number;
  style?: TextStyle;
}

export interface Line {
  id: string;
  words: Word[];
  bbox: BBox;
  style?: TextStyle;
  /** y of the text baseline when the provider reports one. */
  baseline?: number;
}

/**
 * What a region of the page *is*. Assigned by layout analysis, never by the
 * OCR engine — engines report geometry and glyphs, not document semantics.
 */
export type BlockType =
  | "paragraph"
  | "heading"
  | "list"
  | "table"
  | "figure"
  | "caption"
  | "header"
  | "footer"
  | "pageNumber"
  | "signature"
  | "formField"
  | "equation"
  | "separator"
  | "unknown";

/** One cell of a reconstructed table. */
export interface TableCell {
  id: string;
  text: string;
  bbox: BBox;
  rowSpan: number;
  colSpan: number;
  isHeader: boolean;
}

export interface TableStructure {
  rows: TableCell[][];
  /** 0..1. Below the caller's threshold the table should be offered for
   *  manual confirmation rather than silently trusted. */
  confidence: number;
  hasHeaderRow: boolean;
}

export interface Block {
  id: string;
  type: BlockType;
  bbox: BBox;
  lines: Line[];
  /** Mean OCR confidence of contained words, 0..100. */
  confidence: number;
  /** Confidence in the *type* classification, 0..1. */
  typeConfidence: number;
  /** Position in the resolved reading order within the page. */
  readingOrder: number;
  /** Column this block belongs to (0-based, left to right). */
  columnIndex?: number;
  /** Heading depth, 1..6. Only meaningful when type === "heading". */
  level?: number;
  /** Present only when type === "table". */
  table?: TableStructure;
  style?: TextStyle;
}

/** A non-text region preserved as an image (photo, logo, signature, stamp). */
export interface PageImage {
  id: string;
  bbox: BBox;
  kind: "figure" | "logo" | "signature" | "stamp" | "unknown";
  /** Cropped raster, when extracted. Omitted until the crop is materialized. */
  dataUrl?: string;
}

export type PageStatus = "ok" | "failed" | "blank";

export interface Page {
  /** 0-based. */
  index: number;
  /** Analysis-space dimensions in pixels. */
  width: number;
  height: number;
  /** Detected rotation applied during preprocessing, in degrees. */
  rotation: number;
  blocks: Block[];
  images: PageImage[];
  /**
   * Where the content came from. "native" means a real PDF text layer was
   * reused and no OCR ran — which is both faster and exact, so it must be
   * distinguishable from OCR output in the UI and in the quality score.
   */
  source: "ocr" | "native" | "mixed";
  status: PageStatus;
  /** Populated when status === "failed", so one bad page never kills a run. */
  error?: string;
}

export type DocumentKind =
  | "invoice"
  | "receipt"
  | "resume"
  | "certificate"
  | "academicPaper"
  | "form"
  | "book"
  | "report"
  | "letter"
  | "idDocument"
  | "presentation"
  | "generic";

export interface DocumentMetadata {
  /** Original filename, when known. */
  fileName?: string;
  /** Detected document type plus how sure we are (0..1). */
  kind: DocumentKind;
  kindConfidence: number;
  /** BCP-47-ish language tag(s) the OCR ran with. */
  languages: string[];
  /** Which provider produced this, e.g. "tesseract". */
  providerId: string;
  /** Wall-clock processing time in ms. */
  processingMs?: number;
}

export interface DocumentModel {
  metadata: DocumentMetadata;
  pages: Page[];
}

/* ------------------------------------------------------------------ */
/* Derived metrics                                                      */
/* ------------------------------------------------------------------ */

/**
 * Quality score derived from real internal metrics — never invented.
 *
 * Each component is null when nothing was measured (e.g. `tableDetection` on a
 * document with no tables), so the UI can omit it instead of showing a
 * meaningless 100%.
 */
export interface QualityScore {
  /** Mean word confidence across the document, 0..100. */
  ocrConfidence: number | null;
  /** Mean block type-classification confidence, 0..100. */
  layoutConfidence: number | null;
  /** Mean table-structure confidence, 0..100. */
  tableDetection: number | null;
  /** Weighted overall, 0..100. */
  overall: number | null;
  /** Pages that failed, for honest reporting alongside the score. */
  failedPages: number[];
}

/** Every word in a page, in reading order. */
export function pageWords(page: Page): Word[] {
  const out: Word[] = [];
  for (const b of page.blocks) for (const l of b.lines) for (const w of l.words) out.push(w);
  return out;
}

/** Every word in the document. */
export function documentWords(doc: DocumentModel): Word[] {
  return doc.pages.flatMap(pageWords);
}

function mean(nums: number[]): number | null {
  if (!nums.length) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

/**
 * Compute the quality score from the model.
 *
 * Deliberately excludes failed pages from the averages (they contribute no
 * measurements) but reports them separately, so a document where half the
 * pages died cannot show a reassuring 95%.
 */
export function computeQuality(doc: DocumentModel): QualityScore {
  const usable = doc.pages.filter((p) => p.status === "ok");
  const failedPages = doc.pages.filter((p) => p.status === "failed").map((p) => p.index);

  const confidences: number[] = [];
  const typeConfidences: number[] = [];
  const tableConfidences: number[] = [];

  for (const page of usable) {
    // A reused native text layer is exact; scoring it with OCR confidence
    // would understate it, so it contributes a full-confidence sample.
    for (const block of page.blocks) {
      typeConfidences.push(block.typeConfidence * 100);
      if (block.table) tableConfidences.push(block.table.confidence * 100);
      for (const line of block.lines) {
        for (const word of line.words) {
          confidences.push(page.source === "native" ? 100 : word.confidence);
        }
      }
    }
  }

  const ocrConfidence = mean(confidences);
  const layoutConfidence = mean(typeConfidences);
  const tableDetection = mean(tableConfidences);

  // Weighted across whichever components actually have measurements.
  const parts: { value: number; weight: number }[] = [];
  if (ocrConfidence !== null) parts.push({ value: ocrConfidence, weight: 0.5 });
  if (layoutConfidence !== null) parts.push({ value: layoutConfidence, weight: 0.3 });
  if (tableDetection !== null) parts.push({ value: tableDetection, weight: 0.2 });

  const totalWeight = parts.reduce((s, p) => s + p.weight, 0);
  const overall = totalWeight
    ? parts.reduce((s, p) => s + p.value * p.weight, 0) / totalWeight
    : null;

  return { ocrConfidence, layoutConfidence, tableDetection, overall, failedPages };
}

/* ------------------------------------------------------------------ */
/* Construction helpers                                                 */
/* ------------------------------------------------------------------ */

/**
 * Deterministic id factory.
 *
 * Ids must be stable across re-renders so the editor can key off them, and
 * deterministic so tests and workflow resume are reproducible — hence a
 * counter rather than Math.random() or Date.now().
 */
export function createIdFactory(prefix: string) {
  let n = 0;
  return () => `${prefix}${n++}`;
}

/** Mean confidence of a set of words, 0..100 (0 when there are none). */
export function meanWordConfidence(words: Word[]): number {
  if (!words.length) return 0;
  return words.reduce((s, w) => s + w.confidence, 0) / words.length;
}

/** An empty page placeholder — used for failures so the run continues. */
export function failedPage(index: number, width: number, height: number, error: string): Page {
  return {
    index,
    width,
    height,
    rotation: 0,
    blocks: [],
    images: [],
    source: "ocr",
    status: "failed",
    error,
  };
}
