/**
 * Real DOCX (Office Open XML) generation from the document model.
 *
 * This replaces a genuine fake feature. The OCR tool's "Word" export produced
 * an HTML document with Office namespaces and named it `.doc` — Word opens it,
 * but it is not DOCX, styles are not real styles, tables are HTML tables, and
 * anything that parses OOXML (Google Docs import, python-docx, Pages) sees a
 * broken file. Section 13 of the brief asks for real paragraphs, headings,
 * runs, tables and page breaks, and section 28 forbids labelling something as
 * what it is not.
 *
 * The package written here is minimal but valid:
 *
 *   [Content_Types].xml      declares every part
 *   _rels/.rels              root relationship -> document
 *   word/document.xml        the body
 *   word/_rels/…rels         document -> styles, numbering
 *   word/styles.xml          real Heading 1..6 + ListParagraph styles
 *   word/numbering.xml       bullet and decimal list definitions
 *
 * Structure comes from the model, so headings are headings and tables are
 * tables — not text that happens to look like them.
 */

import { tableToMarkdown } from "./table";
import type { Block, DocumentModel, Line, Page, TableStructure } from "./types";

const NS_W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    // Control characters are illegal in XML 1.0 and Word refuses the file
    // outright rather than skipping them. OCR of a noisy scan does
    // occasionally emit them.
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");
}

const lineText = (l: Line) => l.words.map((w) => w.text).join(" ");
const blockText = (b: Block) => b.lines.map(lineText).join(" ");

const inOrder = (page: Page) =>
  page.blocks.slice().sort((a, b) => a.readingOrder - b.readingOrder);

/** A run, optionally marked as uncertain. */
function run(text: string, opts: { highlight?: boolean } = {}): string {
  if (!text) return "";
  const props = opts.highlight
    ? `<w:rPr><w:highlight w:val="yellow"/></w:rPr>`
    : "";
  // xml:space="preserve" or Word collapses leading/trailing spaces.
  return `<w:r>${props}<w:t xml:space="preserve">${esc(text)}</w:t></w:r>`;
}

function paragraph(content: string, style?: string, extraProps = ""): string {
  const props =
    style || extraProps
      ? `<w:pPr>${style ? `<w:pStyle w:val="${style}"/>` : ""}${extraProps}</w:pPr>`
      : "";
  return `<w:p>${props}${content}</w:p>`;
}

export interface DocxOptions {
  /** Highlight low-confidence words so they can be proofread in Word. */
  markLowConfidence?: boolean;
  /** Confidence below which a word is considered uncertain. */
  confidenceThreshold?: number;
  /** Start each source page on a new page. */
  pageBreaks?: boolean;
}

/** Build the runs for a block, splitting on confidence when asked. */
function blockRuns(b: Block, opts: DocxOptions): string {
  const threshold = opts.confidenceThreshold ?? 72;
  if (!opts.markLowConfidence) return run(blockText(b));

  const parts: string[] = [];
  b.lines.forEach((line, li) => {
    if (li > 0) parts.push(run(" "));
    line.words.forEach((w, wi) => {
      if (wi > 0) parts.push(run(" "));
      parts.push(run(w.text, { highlight: w.confidence < threshold }));
    });
  });
  return parts.join("");
}

const LIST_MARKER = /^\s*([•▪◦*–—-]|\d{1,3}[.)]|[a-zA-Z][.)])\s+/;
const ORDERED_MARKER = /^\s*\d{1,3}[.)]\s+/;

function listParagraphs(b: Block): string {
  // numId 1 = bullet, 2 = decimal (see numbering.xml).
  const ordered = b.lines.length > 0 && ORDERED_MARKER.test(lineText(b.lines[0]));
  const numId = ordered ? 2 : 1;
  return b.lines
    .map((l) =>
      paragraph(
        run(lineText(l).replace(LIST_MARKER, "")),
        "ListParagraph",
        `<w:numPr><w:ilvl w:val="0"/><w:numId w:val="${numId}"/></w:numPr>`
      )
    )
    .join("");
}

function tableXml(t: TableStructure): string {
  const columns = Math.max(
    1,
    ...t.rows.map((r) => r.reduce((s, c) => s + c.colSpan, 0))
  );
  // Word requires a grid; equal widths over a 9360 twip content area.
  const colWidth = Math.floor(9360 / columns);
  const grid = `<w:tblGrid>${Array.from({ length: columns })
    .map(() => `<w:gridCol w:w="${colWidth}"/>`)
    .join("")}</w:tblGrid>`;

  const rows = t.rows
    .map((cells) => {
      const tcs = cells
        .map((c) => {
          const span = c.colSpan > 1 ? `<w:gridSpan w:val="${c.colSpan}"/>` : "";
          const width = colWidth * c.colSpan;
          const shade = c.isHeader
            ? `<w:shd w:val="clear" w:color="auto" w:fill="EFEFEF"/>`
            : "";
          const body = paragraph(
            c.isHeader
              ? `<w:r><w:rPr><w:b/></w:rPr><w:t xml:space="preserve">${esc(c.text)}</w:t></w:r>`
              : run(c.text)
          );
          return `<w:tc><w:tcPr><w:tcW w:w="${width}" w:type="dxa"/>${span}${shade}</w:tcPr>${body}</w:tc>`;
        })
        .join("");
      // tblHeader repeats the header row across page breaks.
      const trPr = cells.some((c) => c.isHeader)
        ? `<w:trPr><w:tblHeader/></w:trPr>`
        : "";
      return `<w:tr>${trPr}${tcs}</w:tr>`;
    })
    .join("");

  const borders = ["top", "left", "bottom", "right", "insideH", "insideV"]
    .map((s) => `<w:${s} w:val="single" w:sz="4" w:space="0" w:color="999999"/>`)
    .join("");

  return `<w:tbl><w:tblPr><w:tblStyle w:val="TableGrid"/><w:tblW w:w="0" w:type="auto"/><w:tblBorders>${borders}</w:tblBorders></w:tblPr>${grid}${rows}</w:tbl>`;
}

const PAGE_BREAK = `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`;

function bodyXml(doc: DocumentModel, opts: DocxOptions): string {
  const out: string[] = [];

  doc.pages.forEach((page, pi) => {
    if (opts.pageBreaks && pi > 0) out.push(PAGE_BREAK);

    if (page.status === "failed") {
      // Reported rather than silently omitted — a gap the reader cannot see is
      // worse than a visible note.
      out.push(
        paragraph(
          `<w:r><w:rPr><w:i/><w:color w:val="B91C1C"/></w:rPr><w:t xml:space="preserve">${esc(
            `[Page ${page.index + 1} could not be read: ${page.error ?? "unknown error"}]`
          )}</w:t></w:r>`
        )
      );
      return;
    }

    for (const b of inOrder(page)) {
      switch (b.type) {
        case "heading":
          out.push(paragraph(blockRuns(b, opts), `Heading${Math.min(6, b.level ?? 2)}`));
          break;
        case "list":
          out.push(listParagraphs(b));
          break;
        case "table":
          out.push(b.table ? tableXml(b.table) : paragraph(blockRuns(b, opts)));
          break;
        // Running heads, feet and page numbers belong in Word's own header and
        // footer parts, not inline. Emitting them as body text would litter the
        // document at every page boundary.
        case "header":
        case "footer":
        case "pageNumber":
          break;
        default:
          out.push(paragraph(blockRuns(b, opts)));
      }
    }
  });

  // Word tolerates an empty body poorly; give it one empty paragraph.
  if (!out.length) out.push(paragraph(""));
  return out.join("");
}

/* ------------------------------------------------------------------ */
/* Package parts                                                       */
/* ------------------------------------------------------------------ */

const CONTENT_TYPES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
<Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>
</Types>`;

const ROOT_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

const DOC_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>
</Relationships>`;

/** Heading sizes in half-points, so Heading1 renders at 20pt. */
const HEADING_SIZES = [40, 32, 28, 24, 22, 20];

const STYLES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="${NS_W}">
<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="22"/></w:rPr></w:rPrDefault></w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>
${HEADING_SIZES.map(
  (size, i) => `<w:style w:type="paragraph" w:styleId="Heading${i + 1}">
<w:name w:val="heading ${i + 1}"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/>
<w:pPr><w:keepNext/><w:spacing w:before="240" w:after="60"/><w:outlineLvl w:val="${i}"/></w:pPr>
<w:rPr><w:b/><w:sz w:val="${size}"/></w:rPr></w:style>`
).join("\n")}
<w:style w:type="paragraph" w:styleId="ListParagraph"><w:name w:val="List Paragraph"/><w:basedOn w:val="Normal"/><w:qFormat/><w:pPr><w:ind w:left="720"/><w:contextualSpacing/></w:pPr></w:style>
<w:style w:type="table" w:styleId="TableGrid"><w:name w:val="Table Grid"/><w:tblPr><w:tblCellMar><w:top w:w="60" w:type="dxa"/><w:left w:w="90" w:type="dxa"/><w:bottom w:w="60" w:type="dxa"/><w:right w:w="90" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style>
</w:styles>`;

const NUMBERING = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:numbering xmlns:w="${NS_W}">
<w:abstractNum w:abstractNumId="0"><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="•"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="720" w:hanging="360"/></w:pPr></w:lvl></w:abstractNum>
<w:abstractNum w:abstractNumId="1"><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="decimal"/><w:lvlText w:val="%1."/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="720" w:hanging="360"/></w:pPr></w:lvl></w:abstractNum>
<w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num>
<w:num w:numId="2"><w:abstractNumId w:val="1"/></w:num>
</w:numbering>`;

/** A4 portrait with 1-inch margins, in twips. */
const SECT_PR = `<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr>`;

/** The word/document.xml part. Exported for testing without unzipping. */
export function documentXml(doc: DocumentModel, opts: DocxOptions = {}): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="${NS_W}"><w:body>${bodyXml(doc, opts)}${SECT_PR}</w:body></w:document>`;
}

/** Build a real .docx package. */
export async function toDocxBlob(
  doc: DocumentModel,
  opts: DocxOptions = { pageBreaks: true }
): Promise<Blob> {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();

  zip.file("[Content_Types].xml", CONTENT_TYPES);
  zip.folder("_rels")!.file(".rels", ROOT_RELS);
  const word = zip.folder("word")!;
  word.file("document.xml", documentXml(doc, opts));
  word.file("styles.xml", STYLES);
  word.file("numbering.xml", NUMBERING);
  word.folder("_rels")!.file("document.xml.rels", DOC_RELS);

  return zip.generateAsync({
    type: "blob",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}

/** Plain-text fallback used when a caller wants a quick preview of structure. */
export function docxOutline(doc: DocumentModel): string {
  const out: string[] = [];
  for (const page of doc.pages) {
    for (const b of inOrder(page)) {
      if (b.type === "heading") out.push(`H${b.level ?? 2}: ${blockText(b)}`);
      else if (b.type === "table" && b.table) out.push(tableToMarkdown(b.table));
      else if (b.type === "list") out.push(b.lines.map((l) => `- ${lineText(l)}`).join("\n"));
      else if (!["header", "footer", "pageNumber"].includes(b.type)) out.push(blockText(b));
    }
  }
  return out.join("\n\n");
}
