import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { writeFileSync, mkdirSync } from "fs";

mkdirSync("scripts/fixtures", { recursive: true });

// --- A 3-page PDF with text ---
async function makeTextPdf(name, pages, label) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  for (let i = 1; i <= pages; i++) {
    const page = doc.addPage([595, 842]);
    page.drawText(`${label} — Page ${i}`, {
      x: 60,
      y: 760,
      size: 32,
      font,
      color: rgb(0.1, 0.1, 0.6),
    });
    page.drawText("The quick brown fox jumps over the lazy dog.", {
      x: 60,
      y: 700,
      size: 16,
      font,
    });
  }
  const bytes = await doc.save();
  writeFileSync(`scripts/fixtures/${name}`, bytes);
  console.log(`wrote scripts/fixtures/${name} (${bytes.length} bytes)`);
}

await makeTextPdf("doc-a.pdf", 3, "Document A");
await makeTextPdf("doc-b.pdf", 2, "Document B");

// --- A large-ish PNG (so compression has something to chew on) ---
function makePng() {
  const W = 800;
  const H = 600;
  // Build a raw RGBA buffer with a noisy gradient (poorly compressible).
  const raw = Buffer.alloc(W * H * 4);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = (y * W + x) * 4;
      raw[idx] = (x * 255) / W;
      raw[idx + 1] = (y * 255) / H;
      raw[idx + 2] = (x ^ y) & 0xff;
      raw[idx + 3] = 255;
    }
  }
  // Minimal uncompressed-ish PNG via zlib stored blocks.
  return encodePng(W, H, raw);
}

import zlib from "zlib";
function encodePng(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, "ascii");
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])) >>> 0, 0);
    return Buffer.concat([len, typeBuf, data, crc]);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  // Add filter byte 0 per scanline
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const idat = zlib.deflateSync(raw);
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}
function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = c & 1 ? (c >>> 1) ^ 0xedb88320 : c >>> 1;
  }
  return ~c;
}

const png = makePng();
writeFileSync("scripts/fixtures/photo.png", png);
console.log(`wrote scripts/fixtures/photo.png (${png.length} bytes)`);
