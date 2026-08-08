import { describe, it, expect } from "vitest";
import {
  clusterColumns,
  detectHeaderRow,
  detectTable,
  groupIntoRows,
  isNumericCell,
  splitRowIntoSegments,
  tableToMarkdown,
  DEFAULT_TABLE_OPTIONS,
} from "@/lib/ocr/table";
import type { Line, TableCell, Word } from "@/lib/ocr/types";

const OPTS = DEFAULT_TABLE_OPTIONS;
let uid = 0;

/** One word at an exact x-range — tables are all about horizontal position. */
function word(text: string, x0: number, y0: number, w = 8): Word {
  const width = text.length * w;
  return {
    id: `w${uid++}`,
    text,
    bbox: { x0, y0, x1: x0 + width, y1: y0 + 16 },
    confidence: 92,
  };
}

/** A line made of words placed at given x positions. */
function lineOf(words: Word[]): Line {
  const x0 = Math.min(...words.map((w) => w.bbox.x0));
  const x1 = Math.max(...words.map((w) => w.bbox.x1));
  const y0 = Math.min(...words.map((w) => w.bbox.y0));
  const y1 = Math.max(...words.map((w) => w.bbox.y1));
  return { id: `l${uid++}`, words, bbox: { x0, y0, x1, y1 } };
}

/** A line of prose with realistic ~5px word spacing at 16px glyph height. */
function proseLine(text: string, y: number, x = 0): Line {
  const words: Word[] = [];
  let cursor = x;
  for (const t of text.split(" ")) {
    const w = word(t, cursor, y);
    words.push(w);
    cursor = w.bbox.x1 + 5;
  }
  return lineOf(words);
}

/** A 3-column table row: label at x=0, qty at x=300, price at x=500. */
function tableRow(a: string, b: string, c: string, y: number): Line {
  return lineOf([word(a, 0, y), word(b, 300, y), word(c, 500, y)]);
}

describe("groupIntoRows", () => {
  it("groups vertically overlapping lines into one row", () => {
    // Cells the engine emitted as separate lines but which share a row.
    const rows = groupIntoRows(
      [lineOf([word("Widget", 0, 100)]), lineOf([word("12", 400, 100)])],
      OPTS
    );
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveLength(2);
  });

  it("keeps vertically separated lines in different rows", () => {
    const rows = groupIntoRows(
      [lineOf([word("a", 0, 100)]), lineOf([word("b", 0, 200)])],
      OPTS
    );
    expect(rows).toHaveLength(2);
  });

  it("orders cells left to right within a row", () => {
    const rows = groupIntoRows(
      [lineOf([word("right", 400, 100)]), lineOf([word("left", 0, 100)])],
      OPTS
    );
    expect(rows[0][0].words[0].text).toBe("left");
  });
});

describe("splitRowIntoSegments", () => {
  it("splits at large horizontal gaps", () => {
    const row = [lineOf([word("Widget", 0, 0), word("12", 300, 0), word("9.99", 500, 0)])];
    const segs = splitRowIntoSegments(row, OPTS);
    expect(segs.map((s) => s.text)).toEqual(["Widget", "12", "9.99"]);
  });

  it("keeps adjacent words of a multi-word cell together", () => {
    // "Blue Widget" is one cell; the jump to x=300 is the real boundary.
    const row = [
      lineOf([word("Blue", 0, 0), word("Widget", 40, 0), word("12", 300, 0)]),
    ];
    const segs = splitRowIntoSegments(row, OPTS);
    expect(segs.map((s) => s.text)).toEqual(["Blue Widget", "12"]);
  });

  it("returns a single segment for evenly spaced prose", () => {
    expect(splitRowIntoSegments([proseLine("the quick brown fox jumps", 0)], OPTS)).toHaveLength(1);
  });

  it("returns nothing for an empty row", () => {
    expect(splitRowIntoSegments([], OPTS)).toEqual([]);
  });
});

describe("clusterColumns", () => {
  it("merges near-identical left edges into one guide", () => {
    const segs = [
      { text: "a", bbox: { x0: 100, y0: 0, x1: 150, y1: 10 }, words: [] },
      { text: "b", bbox: { x0: 104, y0: 20, x1: 150, y1: 30 }, words: [] },
      { text: "c", bbox: { x0: 500, y0: 0, x1: 550, y1: 10 }, words: [] },
    ];
    const cols = clusterColumns(segs, 600);
    expect(cols).toHaveLength(2);
    expect(cols[0]).toBeCloseTo(102, 0);
  });

  it("returns nothing for no segments", () => {
    expect(clusterColumns([], 600)).toEqual([]);
  });
});

describe("isNumericCell", () => {
  it.each(["12", "9.99", "1,200", "45%", "3/4", "-5"])("treats %s as numeric", (t) => {
    expect(isNumericCell(t)).toBe(true);
  });
  it.each(["Widget", "Item 3", "N/A", ""])("treats %s as non-numeric", (t) => {
    expect(isNumericCell(t)).toBe(false);
  });
});

describe("detectHeaderRow", () => {
  const cell = (text: string): TableCell => ({
    id: text,
    text,
    bbox: { x0: 0, y0: 0, x1: 1, y1: 1 },
    rowSpan: 1,
    colSpan: 1,
    isHeader: false,
  });

  it("detects a textual header over numeric body rows", () => {
    expect(
      detectHeaderRow([
        [cell("Item"), cell("Qty")],
        [cell("Widget"), cell("12")],
      ])
    ).toBe(true);
  });

  it("rejects a first row that already contains numbers", () => {
    expect(
      detectHeaderRow([
        [cell("Widget"), cell("12")],
        [cell("Gadget"), cell("7")],
      ])
    ).toBe(false);
  });

  it("returns false for a single-row table", () => {
    expect(detectHeaderRow([[cell("Item"), cell("Qty")]])).toBe(false);
  });
});

describe("detectTable", () => {
  const invoice = () => [
    tableRow("Item", "Qty", "Price", 0),
    tableRow("Widget", "12", "9.99", 40),
    tableRow("Gadget", "7", "24.50", 80),
    tableRow("Doohickey", "3", "5.00", 120),
  ];

  it("reconstructs a 3-column invoice table", () => {
    const t = detectTable(invoice())!;
    expect(t).not.toBeNull();
    expect(t.rows).toHaveLength(4);
    expect(t.rows[1].map((c) => c.text)).toEqual(["Widget", "12", "9.99"]);
  });

  it("marks the header row", () => {
    const t = detectTable(invoice())!;
    expect(t.hasHeaderRow).toBe(true);
    expect(t.rows[0].every((c) => c.isHeader)).toBe(true);
    expect(t.rows[1].every((c) => c.isHeader)).toBe(false);
  });

  it("reports a confidence in range", () => {
    const t = detectTable(invoice())!;
    expect(t.confidence).toBeGreaterThan(0.5);
    expect(t.confidence).toBeLessThanOrEqual(0.98);
  });

  it("REFUSES to turn ordinary prose into a table", () => {
    // The failure mode that matters most: a false positive shreds paragraphs
    // into a grid, which is far worse than leaving them as prose.
    const prose = [0, 30, 60, 90].map((y) =>
      proseLine("the quick brown fox jumps over lazy dogs", y)
    );
    expect(detectTable(prose)).toBeNull();
  });

  it("returns null when only one row happens to have a wide gap", () => {
    const lines = [
      proseLine("normal text here on one line", 0),
      proseLine("also normal text on this line", 40),
      tableRow("odd", "one", "out", 80),
    ];
    expect(detectTable(lines)).toBeNull();
  });

  it("returns null below the minimum row count", () => {
    expect(detectTable([tableRow("a", "b", "c", 0)])).toBeNull();
  });

  it("handles cells the engine split across separate lines", () => {
    // Same row, three separate Line objects — common when cells are far apart.
    const lines = [
      lineOf([word("Item", 0, 0)]),
      lineOf([word("Qty", 300, 0)]),
      lineOf([word("Price", 500, 0)]),
      lineOf([word("Widget", 0, 40)]),
      lineOf([word("12", 300, 40)]),
      lineOf([word("9.99", 500, 40)]),
      lineOf([word("Gadget", 0, 80)]),
      lineOf([word("7", 300, 80)]),
      lineOf([word("24.50", 500, 80)]),
    ];
    const t = detectTable(lines)!;
    expect(t).not.toBeNull();
    expect(t.rows).toHaveLength(3);
    expect(t.rows[1].map((c) => c.text)).toEqual(["Widget", "12", "9.99"]);
  });

  it("infers colSpan for a cell that covers two column guides", () => {
    const lines = [
      tableRow("Item", "Qty", "Price", 0),
      tableRow("Widget", "12", "9.99", 40),
      tableRow("Gadget", "7", "24.50", 80),
      // A row whose first cell spans the first two columns.
      lineOf([word("Subtotal", 0, 120), word("34.49", 500, 120)]),
    ];
    const t = detectTable(lines)!;
    const last = t.rows[3];
    expect(last[0].text).toBe("Subtotal");
    expect(last[0].colSpan).toBe(2);
    expect(last[1].colSpan).toBe(1);
  });

  it("preserves multi-word cell text", () => {
    const lines = [
      lineOf([word("Item", 0, 0), word("Qty", 300, 0)]),
      lineOf([word("Blue", 0, 40), word("Widget", 42, 40), word("12", 300, 40)]),
      lineOf([word("Red", 0, 80), word("Gadget", 34, 80), word("7", 300, 80)]),
    ];
    const t = detectTable(lines)!;
    expect(t.rows[1][0].text).toBe("Blue Widget");
  });
});

describe("tableToMarkdown", () => {
  it("emits a header separator row", () => {
    const t = detectTable([
      tableRow("Item", "Qty", "Price", 0),
      tableRow("Widget", "12", "9.99", 40),
      tableRow("Gadget", "7", "24.50", 80),
    ])!;
    const md = tableToMarkdown(t).split("\n");
    expect(md[0]).toBe("| Item | Qty | Price |");
    expect(md[1]).toBe("| --- | --- | --- |");
    expect(md[2]).toBe("| Widget | 12 | 9.99 |");
  });

  it("escapes pipes so a cell cannot break the table", () => {
    const t = {
      rows: [
        [
          { id: "a", text: "a|b", bbox: { x0: 0, y0: 0, x1: 1, y1: 1 }, rowSpan: 1, colSpan: 1, isHeader: true },
        ],
      ],
      confidence: 0.9,
      hasHeaderRow: true,
    };
    expect(tableToMarkdown(t)).toContain("a\\|b");
  });

  it("returns an empty string for an empty table", () => {
    expect(tableToMarkdown({ rows: [], confidence: 0, hasHeaderRow: false })).toBe("");
  });
});
