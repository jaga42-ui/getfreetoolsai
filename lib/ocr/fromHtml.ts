/**
 * Parse the editor's HTML back into the document model.
 *
 * The OCR editor is a `contentEditable` region holding the HTML produced by
 * `serialize.toHtml`, and every export is built from what the user has edited
 * there. So an exporter that works from the original model would silently
 * discard their corrections — which is worse than having no exporter.
 *
 * This is deliberately a narrow parser for the tag vocabulary this application
 * emits (headings, paragraphs, lists, tables, rules), not a general HTML
 * parser. It runs in Node as well as the browser, which is what lets the DOCX
 * writer be tested without a DOM.
 *
 * Geometry is not recoverable from HTML, so blocks come back with zero boxes
 * and full confidence. That is fine for export, which cares about structure;
 * anything needing coordinates must use the real model.
 */

import { createIdFactory, type Block, type Line, type Page, type TableCell } from "./types";

const ZERO = { x0: 0, y0: 0, x1: 0, y1: 0 };

function decodeEntities(s: string): string {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    // Ampersand last, or "&amp;lt;" would decode twice.
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

/** Strip all tags from a fragment and collapse whitespace. */
function textOf(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, ""))
    .replace(/\s+/g, " ")
    .trim();
}

/** Build a synthetic line whose words carry no geometry. */
function lineFrom(text: string, nextId: () => string): Line {
  const words = text
    .split(" ")
    .filter(Boolean)
    .map((t) => ({ id: nextId(), text: t, bbox: ZERO, confidence: 100 }));
  return { id: nextId(), words, bbox: ZERO };
}

function parseTable(html: string, nextId: () => string) {
  const rows: TableCell[][] = [];
  let hasHeaderRow = false;

  const trRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let tr: RegExpExecArray | null;
  while ((tr = trRe.exec(html))) {
    const cells: TableCell[] = [];
    const cellRe = /<(t[hd])([^>]*)>([\s\S]*?)<\/\1>/gi;
    let td: RegExpExecArray | null;
    while ((td = cellRe.exec(tr[1]))) {
      const isHeader = td[1].toLowerCase() === "th";
      if (isHeader) hasHeaderRow = true;
      const spanMatch = td[2].match(/colspan\s*=\s*["']?(\d+)/i);
      cells.push({
        id: nextId(),
        text: textOf(td[3]),
        bbox: ZERO,
        rowSpan: 1,
        colSpan: spanMatch ? Math.max(1, parseInt(spanMatch[1], 10)) : 1,
        isHeader,
      });
    }
    if (cells.length) rows.push(cells);
  }
  return { rows, confidence: 1, hasHeaderRow };
}

/**
 * Convert editor HTML into blocks.
 *
 * Top-level elements are matched in document order; anything not recognised
 * falls through to a paragraph so content is never dropped.
 */
export function blocksFromHtml(html: string): Block[] {
  const nextId = createIdFactory("h");
  const blocks: Block[] = [];
  let order = 0;

  const push = (b: Omit<Block, "id" | "readingOrder">) => {
    blocks.push({ ...b, id: nextId(), readingOrder: order++ });
  };

  // One pass over the recognised top-level constructs, in source order.
  const re =
    /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>|<ul[^>]*>([\s\S]*?)<\/ul>|<ol[^>]*>([\s\S]*?)<\/ol>|<table[^>]*>([\s\S]*?)<\/table>|<hr\s*\/?>|<p[^>]*>([\s\S]*?)<\/p>/gi;

  let m: RegExpExecArray | null;
  let lastIndex = 0;
  let sawAny = false;

  while ((m = re.exec(html))) {
    sawAny = true;
    lastIndex = re.lastIndex;

    if (m[1]) {
      const text = textOf(m[2]);
      if (text) {
        push({
          type: "heading",
          level: parseInt(m[1], 10),
          bbox: ZERO,
          lines: [lineFrom(text, nextId)],
          confidence: 100,
          typeConfidence: 1,
        });
      }
    } else if (m[3] !== undefined || m[4] !== undefined) {
      const inner = m[3] ?? m[4];
      const items = Array.from(inner.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi))
        .map((li) => textOf(li[1]))
        .filter(Boolean);
      if (items.length) {
        push({
          type: "list",
          bbox: ZERO,
          lines: items.map((t) =>
            // Re-add an ordinal marker for ordered lists so the DOCX writer
            // picks the decimal numbering definition rather than bullets.
            lineFrom(m![4] !== undefined ? `1. ${t}` : t, nextId)
          ),
          confidence: 100,
          typeConfidence: 1,
        });
      }
    } else if (m[5] !== undefined) {
      const table = parseTable(m[5], nextId);
      if (table.rows.length) {
        push({ type: "table", bbox: ZERO, lines: [], confidence: 100, typeConfidence: 1, table });
      }
    } else if (m[6] !== undefined) {
      const text = textOf(m[6]);
      if (text) {
        push({
          type: "paragraph",
          bbox: ZERO,
          lines: [lineFrom(text, nextId)],
          confidence: 100,
          typeConfidence: 1,
        });
      }
    } else {
      push({ type: "separator", bbox: ZERO, lines: [], confidence: 100, typeConfidence: 1 });
    }
  }

  // No recognised structure at all (a bare string, or markup we do not model):
  // keep the text rather than returning nothing.
  if (!sawAny) {
    const text = textOf(html);
    if (text) {
      push({
        type: "paragraph",
        bbox: ZERO,
        lines: [lineFrom(text, nextId)],
        confidence: 100,
        typeConfidence: 1,
      });
    }
  } else {
    // Trailing text after the last matched element.
    const tail = textOf(html.slice(lastIndex));
    if (tail) {
      push({
        type: "paragraph",
        bbox: ZERO,
        lines: [lineFrom(tail, nextId)],
        confidence: 100,
        typeConfidence: 1,
      });
    }
  }

  return blocks;
}

/** Wrap editor HTML as a single model page. */
export function pageFromHtml(html: string, index = 0): Page {
  const blocks = blocksFromHtml(html);
  return {
    index,
    width: 0,
    height: 0,
    rotation: 0,
    blocks,
    images: [],
    source: "ocr",
    status: blocks.length ? "ok" : "blank",
  };
}
