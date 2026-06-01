import type { PDFPageProxy } from "pdfjs-dist";

/**
 * Lazily load pdfjs-dist and wire up its web worker.
 * The worker is emitted as a static asset by webpack via new URL(..., import.meta.url).
 */
export async function getPdfjs() {
  const pdfjs = await import("pdfjs-dist");
  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    // Served from /public (see scripts/copy-pdf-worker.mjs, run on pre(dev|build)).
    pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  }
  return pdfjs;
}

/** Render a single PDF page to a fresh canvas at the given scale. */
export async function renderPageToCanvas(
  page: PDFPageProxy,
  scale: number
): Promise<HTMLCanvasElement> {
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");
  await page.render({ canvasContext: ctx, viewport }).promise;
  return canvas;
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Export failed."))),
      type,
      quality
    );
  });
}
