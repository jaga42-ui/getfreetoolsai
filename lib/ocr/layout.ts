/**
 * Layout analysis: geometry in, document semantics out.
 *
 * This is where the single worst defect of the previous implementation is
 * fixed. That version emitted blocks in whatever order Tesseract produced,
 * which is raster order — so a two-column paper came out interleaved
 * (A D B E C F instead of A B C then D E F). Reading order is a decision that
 * must be made from geometry, not inherited from the engine.
 *
 * The pipeline, in order:
 *
 *   1. separate full-width lines (titles, rules) from body lines
 *   2. find vertical gutters in the body lines  -> candidate columns
 *   3. reject gutters that are actually table column gaps
 *   4. assign lines to columns
 *   5. segment each column's lines into blocks on vertical gaps
 *   6. classify each block (heading / list / header / footer / paragraph ...)
 *   7. resolve reading order, respecting full-width blocks as section breaks
 *
 * Every step is a pure function over the normalized model so it can be tested
 * without an OCR engine, a canvas, or a browser.
 */

import {
  boxHeight,
  boxWidth,
  createIdFactory,
  meanWordConfidence,
  unionBox,
  verticalOverlap,
  type BBox,
  type Block,
  type BlockType,
  type Line,
  type Page,
  type TextStyle,
} from "./types";
import type { RecognizedPage } from "./provider";
import { detectTable, type TableOptions } from "./table";
import { median } from "./stats";

// Re-exported: median was originally defined here and is imported from this
// module by callers and tests. It now lives in ./stats to break the layout <->
// table import cycle.
export { median };

export interface LayoutOptions {
  /** Top fraction of the page treated as the header band. */
  headerBand: number;
  /** Bottom fraction of the page treated as the footer band. */
  footerBand: number;
  /** Minimum gutter width, as a fraction of page width, to split columns. */
  minGutter: number;
  /** A line wider than this fraction of the content width spans all columns. */
  fullWidthRatio: number;
  /** Font size ratio over body median at which a block becomes a heading. */
  headingRatio: number;
  /** Minimum lines each side of a gutter needs for a real column split. */
  minLinesPerColumn: number;
  /**
   * Fraction of lines allowed to cross a band while it still counts as a
   * gutter. Lets a full-width title or rule sit across the gutter without
   * hiding it from the twenty body lines that agree it is there.
   */
  gutterTolerance: number;
  /**
   * If more than this fraction of a column's lines are vertically aligned with
   * a line in the neighbouring column, the layout is row-structured. Necessary
   * but NOT sufficient evidence of a table — see `tableMaxWordsPerLine`.
   */
  tableRowAlignment: number;
  /**
   * Median words per line at or below which a row-structured layout is judged
   * a table rather than text columns.
   */
  tableMaxWordsPerLine: number;
}

export const DEFAULT_LAYOUT_OPTIONS: LayoutOptions = {
  headerBand: 0.07,
  footerBand: 0.07,
  minGutter: 0.025,
  fullWidthRatio: 0.75,
  headingRatio: 1.22,
  minLinesPerColumn: 3,
  gutterTolerance: 0.15,
  tableRowAlignment: 0.6,
  tableMaxWordsPerLine: 3,
};

/* ------------------------------------------------------------------ */
/* Small statistics helpers                                            */
/* ------------------------------------------------------------------ */

/** Median font size across a set of lines, from word glyph heights. */
export function lineFontSize(line: Line): number {
  const sizes = line.words
    .map((w) => w.style?.fontSizePx ?? boxHeight(w.bbox))
    .filter((n) => n > 0);
  return median(sizes);
}

const lineText = (line: Line) => line.words.map((w) => w.text).join(" ");

/* ------------------------------------------------------------------ */
/* 1-4. Columns                                                        */
/* ------------------------------------------------------------------ */

export interface Column {
  x0: number;
  x1: number;
}

/**
 * Find vertical whitespace gutters among body lines.
 *
 * Works on a coverage histogram across x: buckets no line touches are
 * whitespace. A run of empty buckets wide enough, with real content on both
 * sides, is a gutter. Leading/trailing runs are page margins, not gutters.
 */
export function findGutters(
  lines: Line[],
  pageWidth: number,
  opts: LayoutOptions
): { x0: number; x1: number }[] {
  if (lines.length < opts.minLinesPerColumn * 2 || pageWidth <= 0) return [];

  const BUCKETS = 200;
  const bucketW = pageWidth / BUCKETS;

  /*
   * Coverage is measured from WORD boxes, and counts how many distinct lines
   * touch each bucket.
   *
   * Both details are load-bearing, and both come from watching real Tesseract
   * output rather than from theory:
   *
   *  - Words, not line boxes. In its default segmentation mode Tesseract reads
   *    straight across a gutter and emits ONE line spanning both columns
   *    ("ALPHA the quick brown fox DELTA the right hand column..."). Line boxes
   *    are therefore full-width and show no gutter at all, while the word boxes
   *    inside them still have a clean gap.
   *
   *  - A count, not a boolean. A full-width title or rule crosses the gutter.
   *    Requiring zero coverage would let a single such line hide a gutter that
   *    twenty body lines agree on, so a band touched by only a small fraction
   *    of lines still counts as whitespace.
   */
  const counts = new Array<number>(BUCKETS).fill(0);
  for (const line of lines) {
    const touched = new Set<number>();
    const boxes = line.words.length ? line.words.map((w) => w.bbox) : [line.bbox];
    for (const b of boxes) {
      const from = Math.max(0, Math.floor(b.x0 / bucketW));
      const to = Math.min(BUCKETS - 1, Math.ceil(b.x1 / bucketW));
      for (let i = from; i <= to; i++) touched.add(i);
    }
    touched.forEach((i) => counts[i]++);
  }

  const tolerance = Math.floor(lines.length * opts.gutterTolerance);
  const isEmpty = (i: number) => counts[i] <= tolerance;
  const isContent = (i: number) => counts[i] > 0;

  // Content extent, so page margins are excluded from gutter search.
  let first = -1;
  let last = -1;
  for (let i = 0; i < BUCKETS; i++) {
    if (isContent(i)) {
      if (first < 0) first = i;
      last = i;
    }
  }
  if (first < 0 || last <= first) return [];

  const minBuckets = Math.max(1, Math.round((opts.minGutter * pageWidth) / bucketW));
  const gutters: { x0: number; x1: number }[] = [];
  let runStart = -1;

  for (let i = first; i <= last; i++) {
    if (isEmpty(i)) {
      if (runStart < 0) runStart = i;
      continue;
    }
    if (runStart >= 0) {
      const runLen = i - runStart;
      if (runLen >= minBuckets) gutters.push({ x0: runStart * bucketW, x1: i * bucketW });
      runStart = -1;
    }
  }
  return gutters;
}

/**
 * Split lines that run across a gutter into one line per column.
 *
 * This is the repair step for engines that read straight across a multi-column
 * page. Words keep their geometry; only the grouping changes, so everything
 * downstream (block segmentation, classification, tables) sees the per-column
 * lines it expects.
 *
 * Lines whose words all sit in one region pass through untouched, so a
 * single-column page is unaffected.
 */
export function splitLinesAtGutters(
  lines: Line[],
  pageWidth: number,
  opts: LayoutOptions
): Line[] {
  const gutters = findGutters(lines, pageWidth, opts);
  if (!gutters.length) return lines;

  /*
   * Regions are split at gutter MIDPOINTS, not gutter edges, so they tile the
   * full page width with no holes.
   *
   * Using the edges leaves the gutter band itself belonging to no region, and
   * any word whose centre happens to land inside it is silently dropped — which
   * is exactly what swallowed a paragraph marker the first time this ran on a
   * real scan. Losing content is far worse than assigning an ambiguous word to
   * the nearer column.
   */
  const cuts = gutters.map((g) => (g.x0 + g.x1) / 2);
  const bounds = [0, ...cuts, pageWidth];
  const regions: { x0: number; x1: number }[] = [];
  for (let i = 0; i < bounds.length - 1; i++) {
    regions.push({ x0: bounds[i], x1: bounds[i + 1] });
  }
  if (regions.length < 2) return lines;

  /*
   * A table's column gaps look exactly like text-column gutters to
   * `findGutters`, and splitting there is actively destructive: it tears every
   * row into per-column fragments, so table reconstruction downstream sees
   * shredded rows and can never rebuild the grid.
   *
   * `detectColumns` already guards against this, but it runs later and on the
   * lines this function produces — by then the damage is done. So the same
   * discriminator is applied here, at the only point where it can still help:
   * count words per region per line. Body text puts many words in one region;
   * a table row puts one or two in each.
   */
  const perRegionCounts: number[] = [];
  for (const line of lines) {
    for (const r of regions) {
      const n = line.words.filter((w) => {
        const cx = (w.bbox.x0 + w.bbox.x1) / 2;
        return cx >= r.x0 && cx < r.x1;
      }).length;
      if (n > 0) perRegionCounts.push(n);
    }
  }
  if (
    perRegionCounts.length &&
    median(perRegionCounts) <= opts.tableMaxWordsPerLine
  ) {
    return lines;
  }

  const out: Line[] = [];
  for (const line of lines) {
    if (!line.words.length) {
      out.push(line);
      continue;
    }
    let emitted = 0;
    regions.forEach((r, ri) => {
      // Assign by word centre so a glyph straddling a boundary lands once.
      const inRegion = line.words.filter((w) => {
        const cx = (w.bbox.x0 + w.bbox.x1) / 2;
        return cx >= r.x0 && cx < r.x1;
      });
      if (!inRegion.length) return;
      emitted++;
      out.push({
        ...line,
        id: `${line.id}#${ri}`,
        words: inRegion,
        bbox: unionBox(inRegion.map((w) => w.bbox))!,
      });
    });
    // Every word fell outside every region (should not happen) — keep the
    // original rather than dropping content.
    if (emitted === 0) out.push(line);
  }
  return out;
}

/**
 * Reject gutters produced by a table rather than a column layout.
 *
 * Row alignment alone is NOT enough evidence, which is the trap here: a real
 * two-column paper is also row-aligned, because both columns share a top
 * margin and a leading, so their baselines line up down the page. Rejecting on
 * alignment alone would break exactly the two-column case this module exists
 * to fix.
 *
 * The discriminator is words per line. A table cell holds a label or a value —
 * one to three words. A line of body text holds eight to fifteen. Crucially
 * this signal is independent of geometry, unlike anything measured against the
 * column width: gutters are derived from the content, so content always fills
 * its own column and any fill-ratio test is self-normalizing and useless here.
 *
 * So a table is: row-aligned AND sparse in words.
 */
export function looksLikeTableGap(left: Line[], right: Line[], opts: LayoutOptions): boolean {
  if (!left.length || !right.length) return false;

  let aligned = 0;
  for (const l of left) {
    if (right.some((r) => verticalOverlap(l.bbox, r.bbox) > 0.5)) aligned++;
  }
  const rowAligned = aligned / left.length > opts.tableRowAlignment;
  if (!rowAligned) return false;

  const wordsPerLine = (lines: Line[]) =>
    median(lines.map((l) => l.words.filter((w) => w.text.trim()).length));

  const sparse =
    Math.max(wordsPerLine(left), wordsPerLine(right)) <= opts.tableMaxWordsPerLine;
  return sparse;
}

/**
 * Index of the column a line belongs to, by greatest horizontal overlap.
 *
 * Deliberately NOT strict containment. Column bounds come from a bucketed
 * histogram, so they are quantized to a few pixels, and a line that legitimately
 * runs a hair past the boundary would match no column at all and be dropped —
 * which is precisely how a paragraph went missing the first time this ran on a
 * real scan. Every line must land somewhere, so this always returns a valid
 * index, falling back to the nearest column by centre when overlaps are all zero.
 */
export function assignToColumn(line: Line, columns: Column[]): number {
  if (columns.length <= 1) return 0;
  let best = 0;
  let bestOverlap = -1;
  columns.forEach((c, i) => {
    const overlap = Math.min(line.bbox.x1, c.x1) - Math.max(line.bbox.x0, c.x0);
    if (overlap > bestOverlap) {
      bestOverlap = overlap;
      best = i;
    }
  });
  if (bestOverlap > 0) return best;

  // No positive overlap anywhere — pick the nearest column centre.
  const cx = (line.bbox.x0 + line.bbox.x1) / 2;
  let nearest = 0;
  let nearestD = Infinity;
  columns.forEach((c, i) => {
    const d = Math.abs(cx - (c.x0 + c.x1) / 2);
    if (d < nearestD) {
      nearestD = d;
      nearest = i;
    }
  });
  return nearest;
}

/**
 * Resolve the column structure of a page from its body lines.
 * Returns a single full-width column when no valid split is found.
 */
export function detectColumns(
  bodyLines: Line[],
  pageWidth: number,
  opts: LayoutOptions
): Column[] {
  const whole: Column[] = [{ x0: 0, x1: pageWidth }];
  if (!bodyLines.length) return whole;

  const gutters = findGutters(bodyLines, pageWidth, opts);
  if (!gutters.length) return whole;

  // Build candidate columns from the gutter boundaries.
  const edges: number[] = [0];
  for (const g of gutters) {
    edges.push(g.x0);
    edges.push(g.x1);
  }
  edges.push(pageWidth);

  const candidates: Column[] = [];
  for (let i = 0; i < edges.length; i += 2) {
    candidates.push({ x0: edges[i], x1: edges[i + 1] });
  }

  const linesIn = (c: Column) =>
    bodyLines.filter((l) => l.bbox.x0 >= c.x0 - 1 && l.bbox.x1 <= c.x1 + 1);

  // Every candidate must hold enough lines to be a real column.
  const populated = candidates.filter((c) => linesIn(c).length >= opts.minLinesPerColumn);
  if (populated.length < 2) return whole;

  // Adjacent populated columns that behave like table rows are not columns.
  for (let i = 0; i < populated.length - 1; i++) {
    if (looksLikeTableGap(linesIn(populated[i]), linesIn(populated[i + 1]), opts)) {
      return whole;
    }
  }

  return populated;
}

/* ------------------------------------------------------------------ */
/* 5. Block segmentation                                               */
/* ------------------------------------------------------------------ */

/**
 * Split a column's lines into blocks.
 *
 * Two triggers: a vertical gap noticeably larger than the column's typical
 * line spacing, or a font-size change large enough to imply a different role
 * (body -> heading). Using the median gap rather than a fixed pixel threshold
 * keeps this resolution-independent.
 */
export function segmentIntoBlocks(lines: Line[]): Line[][] {
  if (!lines.length) return [];
  const sorted = lines.slice().sort((a, b) => a.bbox.y0 - b.bbox.y0);

  const gaps: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    gaps.push(Math.max(0, sorted[i].bbox.y0 - sorted[i - 1].bbox.y1));
  }
  const medGap = median(gaps);
  // With uniform spacing the median gap can be 0; fall back to line height so
  // the threshold stays meaningful.
  const medHeight = median(sorted.map((l) => boxHeight(l.bbox)));
  const gapThreshold = Math.max(medGap * 1.6, medHeight * 0.6);

  const groups: Line[][] = [[sorted[0]]];
  for (let i = 1; i < sorted.length; i++) {
    const gap = sorted[i].bbox.y0 - sorted[i - 1].bbox.y1;
    const prevSize = lineFontSize(sorted[i - 1]);
    const size = lineFontSize(sorted[i]);
    const sizeShift = prevSize > 0 && size > 0 && Math.abs(size - prevSize) / prevSize > 0.25;

    if (gap > gapThreshold || sizeShift) groups.push([sorted[i]]);
    else groups[groups.length - 1].push(sorted[i]);
  }
  return groups;
}

/* ------------------------------------------------------------------ */
/* 6. Classification                                                   */
/* ------------------------------------------------------------------ */

const BULLET_RE = /^\s*[•▪◦*–—-]\s+/;
const ORDERED_RE = /^\s*(\d{1,3}[.)]|[a-zA-Z][.)])\s+/;
const PAGE_NUMBER_RE = /^\s*(page\s+)?\d{1,4}(\s*(\/|of)\s*\d{1,4})?\s*$/i;

export interface Classified {
  type: BlockType;
  confidence: number;
  level?: number;
}

/**
 * Decide what a group of lines represents.
 *
 * Returns a confidence with every verdict, because these are heuristics and
 * the UI is expected to surface uncertainty rather than present a guess as
 * fact. `bodySize` is the page's median body font size — the reference against
 * which "large" is judged.
 */
export function classifyBlock(
  lines: Line[],
  bbox: BBox,
  page: { width: number; height: number },
  bodySize: number,
  opts: LayoutOptions
): Classified {
  const text = lines.map(lineText).join(" ").trim();
  if (!text) return { type: "unknown", confidence: 0.2 };

  const topBand = page.height * opts.headerBand;
  const bottomBand = page.height * (1 - opts.footerBand);
  const size = median(lines.map(lineFontSize).filter((n) => n > 0));
  const ratio = bodySize > 0 ? size / bodySize : 1;

  // Page number: short, numeric, in a margin band. Checked before footer so
  // the more specific type wins.
  if ((bbox.y1 <= topBand || bbox.y0 >= bottomBand) && PAGE_NUMBER_RE.test(text)) {
    return { type: "pageNumber", confidence: 0.9 };
  }

  // Header / footer: entirely inside a margin band and not oversized.
  if (bbox.y1 <= topBand && ratio <= opts.headingRatio) {
    return { type: "header", confidence: 0.7 };
  }
  if (bbox.y0 >= bottomBand && ratio <= opts.headingRatio) {
    return { type: "footer", confidence: 0.7 };
  }

  // List: every line carries a bullet or an ordinal marker. Requiring *all*
  // lines to match avoids turning a paragraph that happens to start with
  // "1. " into a list.
  const texts = lines.map(lineText);
  if (lines.length >= 2 && texts.every((t) => BULLET_RE.test(t) || ORDERED_RE.test(t))) {
    return { type: "list", confidence: 0.85 };
  }
  if (lines.length === 1 && (BULLET_RE.test(text) || ORDERED_RE.test(text))) {
    return { type: "list", confidence: 0.5 };
  }

  // Heading: visibly larger than body text and short. Length matters — a full
  // paragraph set in a large face is still a paragraph.
  if (ratio >= opts.headingRatio && lines.length <= 3 && text.length <= 120) {
    // Bigger relative size implies a shallower level.
    const level = ratio >= 1.8 ? 1 : ratio >= 1.45 ? 2 : 3;
    const confidence = Math.min(0.95, 0.55 + (ratio - opts.headingRatio));
    return { type: "heading", confidence, level };
  }

  // A short isolated line in the body that is not larger than body text is
  // ambiguous — often a caption or a stray fragment. Say so with low
  // confidence rather than silently calling it a paragraph.
  if (lines.length === 1 && text.length <= 60 && ratio < opts.headingRatio) {
    return { type: "caption", confidence: 0.35 };
  }

  return { type: "paragraph", confidence: 0.8 };
}

/** Alignment estimate for a block within its column. */
export function estimateAlign(
  bbox: BBox,
  column: Column
): NonNullable<TextStyle["align"]> | undefined {
  const colW = column.x1 - column.x0;
  if (colW <= 0) return undefined;
  const leftGap = bbox.x0 - column.x0;
  const rightGap = column.x1 - bbox.x1;
  const tolerance = colW * 0.06;

  if (Math.abs(leftGap - rightGap) <= tolerance && leftGap > tolerance) return "center";
  if (rightGap <= tolerance && leftGap > tolerance * 2) return "right";
  return "left";
}

/* ------------------------------------------------------------------ */
/* 7. Reading order + assembly                                         */
/* ------------------------------------------------------------------ */

/**
 * Order blocks for reading.
 *
 * Full-width blocks (columnIndex === -1) act as section breaks: everything
 * above them in the columns is read first, then the spanning block, then the
 * next section. Within a section, columns are read left to right and each
 * column top to bottom.
 */
export function resolveReadingOrder(blocks: Block[]): Block[] {
  const spanning = blocks
    .filter((b) => b.columnIndex === -1)
    .sort((a, b) => a.bbox.y0 - b.bbox.y0);
  const columnar = blocks.filter((b) => b.columnIndex !== -1);

  // Section boundaries are the vertical positions of the spanning blocks.
  const boundaries = spanning.map((b) => b.bbox.y0);
  const sectionOf = (y: number) => {
    let s = 0;
    for (const b of boundaries) if (y >= b) s++;
    return s;
  };

  const ordered: Block[] = [];
  const sectionCount = boundaries.length + 1;

  for (let s = 0; s < sectionCount; s++) {
    // The spanning block that opens this section (none for section 0).
    if (s > 0) ordered.push(spanning[s - 1]);

    const inSection = columnar.filter((b) => sectionOf(b.bbox.y0) === s);
    inSection.sort((a, b) => {
      const ca = a.columnIndex ?? 0;
      const cb = b.columnIndex ?? 0;
      if (ca !== cb) return ca - cb;
      return a.bbox.y0 - b.bbox.y0;
    });
    ordered.push(...inSection);
  }

  ordered.forEach((b, i) => {
    b.readingOrder = i;
  });
  return ordered;
}

/**
 * Turn a provider's raw recognized page into a fully analyzed `Page`.
 */
export function analyzePage(
  recognized: RecognizedPage,
  options: Partial<LayoutOptions> = {},
  tableOptions: Partial<TableOptions> = {}
): Page {
  const opts = { ...DEFAULT_LAYOUT_OPTIONS, ...options };
  const nextBlockId = createIdFactory(`p${recognized.pageIndex}b`);
  const { width, height, lines } = recognized;

  const base: Page = {
    index: recognized.pageIndex,
    width,
    height,
    rotation: recognized.hints?.rotation ?? 0,
    blocks: [],
    images: [],
    source: "ocr",
    status: lines.length ? "ok" : "blank",
  };
  if (!lines.length) return base;

  // Repair lines the engine read straight across a gutter, before anything
  // downstream measures them. Without this, every line on a two-column page
  // looks full-width and no column can be found.
  const repaired = splitLinesAtGutters(lines, width, opts);

  // Content extent drives "full width", so a narrow-margined page is not
  // mistaken for a wide one.
  const contentBox = unionBox(repaired.map((l) => l.bbox))!;
  const contentW = Math.max(1, boxWidth(contentBox));
  const bodySize = median(repaired.map(lineFontSize).filter((n) => n > 0));

  const isFullWidth = (l: Line) => boxWidth(l.bbox) / contentW >= opts.fullWidthRatio;
  const spanningLines = repaired.filter(isFullWidth);
  const bodyLines = repaired.filter((l) => !isFullWidth(l));

  const columns = detectColumns(bodyLines, width, opts);
  const singleColumn = columns.length < 2;

  const build = (group: Line[], columnIndex: number, column: Column): Block => {
    const bbox = unionBox(group.map((l) => l.bbox))!;
    const words = group.flatMap((l) => l.words);
    let { type, confidence, level } = classifyBlock(group, bbox, { width, height }, bodySize, opts);

    // Table detection runs per block, after segmentation.
    //
    // Known limitation: a table whose rows are spaced far enough apart to
    // exceed the paragraph-split threshold will be segmented into several
    // blocks first, and each fragment is then too small to recognise. Uniformly
    // spaced tables — the overwhelmingly common case — stay in one block and
    // are detected. Fixing the general case needs a region pass before
    // segmentation, which is deferred rather than guessed at here.
    const table = detectTable(group, tableOptions) ?? undefined;
    if (table) {
      type = "table";
      confidence = table.confidence;
      level = undefined;
    }

    const size = median(group.map(lineFontSize).filter((n) => n > 0));
    return {
      id: nextBlockId(),
      type,
      bbox,
      lines: group,
      confidence: meanWordConfidence(words),
      typeConfidence: confidence,
      readingOrder: 0,
      columnIndex,
      level,
      table,
      style: {
        fontSizePx: size || undefined,
        align: estimateAlign(bbox, column),
        confidence: confidence,
      },
    };
  };

  const blocks: Block[] = [];
  const fullColumn: Column = { x0: contentBox.x0, x1: contentBox.x1 };

  if (singleColumn) {
    // No real column split: spanning lines are just ordinary lines here, so
    // segment everything together and keep natural vertical order.
    for (const group of segmentIntoBlocks(repaired)) blocks.push(build(group, 0, fullColumn));
  } else {
    // Partition by best overlap so every body line lands in exactly one
    // column and none can be silently lost at a quantized boundary.
    const buckets: Line[][] = columns.map(() => []);
    for (const l of bodyLines) buckets[assignToColumn(l, columns)].push(l);

    for (let ci = 0; ci < columns.length; ci++) {
      for (const group of segmentIntoBlocks(buckets[ci])) {
        blocks.push(build(group, ci, columns[ci]));
      }
    }
    // Spanning lines become their own blocks marked -1 so reading order can
    // treat them as section breaks.
    for (const group of segmentIntoBlocks(spanningLines)) {
      blocks.push(build(group, -1, fullColumn));
    }
  }

  base.blocks = resolveReadingOrder(blocks);
  return base;
}

/** Concatenate a page's text in resolved reading order. */
export function pageToText(page: Page): string {
  return page.blocks
    .slice()
    .sort((a, b) => a.readingOrder - b.readingOrder)
    .map((b) => b.lines.map(lineText).join("\n"))
    .join("\n\n");
}
