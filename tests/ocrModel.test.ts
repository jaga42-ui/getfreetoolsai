import { describe, it, expect } from "vitest";
import {
  unionBox,
  verticalOverlap,
  horizontalOverlap,
  computeQuality,
  meanWordConfidence,
  createIdFactory,
  failedPage,
  type Block,
  type DocumentModel,
  type Line,
  type Page,
  type Word,
} from "@/lib/ocr/types";
import {
  linesFromTesseractBlocks,
  linesFromPlainText,
  TESSERACT_LANGUAGES,
} from "@/lib/ocr/providers/tesseract";
import {
  registerProvider,
  createProvider,
  availableProviders,
  resetProviders,
  OcrPageError,
} from "@/lib/ocr/provider";

const box = (x0: number, y0: number, x1: number, y1: number) => ({ x0, y0, x1, y1 });

describe("geometry helpers", () => {
  it("unionBox returns null for an empty list", () => {
    expect(unionBox([])).toBeNull();
  });

  it("unionBox spans all inputs", () => {
    expect(unionBox([box(10, 10, 20, 20), box(5, 30, 40, 35)])).toEqual(box(5, 10, 40, 35));
  });

  it("verticalOverlap is 0 for vertically disjoint boxes", () => {
    expect(verticalOverlap(box(0, 0, 10, 10), box(0, 20, 10, 30))).toBe(0);
  });

  it("verticalOverlap is 1 when one box fully covers the other's height", () => {
    // Same rows — typical of two cells in one table row.
    expect(verticalOverlap(box(0, 10, 10, 20), box(100, 10, 110, 20))).toBe(1);
  });

  it("verticalOverlap normalizes by the SHORTER box", () => {
    // A 10px-tall box entirely inside a 100px-tall one is fully overlapped,
    // even though it covers only a tenth of the taller box.
    expect(verticalOverlap(box(0, 0, 10, 100), box(0, 40, 10, 50))).toBe(1);
  });

  it("horizontalOverlap is 0 for side-by-side columns", () => {
    // The signal that distinguishes two columns from one wide block.
    expect(horizontalOverlap(box(0, 0, 300, 50), box(400, 0, 700, 50))).toBe(0);
  });
});

describe("createIdFactory", () => {
  it("produces stable sequential ids", () => {
    const next = createIdFactory("w");
    expect([next(), next(), next()]).toEqual(["w0", "w1", "w2"]);
  });

  it("keeps separate factories independent", () => {
    const a = createIdFactory("a");
    const b = createIdFactory("b");
    a();
    expect(b()).toBe("b0");
  });
});

describe("meanWordConfidence", () => {
  const w = (confidence: number): Word => ({
    id: "x",
    text: "t",
    bbox: box(0, 0, 1, 1),
    confidence,
  });

  it("returns 0 for no words rather than NaN", () => {
    expect(meanWordConfidence([])).toBe(0);
  });

  it("averages confidences", () => {
    expect(meanWordConfidence([w(90), w(70)])).toBe(80);
  });
});

/* ------------------------------------------------------------------ */

function makeWord(text: string, confidence: number): Word {
  return { id: `w-${text}`, text, bbox: box(0, 0, 10, 10), confidence };
}
function makeLine(words: Word[]): Line {
  return { id: "l", words, bbox: box(0, 0, 100, 10) };
}
function makeBlock(over: Partial<Block> & { lines: Line[] }): Block {
  return {
    id: "b",
    type: "paragraph",
    bbox: box(0, 0, 100, 10),
    confidence: 0,
    typeConfidence: 1,
    readingOrder: 0,
    ...over,
  };
}
function makePage(over: Partial<Page> & { blocks: Block[] }): Page {
  return {
    index: 0,
    width: 100,
    height: 100,
    rotation: 0,
    images: [],
    source: "ocr",
    status: "ok",
    ...over,
  };
}
function makeDoc(pages: Page[]): DocumentModel {
  return {
    metadata: { kind: "generic", kindConfidence: 0, languages: ["eng"], providerId: "test" },
    pages,
  };
}

describe("computeQuality", () => {
  it("returns nulls, not zeros, when nothing was measured", () => {
    // An empty document must not report a confident-looking 0%.
    const q = computeQuality(makeDoc([]));
    expect(q.ocrConfidence).toBeNull();
    expect(q.layoutConfidence).toBeNull();
    expect(q.tableDetection).toBeNull();
    expect(q.overall).toBeNull();
  });

  it("leaves tableDetection null when the document has no tables", () => {
    const q = computeQuality(
      makeDoc([makePage({ blocks: [makeBlock({ lines: [makeLine([makeWord("a", 90)])] })] })])
    );
    expect(q.tableDetection).toBeNull();
    expect(q.ocrConfidence).toBe(90);
  });

  it("scores a reused native text layer as exact rather than by OCR confidence", () => {
    // Native PDF text is not a guess, so a low stored confidence must not drag
    // the score down.
    const q = computeQuality(
      makeDoc([
        makePage({
          source: "native",
          blocks: [makeBlock({ lines: [makeLine([makeWord("a", 0)])] })],
        }),
      ])
    );
    expect(q.ocrConfidence).toBe(100);
  });

  it("excludes failed pages from averages but reports them", () => {
    const good = makePage({ blocks: [makeBlock({ lines: [makeLine([makeWord("a", 80)])] })] });
    const bad = failedPage(1, 100, 100, "boom");
    const q = computeQuality(makeDoc([good, bad]));
    expect(q.ocrConfidence).toBe(80);
    expect(q.failedPages).toEqual([1]);
  });

  it("weights ocr/layout/table 50/30/20", () => {
    const q = computeQuality(
      makeDoc([
        makePage({
          blocks: [
            makeBlock({
              typeConfidence: 0.5,
              lines: [makeLine([makeWord("a", 100)])],
              table: { rows: [], confidence: 0, hasHeaderRow: false },
            }),
          ],
        }),
      ])
    );
    // 100*0.5 + 50*0.3 + 0*0.2 = 65
    expect(q.overall).toBeCloseTo(65, 6);
  });

  it("renormalizes weights when a component is absent", () => {
    // No tables: the remaining 0.5/0.3 must renormalize to 1, not sum to 0.8.
    const q = computeQuality(
      makeDoc([
        makePage({
          blocks: [makeBlock({ typeConfidence: 1, lines: [makeLine([makeWord("a", 50)])] })],
        }),
      ])
    );
    // (50*0.5 + 100*0.3) / 0.8 = 68.75
    expect(q.overall).toBeCloseTo(68.75, 6);
  });
});

/* ------------------------------------------------------------------ */

describe("linesFromTesseractBlocks", () => {
  const tBox = (x0: number, y0: number, x1: number, y1: number) => ({ x0, y0, x1, y1 });

  it("returns nothing for null blocks", () => {
    expect(linesFromTesseractBlocks(null).lines).toEqual([]);
  });

  it("flattens block > paragraph > line > word into normalized lines", () => {
    const { lines } = linesFromTesseractBlocks([
      {
        bbox: tBox(0, 0, 200, 40),
        paragraphs: [
          {
            bbox: tBox(0, 0, 200, 40),
            lines: [
              {
                text: "hello world",
                bbox: tBox(0, 0, 200, 20),
                words: [
                  { text: "hello", confidence: 95, bbox: tBox(0, 0, 90, 20) },
                  { text: "world", confidence: 85, bbox: tBox(100, 0, 200, 20) },
                ],
              },
            ],
          },
        ],
      },
    ]);
    expect(lines).toHaveLength(1);
    expect(lines[0].words.map((w) => w.text)).toEqual(["hello", "world"]);
    expect(lines[0].words[0].confidence).toBe(95);
  });

  it("drops whitespace-only words so they don't skew confidence", () => {
    const { lines } = linesFromTesseractBlocks([
      {
        bbox: tBox(0, 0, 100, 20),
        paragraphs: [
          {
            bbox: tBox(0, 0, 100, 20),
            lines: [
              {
                text: "a",
                bbox: tBox(0, 0, 100, 20),
                words: [
                  { text: "a", confidence: 90, bbox: tBox(0, 0, 10, 20) },
                  { text: "   ", confidence: 0, bbox: tBox(10, 0, 20, 20) },
                ],
              },
            ],
          },
        ],
      },
    ]);
    expect(lines[0].words).toHaveLength(1);
    expect(meanWordConfidence(lines[0].words)).toBe(90);
  });

  it("skips lines that contain no real words", () => {
    const { lines } = linesFromTesseractBlocks([
      {
        bbox: tBox(0, 0, 100, 20),
        paragraphs: [
          {
            bbox: tBox(0, 0, 100, 20),
            lines: [{ text: " ", bbox: tBox(0, 0, 100, 20), words: [{ text: " ", confidence: 0, bbox: tBox(0, 0, 5, 5) }] }],
          },
        ],
      },
    ]);
    expect(lines).toEqual([]);
  });

  it("derives the line box from word boxes, not the engine's line box", () => {
    // The engine's line box runs to x1=500 (trailing whitespace); the real text
    // ends at 90. Using the engine box would distort column clustering.
    const { lines } = linesFromTesseractBlocks([
      {
        bbox: tBox(0, 0, 500, 20),
        paragraphs: [
          {
            bbox: tBox(0, 0, 500, 20),
            lines: [
              {
                text: "hi",
                bbox: tBox(0, 0, 500, 20),
                words: [{ text: "hi", confidence: 90, bbox: tBox(10, 2, 90, 18) }],
              },
            ],
          },
        ],
      },
    ]);
    expect(lines[0].bbox).toEqual(box(10, 2, 90, 18));
  });

  it("clamps out-of-range confidences into 0..100", () => {
    const { lines } = linesFromTesseractBlocks([
      {
        bbox: tBox(0, 0, 100, 20),
        paragraphs: [
          {
            bbox: tBox(0, 0, 100, 20),
            lines: [
              {
                text: "x y",
                bbox: tBox(0, 0, 100, 20),
                words: [
                  { text: "x", confidence: 140, bbox: tBox(0, 0, 10, 20) },
                  { text: "y", confidence: -5, bbox: tBox(20, 0, 30, 20) },
                ],
              },
            ],
          },
        ],
      },
    ]);
    expect(lines[0].words.map((w) => w.confidence)).toEqual([100, 0]);
  });

  it("exposes block boxes as advisory regions", () => {
    const { regions } = linesFromTesseractBlocks([
      { bbox: tBox(0, 0, 300, 400), paragraphs: [] },
      { bbox: tBox(320, 0, 620, 400), paragraphs: [] },
    ]);
    expect(regions).toEqual([{ bbox: box(0, 0, 300, 400) }, { bbox: box(320, 0, 620, 400) }]);
  });

  it("estimates font size from glyph height", () => {
    const { lines } = linesFromTesseractBlocks([
      {
        bbox: tBox(0, 0, 100, 40),
        paragraphs: [
          {
            bbox: tBox(0, 0, 100, 40),
            lines: [
              {
                text: "Big",
                bbox: tBox(0, 0, 100, 40),
                words: [{ text: "Big", confidence: 90, bbox: tBox(0, 5, 60, 37) }],
              },
            ],
          },
        ],
      },
    ]);
    expect(lines[0].words[0].style?.fontSizePx).toBe(32);
  });

  it("does not guess bold or italic from geometry", () => {
    const { lines } = linesFromTesseractBlocks([
      {
        bbox: tBox(0, 0, 100, 20),
        paragraphs: [
          {
            bbox: tBox(0, 0, 100, 20),
            lines: [
              {
                text: "x",
                bbox: tBox(0, 0, 100, 20),
                words: [{ text: "x", confidence: 90, bbox: tBox(0, 0, 10, 20) }],
              },
            ],
          },
        ],
      },
    ]);
    expect(lines[0].words[0].style?.bold).toBeUndefined();
    expect(lines[0].words[0].style?.italic).toBeUndefined();
  });
});

describe("linesFromPlainText fallback", () => {
  it("marks synthetic lines at zero confidence so they are distinguishable", () => {
    const lines = linesFromPlainText("one\ntwo", 500);
    expect(lines).toHaveLength(2);
    expect(lines.every((l) => l.words.every((w) => w.confidence === 0))).toBe(true);
  });

  it("drops blank lines", () => {
    expect(linesFromPlainText("a\n\n\nb", 100)).toHaveLength(2);
  });
});

describe("language list", () => {
  it("exposes 13 languages, 8 of them Indian", () => {
    // Pinned deliberately: this count is quoted in user-facing copy on
    // /ocr-tools, and an earlier draft claimed 9. The page computes the number
    // from this list rather than hardcoding it, and this test is what keeps
    // the list and the claim honest.
    expect(TESSERACT_LANGUAGES).toHaveLength(13);
    const indian = TESSERACT_LANGUAGES.filter((l) =>
      ["Devanagari", "Bengali", "Odia", "Tamil", "Telugu", "Gujarati", "Gurmukhi"].includes(l.script)
    );
    expect(indian.map((l) => l.code)).toEqual([
      "hin",
      "ben",
      "ori",
      "tam",
      "tel",
      "mar",
      "guj",
      "pan",
    ]);
  });

  it("has no duplicate codes", () => {
    const codes = TESSERACT_LANGUAGES.map((l) => l.code);
    expect(new Set(codes).size).toBe(codes.length);
  });
});

describe("provider registry", () => {
  it("registers and instantiates by id", () => {
    resetProviders();
    const fake = {
      id: "fake",
      displayName: "Fake",
      runsLocally: true,
      languages: () => [],
      init: async () => {},
      recognize: async () => ({ pageIndex: 0, width: 0, height: 0, lines: [], confidence: 0 }),
      terminate: async () => {},
    };
    registerProvider("fake", () => fake);
    expect(availableProviders()).toContain("fake");
    expect(createProvider("fake").id).toBe("fake");
  });

  it("throws a helpful error for an unknown id", () => {
    resetProviders();
    registerProvider("a", () => ({}) as never);
    expect(() => createProvider("nope")).toThrow(/Unknown OCR provider "nope".*Registered: a/);
  });
});

describe("OcrPageError", () => {
  it("carries the page index for per-page isolation", () => {
    const e = new OcrPageError(6, "bad scan");
    expect(e.pageIndex).toBe(6);
    expect(e.name).toBe("OcrPageError");
  });
});

describe("failedPage", () => {
  it("produces an empty page marked failed so a run can continue", () => {
    const p = failedPage(3, 800, 1000, "timeout");
    expect(p).toMatchObject({ index: 3, status: "failed", error: "timeout", blocks: [], images: [] });
  });
});
