import { describe, it, expect } from "vitest";
import { documentXml, toDocxBlob, docxOutline } from "@/lib/ocr/docx";
import { blocksFromHtml, pageFromHtml } from "@/lib/ocr/fromHtml";
import type { Block, DocumentModel, Line, Page, Word } from "@/lib/ocr/types";

let uid = 0;
function word(text: string, confidence = 95): Word {
  return {
    id: `w${uid++}`,
    text,
    bbox: { x0: 0, y0: 0, x1: 10, y1: 16 },
    confidence,
  };
}
function lineOf(text: string, confidence = 95): Line {
  return {
    id: `l${uid++}`,
    words: text.split(" ").map((t) => word(t, confidence)),
    bbox: { x0: 0, y0: 0, x1: 100, y1: 16 },
  };
}
function block(over: Partial<Block> & { lines: Line[] }): Block {
  return {
    id: `b${uid++}`,
    type: "paragraph",
    bbox: { x0: 0, y0: 0, x1: 100, y1: 16 },
    confidence: 95,
    typeConfidence: 0.9,
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
const docOf = (pages: Page[]): DocumentModel => ({
  metadata: { kind: "generic", kindConfidence: 0, languages: ["eng"], providerId: "t" },
  pages,
});

const cell = (text: string, isHeader = false, colSpan = 1) => ({
  id: `c${uid++}`,
  text,
  bbox: { x0: 0, y0: 0, x1: 10, y1: 10 },
  rowSpan: 1,
  colSpan,
  isHeader,
});

describe("documentXml structure", () => {
  it("emits a well-formed document with a body and section properties", () => {
    const xml = documentXml(docOf([pageOf([block({ lines: [lineOf("hello world")] })])]));
    expect(xml.startsWith('<?xml version="1.0"')).toBe(true);
    expect(xml).toContain("<w:document");
    expect(xml).toContain("<w:body>");
    expect(xml).toContain("<w:sectPr>");
    expect(xml).toContain("</w:document>");
  });

  it("uses real heading styles, not bold text", () => {
    // The whole point of DOCX over HTML-as-.doc: a heading is a style Word
    // understands, so navigation and tables of contents work.
    const xml = documentXml(
      docOf([pageOf([block({ type: "heading", level: 1, lines: [lineOf("Title")] })])])
    );
    expect(xml).toContain('<w:pStyle w:val="Heading1"/>');
    expect(xml).toContain("Title");
  });

  it("clamps heading level to 6", () => {
    const xml = documentXml(
      docOf([pageOf([block({ type: "heading", level: 9, lines: [lineOf("Deep")] })])])
    );
    expect(xml).toContain('w:val="Heading6"');
  });

  it("emits real list paragraphs with numbering references", () => {
    const xml = documentXml(
      docOf([
        pageOf([
          block({ type: "list", lines: [lineOf("• first"), lineOf("• second")] }),
        ]),
      ])
    );
    expect(xml).toContain('<w:pStyle w:val="ListParagraph"/>');
    expect(xml).toContain("<w:numPr>");
    // Bullet list uses numId 1.
    expect(xml).toContain('<w:numId w:val="1"/>');
    // The marker character itself must be stripped — numbering draws it.
    expect(xml).not.toContain("• first");
    expect(xml).toContain("first");
  });

  it("uses the decimal list definition for a numbered list", () => {
    const xml = documentXml(
      docOf([
        pageOf([block({ type: "list", lines: [lineOf("1. alpha"), lineOf("2. beta")] })]),
      ])
    );
    expect(xml).toContain('<w:numId w:val="2"/>');
    expect(xml).not.toContain("1. alpha");
  });

  it("emits a real table, not text", () => {
    const xml = documentXml(
      docOf([
        pageOf([
          block({
            type: "table",
            lines: [],
            table: {
              rows: [
                [cell("Item", true), cell("Qty", true)],
                [cell("Widget"), cell("12")],
              ],
              confidence: 0.9,
              hasHeaderRow: true,
            },
          }),
        ]),
      ])
    );
    expect(xml).toContain("<w:tbl>");
    expect(xml).toContain("<w:tblGrid>");
    expect(xml).toContain("<w:tr>");
    expect(xml).toContain("<w:tc>");
    expect(xml).toContain("Widget");
  });

  it("marks the header row so it repeats across pages", () => {
    const xml = documentXml(
      docOf([
        pageOf([
          block({
            type: "table",
            lines: [],
            table: {
              rows: [[cell("Item", true)], [cell("Widget")]],
              confidence: 0.9,
              hasHeaderRow: true,
            },
          }),
        ]),
      ])
    );
    expect(xml).toContain("<w:tblHeader/>");
  });

  it("expresses a merged cell as gridSpan", () => {
    const xml = documentXml(
      docOf([
        pageOf([
          block({
            type: "table",
            lines: [],
            table: {
              rows: [[cell("Subtotal", false, 2), cell("34.49")]],
              confidence: 0.9,
              hasHeaderRow: false,
            },
          }),
        ]),
      ])
    );
    expect(xml).toContain('<w:gridSpan w:val="2"/>');
  });

  it("omits running heads, feet and page numbers from the body", () => {
    const xml = documentXml(
      docOf([
        pageOf([
          block({ type: "header", lines: [lineOf("Annual Report")] }),
          block({ type: "paragraph", lines: [lineOf("real content")], readingOrder: 1 }),
          block({ type: "footer", lines: [lineOf("confidential")], readingOrder: 2 }),
          block({ type: "pageNumber", lines: [lineOf("12")], readingOrder: 3 }),
        ]),
      ])
    );
    expect(xml).toContain("real content");
    expect(xml).not.toContain("Annual Report");
    expect(xml).not.toContain("confidential");
  });

  it("inserts a page break between source pages when asked", () => {
    const doc = docOf([
      pageOf([block({ lines: [lineOf("one")] })], { index: 0 }),
      pageOf([block({ lines: [lineOf("two")] })], { index: 1 }),
    ]);
    expect(documentXml(doc, { pageBreaks: true })).toContain('<w:br w:type="page"/>');
    expect(documentXml(doc, { pageBreaks: false })).not.toContain('<w:br w:type="page"/>');
  });

  it("reports a failed page rather than dropping it", () => {
    const doc = docOf([
      {
        index: 0,
        width: 0,
        height: 0,
        rotation: 0,
        blocks: [],
        images: [],
        source: "ocr",
        status: "failed",
        error: "corrupt",
      },
    ]);
    expect(documentXml(doc)).toContain("could not be read");
    expect(documentXml(doc)).toContain("corrupt");
  });

  it("highlights low-confidence words when asked", () => {
    const l = lineOf("clear");
    l.words.push(word("documant", 40));
    const xml = documentXml(docOf([pageOf([block({ lines: [l] })])]), {
      markLowConfidence: true,
    });
    expect(xml).toContain('<w:highlight w:val="yellow"/>');
    expect(xml).toContain("documant");
  });

  it("does not highlight when the option is off", () => {
    const l = lineOf("documant", 40);
    expect(documentXml(docOf([pageOf([block({ lines: [l] })])]))).not.toContain("w:highlight");
  });

  it("preserves spaces so words do not run together", () => {
    const xml = documentXml(docOf([pageOf([block({ lines: [lineOf("a b")] })])]));
    expect(xml).toContain('xml:space="preserve"');
  });

  it("escapes XML metacharacters in the source text", () => {
    const xml = documentXml(
      docOf([pageOf([block({ lines: [lineOf("a<b>&c")] })])])
    );
    expect(xml).toContain("&lt;b&gt;");
    expect(xml).toContain("&amp;c");
  });

  it("strips control characters that would make Word reject the file", () => {
    const l: Line = {
      id: "l",
      words: [word("badtext")],
      bbox: { x0: 0, y0: 0, x1: 10, y1: 10 },
    };
    const xml = documentXml(docOf([pageOf([block({ lines: [l] })])]));
    expect(xml).not.toContain("");
    expect(xml).toContain("badtext");
  });

  it("emits at least one paragraph for an empty document", () => {
    // Word handles a completely empty body poorly.
    expect(documentXml(docOf([]))).toContain("<w:p>");
  });
});

describe("toDocxBlob package", () => {
  async function unzip(doc: DocumentModel) {
    const blob = await toDocxBlob(doc);
    const JSZip = (await import("jszip")).default;
    const buf = Buffer.from(await blob.arrayBuffer());
    return JSZip.loadAsync(buf);
  }

  const sample = () =>
    docOf([
      pageOf([
        block({ type: "heading", level: 1, lines: [lineOf("Report")] }),
        block({ type: "paragraph", lines: [lineOf("Body text here")], readingOrder: 1 }),
      ]),
    ]);

  it("contains every part OOXML requires", async () => {
    const zip = await unzip(sample());
    const names = Object.keys(zip.files);
    for (const required of [
      "[Content_Types].xml",
      "_rels/.rels",
      "word/document.xml",
      "word/styles.xml",
      "word/numbering.xml",
      "word/_rels/document.xml.rels",
    ]) {
      expect(names).toContain(required);
    }
  });

  it("declares content types for styles and numbering", async () => {
    const zip = await unzip(sample());
    const ct = await zip.file("[Content_Types].xml")!.async("string");
    expect(ct).toContain("/word/styles.xml");
    expect(ct).toContain("/word/numbering.xml");
  });

  it("relates the document to styles and numbering", async () => {
    const zip = await unzip(sample());
    const rels = await zip.file("word/_rels/document.xml.rels")!.async("string");
    expect(rels).toContain("styles.xml");
    expect(rels).toContain("numbering.xml");
  });

  it("defines the heading styles the body references", async () => {
    // A dangling pStyle reference renders as plain text in Word — the exact
    // failure the old HTML-as-.doc export had.
    const zip = await unzip(sample());
    const styles = await zip.file("word/styles.xml")!.async("string");
    const body = await zip.file("word/document.xml")!.async("string");

    const referenced = Array.from(body.matchAll(/<w:pStyle w:val="([^"]+)"\/>/g)).map(
      (m) => m[1]
    );
    expect(referenced.length).toBeGreaterThan(0);
    for (const style of referenced) {
      expect(styles).toContain(`w:styleId="${style}"`);
    }
  });

  it("defines every numId the body references", async () => {
    const zip = await unzip(
      docOf([pageOf([block({ type: "list", lines: [lineOf("• a"), lineOf("• b")] })])])
    );
    const numbering = await zip.file("word/numbering.xml")!.async("string");
    const body = await zip.file("word/document.xml")!.async("string");
    const ids = Array.from(body.matchAll(/<w:numId w:val="(\d+)"\/>/g)).map((m) => m[1]);
    expect(ids.length).toBeGreaterThan(0);
    for (const id of ids) {
      expect(numbering).toContain(`<w:num w:numId="${id}">`);
    }
  });

  it("produces a non-trivial zip", async () => {
    const blob = await toDocxBlob(sample());
    expect(blob.size).toBeGreaterThan(500);
  });
});

describe("docxOutline", () => {
  it("summarises structure for a quick check", () => {
    const out = docxOutline(
      docOf([
        pageOf([
          block({ type: "heading", level: 2, lines: [lineOf("Section")] }),
          block({ type: "paragraph", lines: [lineOf("prose")], readingOrder: 1 }),
        ]),
      ])
    );
    expect(out).toContain("H2: Section");
    expect(out).toContain("prose");
  });
});

/* ------------------------------------------------------------------ */
/* HTML round trip — the path real exports actually take               */
/* ------------------------------------------------------------------ */

describe("blocksFromHtml", () => {
  it("recovers headings with their level", () => {
    const [b] = blocksFromHtml("<h3>Section Title</h3>");
    expect(b.type).toBe("heading");
    expect(b.level).toBe(3);
    expect(b.lines[0].words.map((w) => w.text).join(" ")).toBe("Section Title");
  });

  it("recovers paragraphs", () => {
    const [b] = blocksFromHtml("<p>Some body copy</p>");
    expect(b.type).toBe("paragraph");
  });

  it("recovers bullet lists", () => {
    const [b] = blocksFromHtml("<ul><li>alpha</li><li>beta</li></ul>");
    expect(b.type).toBe("list");
    expect(b.lines).toHaveLength(2);
  });

  it("distinguishes ordered lists so numbering is decimal", () => {
    const [b] = blocksFromHtml("<ol><li>first</li></ol>");
    expect(b.lines[0].words[0].text).toBe("1.");
  });

  it("recovers tables with headers and colspan", () => {
    const [b] = blocksFromHtml(
      '<table><tbody><tr><th>Item</th><th>Qty</th></tr><tr><td colspan="2">Merged</td></tr></tbody></table>'
    );
    expect(b.type).toBe("table");
    expect(b.table!.hasHeaderRow).toBe(true);
    expect(b.table!.rows[1][0].colSpan).toBe(2);
  });

  it("preserves document order across mixed elements", () => {
    const blocks = blocksFromHtml("<h1>T</h1><p>a</p><ul><li>b</li></ul><p>c</p>");
    expect(blocks.map((b) => b.type)).toEqual(["heading", "paragraph", "list", "paragraph"]);
    expect(blocks.map((b) => b.readingOrder)).toEqual([0, 1, 2, 3]);
  });

  it("strips the low-confidence <mark> wrapper but keeps the word", () => {
    const [b] = blocksFromHtml('<p>a <mark class="ocr-low">documant</mark> here</p>');
    expect(b.lines[0].words.map((w) => w.text).join(" ")).toBe("a documant here");
  });

  it("decodes escaped entities back to characters", () => {
    const [b] = blocksFromHtml("<p>a &lt;b&gt; &amp; c</p>");
    expect(b.lines[0].words.map((w) => w.text).join(" ")).toBe("a <b> & c");
  });

  it("does not double-decode a literally escaped entity", () => {
    const [b] = blocksFromHtml("<p>&amp;lt;</p>");
    expect(b.lines[0].words.map((w) => w.text).join(" ")).toBe("&lt;");
  });

  it("keeps bare text that has no recognised markup", () => {
    // Content must never be dropped just because the editor produced something
    // outside the expected vocabulary.
    const [b] = blocksFromHtml("just some text");
    expect(b.type).toBe("paragraph");
    expect(b.lines[0].words).toHaveLength(3);
  });

  it("keeps trailing text after the last element", () => {
    const blocks = blocksFromHtml("<p>first</p>trailing words");
    expect(blocks).toHaveLength(2);
    expect(blocks[1].lines[0].words.map((w) => w.text).join(" ")).toBe("trailing words");
  });

  it("skips empty elements", () => {
    expect(blocksFromHtml("<p></p><p>   </p>")).toHaveLength(0);
  });
});

describe("edited HTML -> DOCX", () => {
  it("carries the user's edits into a real DOCX", async () => {
    // The regression this guards: exporting from the ORIGINAL model would
    // silently throw away everything the user corrected in the editor.
    const edited = "<h1>Corrected Title</h1><p>fixed body text</p>";
    const doc: DocumentModel = {
      metadata: { kind: "generic", kindConfidence: 0, languages: ["eng"], providerId: "t" },
      pages: [pageFromHtml(edited)],
    };
    const xml = documentXml(doc);
    expect(xml).toContain("Corrected Title");
    expect(xml).toContain("fixed body text");
    expect(xml).toContain('<w:pStyle w:val="Heading1"/>');
  });

  it("turns an edited HTML table into a real Word table", async () => {
    const edited =
      "<table><tbody><tr><th>Item</th><th>Qty</th></tr><tr><td>Widget</td><td>12</td></tr></tbody></table>";
    const doc: DocumentModel = {
      metadata: { kind: "generic", kindConfidence: 0, languages: ["eng"], providerId: "t" },
      pages: [pageFromHtml(edited)],
    };
    const xml = documentXml(doc);
    expect(xml).toContain("<w:tbl>");
    expect(xml).toContain("Widget");
    expect(xml).toContain("<w:tblHeader/>");
  });
});
