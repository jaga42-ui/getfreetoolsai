export type OutputFormat =
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "image/bmp";

export const EXT: Record<OutputFormat, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/bmp": "bmp",
};

/** Load a File into an HTMLImageElement via object URL. */
export function loadImage(file: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not load this image."));
    };
    img.src = url;
  });
}

function drawToCanvas(
  img: HTMLImageElement,
  width: number,
  height: number
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");
  // White backdrop so transparent PNGs don't turn black when exported as JPEG.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: OutputFormat,
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Export failed."))),
      format,
      quality
    );
  });
}

/** Re-encode an image at explicit pixel dimensions. */
export async function encodeResized(
  img: HTMLImageElement,
  width: number,
  height: number,
  format: OutputFormat,
  quality: number
): Promise<Blob> {
  const canvas = drawToCanvas(img, width, height);
  if (format === "image/bmp") return canvasToBmpBlob(canvas);
  return canvasToBlob(canvas, format, quality);
}

/** Map a file's mime type to a supported output format (fallback JPEG). */
export function formatFromMime(mime: string): OutputFormat {
  if (mime === "image/png") return "image/png";
  if (mime === "image/webp") return "image/webp";
  if (mime === "image/bmp") return "image/bmp";
  return "image/jpeg";
}

/** Encode a canvas to a 24-bit uncompressed BMP (browsers can't toBlob BMP). */
function canvasToBmpBlob(canvas: HTMLCanvasElement): Blob {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");
  const { width: w, height: h } = canvas;
  const data = ctx.getImageData(0, 0, w, h).data;

  const rowSize = Math.floor((24 * w + 31) / 32) * 4; // padded to 4 bytes
  const pixelArraySize = rowSize * h;
  const fileSize = 54 + pixelArraySize;
  const buf = new ArrayBuffer(fileSize);
  const view = new DataView(buf);

  // BITMAPFILEHEADER
  view.setUint8(0, 0x42); // 'B'
  view.setUint8(1, 0x4d); // 'M'
  view.setUint32(2, fileSize, true);
  view.setUint32(10, 54, true); // pixel data offset
  // BITMAPINFOHEADER
  view.setUint32(14, 40, true);
  view.setInt32(18, w, true);
  view.setInt32(22, h, true); // positive = bottom-up
  view.setUint16(26, 1, true);
  view.setUint16(28, 24, true);
  view.setUint32(34, pixelArraySize, true);

  let offset = 54;
  for (let y = h - 1; y >= 0; y--) {
    let rowOffset = offset;
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      view.setUint8(rowOffset++, data[i + 2]); // B
      view.setUint8(rowOffset++, data[i + 1]); // G
      view.setUint8(rowOffset++, data[i]); // R
    }
    offset += rowSize;
  }
  return new Blob([buf], { type: "image/bmp" });
}

/** Re-encode an image at a given format/quality, optionally rescaled. */
export async function encodeImage(
  img: HTMLImageElement,
  format: OutputFormat,
  quality: number,
  scale = 1
): Promise<Blob> {
  const canvas = drawToCanvas(
    img,
    img.naturalWidth * scale,
    img.naturalHeight * scale
  );
  if (format === "image/bmp") return canvasToBmpBlob(canvas);
  return canvasToBlob(canvas, format, quality);
}

/**
 * Binary-search JPEG/WebP quality (and downscale as a fallback) to land at or
 * just under a target size in bytes.
 */
export async function compressToTargetBytes(
  img: HTMLImageElement,
  targetBytes: number,
  format: OutputFormat = "image/jpeg"
): Promise<{ blob: Blob; quality: number; scale: number }> {
  let scale = 1;
  let best: { blob: Blob; quality: number; scale: number } | null = null;

  // Up to a few downscale passes if quality alone can't reach the target.
  for (let pass = 0; pass < 6; pass++) {
    let lo = 0.05;
    let hi = 0.95;
    let passBest: Blob | null = null;
    let passQuality = lo;

    for (let i = 0; i < 8; i++) {
      const mid = (lo + hi) / 2;
      const blob = await encodeImage(img, format, mid, scale);
      if (blob.size <= targetBytes) {
        passBest = blob;
        passQuality = mid;
        lo = mid; // try for higher quality
      } else {
        hi = mid; // too big, lower quality
      }
    }

    if (passBest) {
      best = { blob: passBest, quality: passQuality, scale };
      break;
    }

    // Even lowest quality overshoots — record the smallest we got, then downscale.
    const lowest = await encodeImage(img, format, 0.05, scale);
    if (!best || lowest.size < best.blob.size) {
      best = { blob: lowest, quality: 0.05, scale };
    }
    scale *= 0.8;
  }

  return best!;
}
