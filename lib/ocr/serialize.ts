/**
 * Model -> export formats.
 *
 * Every exporter reads the `DocumentModel` directly. The previous
 * implementation serialized to an HTML string immediately after OCR and then
 * derived text, Markdown and "Word" by regex-munging that string, so structure
 * that survived reconstruction was thrown away before the exporters ever saw
 * it, and each format re-parsed the same HTML slightly differently.
 *
 * Here the model is the single source and each format is a straight walk of it.
 */

import { tableToMarkdown } from "./table";
import type { Block, DocumentModel, Line, Page, TableStructure } from "./types";

const lineText = (l: Line) => l.words.map((w) => w.text).join(" ");
const blockText = (b: Block) => b.lines.map(lineText).join("\n");

const inOrder = (page: Page) =>
  page.blocks.slice().sort((a, b) => a.readingOrder - b.readingOrder);

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/* ------------------------------------------------------------------ */
/* Plain text                                                          */
/* ------------------------------------------------------------------ */

function tableToText(table: TableStructure): string {
  return table.rows.map((r) => r.map((c) => c.text).join("\t")).join("\n");
}

export function toPlainText(doc: DocumentModel): string {
  const pages: string[] = [];
  for (const page of doc.pages) {
    if (page.status === "failed") {
      // Surfaced rather than silently omitted: a gap in the output the user
      // cannot see is worse than an explicit marker.
      pages.push(`[Page ${page.index + 1} could not be read: ${page.error ?? "unknown error"}]`);
      continue;
    }
    const parts = inOrder(page).map((b) =>
      b.type === "table" && b.table ? tableToText(b.table) : blockText(b)
    );
    pages.push(parts.join("\n\n"));
  }
  return pages.join("\n\n");
}

/* ------------------------------------------------------------------ */
/* Markdown                                                            */
/* ------------------------------------------------------------------ */

const LIST_MARKER = /^\s*([•▪◦*–—-]|\d{1,3}[.)]|[a-zA-Z][.)])\s+/;

function listToMarkdown(block: Block): string {
  return block.lines
    .map((l) => `- ${lineText(l).replace(LIST_MARKER, "")}`)
    .join("\n");
}

export function toMarkdown(doc: DocumentModel): string {
  const out: string[] = [];
  for (const page of doc.pages) {
    if (page.status === "failed") {
      out.push(`> **Page ${page.index + 1} could not be read:** ${page.error ?? "unknown error"}`);
      continue;
    }
    for (const b of inOrder(page)) {
      switch (b.type) {
        case "heading":
          out.push(`${"#".repeat(Math.min(6, b.level ?? 2))} ${blockText(b).replace(/\n/g, " ")}`);
          break;
        case "list":
          out.push(listToMarkdown(b));
          break;
        case "table":
          out.push(b.table ? tableToMarkdown(b.table) : blockText(b));
          break;
        case "separator":
          out.push("---");
          break;
        // Running heads, feet and page numbers are page furniture, not
        // content. Emitting them inline would litter the document with
        // repeated noise at every page boundary.
        case "header":
        case "footer":
        case "pageNumber":
          break;
        default:
          out.push(blockText(b));
      }
    }
  }
  return out.filter(Boolean).join("\n\n");
}

/* ------------------------------------------------------------------ */
/* HTML                                                                */
/* ------------------------------------------------------------------ */

function tableToHtml(table: TableStructure): string {
  const renderRow = (r: TableStructure["rows"][number]) => {
    const cells = r
      .map((c) => {
        const tag = c.isHeader ? "th" : "td";
        const span = c.colSpan > 1 ? ` colspan="${c.colSpan}"` : "";
        return `<${tag}${span}>${escapeHtml(c.text)}</${tag}>`;
      })
      .join("");
    return `<tr>${cells}</tr>`;
  };

  if (table.hasHeaderRow && table.rows.length) {
    const [head, ...body] = table.rows;
    return `<table><thead>${renderRow(head)}</thead><tbody>${body
      .map(renderRow)
      .join("")}</tbody></table>`;
  }
  return `<table><tbody>${table.rows.map(renderRow).join("")}</tbody></table>`;
}

export interface HtmlOptions {
  /** Wrap low-confidence words in <mark> so the editor can highlight them. */
  markLowConfidence?: boolean;
  /** Confidence below which a word is considered uncertain. */
  confidenceThreshold?: number;
}

function linesToHtml(block: Block, opts: HtmlOptions): string {
  const threshold = opts.confidenceThreshold ?? 72;
  return block.lines
    .map((l) =>
      l.words
        .map((w) => {
          const text = escapeHtml(w.text);
          return opts.markLowConfidence && w.confidence < threshold
            ? `<mark class="ocr-low" data-word="${w.id}" data-confidence="${Math.round(w.confidence)}">${text}</mark>`
            : text;
        })
        .join(" ")
    )
    .join(" ");
}

export function toHtml(doc: DocumentModel, opts: HtmlOptions = {}): string {
  const out: string[] = [];
  for (const page of doc.pages) {
    if (page.status === "failed") {
      out.push(
        `<p class="ocr-page-error" data-page="${page.index + 1}">Page ${
          page.index + 1
        } could not be read: ${escapeHtml(page.error ?? "unknown error")}</p>`
      );
      continue;
    }
    for (const b of inOrder(page)) {
      const attrs = `data-block="${b.id}" data-type="${b.type}"`;
      switch (b.type) {
        case "heading": {
          const level = Math.min(6, b.level ?? 2);
          out.push(`<h${level} ${attrs}>${linesToHtml(b, opts)}</h${level}>`);
          break;
        }
        case "list":
          out.push(
            `<ul ${attrs}>${b.lines
              .map((l) => `<li>${escapeHtml(lineText(l).replace(LIST_MARKER, ""))}</li>`)
              .join("")}</ul>`
          );
          break;
        case "table":
          out.push(b.table ? tableToHtml(b.table) : `<p ${attrs}>${linesToHtml(b, opts)}</p>`);
          break;
        case "separator":
          out.push("<hr/>");
          break;
        default:
          out.push(`<p ${attrs}>${linesToHtml(b, opts)}</p>`);
      }
    }
  }
  return out.join("\n");
}

/** A standalone, styled HTML document for download. */
export function toHtmlDocument(doc: DocumentModel, title: string): string {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(
    title
  )}</title>
<style>body{font-family:Georgia,serif;max-width:820px;margin:2rem auto;padding:0 1rem;line-height:1.6;color:#222}h1,h2,h3,h4,h5,h6{font-family:system-ui,sans-serif;line-height:1.25}table{border-collapse:collapse;margin:1rem 0;width:100%}td,th{border:1px solid #ccc;padding:6px 10px;text-align:left}th{background:#f4f4f4}mark.ocr-low{background:#fde68a}.ocr-page-error{color:#b91c1c;font-style:italic}</style>
</head><body>${toHtml(doc)}</body></html>`;
}

/* ------------------------------------------------------------------ */
/* JSON                                                                */
/* ------------------------------------------------------------------ */

/**
 * The document model as JSON.
 *
 * This is the full internal representation, which is the point: it is the
 * interchange format that lets someone post-process the result themselves.
 * `space` defaults to 2 because these are read by humans far more often than
 * they are re-parsed.
 */
export function toJson(doc: DocumentModel, space = 2): string {
  return JSON.stringify(doc, null, space);
}
