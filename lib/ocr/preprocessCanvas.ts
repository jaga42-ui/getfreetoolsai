/**
 * Browser adapter for the preprocessing pipeline.
 *
 * `preprocess.ts` is deliberately DOM-free so it can be unit-tested in Node and
 * reused server-side. This is the only place that knows about canvases, and it
 * is a thin bridge: pixels in, pixels out, no analysis logic.
 *
 * Nothing here touches the DOM at module scope, so importing this file from
 * code that also runs under Node is safe — only calling the functions requires
 * a browser.
 */

import {
  preprocess,
  type PreprocessPlan,
  type Raster,
  type RasterAnalysis,
} from "./preprocess";

/** Read a canvas into a plain RGBA raster. */
export function rasterFromCanvas(canvas: HTMLCanvasElement): Raster {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas 2D context is unavailable in this browser.");
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return { data: img.data, width: img.width, height: img.height };
}

/** Write a raster into a new canvas. */
export function canvasFromRaster(raster: Raster): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = raster.width;
  canvas.height = raster.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context is unavailable in this browser.");
  // createImageData + set, rather than `new ImageData(raster.data, ...)`: the
  // constructor requires an ArrayBuffer-backed array specifically, and a
  // Raster's buffer may be a view over something else (a raw fixture read, a
  // SharedArrayBuffer). This copies once and is always valid.
  const img = ctx.createImageData(raster.width, raster.height);
  img.data.set(raster.data);
  ctx.putImageData(img, 0, 0);
  return canvas;
}

export interface CanvasPreprocessResult {
  /** The cleaned canvas — the SAME object as the input when nothing was done. */
  canvas: HTMLCanvasElement;
  analysis: RasterAnalysis;
  plan: PreprocessPlan;
}

/**
 * Analyse and clean a rendered page.
 *
 * Returns the original canvas untouched when the plan is empty, so a clean
 * scan costs one analysis pass and no reallocation.
 */
export function preprocessCanvas(canvas: HTMLCanvasElement): CanvasPreprocessResult {
  const { raster, analysis, plan } = preprocess(rasterFromCanvas(canvas));
  if (!plan.ops.length) return { canvas, analysis, plan };
  return { canvas: canvasFromRaster(raster), analysis, plan };
}
