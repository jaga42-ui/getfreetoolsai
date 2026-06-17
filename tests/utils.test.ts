import { describe, it, expect } from "vitest";
import { formatBytes, parsePageRanges } from "@/lib/utils";

describe("formatBytes", () => {
  it("returns '0 B' for zero", () => {
    expect(formatBytes(0)).toBe("0 B");
  });

  it("formats bytes, KB, MB and GB", () => {
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(1024)).toBe("1 KB");
    expect(formatBytes(1536)).toBe("1.5 KB");
    expect(formatBytes(1024 * 1024)).toBe("1 MB");
    expect(formatBytes(1024 * 1024 * 1024)).toBe("1 GB");
  });

  it("honors the decimals argument", () => {
    expect(formatBytes(1536, 0)).toBe("2 KB");
    expect(formatBytes(1024 * 1024 * 1.25, 2)).toBe("1.25 MB");
  });
});

describe("parsePageRanges", () => {
  it("parses single pages and ranges, sorted and de-duplicated", () => {
    expect(parsePageRanges("1,3,5-8,12", 20)).toEqual([1, 3, 5, 6, 7, 8, 12]);
  });

  it("clamps out-of-bounds pages to the total", () => {
    expect(parsePageRanges("0,5-12", 10)).toEqual([5, 6, 7, 8, 9, 10]);
  });

  it("normalizes reversed ranges", () => {
    expect(parsePageRanges("8-5", 10)).toEqual([5, 6, 7, 8]);
  });

  it("de-duplicates overlapping ranges and pages", () => {
    expect(parsePageRanges("1-3,2,3-4", 10)).toEqual([1, 2, 3, 4]);
  });

  it("ignores whitespace and empty/garbage segments", () => {
    expect(parsePageRanges(" 2 , , 4 , x , 6-7 ", 10)).toEqual([2, 4, 6, 7]);
  });

  it("returns an empty array when nothing is valid", () => {
    expect(parsePageRanges("abc, 99", 10)).toEqual([]);
  });
});
