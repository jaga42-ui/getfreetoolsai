/**
 * Table reconstruction.
 *
 * Turns a group of lines into a real row/column/cell structure, or returns
 * null when the evidence is not there. Returning null is the important half:
 * the previous implementation's table detector was deliberately strict for the
 * same reason, because a false positive shreds ordinary prose into a grid,
 * which is far worse output than leaving it as paragraphs.
 *
 * The approach is bottom-up from geometry:
 *
 *   1. cluster lines into rows by vertical overlap
 *   2. split each row into cell segments at large horizontal gaps
 *   3. cluster segment positions across all rows into column boundaries
 *   4. snap segments to columns, inferring colSpan where one segment covers
 *      several columns (a merged cell)
 *   5. score the result; below a floor, report no table at all
 *
 * Confidence is returned alongside the structure so the UI can offer an
 * uncertain table for confirmation rather than silently trusting it, which is
 * what section 7 of the brief asks for.
 */

import {
  boxWidth,
  createIdFactory,
  unionBox,
  verticalOverlap,
  type BBox,
  type Line,
  type TableCell,
  type TableStructure,
  type Word,
} from "./types";
import { median } from "./stats";

export interface TableOptions {
  /** Vertical overlap above which two lines are considered the same row. */
  rowOverlap: number;
  /**
   * Gap that opens a new cell, as a multiple of glyph height.
   *
   * Anchored to glyph height rather than to the observed gaps: in a table
   * *every* inter-cell gap is large, so a threshold derived from the median
   * gap scales with the thing it is trying to detect and never fires. Glyph
   * height is independent of cell spacing and still resolution-independent
   * (a space is roughly 0.3em, so 1.5em is comfortably above any word space
   * and far below any column gap).
   */
  cellGapFactor: number;
  /** Minimum rows for a table. */
  minRows: number;
  /** Minimum columns for a table. */
  minColumns: number;
  /** Maximum columns before the structure is judged noise. */
  maxColumns: number;
  /** Fraction of rows that must match the modal column count. */
  minRegularity: number;
  /** Confidence below which no table is reported. */
  minConfidence: number;
}

export const DEFAULT_TABLE_OPTIONS: TableOptions = {
  rowOverlap: 0.5,
  cellGapFactor: 1.5,
  minRows: 2,
  minColumns: 2,
  maxColumns: 12,
  minRegularity: 0.6,
  minConfidence: 0.5,
};

/** A contiguous run of words within a row — a candidate cell. */
export interface Segment {
  text: string;
  bbox: BBox;
  words: Word[];
}

/* ------------------------------------------------------------------ */
/* 1. Rows                                                             */
/* ------------------------------------------------------------------ */

/**
 * Cluster lines into visual rows.
 *
 * Lines that overlap vertically belong to the same row even when the OCR
 * engine emitted them as separate lines (which it does when cells are far
 * apart horizontally).
 */
export function groupIntoRows(lines: Line[], opts: TableOptions): Line[][] {
  const sorted = lines.slice().sort((a, b) => a.bbox.y0 - b.bbox.y0);
  const rows: Line[][] = [];

  for (const line of sorted) {
    const row = rows.find((r) =>
      r.some((existing) => verticalOverlap(existing.bbox, line.bbox) >= opts.rowOverlap)
    );
    if (row) row.push(line);
    else rows.push([line]);
  }

  // Left-to-right within each row; rows already sorted by first insertion.
  for (const r of rows) r.sort((a, b) => a.bbox.x0 - b.bbox.x0);
  return rows;
}

/* ------------------------------------------------------------------ */
/* 2. Segments                                                         */
/* ------------------------------------------------------------------ */

/**
 * Split a row's words into cell segments at unusually large horizontal gaps.
 *
 * The threshold comes from glyph height, not from the gaps themselves — see
 * `cellGapFactor` for why measuring the gaps would defeat the detector.
 */
export function splitRowIntoSegments(row: Line[], opts: TableOptions): Segment[] {
  const words = row
    .flatMap((l) => l.words)
    .filter((w) => w.text.trim())
    .sort((a, b) => a.bbox.x0 - b.bbox.x0);
  if (!words.length) return [];

  // Reference is glyph height, NOT the observed gaps — see cellGapFactor.
  const glyphHeight = median(words.map((w) => w.bbox.y1 - w.bbox.y0).filter((h) => h > 0));
  const threshold = Math.max(glyphHeight * opts.cellGapFactor, 1);

  const segments: Segment[] = [];
  let current: Word[] = [words[0]];

  for (let i = 1; i < words.length; i++) {
    const gap = words[i].bbox.x0 - words[i - 1].bbox.x1;
    // Words from different source lines in the same row are always separate
    // cells — the engine already decided they were spatially disjoint.
    if (gap > threshold) {
      segments.push(toSegment(current));
      current = [words[i]];
    } else {
      current.push(words[i]);
    }
  }
  segments.push(toSegment(current));
  return segments;
}

function toSegment(words: Word[]): Segment {
  return {
    text: words.map((w) => w.text).join(" "),
    bbox: unionBox(words.map((w) => w.bbox))!,
    words,
  };
}

/* ------------------------------------------------------------------ */
/* 3. Columns                                                          */
/* ------------------------------------------------------------------ */

/**
 * Derive column boundaries by clustering segment left edges.
 *
 * Left edges cluster tightly in a real table because cells share an alignment
 * guide; in prose they scatter. `tolerance` is a fraction of the table width.
 */
export function clusterColumns(segments: Segment[], tableWidth: number, tolerance = 0.04): number[] {
  if (!segments.length || tableWidth <= 0) return [];
  const tol = tableWidth * tolerance;
  const xs = segments.map((s) => s.bbox.x0).sort((a, b) => a - b);

  const clusters: number[][] = [[xs[0]]];
  for (let i = 1; i < xs.length; i++) {
    const last = clusters[clusters.length - 1];
    if (xs[i] - last[last.length - 1] <= tol) last.push(xs[i]);
    else clusters.push([xs[i]]);
  }
  return clusters.map((c) => c.reduce((a, b) => a + b, 0) / c.length);
}

/** Index of the column whose guide is nearest a segment's left edge. */
function nearestColumn(x: number, columns: number[]): number {
  let best = 0;
  let bestD = Infinity;
  columns.forEach((c, i) => {
    const d = Math.abs(x - c);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  });
  return best;
}

/* ------------------------------------------------------------------ */
/* 5. Header + scoring                                                 */
/* ------------------------------------------------------------------ */

const NUMERIC_RE = /^[^\dA-Za-z]*[\d][\d.,%\s/-]*$/;

export const isNumericCell = (text: string) => NUMERIC_RE.test(text.trim());

/**
 * Decide whether the first row is a header.
 *
 * The reliable signal is contrast, not styling: a header row is textual while
 * the body below it contains numbers in the same columns. Font weight would be
 * better evidence but a raster OCR pass cannot supply it reliably.
 */
export function detectHeaderRow(rows: TableCell[][]): boolean {
  if (rows.length < 2) return false;
  const [head, ...body] = rows;

  const headNumeric = head.filter((c) => c.text.trim() && isNumericCell(c.text)).length;
  if (headNumeric > 0) return false;

  const bodyNumeric = body.some((r) =>
    r.some((c) => c.text.trim() && isNumericCell(c.text))
  );
  return bodyNumeric;
}

/* ------------------------------------------------------------------ */
/* Main entry                                                          */
/* ------------------------------------------------------------------ */

/**
 * Attempt to reconstruct a table from a block's lines.
 * Returns null when the geometry does not support one.
 */
export function detectTable(
  lines: Line[],
  options: Partial<TableOptions> = {}
): TableStructure | null {
  const opts = { ...DEFAULT_TABLE_OPTIONS, ...options };
  if (lines.length < opts.minRows) return null;

  const extent = unionBox(lines.map((l) => l.bbox));
  if (!extent) return null;
  const tableWidth = boxWidth(extent);
  if (tableWidth <= 0) return null;

  const rows = groupIntoRows(lines, opts);
  if (rows.length < opts.minRows) return null;

  const rowSegments = rows.map((r) => splitRowIntoSegments(r, opts));
  // A table needs most rows genuinely divided into cells. If only one row
  // splits, that is a stray wide gap in prose, not a table.
  const multiCell = rowSegments.filter((s) => s.length >= opts.minColumns).length;
  if (multiCell < Math.max(opts.minRows, Math.ceil(rows.length * opts.minRegularity))) {
    return null;
  }

  const columns = clusterColumns(rowSegments.flat(), tableWidth);
  if (columns.length < opts.minColumns || columns.length > opts.maxColumns) return null;

  const nextCellId = createIdFactory("c");
  const grid: TableCell[][] = rowSegments.map((segments) => {
    const cells: TableCell[] = [];
    segments.forEach((seg, i) => {
      const start = nearestColumn(seg.bbox.x0, columns);
      // A segment reaching into later column guides is a merged cell.
      const next = segments[i + 1];
      const end = next ? nearestColumn(next.bbox.x0, columns) - 1 : columns.length - 1;
      const colSpan = Math.max(1, end - start + 1);
      cells.push({
        id: nextCellId(),
        text: seg.text,
        bbox: seg.bbox,
        rowSpan: 1,
        colSpan,
        isHeader: false,
      });
    });
    return cells;
  });

  // Regularity: how many rows sum to the full column count.
  const totalSpan = (r: TableCell[]) => r.reduce((s, c) => s + c.colSpan, 0);
  const regular = grid.filter((r) => totalSpan(r) === columns.length).length;
  const regularity = grid.length ? regular / grid.length : 0;
  if (regularity < opts.minRegularity) return null;

  const hasHeaderRow = detectHeaderRow(grid);
  if (hasHeaderRow) for (const c of grid[0]) c.isHeader = true;

  // Confidence blends structural regularity with how well the table fills its
  // declared grid — a table with many missing cells is a weaker reading.
  const filled = grid.reduce((s, r) => s + r.length, 0);
  const expected = grid.length * columns.length;
  const density = expected > 0 ? Math.min(1, filled / expected) : 0;
  const confidence = Math.min(0.98, regularity * 0.7 + density * 0.3);

  if (confidence < opts.minConfidence) return null;

  return { rows: grid, confidence, hasHeaderRow };
}

/** Render a reconstructed table as Markdown (used by the Markdown exporter). */
export function tableToMarkdown(table: TableStructure): string {
  if (!table.rows.length) return "";
  const width = Math.max(...table.rows.map((r) => r.reduce((s, c) => s + c.colSpan, 0)));
  const pad = (cells: TableCell[]) => {
    const out = cells.map((c) => c.text.replace(/\|/g, "\\|"));
    while (out.length < width) out.push("");
    return out;
  };
  const head = pad(table.rows[0]);
  const sep = head.map(() => "---");
  const body = table.rows.slice(1).map(pad);
  return [head, sep, ...body].map((r) => `| ${r.join(" | ")} |`).join("\n");
}
