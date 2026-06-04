/**
 * Layout-aware document reconstruction from Tesseract's structured output.
 *
 * Tesseract returns a block → paragraph → line → word hierarchy with bounding
 * boxes and per-word confidence. Most OCR tools throw this away and keep only
 * `data.text`. Here we use the geometry to rebuild headings, paragraphs, lists
 * and (heuristically) tables, then serialise to HTML / Markdown / plain text.
 *
 * Everything is defensive: if the structured `blocks` are missing we fall back
 * to plain paragraphs, so the result is never worse than a flat text dump.
 */

export interface OcrBox { x0: number; y0: number; x1: number; y1: number }
export interface OcrWord { text: string; confidence: number; bbox: OcrBox }
export interface OcrLine { text: string; bbox: OcrBox; words: OcrWord[] }
export interface OcrPara { bbox: OcrBox; lines: OcrLine[] }
export interface OcrBlock { bbox: OcrBox; paragraphs: OcrPara[] }

export type Run = { text: string; low: boolean };
export type DocNode =
  | { kind: "heading"; level: 2 | 3; runs: Run[] }
  | { kind: "paragraph"; runs: Run[] }
  | { kind: "list"; items: Run[][] }
  | { kind: "table"; rows: string[][] };

const LOW_CONF = 72;
const LIST_RE = /^\s*([•▪◦*\-–]|\d{1,3}[.)]|[a-zA-Z][.)])\s+/;

function median(nums: number[]): number {
  if (!nums.length) return 0;
  const s = [...nums].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function wordsToRuns(words: OcrWord[]): Run[] {
  const ws = words.filter((w) => w.text.trim());
  const runs: Run[] = [];
  ws.forEach((w, i) => {
    if (i > 0) runs.push({ text: " ", low: false });
    runs.push({ text: w.text, low: (w.confidence ?? 100) < LOW_CONF });
  });
  return runs;
}

/** Cluster x-positions into column centres. */
function clusterColumns(xs: number[], threshold: number): number[] {
  const sorted = [...xs].sort((a, b) => a - b);
  const clusters: number[][] = [];
  for (const x of sorted) {
    const last = clusters[clusters.length - 1];
    if (last && x - last[last.length - 1] <= threshold) last.push(x);
    else clusters.push([x]);
  }
  return clusters.map((c) => c.reduce((a, b) => a + b, 0) / c.length);
}

/** Split a line into cells at LARGE horizontal gaps (real column separators). */
function splitRowByGaps(line: OcrLine, gapThresh: number): { x0: number; text: string }[] {
  const ws = line.words.filter((w) => w.text.trim());
  if (!ws.length) return [];
  const cells: { x0: number; text: string }[] = [];
  let curX0 = ws[0].bbox.x0, curX1 = ws[0].bbox.x1, curText = ws[0].text;
  for (let i = 1; i < ws.length; i++) {
    if (ws[i].bbox.x0 - curX1 > gapThresh) {
      cells.push({ x0: curX0, text: curText });
      curX0 = ws[i].bbox.x0; curText = ws[i].text;
    } else curText += " " + ws[i].text;
    curX1 = ws[i].bbox.x1;
  }
  cells.push({ x0: curX0, text: curText });
  return cells;
}

function modeOf(nums: number[]): number {
  const m = new Map<number, number>();
  let best = nums[0], bestC = 0;
  for (const n of nums) {
    const c = (m.get(n) ?? 0) + 1;
    m.set(n, c);
    if (c > bestC) { bestC = c; best = n; }
  }
  return best;
}

/**
 * Strict table detection: requires real (large-gap) column separators, a
 * consistent cell count across rows, and columns that align vertically. This
 * deliberately rejects ordinary prose (small, irregular word gaps).
 */
function detectTable(lines: OcrLine[], pageWidth: number): string[][] | null {
  if (pageWidth <= 0) return null;
  const gapThresh = pageWidth * 0.06;
  const rows = lines.map((l) => splitRowByGaps(l, gapThresh)).filter((c) => c.length);
  const candidates = rows.filter((r) => r.length >= 2);
  if (candidates.length < 2) return null;

  const mode = modeOf(candidates.map((r) => r.length));
  if (mode < 2 || mode > 8) return null;
  const tableRows = candidates.filter((r) => r.length === mode);
  if (tableRows.length < Math.max(2, Math.ceil(rows.length * 0.6))) return null;

  const cols = clusterColumns(tableRows.flatMap((r) => r.map((c) => c.x0)), pageWidth * 0.05);
  if (Math.abs(cols.length - mode) > 1) return null;

  return tableRows.map((r) => {
    const cells = cols.map(() => "");
    for (const cell of r) {
      let best = 0, bestD = Infinity;
      cols.forEach((c, i) => { const d = Math.abs(cell.x0 - c); if (d < bestD) { bestD = d; best = i; } });
      cells[best] = cells[best] ? `${cells[best]} ${cell.text}` : cell.text;
    }
    return cells;
  });
}

/** Build a structured document model from Tesseract blocks. */
export function reconstruct(blocks: OcrBlock[] | null | undefined, fallbackText: string): DocNode[] {
  if (!blocks || !blocks.length) {
    return fallbackText
      .split(/\n{2,}/)
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => ({ kind: "paragraph", runs: [{ text: t, low: false }] }));
  }

  const allLines: OcrLine[] = [];
  for (const b of blocks) for (const p of b.paragraphs ?? []) for (const l of p.lines ?? []) allLines.push(l);
  const medHeight = median(allLines.map((l) => l.bbox.y1 - l.bbox.y0).filter((h) => h > 0)) || 1;
  const pageWidth = Math.max(0, ...allLines.map((l) => l.bbox.x1));

  const out: DocNode[] = [];

  for (const block of blocks) {
    for (const para of block.paragraphs ?? []) {
      const lines = (para.lines ?? []).filter((l) => l.words?.some((w) => w.text.trim()));
      if (!lines.length) continue;

      // Table?
      const table = detectTable(lines, pageWidth);
      if (table) { out.push({ kind: "table", rows: table }); continue; }

      // List?
      const isList = lines.length >= 2 && lines.every((l) => LIST_RE.test(l.text));
      if (isList) {
        out.push({
          kind: "list",
          items: lines.map((l) => wordsToRuns(l.words.filter((w, i) => !(i === 0 && /^[•▪◦*\-–\d.)]+$/.test(w.text))))),
        });
        continue;
      }

      // Heading? (single short line, noticeably taller than body text)
      const h = lines[0].bbox.y1 - lines[0].bbox.y0;
      const wordCount = lines.reduce((n, l) => n + l.words.filter((w) => w.text.trim()).length, 0);
      if (lines.length === 1 && wordCount <= 12 && h >= medHeight * 1.4) {
        out.push({ kind: "heading", level: h >= medHeight * 1.9 ? 2 : 3, runs: wordsToRuns(lines[0].words) });
        continue;
      }

      // Paragraph (join lines, fixing end-of-line hyphenation).
      const runs: Run[] = [];
      lines.forEach((l, i) => {
        const lr = wordsToRuns(l.words);
        if (i > 0) {
          const prev = runs[runs.length - 1];
          if (prev && /[A-Za-z]-$/.test(prev.text)) prev.text = prev.text.replace(/-$/, "");
          else runs.push({ text: " ", low: false });
        }
        runs.push(...lr);
      });
      out.push({ kind: "paragraph", runs });
    }
  }

  return out.length ? out : reconstruct(null, fallbackText);
}

/* ----------------------------- serialisers ----------------------------- */

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function runsHtml(runs: Run[], highlight: boolean): string {
  return runs
    .map((r) => (highlight && r.low ? `<mark class="ocr-low">${esc(r.text)}</mark>` : esc(r.text)))
    .join("");
}
const runsText = (runs: Run[]) => runs.map((r) => r.text).join("");

export function docToHtml(doc: DocNode[], highlight = false): string {
  return doc
    .map((n) => {
      switch (n.kind) {
        case "heading":
          return `<h${n.level}>${runsHtml(n.runs, highlight)}</h${n.level}>`;
        case "list":
          return `<ul>${n.items.map((it) => `<li>${runsHtml(it, highlight)}</li>`).join("")}</ul>`;
        case "table":
          return `<table><tbody>${n.rows
            .map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`)
            .join("")}</tbody></table>`;
        default:
          return `<p>${runsHtml(n.runs, highlight)}</p>`;
      }
    })
    .join("\n");
}

export function docToMarkdown(doc: DocNode[]): string {
  return doc
    .map((n) => {
      switch (n.kind) {
        case "heading":
          return `${n.level === 2 ? "##" : "###"} ${runsText(n.runs)}`;
        case "list":
          return n.items.map((it) => `- ${runsText(it)}`).join("\n");
        case "table": {
          if (!n.rows.length) return "";
          const head = n.rows[0];
          const sep = head.map(() => "---");
          const body = n.rows.slice(1);
          return [head, sep, ...body].map((r) => `| ${r.join(" | ")} |`).join("\n");
        }
        default:
          return runsText(n.runs);
      }
    })
    .join("\n\n");
}

export function docToText(doc: DocNode[]): string {
  return doc
    .map((n) => {
      switch (n.kind) {
        case "list":
          return n.items.map((it) => `• ${runsText(it)}`).join("\n");
        case "table":
          return n.rows.map((r) => r.join("\t")).join("\n");
        default:
          return runsText(n.runs);
      }
    })
    .join("\n\n");
}

/* ----------------------------- exports ----------------------------- */

/** Standalone, styled HTML document. */
export function fullHtmlDocument(bodyHtml: string, title: string): string {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}</title>
<style>body{font-family:Georgia,serif;max-width:820px;margin:2rem auto;padding:0 1rem;line-height:1.6;color:#222}h2,h3{font-family:system-ui,sans-serif}table{border-collapse:collapse;margin:1rem 0;width:100%}td,th{border:1px solid #ccc;padding:6px 10px;text-align:left}mark{background:#fde68a}</style>
</head><body>${bodyHtml}</body></html>`;
}

/** Word-openable .doc (HTML with Office namespaces) — preserves headings & tables. */
export function wordDocument(bodyHtml: string, title: string): string {
  return `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><meta charset='utf-8'><title>${esc(title)}</title>
<style>table{border-collapse:collapse}td,th{border:1px solid #000000;padding:4px 8px}</style></head>
<body>${bodyHtml}</body></html>`;
}

const ENTITIES: Record<string, string> = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&nbsp;": " ", "&quot;": '"', "&#39;": "'" };
const decode = (s: string) => s.replace(/&[a-z#0-9]+;/gi, (m) => ENTITIES[m] ?? m);

/** Convert (possibly edited) HTML back to plain text. */
export function htmlToPlainText(html: string): string {
  return decode(
    html
      .replace(/<\s*(style|script)[\s\S]*?<\/\s*\1\s*>/gi, "")
      .replace(/<\/(p|h[1-6]|div|tr|ul|ol)>/gi, "\n")
      .replace(/<li[^>]*>/gi, "• ")
      .replace(/<\/li>/gi, "\n")
      .replace(/<\/td>\s*<td[^>]*>/gi, "\t")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, "")
  )
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Convert (possibly edited) HTML to Markdown (approximate). */
export function htmlToMarkdown(html: string): string {
  return decode(
    html
      .replace(/<\s*(style|script)[\s\S]*?<\/\s*\1\s*>/gi, "")
      .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, t) => `\n## ${t.replace(/<[^>]+>/g, "").trim()}\n`)
      .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, t) => `\n### ${t.replace(/<[^>]+>/g, "").trim()}\n`)
      .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, t) => `- ${t.replace(/<[^>]+>/g, "").trim()}\n`)
      .replace(/<\/tr>/gi, "|\n")
      .replace(/<td[^>]*>([\s\S]*?)<\/td>/gi, (_, t) => `| ${t.replace(/<[^>]+>/g, "").trim()} `)
      .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, t) => `\n${t.replace(/<[^>]+>/g, "").trim()}\n`)
      .replace(/<[^>]+>/g, "")
  )
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Quick stats for the live dashboard. */
export function docStats(doc: DocNode[]) {
  let words = 0;
  let tables = 0;
  let headings = 0;
  for (const n of doc) {
    if (n.kind === "table") { tables++; words += n.rows.flat().join(" ").split(/\s+/).filter(Boolean).length; }
    else if (n.kind === "heading") { headings++; words += runsText(n.runs).split(/\s+/).filter(Boolean).length; }
    else if (n.kind === "list") words += n.items.map(runsText).join(" ").split(/\s+/).filter(Boolean).length;
    else words += runsText(n.runs).split(/\s+/).filter(Boolean).length;
  }
  return { words, tables, headings };
}
