import { describe, it, expect } from "vitest";
import {
  buildDocument,
  classifyDocument,
  documentStats,
  documentText,
  lowConfidenceWords,
  pageText,
} from "@/lib/ocr/document";
import { toHtml, toJson, toMarkdown, toPlainText } from "@/lib/ocr/serialize";
import { analyzePage } from "@/lib/ocr/layout";
import { failedPage, type Block, type Line, type Page, type Word } from "@/lib/ocr/types";
import type { RecognizedPage } from "@/lib/ocr/provider";

let uid = 0;
function word(text: string, x0: number, y0: number, confidence = 92, w = 8): Word {
  return {
    id: `w${uid++}`,
    text,
    bbox: { x0, y0, x1: x0 + text.length * w, y1: y0 + 16 },
    confidence,
    style: { fontSizePx: 16 },
  };
}
function lineOf(words: Word[]): Line {
  return {
    id: `l${uid++}`,
    words,
    bbox: {
      x0: Math.min(...words.map((w) => w.bbox.x0)),
      y0: Math.min(...words.map((w) => w.bbox.y0)),
      x1: Math.max(...words.map((w) => w.bbox.x1)),
      y1: Math.max(...words.map((w) => w.bbox.y1)),
    },
  };
}
function prose(text: string, y: number, x = 0, conf = 92): Line {
  const words: Word[] = [];
  let cursor = x;
  for (const t of text.split(" ")) {
    const w = word(t, cursor, y, conf);
    words.push(w);
    cursor = w.bbox.x1 + 5;
  }
  return lineOf(words);
}

function block(over: Partial<Block> & { lines: Line[] }): Block {
  return {
    id: `b${uid++}`,
    type: "paragraph",
    bbox: { x0: 0, y0: 0, x1: 100, y1: 20 },
    confidence: 92,
    typeConfidence: 0.8,
    readingOrder: 0,
    ...over,
  };
}
function pageOf(blocks: Block[], over: Partial<Page> = {}): Page {
  return {
    index: 0,
    width: 1000,
    height: 1400,
    rotation: 0,
    blocks,
    images: [],
    source: "ocr",
    status: "ok",
    ...over,
  };
}
const docOf = (pages: Page[]) =>
  buildDocument({ pages, providerId: "test", languages: ["eng"] });

describe("pageText / documentText", () => {
  it("emits blocks in reading order, not array order", () => {
    const a = block({ lines: [prose("second block", 0)], readingOrder: 1 });
    const b = block({ lines: [prose("first block", 0)], readingOrder: 0 });
    expect(pageText(pageOf([a, b]))).toBe("first block\n\nsecond block");
  });

  it("skips failed pages", () => {
    const good = pageOf([block({ lines: [prose("hello", 0)] })]);
    const doc = docOf([good, failedPage(1, 100, 100, "boom")]);
    expect(documentText(doc)).toBe("hello");
  });
});

describe("classifyDocument", () => {
  const fromText = (text: string, over: Partial<Page> = {}) =>
    docOf([
      pageOf(
        text.split("|").map((t, i) => block({ lines: [prose(t.trim(), i * 30)], readingOrder: i })),
        over
      ),
    ]);

  it("returns generic at zero confidence for empty input", () => {
    const g = classifyDocument(docOf([]));
    expect(g).toEqual({ kind: "generic", confidence: 0 });
  });

  it("identifies an invoice", () => {
    const g = classifyDocument(fromText("Tax Invoice | Bill To Acme | Subtotal 100 | Amount Due 118"));
    expect(g.kind).toBe("invoice");
    expect(g.confidence).toBeGreaterThan(0.5);
  });

  it("identifies a resume", () => {
    const g = classifyDocument(
      fromText("Curriculum Vitae | Work Experience | Education | Skills")
    );
    expect(g.kind).toBe("resume");
  });

  it("identifies a certificate", () => {
    const g = classifyDocument(
      fromText("Certificate of Completion | This is to certify that | has successfully completed")
    );
    expect(g.kind).toBe("certificate");
  });

  it("identifies an academic paper", () => {
    const g = classifyDocument(
      fromText("Abstract | Introduction | Related Work | Methodology | References")
    );
    expect(g.kind).toBe("academicPaper");
  });

  it("falls back to generic for unremarkable text", () => {
    const g = classifyDocument(fromText("the quick brown fox | jumps over the lazy dog"));
    expect(g.kind).toBe("generic");
    expect(g.confidence).toBeLessThan(0.3);
  });

  it("never claims certainty", () => {
    const g = classifyDocument(
      fromText(
        "Tax Invoice | Invoice No 1 | Bill To Acme | Subtotal | Amount Due | Purchase Order | GSTIN"
      )
    );
    expect(g.confidence).toBeLessThanOrEqual(0.85);
  });
});

describe("buildDocument", () => {
  it("sorts pages by index so concurrent completion cannot scramble them", () => {
    const p2 = pageOf([block({ lines: [prose("second", 0)] })], { index: 1 });
    const p1 = pageOf([block({ lines: [prose("first", 0)] })], { index: 0 });
    const doc = buildDocument({ pages: [p2, p1], providerId: "t", languages: ["eng"] });
    expect(doc.pages.map((p) => p.index)).toEqual([0, 1]);
    expect(documentText(doc)).toBe("first\n\nsecond");
  });

  it("records provider and language metadata", () => {
    const doc = buildDocument({
      pages: [],
      providerId: "tesseract",
      languages: ["hin", "eng"],
      fileName: "scan.pdf",
    });
    expect(doc.metadata.providerId).toBe("tesseract");
    expect(doc.metadata.languages).toEqual(["hin", "eng"]);
    expect(doc.metadata.fileName).toBe("scan.pdf");
  });
});

describe("documentStats", () => {
  it("counts structure and page outcomes", () => {
    const doc = docOf([
      pageOf([
        block({ type: "heading", lines: [prose("Title", 0)], readingOrder: 0 }),
        block({ type: "paragraph", lines: [prose("one two three", 30)], readingOrder: 1 }),
        block({ type: "list", lines: [prose("- a", 60)], readingOrder: 2 }),
      ]),
      failedPage(1, 100, 100, "nope"),
    ]);
    const s = documentStats(doc);
    expect(s.pages).toBe(2);
    expect(s.okPages).toBe(1);
    expect(s.failedPages).toBe(1);
    expect(s.headings).toBe(1);
    expect(s.lists).toBe(1);
    expect(s.words).toBe(1 + 3 + 2);
    expect(s.quality.failedPages).toEqual([1]);
  });
});

describe("lowConfidenceWords", () => {
  it("flags only words below the threshold", () => {
    const l = lineOf([word("good", 0, 0, 95), word("documant", 50, 0, 41)]);
    const flagged = lowConfidenceWords(docOf([pageOf([block({ lines: [l] })])]));
    expect(flagged).toHaveLength(1);
    expect(flagged[0].text).toBe("documant");
    expect(flagged[0].confidence).toBe(41);
  });

  it("does not flag a reused native text layer", () => {
    // Native PDF text is exact; a stored low confidence is meaningless there.
    const l = lineOf([word("exact", 0, 0, 0)]);
    const doc = docOf([pageOf([block({ lines: [l] })], { source: "native" })]);
    expect(lowConfidenceWords(doc)).toEqual([]);
  });

  it("reports page and block so the editor can locate it", () => {
    const l = lineOf([word("blurry", 0, 0, 30)]);
    const b = block({ lines: [l] });
    const flagged = lowConfidenceWords(docOf([pageOf([b])]));
    expect(flagged[0].pageIndex).toBe(0);
    expect(flagged[0].blockId).toBe(b.id);
  });
});

describe("serializers", () => {
  const sample = () =>
    docOf([
      pageOf([
        block({ type: "heading", level: 1, lines: [prose("Report Title", 0)], readingOrder: 0 }),
        block({ type: "paragraph", lines: [prose("Body copy here", 40)], readingOrder: 1 }),
        block({
          type: "list",
          lines: [prose("- first item", 80), prose("- second item", 110)],
          readingOrder: 2,
        }),
        block({ type: "footer", lines: [prose("confidential", 1350)], readingOrder: 3 }),
      ]),
    ]);

  it("toPlainText concatenates blocks in order", () => {
    const t = toPlainText(sample());
    expect(t.indexOf("Report Title")).toBeLessThan(t.indexOf("Body copy here"));
  });

  it("toPlainText surfaces a failed page instead of silently dropping it", () => {
    const doc = docOf([failedPage(0, 100, 100, "corrupt")]);
    expect(toPlainText(doc)).toContain("Page 1 could not be read: corrupt");
  });

  it("toMarkdown uses heading level and list syntax", () => {
    const md = toMarkdown(sample());
    expect(md).toContain("# Report Title");
    expect(md).toContain("- first item");
  });

  it("toMarkdown strips the bullet character rather than doubling it", () => {
    expect(toMarkdown(sample())).not.toContain("- - first");
  });

  it("toMarkdown omits page furniture", () => {
    // Running feet repeated at every page boundary would be noise.
    expect(toMarkdown(sample())).not.toContain("confidential");
  });

  it("toHtml emits semantic tags with block metadata", () => {
    const html = toHtml(sample());
    expect(html).toContain("<h1 ");
    expect(html).toContain('data-type="heading"');
    expect(html).toContain("<ul ");
  });

  it("toHtml escapes markup in the source text", () => {
    const doc = docOf([pageOf([block({ lines: [lineOf([word("<script>", 0, 0)])] })])]);
    const html = toHtml(doc);
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>");
  });

  it("toHtml marks low-confidence words when asked", () => {
    const doc = docOf([
      pageOf([block({ lines: [lineOf([word("documant", 0, 0, 41)])] })]),
    ]);
    const html = toHtml(doc, { markLowConfidence: true });
    expect(html).toContain('class="ocr-low"');
    expect(html).toContain('data-confidence="41"');
  });

  it("toHtml leaves confident words unmarked", () => {
    const doc = docOf([pageOf([block({ lines: [lineOf([word("fine", 0, 0, 98)])] })])]);
    expect(toHtml(doc, { markLowConfidence: true })).not.toContain("ocr-low");
  });

  it("toJson round-trips the model", () => {
    const doc = sample();
    const parsed = JSON.parse(toJson(doc));
    expect(parsed.pages).toHaveLength(1);
    expect(parsed.metadata.providerId).toBe("test");
  });
});

describe("table integration through analyzePage", () => {
  const tableRow = (a: string, b: string, c: string, y: number) =>
    lineOf([word(a, 0, y), word(b, 300, y), word(c, 500, y)]);

  const recognized = (lines: Line[]): RecognizedPage => ({
    pageIndex: 0,
    width: 1000,
    height: 1400,
    lines,
    confidence: 90,
  });

  it("promotes a detected table to a table block", () => {
    const p = analyzePage(
      recognized([
        tableRow("Item", "Qty", "Price", 200),
        tableRow("Widget", "12", "9.99", 240),
        tableRow("Gadget", "7", "24.50", 280),
        tableRow("Bolt", "40", "0.25", 320),
      ])
    );
    const table = p.blocks.find((b) => b.type === "table");
    expect(table).toBeDefined();
    expect(table!.table!.rows).toHaveLength(4);
    expect(table!.table!.hasHeaderRow).toBe(true);
  });

  it("renders that table as Markdown and HTML from the model", () => {
    const p = analyzePage(
      recognized([
        tableRow("Item", "Qty", "Price", 200),
        tableRow("Widget", "12", "9.99", 240),
        tableRow("Gadget", "7", "24.50", 280),
        tableRow("Bolt", "40", "0.25", 320),
      ])
    );
    const doc = docOf([p]);
    expect(toMarkdown(doc)).toContain("| Item | Qty | Price |");
    const html = toHtml(doc);
    expect(html).toContain("<thead>");
    expect(html).toContain("<th>Item</th>");
  });

  it("leaves prose as paragraphs, not tables", () => {
    const p = analyzePage(
      recognized([
        prose("the quick brown fox jumps over lazy dogs", 200),
        prose("and then continues on a second line here", 230),
        prose("and a third line to complete the paragraph", 260),
      ])
    );
    expect(p.blocks.every((b) => b.type !== "table")).toBe(true);
  });
});
