import { describe, it, expect } from "vitest";
import { wrapText, roundRect } from "@/lib/canvasDraw";

/**
 * A stand-in for CanvasRenderingContext2D. Only `measureText` matters for
 * wrapping, and a fixed 10px-per-character metric makes expected line breaks
 * exact rather than font-dependent.
 */
function fakeCtx(charWidth = 10) {
  return {
    measureText: (s: string) => ({ width: s.length * charWidth }),
  } as unknown as CanvasRenderingContext2D;
}

describe("wrapText", () => {
  it("keeps text on one line when it fits", () => {
    expect(wrapText(fakeCtx(), "hello world", 200)).toEqual(["hello world"]);
  });

  it("breaks on word boundaries when the line overflows", () => {
    // 10px/char, 100px max => 10 chars per line.
    expect(wrapText(fakeCtx(), "aaa bbb ccc ddd", 100)).toEqual([
      "aaa bbb",
      "ccc ddd",
    ]);
  });

  it("treats newlines as hard breaks", () => {
    expect(wrapText(fakeCtx(), "one\ntwo", 1000)).toEqual(["one", "two"]);
  });

  it("preserves blank lines so paragraph spacing survives", () => {
    expect(wrapText(fakeCtx(), "one\n\ntwo", 1000)).toEqual(["one", "", "two"]);
  });

  it("does not drop a word that is longer than the max width", () => {
    // A single 15-char word cannot fit in 100px but must still be emitted.
    const out = wrapText(fakeCtx(), "supercalifragil", 100);
    expect(out).toEqual(["supercalifragil"]);
  });

  it("puts an over-long word on its own line rather than merging it", () => {
    const out = wrapText(fakeCtx(), "hi supercalifragil", 100);
    expect(out).toEqual(["hi", "supercalifragil"]);
  });

  it("returns a single empty string for empty input", () => {
    expect(wrapText(fakeCtx(), "", 100)).toEqual([""]);
  });
});

/** Records the radius passed to each arcTo call so clamping can be asserted. */
function recordingCtx() {
  const radii: number[] = [];
  const ctx = {
    beginPath: () => {},
    closePath: () => {},
    moveTo: () => {},
    arcTo: (_x1: number, _y1: number, _x2: number, _y2: number, r: number) => {
      radii.push(r);
    },
  } as unknown as CanvasRenderingContext2D;
  return { ctx, radii };
}

describe("roundRect", () => {
  it("uses the requested radius when it fits", () => {
    const { ctx, radii } = recordingCtx();
    roundRect(ctx, 0, 0, 100, 60, 8);
    expect(radii).toEqual([8, 8, 8, 8]);
  });

  it("clamps the radius to half the shorter side", () => {
    // Height 20 => max usable radius is 10, even though 40 was requested.
    const { ctx, radii } = recordingCtx();
    roundRect(ctx, 0, 0, 100, 20, 40);
    expect(radii).toEqual([10, 10, 10, 10]);
  });

  it("never produces a negative radius", () => {
    const { ctx, radii } = recordingCtx();
    roundRect(ctx, 0, 0, 50, 50, -5);
    expect(radii).toEqual([0, 0, 0, 0]);
  });
});
