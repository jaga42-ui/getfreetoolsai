// Generates the brand favicon, app icons, Apple touch icon, PWA manifest icons
// and the Organization logo as real PNG/ICO files. Pure Node (zlib) — no native
// deps, fully offline & deterministic. Indigo rounded-square "F" monogram that
// matches the OG image and manifest theme color (#6366f1).
import zlib from "zlib";
import { writeFileSync, mkdirSync } from "fs";

const INDIGO = [99, 102, 241];
const WHITE = [255, 255, 255];

/** Build an RGBA buffer for the icon at a given size. */
function drawIcon(size, { rounded }) {
  const W = size;
  const H = size;
  const buf = Buffer.alloc(W * H * 4); // zero = transparent
  const r = Math.round(size * 0.22);

  const inRounded = (x, y) => {
    if (!rounded) return true;
    if (x < r && y < r) return (x - r) ** 2 + (y - r) ** 2 <= r * r;
    if (x >= W - r && y < r) return (x - (W - r - 1)) ** 2 + (y - r) ** 2 <= r * r;
    if (x < r && y >= H - r) return (x - r) ** 2 + (y - (H - r - 1)) ** 2 <= r * r;
    if (x >= W - r && y >= H - r)
      return (x - (W - r - 1)) ** 2 + (y - (H - r - 1)) ** 2 <= r * r;
    return true;
  };

  // "F" monogram, defined in relative coordinates.
  const sx0 = 0.34 * W, sx1 = 0.46 * W; // stem
  const y0 = 0.28 * H, y1 = 0.72 * H;
  const topX1 = 0.68 * W, topY1 = 0.4 * H; // top arm
  const midX1 = 0.6 * W, midY0 = 0.46 * H, midY1 = 0.56 * H; // middle arm
  const inF = (x, y) =>
    (x >= sx0 && x < sx1 && y >= y0 && y < y1) ||
    (x >= sx0 && x < topX1 && y >= y0 && y < topY1) ||
    (x >= sx0 && x < midX1 && y >= midY0 && y < midY1);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      if (!inRounded(x, y)) continue; // transparent
      const c = inF(x, y) ? WHITE : INDIGO;
      buf[i] = c[0];
      buf[i + 1] = c[1];
      buf[i + 2] = c[2];
      buf[i + 3] = 255;
    }
  }
  return buf;
}

// --- Minimal PNG encoder (RGBA, filter 0) ---
function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = c & 1 ? (c >>> 1) ^ 0xedb88320 : c >>> 1;
  }
  return ~c >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}
function encodePng(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}
function pngIcon(size, opts) {
  return encodePng(size, size, drawIcon(size, opts));
}

/** Wrap a PNG into a single-image .ico container. */
function pngToIco(pngBuf, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // count
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size >= 256 ? 0 : size, 0);
  entry.writeUInt8(size >= 256 ? 0 : size, 1);
  entry.writeUInt16LE(1, 4); // planes
  entry.writeUInt16LE(32, 6); // bpp
  entry.writeUInt32LE(pngBuf.length, 8);
  entry.writeUInt32LE(22, 12); // offset
  return Buffer.concat([header, entry, pngBuf]);
}

mkdirSync("public", { recursive: true });

// Favicon (classic .ico) + app PNG icon + Apple touch icon (full-bleed for iOS).
writeFileSync("app/favicon.ico", pngToIco(pngIcon(48, { rounded: true }), 48));
writeFileSync("app/icon.png", pngIcon(256, { rounded: true }));
writeFileSync("app/apple-icon.png", pngIcon(180, { rounded: false }));

// PWA manifest icons + Organization logo.
writeFileSync("public/icon-192.png", pngIcon(192, { rounded: true }));
writeFileSync("public/icon-512.png", pngIcon(512, { rounded: true }));
writeFileSync("public/logo.png", pngIcon(512, { rounded: true }));

console.log(
  "Generated: app/favicon.ico, app/icon.png, app/apple-icon.png, public/icon-192.png, public/icon-512.png, public/logo.png"
);
