/**
 * Minimal PNG encoder for tests.
 *
 * Exists so a preprocessed `Raster` can be handed back to tesseract.js, which
 * wants an encoded image rather than a pixel buffer. Node ships zlib, so this
 * needs no dependency — and adding an image library purely for tests would be
 * exactly the kind of weight the project avoids.
 *
 * Encodes 8-bit RGBA, no interlacing, filter type 0. Not general-purpose.
 */

import { deflateSync } from "node:zlib";

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

export function encodePng(raster: {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}): Buffer {
  const { data, width, height } = raster;

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type: RGBA
  ihdr[10] = 0; // deflate
  ihdr[11] = 0; // adaptive filtering
  ihdr[12] = 0; // no interlace

  // Each scanline is prefixed with its filter byte (0 = None).
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    for (let x = 0; x < stride; x++) {
      raw[y * (stride + 1) + 1 + x] = data[y * stride + x];
    }
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/**
 * Load a raw RGBA dump written by scripts/render-ocr-fixtures.ps1.
 *
 * Raw rather than PNG because decoding PNG would need a real decoder; the
 * fixture script can emit raw bytes for free, and this keeps the test helper
 * to an encoder only.
 */
export function loadRawRgba(buf: Buffer, width: number, height: number) {
  return {
    data: new Uint8ClampedArray(buf.buffer, buf.byteOffset, width * height * 4),
    width,
    height,
  };
}
