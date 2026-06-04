import { PDFDocument, StandardFonts, type PDFFont, type PDFPage } from "pdf-lib";

/**
 * Build a searchable PDF entirely in the browser: keep the original page exactly
 * as it looks, and overlay an INVISIBLE (opacity 0) text layer positioned from
 * the OCR word boxes. The result looks identical but is selectable/searchable.
 *
 * Standard Helvetica only encodes Latin-1, so the searchable layer is sanitised
 * to WinAnsi. Non-Latin scripts still render visibly (the original image is
 * untouched) but won't be in the hidden text layer — an honest browser limit
 * without embedding a multi-megabyte Unicode font.
 */

export type OcrWordBox = { text: string; x0: number; y0: number; x1: number; y1: number };
export type PageWords = { words: OcrWordBox[]; cw: number; ch: number };

function sanitize(s: string): string {
  return s
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...")
    .replace(/[^\x20-\xFF]/g, "");
}

function drawWords(page: PDFPage, font: PDFFont, words: OcrWordBox[], scale: number, pageHeight: number) {
  for (const w of words) {
    const text = sanitize(w.text);
    if (!text.trim()) continue;
    const size = Math.max(1, (w.y1 - w.y0) / scale);
    const x = w.x0 / scale;
    const y = pageHeight - w.y1 / scale;
    try {
      page.drawText(text, { x, y, size, font, opacity: 0 });
    } catch {
      /* word contains glyphs Helvetica can't encode — skip it */
    }
  }
}

/** Overlay a searchable text layer onto the original PDF (preserves vectors). */
export async function searchablePdfFromOriginal(originalBytes: ArrayBuffer, pages: PageWords[]): Promise<Blob> {
  const pdf = await PDFDocument.load(originalBytes);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const docPages = pdf.getPages();
  pages.forEach((pw, i) => {
    const page = docPages[i];
    if (!page) return;
    const { width, height } = page.getSize();
    const scale = pw.cw > 0 ? pw.cw / width : 1;
    drawWords(page, font, pw.words, scale, height);
  });
  const bytes = await pdf.save();
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
}

/** Wrap a single (already-rendered) image page into a searchable PDF. */
export async function searchablePdfFromImagePng(
  pngBytes: ArrayBuffer,
  words: OcrWordBox[],
  cw: number,
  ch: number
): Promise<Blob> {
  const pdf = await PDFDocument.create();
  const img = await pdf.embedPng(pngBytes);
  const page = pdf.addPage([cw, ch]);
  page.drawImage(img, { x: 0, y: 0, width: cw, height: ch });
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  drawWords(page, font, words, 1, ch);
  const bytes = await pdf.save();
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
}
