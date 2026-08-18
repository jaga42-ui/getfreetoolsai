/**
 * Non-text region detection: figures, logos, signatures and stamps.
 *
 * Fills in the part of the model that was declared but never populated —
 * `Page.images` has always come back empty, which means a photograph, a logo
 * or a handwritten signature is fed to the OCR engine and comes back as
 * garbage words rather than being preserved as an image. Sections 9 and 20 of
 * the brief ask for the opposite: recognise those regions, keep them, and do
 * not pretend to read them.
 *
 * The method is subtractive, and that is the key idea: the OCR engine has
 * already told us where the text is. Anything with substantial ink that the
 * engine did NOT claim as a word is, by elimination, a candidate non-text
 * region. That is far more reliable than trying to classify regions from
 * pixels alone, and it costs one pass over a coarse grid.
 *
 *   1. mark grid cells whose ink density is above a floor
 *   2. clear every cell covered by a recognised word
 *   3. connected-component the survivors
 *   4. discard components too small or too sparse to matter
 *   5. classify by geometry and position
 */

import { toGrayPlane, otsuThreshold, type Raster } from "./preprocess";
import { boxHeight, boxWidth, type BBox, type Line, type PageImage } from "./types";
import { createIdFactory } from "./types";

export interface FigureOptions {
  /** Grid cell size in pixels. Smaller is finer but slower. */
  cellSize: number;
  /** Fraction of a cell that must be ink for the cell to count. */
  minCellInk: number;
  /** Padding added around word boxes before they mask out cells. */
  wordPadding: number;
  /**
   * Minimum confidence for a "word" to count as text and mask out its cells.
   *
   * Observed on a real scan: Tesseract read a handwritten signature as the
   * word "NNN" at 43% confidence. Masking on that reading made the signature
   * invisible to this detector — the subtractive method deleted the very
   * region it was meant to find.
   *
   * The engine's own uncertainty is the useful signal here. Real body text
   * lands in the 80s and 90s; marks the engine is guessing at land far lower.
   * So a low-confidence reading no longer protects a region from being
   * recognised as non-text.
   */
  minWordConfidence: number;
  /** Minimum region area as a fraction of the page. */
  minAreaRatio: number;
  /** Maximum region area as a fraction of the page — above this it is the page itself. */
  maxAreaRatio: number;
  /** Minimum fraction of a region's cells that must be inked. */
  minFill: number;
}

export const DEFAULT_FIGURE_OPTIONS: FigureOptions = {
  cellSize: 16,
  minCellInk: 0.12,
  // Generous: OCR boxes hug glyphs tightly, and descenders, accents and the
  // gaps between words would otherwise survive as speckle regions.
  wordPadding: 6,
  minWordConfidence: 60,
  minAreaRatio: 0.004,
  maxAreaRatio: 0.85,
  minFill: 0.25,
};

/** Ink-density grid with text cells removed. */
export function buildNonTextGrid(
  raster: Raster,
  lines: Line[],
  opts: FigureOptions
): { grid: Uint8Array; cols: number; rows: number } {
  const { width: w, height: h } = raster;
  const cell = Math.max(4, opts.cellSize);
  const cols = Math.max(1, Math.ceil(w / cell));
  const rows = Math.max(1, Math.ceil(h / cell));
  const grid = new Uint8Array(cols * rows);

  const plane = toGrayPlane(raster);
  const threshold = otsuThreshold(plane);

  // 1. Ink density per cell.
  const inkCount = new Uint32Array(cols * rows);
  for (let y = 0; y < h; y++) {
    const gy = Math.min(rows - 1, Math.floor(y / cell));
    for (let x = 0; x < w; x++) {
      if (plane[y * w + x] < threshold) {
        inkCount[gy * cols + Math.min(cols - 1, Math.floor(x / cell))]++;
      }
    }
  }
  const cellArea = cell * cell;
  for (let i = 0; i < grid.length; i++) {
    grid[i] = inkCount[i] / cellArea >= opts.minCellInk ? 1 : 0;
  }

  // 2. Subtract text: the engine already told us where the words are — but
  //    only where it was actually confident about them.
  for (const line of lines) {
    for (const word of line.words) {
      if (word.confidence < opts.minWordConfidence) continue;
      const b = word.bbox;
      const x0 = Math.max(0, Math.floor((b.x0 - opts.wordPadding) / cell));
      const x1 = Math.min(cols - 1, Math.floor((b.x1 + opts.wordPadding) / cell));
      const y0 = Math.max(0, Math.floor((b.y0 - opts.wordPadding) / cell));
      const y1 = Math.min(rows - 1, Math.floor((b.y1 + opts.wordPadding) / cell));
      for (let gy = y0; gy <= y1; gy++) {
        for (let gx = x0; gx <= x1; gx++) grid[gy * cols + gx] = 0;
      }
    }
  }

  return { grid, cols, rows };
}

interface Component {
  bbox: BBox;
  cells: number;
}

/** 8-connected components over the grid, returned in page coordinates. */
export function connectedRegions(
  grid: Uint8Array,
  cols: number,
  rows: number,
  cellSize: number
): Component[] {
  const seen = new Uint8Array(grid.length);
  const out: Component[] = [];
  // Explicit stack rather than recursion: a full-page region on a large scan
  // would blow the call stack.
  const stack: number[] = [];

  for (let start = 0; start < grid.length; start++) {
    if (!grid[start] || seen[start]) continue;

    stack.length = 0;
    stack.push(start);
    seen[start] = 1;

    let minX = cols;
    let minY = rows;
    let maxX = -1;
    let maxY = -1;
    let count = 0;

    while (stack.length) {
      const idx = stack.pop()!;
      const cx = idx % cols;
      const cy = (idx - cx) / cols;
      count++;
      if (cx < minX) minX = cx;
      if (cx > maxX) maxX = cx;
      if (cy < minY) minY = cy;
      if (cy > maxY) maxY = cy;

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue;
          const nx = cx + dx;
          const ny = cy + dy;
          if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
          const n = ny * cols + nx;
          if (grid[n] && !seen[n]) {
            seen[n] = 1;
            stack.push(n);
          }
        }
      }
    }

    out.push({
      cells: count,
      bbox: {
        x0: minX * cellSize,
        y0: minY * cellSize,
        x1: (maxX + 1) * cellSize,
        y1: (maxY + 1) * cellSize,
      },
    });
  }
  return out;
}

/**
 * Classify a non-text region from geometry and position.
 *
 * These are weak signals and the function says so by returning "unknown"
 * whenever nothing fits. Guessing "signature" on a chart would be worse than
 * admitting ignorance, because the caller treats signatures as content not to
 * be read.
 */
export function classifyRegion(
  bbox: BBox,
  fill: number,
  page: { width: number; height: number }
): PageImage["kind"] {
  const w = boxWidth(bbox);
  const h = boxHeight(bbox);
  if (w <= 0 || h <= 0) return "unknown";

  const aspect = w / h;
  const areaRatio = (w * h) / Math.max(1, page.width * page.height);
  const centreY = (bbox.y0 + bbox.y1) / 2 / Math.max(1, page.height);

  // Signature: wide, short, sparse strokes, low on the page.
  if (aspect >= 2.2 && fill < 0.55 && centreY > 0.6 && areaRatio < 0.15) {
    return "signature";
  }
  // Logo: small and high on the page.
  if (areaRatio < 0.05 && centreY < 0.2) return "logo";
  // Stamp: roughly square, mid-sized, not solid.
  if (aspect > 0.7 && aspect < 1.4 && areaRatio < 0.1 && fill < 0.8) return "stamp";
  // Figure: anything substantial.
  if (areaRatio >= 0.02) return "figure";

  return "unknown";
}

/**
 * Find non-text regions on a page.
 *
 * `lines` must be the recognised text for the SAME raster, in the same
 * coordinate space — the whole method depends on subtracting them.
 */
export function detectFigures(
  raster: Raster,
  lines: Line[],
  options: Partial<FigureOptions> = {}
): PageImage[] {
  const opts = { ...DEFAULT_FIGURE_OPTIONS, ...options };
  const { width, height } = raster;
  if (width <= 0 || height <= 0) return [];

  const { grid, cols, rows } = buildNonTextGrid(raster, lines, opts);
  const regions = connectedRegions(grid, cols, rows, opts.cellSize);

  const nextId = createIdFactory("img");
  const pageArea = Math.max(1, width * height);
  const out: PageImage[] = [];

  for (const r of regions) {
    // Clamp to the page: the grid rounds up past the right and bottom edges.
    const bbox: BBox = {
      x0: Math.max(0, r.bbox.x0),
      y0: Math.max(0, r.bbox.y0),
      x1: Math.min(width, r.bbox.x1),
      y1: Math.min(height, r.bbox.y1),
    };
    const area = boxWidth(bbox) * boxHeight(bbox);
    const ratio = area / pageArea;
    if (ratio < opts.minAreaRatio || ratio > opts.maxAreaRatio) continue;

    // Fill guards against a sprawling L-shaped component whose bounding box is
    // mostly empty — usually leftover speckle, not a figure.
    const boxCells =
      Math.max(1, Math.ceil(boxWidth(bbox) / opts.cellSize)) *
      Math.max(1, Math.ceil(boxHeight(bbox) / opts.cellSize));
    const fill = r.cells / boxCells;
    if (fill < opts.minFill) continue;

    out.push({
      id: nextId(),
      bbox,
      kind: classifyRegion(bbox, fill, { width, height }),
    });
  }

  // Largest first: the dominant illustration is the one a caller most likely
  // wants to surface.
  out.sort((a, b) => boxWidth(b.bbox) * boxHeight(b.bbox) - boxWidth(a.bbox) * boxHeight(a.bbox));
  return out;
}

/**
 * Whether a block sits inside a detected figure.
 *
 * Used to drop "words" the engine hallucinated out of a photograph or a
 * signature — the noise that makes an otherwise good extraction look broken.
 */
export function isInsideFigure(bbox: BBox, figures: PageImage[], tolerance = 4): boolean {
  return figures.some(
    (f) =>
      bbox.x0 >= f.bbox.x0 - tolerance &&
      bbox.y0 >= f.bbox.y0 - tolerance &&
      bbox.x1 <= f.bbox.x1 + tolerance &&
      bbox.y1 <= f.bbox.y1 + tolerance
  );
}
