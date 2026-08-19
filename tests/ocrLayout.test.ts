import { describe, it, expect } from "vitest";
import {
  analyzePage,
  classifyBlock,
  detectColumns,
  estimateAlign,
  findGutters,
  looksLikeTableGap,
  assignToColumn,
  median,
  pageToText,
  resolveReadingOrder,
  segmentIntoBlocks,
  DEFAULT_LAYOUT_OPTIONS,
} from "@/lib/ocr/layout";
import type { Block, Line } from "@/lib/ocr/types";
import type { RecognizedPage } from "@/lib/ocr/provider";

const OPTS = DEFAULT_LAYOUT_OPTIONS;
const BODY_A = "the quick brown fox jumps over lazy dogs";

let uid = 0;
/** A line of text at a position, with a given glyph height. */
function line(text: string, x0: number, y0: number, x1: number, size = 16): Line {
  const bbox = { x0, y0, x1, y1: y0 + size };
  return {
    id: `l${uid++}`,
    bbox,
    words: text.split(" ").map((t, i) => ({
      id: `w${uid++}-${i}`,
      text: t,
      bbox,
      confidence: 90,
      style: { fontSizePx: size },
    })),
  };
}

const page = (lines: Line[], width = 1000, height = 1400): RecognizedPage => ({
  pageIndex: 0,
  width,
  height,
  lines,
  confidence: 90,
});

describe("median", () => {
  it("returns 0 for an empty list", () => expect(median([])).toBe(0));
  it("handles odd and even counts", () => {
    expect(median([3, 1, 2])).toBe(2);
    expect(median([4, 1, 2, 3])).toBe(2.5);
  });
});

describe("findGutters", () => {
  it("finds the gap between two columns", () => {
    const lines = [
      line("the quick brown fox jumps over lazy dogs", 60, 100, 440),
      line("the quick brown fox jumps over lazy dogs", 60, 130, 440),
      line("the quick brown fox jumps over lazy dogs", 60, 160, 440),
      line("the quick brown fox jumps over lazy dogs", 560, 100, 940),
      line("the quick brown fox jumps over lazy dogs", 560, 130, 940),
      line("the quick brown fox jumps over lazy dogs", 560, 160, 940),
    ];
    const gutters = findGutters(lines, 1000, OPTS);
    expect(gutters).toHaveLength(1);
    expect(gutters[0].x0).toBeGreaterThanOrEqual(440);
    expect(gutters[0].x1).toBeLessThanOrEqual(565);
  });

  it("ignores page margins", () => {
    // Wide empty margins either side must not be reported as gutters.
    const lines = [
      line("a", 200, 10, 800),
      line("b", 200, 40, 800),
      line("c", 200, 70, 800),
      line("d", 200, 100, 800),
      line("e", 200, 130, 800),
      line("f", 200, 160, 800),
    ];
    expect(findGutters(lines, 1000, OPTS)).toEqual([]);
  });

  it("returns nothing when there are too few lines to judge", () => {
    expect(findGutters([line("x", 0, 0, 100)], 1000, OPTS)).toEqual([]);
  });
});

describe("looksLikeTableGap", () => {
  it("fires for short cells sitting in shared rows", () => {
    // A real table: rows align AND cells fill little of the column.
    const left = [line("Widget", 0, 100, 90), line("Gadget", 0, 140, 80), line("Doohickey", 0, 180, 120)];
    const right = [line("12", 400, 100, 430), line("7", 400, 140, 425), line("103", 400, 180, 440)];
    expect(looksLikeTableGap(left, right, OPTS)).toBe(true);
  });

  it("does NOT fire for a row-aligned two-column layout", () => {
    // The trap: genuine text columns share a top margin and leading, so their
    // baselines align down the page just like a table's. Words-per-line is what
    // separates them — body copy runs to 6+ words, table cells to 1-3.
    const left: Line[] = [];
    const right: Line[] = [];
    for (let i = 0; i < 6; i++) {
      left.push(line("a full measure line of body copy", 0, 100 + i * 30, 380));
      right.push(line("another full measure line here", 400, 100 + i * 30, 780));
    }
    expect(looksLikeTableGap(left, right, OPTS)).toBe(false);
  });

  it("does not fire for independently flowing text columns", () => {
    const left = [line("a", 0, 100, 200), line("b", 0, 130, 200), line("c", 0, 160, 200)];
    const right = [line("1", 400, 300, 600), line("2", 400, 330, 600), line("3", 400, 360, 600)];
    expect(looksLikeTableGap(left, right, OPTS)).toBe(false);
  });
});

describe("detectColumns", () => {
  const twoColumnBody = () => {
    const out: Line[] = [];
    for (let i = 0; i < 8; i++) out.push(line(`left the quick brown fox jumps over lazy dogs ${i}`, 60, 100 + i * 30, 440));
    for (let i = 0; i < 8; i++) out.push(line(`right the quick brown fox jumps over lazy dogs ${i}`, 560, 100 + i * 30, 940));
    return out;
  };

  it("finds two columns", () => {
    const cols = detectColumns(twoColumnBody(), 1000, OPTS);
    expect(cols).toHaveLength(2);
  });

  it("finds three columns", () => {
    const out: Line[] = [];
    for (let i = 0; i < 6; i++) {
      out.push(line(`a the quick brown fox jumps over lazy dogs ${i}`, 40, 100 + i * 30, 300));
      out.push(line(`b the quick brown fox jumps over lazy dogs ${i}`, 370, 100 + i * 30, 630));
      out.push(line(`c the quick brown fox jumps over lazy dogs ${i}`, 700, 100 + i * 30, 960));
    }
    expect(detectColumns(out, 1000, OPTS)).toHaveLength(3);
  });

  it("returns one column for ordinary prose", () => {
    const out: Line[] = [];
    for (let i = 0; i < 8; i++) out.push(line(`the quick brown fox jumps over lazy dogs ${i}`, 60, 100 + i * 30, 940));
    expect(detectColumns(out, 1000, OPTS)).toHaveLength(1);
  });

  it("refuses to split when a column would be too sparse", () => {
    const out: Line[] = [];
    for (let i = 0; i < 8; i++) out.push(line(`left the quick brown fox jumps over lazy dogs ${i}`, 60, 100 + i * 30, 440));
    out.push(line("lonely", 560, 100, 940)); // only 1 line on the right
    expect(detectColumns(out, 1000, OPTS)).toHaveLength(1);
  });

  it("does not mistake a table for columns", () => {
    // Same x-gap as a two-column layout, but rows align AND the cells are
    // short — the combination that identifies a table.
    const out: Line[] = [];
    for (let i = 0; i < 6; i++) {
      out.push(line(`item${i}`, 60, 100 + i * 40, 190));
      out.push(line(`$${i}`, 560, 100 + i * 40, 610));
    }
    expect(detectColumns(out, 1000, OPTS)).toHaveLength(1);
  });
});

describe("segmentIntoBlocks", () => {
  it("keeps evenly spaced lines in one block", () => {
    const lines = [line("a", 0, 0, 500), line("b", 0, 25, 500), line("c", 0, 50, 500)];
    expect(segmentIntoBlocks(lines)).toHaveLength(1);
  });

  it("splits on a large vertical gap", () => {
    const lines = [
      line("a", 0, 0, 500),
      line("b", 0, 25, 500),
      line("c", 0, 300, 500), // big gap
      line("d", 0, 325, 500),
    ];
    expect(segmentIntoBlocks(lines)).toHaveLength(2);
  });

  it("splits when font size changes sharply", () => {
    const lines = [
      line("Heading", 0, 0, 400, 34),
      line("body one", 0, 45, 500, 16),
      line("body two", 0, 70, 500, 16),
    ];
    const groups = segmentIntoBlocks(lines);
    expect(groups).toHaveLength(2);
    expect(groups[0][0].words[0].text).toBe("Heading");
  });

  it("sorts unordered input by vertical position", () => {
    const groups = segmentIntoBlocks([line("second", 0, 25, 500), line("first", 0, 0, 500)]);
    expect(groups[0].map((l) => l.words[0].text)).toEqual(["first", "second"]);
  });
});

describe("classifyBlock", () => {
  const P = { width: 1000, height: 1400 };
  const cls = (lines: Line[], bodySize = 16) => {
    const b = lines.reduce(
      (acc, l) => ({
        x0: Math.min(acc.x0, l.bbox.x0),
        y0: Math.min(acc.y0, l.bbox.y0),
        x1: Math.max(acc.x1, l.bbox.x1),
        y1: Math.max(acc.y1, l.bbox.y1),
      }),
      { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity }
    );
    return classifyBlock(lines, b, P, bodySize, OPTS);
  };

  it("calls large short text a heading, with a level", () => {
    const r = cls([line("Chapter One", 60, 300, 500, 34)]);
    expect(r.type).toBe("heading");
    expect(r.level).toBe(1);
  });

  it("does not call a long large-set paragraph a heading", () => {
    const long = "word ".repeat(40).trim();
    expect(cls([line(long, 60, 300, 940, 22)]).type).toBe("paragraph");
  });

  it("detects a bulleted list", () => {
    const r = cls([line("• first", 60, 300, 500), line("• second", 60, 330, 500)]);
    expect(r.type).toBe("list");
  });

  it("detects a numbered list", () => {
    const r = cls([line("1. first", 60, 300, 500), line("2. second", 60, 330, 500)]);
    expect(r.type).toBe("list");
  });

  it("does not call a paragraph a list just because it starts with '1.'", () => {
    const r = cls([
      line("1. the first reason is long", 60, 300, 900),
      line("and it continues here", 60, 330, 900),
    ]);
    expect(r.type).not.toBe("list");
  });

  it("detects a page number in the footer band", () => {
    const r = cls([line("12", 480, 1350, 520)]);
    expect(r.type).toBe("pageNumber");
    expect(r.confidence).toBeGreaterThan(0.8);
  });

  it("detects a running header", () => {
    expect(cls([line("Annual Report 2026", 60, 20, 400)]).type).toBe("header");
  });

  it("classifies ordinary body text as a paragraph", () => {
    const r = cls([
      line("this is a normal sentence of body copy", 60, 400, 900),
      line("continuing onto a second line here", 60, 430, 900),
    ]);
    expect(r.type).toBe("paragraph");
    expect(r.confidence).toBeGreaterThan(0.5);
  });

  it("reports low confidence for an ambiguous short line", () => {
    const r = cls([line("Figure 1", 60, 600, 200)]);
    expect(r.confidence).toBeLessThan(0.5);
  });

  it("returns unknown at low confidence for empty text", () => {
    const r = cls([line("", 0, 0, 0)]);
    expect(r.confidence).toBeLessThanOrEqual(0.2);
  });
});

describe("estimateAlign", () => {
  const col = { x0: 0, x1: 1000 };
  it("detects centered text", () => {
    expect(estimateAlign({ x0: 400, y0: 0, x1: 600, y1: 20 }, col)).toBe("center");
  });
  it("detects left aligned text", () => {
    expect(estimateAlign({ x0: 0, y0: 0, x1: 600, y1: 20 }, col)).toBe("left");
  });
  it("detects right aligned text", () => {
    expect(estimateAlign({ x0: 700, y0: 0, x1: 1000, y1: 20 }, col)).toBe("right");
  });
});

describe("resolveReadingOrder", () => {
  const blk = (id: string, columnIndex: number, y0: number): Block => ({
    id,
    type: "paragraph",
    bbox: { x0: 0, y0, x1: 100, y1: y0 + 20 },
    lines: [],
    confidence: 90,
    typeConfidence: 0.8,
    readingOrder: 0,
    columnIndex,
  });

  it("reads column 0 fully before column 1", () => {
    const out = resolveReadingOrder([
      blk("A", 0, 100),
      blk("D", 1, 100),
      blk("B", 0, 200),
      blk("E", 1, 200),
      blk("C", 0, 300),
      blk("F", 1, 300),
    ]);
    expect(out.map((b) => b.id)).toEqual(["A", "B", "C", "D", "E", "F"]);
  });

  it("treats a full-width block as a section break", () => {
    const out = resolveReadingOrder([
      blk("A", 0, 100),
      blk("B", 1, 100),
      blk("TITLE", -1, 200),
      blk("C", 0, 300),
      blk("D", 1, 300),
    ]);
    expect(out.map((b) => b.id)).toEqual(["A", "B", "TITLE", "C", "D"]);
  });

  it("assigns sequential readingOrder indices", () => {
    const out = resolveReadingOrder([blk("A", 0, 100), blk("B", 0, 200)]);
    expect(out.map((b) => b.readingOrder)).toEqual([0, 1]);
  });
});

describe("analyzePage — end to end", () => {
  it("marks an empty page blank rather than failed", () => {
    const p = analyzePage(page([]));
    expect(p.status).toBe("blank");
    expect(p.blocks).toEqual([]);
  });

  it("REGRESSION: a two-column page does not interleave", () => {
    // The exact defect in the previous implementation. Raster order would
    // yield A D B E C F; correct reading order is A B C D E F.
    const lines: Line[] = [];
    const leftText = ["A", "B", "C"];
    const rightText = ["D", "E", "F"];
    for (let i = 0; i < 3; i++) {
      // Each cell is a small paragraph so both columns are populated enough.
      for (let j = 0; j < 3; j++) {
        lines.push(
          line(`${leftText[i]}${j} the quick brown fox jumps over lazy`, 60, 200 + i * 120 + j * 26, 440)
        );
        lines.push(
          line(`${rightText[i]}${j} the quick brown fox jumps over lazy`, 560, 200 + i * 120 + j * 26, 940)
        );
      }
    }
    const p = analyzePage(page(lines));
    const text = pageToText(p);
    const order = (text.match(/[A-F]/g) ?? []).filter((c, i, a) => a.indexOf(c) === i);
    expect(order).toEqual(["A", "B", "C", "D", "E", "F"]);
  });

  it("keeps single-column prose in visual order", () => {
    const lines = [
      line("first line of the paragraph", 60, 100, 900),
      line("second line of the paragraph", 60, 130, 900),
      line("third line of the paragraph", 60, 160, 900),
    ];
    const p = analyzePage(page(lines));
    expect(pageToText(p)).toContain("first line");
    expect(p.blocks[0].columnIndex).toBe(0);
  });

  it("identifies a title above two columns and reads it first", () => {
    const lines: Line[] = [line("A Wide Document Title", 60, 40, 940, 32)];
    for (let i = 0; i < 6; i++) {
      lines.push(line(`left the quick brown fox jumps over lazy dogs ${i}`, 60, 200 + i * 30, 440));
      lines.push(line(`right the quick brown fox jumps over lazy dogs ${i}`, 560, 200 + i * 30, 940));
    }
    const p = analyzePage(page(lines));
    const first = p.blocks.find((b) => b.readingOrder === 0)!;
    expect(first.lines[0].words.map((w) => w.text).join(" ")).toContain("Wide Document Title");
  });

  it("carries word confidence up into block confidence", () => {
    const l = line("hello world", 60, 100, 400);
    l.words[0].confidence = 60;
    l.words[1].confidence = 80;
    const p = analyzePage(page([l]));
    expect(p.blocks[0].confidence).toBe(70);
  });

  it("NEVER loses a word, whatever the column boundaries land on", () => {
    /*
     * Guards a bug class that bit twice on real output: strict boundaries
     * silently dropping content. Once at the gutter regions (a word centred
     * inside the gutter belonged to no region) and once at column assignment
     * (a line ending 8px past a bucket-quantized column edge matched no
     * column). Both lost a whole paragraph while every other test stayed green.
     *
     * Lines here are deliberately ragged so some overhang the boundaries.
     */
    const lines: Line[] = [];
    for (let i = 0; i < 6; i++) {
      lines.push(line(`left ${BODY_A} ${i}`, 60, 200 + i * 30, 440 + (i % 3) * 22));
      lines.push(line(`right ${BODY_A} ${i}`, 620, 200 + i * 30, 940 - (i % 2) * 18));
    }
    const expected = lines.flatMap((l) => l.words.map((w) => w.text)).sort();
    const p = analyzePage(page(lines));
    const got = p.blocks
      .flatMap((b) => b.lines.flatMap((l) => l.words.map((w) => w.text)))
      .sort();
    expect(got).toEqual(expected);
  });

  it("assignToColumn always returns a valid index, even with no overlap", () => {
    const cols = [
      { x0: 0, x1: 400 },
      { x0: 600, x1: 1000 },
    ];
    // Sits entirely inside the gutter — overlaps neither column.
    const orphan = line("stray", 470, 100, 520);
    const idx = assignToColumn(orphan, cols);
    expect(idx).toBeGreaterThanOrEqual(0);
    expect(idx).toBeLessThan(cols.length);
  });

  it("produces a reading order with no gaps or duplicates", () => {
    const lines: Line[] = [];
    for (let i = 0; i < 6; i++) {
      lines.push(line(`l the quick brown fox jumps over lazy dogs ${i}`, 60, 200 + i * 30, 440));
      lines.push(line(`r the quick brown fox jumps over lazy dogs ${i}`, 560, 200 + i * 30, 940));
    }
    const p = analyzePage(page(lines));
    const orders = p.blocks.map((b) => b.readingOrder).sort((a, b) => a - b);
    expect(orders).toEqual(orders.map((_, i) => i));
  });
});
