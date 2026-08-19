import { describe, it, expect } from "vitest";
import {
  buildNonTextGrid,
  classifyRegion,
  connectedRegions,
  detectFigures,
  isInsideFigure,
  DEFAULT_FIGURE_OPTIONS,
} from "@/lib/ocr/figures";
import { createRaster, type Raster } from "@/lib/ocr/preprocess";
import type { Line, Word } from "@/lib/ocr/types";

const OPTS = DEFAULT_FIGURE_OPTIONS;
let uid = 0;

function fillRect(r: Raster, x0: number, y0: number, w: number, h: number, v: number) {
  for (let y = y0; y < y0 + h; y++) {
    for (let x = x0; x < x0 + w; x++) {
      if (x < 0 || y < 0 || x >= r.width || y >= r.height) continue;
      const o = (y * r.width + x) * 4;
      r.data[o] = v;
      r.data[o + 1] = v;
      r.data[o + 2] = v;
      r.data[o + 3] = 255;
    }
  }
}

/** A recognised word occupying an exact box. */
function word(x0: number, y0: number, x1: number, y1: number): Word {
  return { id: `w${uid++}`, text: "word", bbox: { x0, y0, x1, y1 }, confidence: 92 };
}
function lineAt(x0: number, y0: number, x1: number, y1: number): Line {
  return { id: `l${uid++}`, words: [word(x0, y0, x1, y1)], bbox: { x0, y0, x1, y1 } };
}

/** Draw text-like ink AND report it as recognised words, as a real page would. */
function textRow(r: Raster, x0: number, y: number, width: number): Line {
  fillRect(r, x0, y, width, 12, 0);
  return lineAt(x0, y, x0 + width, y + 12);
}

describe("buildNonTextGrid", () => {
  it("marks inked cells", () => {
    const r = createRaster(160, 160, 255);
    fillRect(r, 0, 0, 160, 160, 0);
    const { grid } = buildNonTextGrid(r, [], OPTS);
    expect(Array.from(grid).every((c) => c === 1)).toBe(true);
  });

  it("subtracts cells covered by recognised words", () => {
    // The core idea: the engine already told us where the text is.
    const r = createRaster(160, 160, 255);
    fillRect(r, 0, 0, 160, 160, 0);
    const { grid } = buildNonTextGrid(r, [lineAt(0, 0, 160, 160)], OPTS);
    expect(Array.from(grid).every((c) => c === 0)).toBe(true);
  });

  it("does not let a LOW-confidence reading mask a region", () => {
    // A hallucinated word over a signature must not hide it. Observed for real:
    // Tesseract read a scrawl as "NNN" at 43%.
    const r = createRaster(160, 160, 255);
    fillRect(r, 0, 0, 160, 160, 0);
    const w: Word = { id: "w", text: "NNN", bbox: { x0: 0, y0: 0, x1: 160, y1: 160 }, confidence: 43 };
    const line: Line = { id: "l", words: [w], bbox: w.bbox };
    const { grid } = buildNonTextGrid(r, [line], OPTS);
    expect(Array.from(grid).some((c) => c === 1)).toBe(true);
  });

  it("leaves blank paper unmarked", () => {
    const { grid } = buildNonTextGrid(createRaster(160, 160, 255), [], OPTS);
    expect(Array.from(grid).some((c) => c === 1)).toBe(false);
  });
});

describe("connectedRegions", () => {
  it("finds a single block of cells", () => {
    const cols = 10;
    const rows = 10;
    const grid = new Uint8Array(cols * rows);
    for (let y = 2; y < 5; y++) for (let x = 2; x < 6; x++) grid[y * cols + x] = 1;
    const regions = connectedRegions(grid, cols, rows, 10);
    expect(regions).toHaveLength(1);
    expect(regions[0].bbox).toEqual({ x0: 20, y0: 20, x1: 60, y1: 50 });
  });

  it("separates two disjoint blocks", () => {
    const cols = 12;
    const rows = 6;
    const grid = new Uint8Array(cols * rows);
    grid[0] = 1;
    grid[cols - 1] = 1;
    expect(connectedRegions(grid, cols, rows, 10)).toHaveLength(2);
  });

  it("joins diagonally touching cells", () => {
    const cols = 5;
    const rows = 5;
    const grid = new Uint8Array(cols * rows);
    grid[0] = 1;
    grid[1 * cols + 1] = 1;
    expect(connectedRegions(grid, cols, rows, 10)).toHaveLength(1);
  });

  it("handles a fully inked grid without overflowing the stack", () => {
    // Recursion would die here on a real page-sized grid.
    const cols = 200;
    const rows = 200;
    const grid = new Uint8Array(cols * rows).fill(1);
    const regions = connectedRegions(grid, cols, rows, 8);
    expect(regions).toHaveLength(1);
    expect(regions[0].cells).toBe(cols * rows);
  });

  it("returns nothing for an empty grid", () => {
    expect(connectedRegions(new Uint8Array(100), 10, 10, 10)).toEqual([]);
  });
});

describe("classifyRegion", () => {
  const page = { width: 1000, height: 1400 };

  it("calls a wide sparse mark low on the page a signature", () => {
    expect(classifyRegion({ x0: 500, y0: 1200, x1: 900, y1: 1300 }, 0.3, page)).toBe("signature");
  });

  it("calls a small mark at the top a logo", () => {
    expect(classifyRegion({ x0: 40, y0: 20, x1: 160, y1: 120 }, 0.9, page)).toBe("logo");
  });

  it("calls a large region a figure", () => {
    expect(classifyRegion({ x0: 100, y0: 400, x1: 900, y1: 1000 }, 0.9, page)).toBe("figure");
  });

  it("returns unknown rather than guessing on a tiny speck", () => {
    // Admitting ignorance beats labelling a speck a signature, because callers
    // treat signatures as content not to be read.
    expect(classifyRegion({ x0: 500, y0: 700, x1: 520, y1: 720 }, 0.9, page)).toBe("unknown");
  });

  it("returns unknown for a degenerate box", () => {
    expect(classifyRegion({ x0: 10, y0: 10, x1: 10, y1: 10 }, 1, page)).toBe("unknown");
  });
});

describe("detectFigures", () => {
  it("finds a photograph among text", () => {
    const r = createRaster(800, 1000, 255);
    const lines: Line[] = [];
    for (let i = 0; i < 6; i++) lines.push(textRow(r, 60, 60 + i * 30, 600));
    // A solid block with no words reported over it.
    fillRect(r, 100, 400, 500, 400, 40);

    const figs = detectFigures(r, lines);
    expect(figs.length).toBeGreaterThan(0);
    const f = figs[0];
    expect(f.bbox.x0).toBeLessThanOrEqual(110);
    expect(f.bbox.x1).toBeGreaterThanOrEqual(590);
    expect(f.kind).toBe("figure");
  });

  it("does NOT report text as a figure", () => {
    // The failure that would matter most: every paragraph becoming an "image".
    const r = createRaster(800, 1000, 255);
    const lines: Line[] = [];
    for (let i = 0; i < 20; i++) lines.push(textRow(r, 60, 60 + i * 30, 600));
    expect(detectFigures(r, lines)).toEqual([]);
  });

  it("finds nothing on a blank page", () => {
    expect(detectFigures(createRaster(400, 400, 255), [])).toEqual([]);
  });

  it("ignores a region too small to matter", () => {
    const r = createRaster(800, 1000, 255);
    fillRect(r, 10, 10, 12, 12, 0);
    expect(detectFigures(r, [])).toEqual([]);
  });

  it("ignores a region covering essentially the whole page", () => {
    // That is the page itself (or an inverted scan), not a figure.
    const r = createRaster(400, 400, 255);
    fillRect(r, 0, 0, 400, 400, 0);
    expect(detectFigures(r, [])).toEqual([]);
  });

  it("finds two separate figures", () => {
    const r = createRaster(800, 1000, 255);
    fillRect(r, 60, 100, 250, 200, 30);
    fillRect(r, 480, 600, 250, 200, 30);
    expect(detectFigures(r, [])).toHaveLength(2);
  });

  it("returns the largest region first", () => {
    const r = createRaster(800, 1000, 255);
    fillRect(r, 60, 100, 120, 120, 30);
    fillRect(r, 300, 400, 400, 300, 30);
    const figs = detectFigures(r, []);
    const area = (f: (typeof figs)[number]) =>
      (f.bbox.x1 - f.bbox.x0) * (f.bbox.y1 - f.bbox.y0);
    expect(area(figs[0])).toBeGreaterThan(area(figs[1]));
  });

  it("gives every region a distinct id", () => {
    const r = createRaster(800, 1000, 255);
    fillRect(r, 60, 100, 250, 200, 30);
    fillRect(r, 480, 600, 250, 200, 30);
    const ids = detectFigures(r, []).map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps regions inside the page bounds", () => {
    // The grid rounds up past the right and bottom edges.
    const r = createRaster(300, 300, 255);
    fillRect(r, 100, 100, 195, 195, 30);
    for (const f of detectFigures(r, [])) {
      expect(f.bbox.x1).toBeLessThanOrEqual(300);
      expect(f.bbox.y1).toBeLessThanOrEqual(300);
    }
  });
});

describe("isInsideFigure", () => {
  const figures = [
    { id: "i0", bbox: { x0: 100, y0: 100, x1: 400, y1: 400 }, kind: "figure" as const },
  ];

  it("detects a block wholly inside a figure", () => {
    expect(isInsideFigure({ x0: 150, y0: 150, x1: 300, y1: 300 }, figures)).toBe(true);
  });

  it("rejects a block outside", () => {
    expect(isInsideFigure({ x0: 500, y0: 500, x1: 600, y1: 600 }, figures)).toBe(false);
  });

  it("rejects a block only partly overlapping", () => {
    expect(isInsideFigure({ x0: 350, y0: 350, x1: 600, y1: 600 }, figures)).toBe(false);
  });

  it("tolerates a few pixels of overhang", () => {
    expect(isInsideFigure({ x0: 98, y0: 98, x1: 402, y1: 402 }, figures)).toBe(true);
  });
});
