import { describe, it, expect, vi } from "vitest";
import { runPipeline, retryPage, type PageSource } from "@/lib/ocr/pipeline";
import { OcrPageError, type OCRProvider, type RecognizedPage } from "@/lib/ocr/provider";
import type { Line, Word } from "@/lib/ocr/types";
import { documentText } from "@/lib/ocr/document";

let uid = 0;
function prose(text: string, y: number): Line {
  const words: Word[] = [];
  let cursor = 0;
  for (const t of text.split(" ")) {
    const bbox = { x0: cursor, y0: y, x1: cursor + t.length * 8, y1: y + 16 };
    words.push({ id: `w${uid++}`, text: t, bbox, confidence: 92, style: { fontSizePx: 16 } });
    cursor = bbox.x1 + 5;
  }
  return {
    id: `l${uid++}`,
    words,
    bbox: {
      x0: 0,
      y0: y,
      x1: words[words.length - 1].bbox.x1,
      y1: y + 16,
    },
  };
}

function recognizedPage(pageIndex: number, text: string): RecognizedPage {
  return {
    pageIndex,
    width: 1000,
    height: 1400,
    lines: [prose(text, 100), prose("second line of this page here", 130)],
    confidence: 92,
  };
}

/** A provider that succeeds, except on the page indices listed in `failOn`. */
function fakeProvider(failOn: number[] = []): OCRProvider & { initCount: number } {
  let initCount = 0;
  const p = {
    id: "fake",
    displayName: "Fake",
    runsLocally: true,
    languages: () => [{ code: "eng", label: "English", script: "Latin" }],
    async init() {
      initCount++;
    },
    async recognize({ pageIndex }: { pageIndex: number }) {
      if (failOn.includes(pageIndex)) {
        throw new OcrPageError(pageIndex, `page ${pageIndex} exploded`);
      }
      return recognizedPage(pageIndex, `content of page ${pageIndex}`);
    },
    async terminate() {},
    get initCount() {
      return initCount;
    },
  };
  return p as unknown as OCRProvider & { initCount: number };
}

const canvas = () => ({ width: 1000, height: 1400 }) as unknown as HTMLCanvasElement;

const sources = (n: number): PageSource[] =>
  Array.from({ length: n }, (_, i) => ({ index: i, render: async () => canvas() }));

describe("runPipeline", () => {
  it("processes every page and assembles a document", async () => {
    const doc = await runPipeline(sources(3), {
      provider: fakeProvider(),
      languages: ["eng"],
    });
    expect(doc.pages).toHaveLength(3);
    expect(doc.pages.every((p) => p.status === "ok")).toBe(true);
    expect(documentText(doc)).toContain("content of page 1");
  });

  it("ISOLATION: one failing page does not abort the run", async () => {
    // The defect this module exists to fix — previously a single throw killed
    // the whole document.
    const doc = await runPipeline(sources(5), {
      provider: fakeProvider([2]),
      languages: ["eng"],
    });
    expect(doc.pages).toHaveLength(5);
    expect(doc.pages.filter((p) => p.status === "ok")).toHaveLength(4);
    const failed = doc.pages.find((p) => p.index === 2)!;
    expect(failed.status).toBe("failed");
    expect(failed.error).toContain("exploded");
  });

  it("records every failure, not just the first", async () => {
    const doc = await runPipeline(sources(6), {
      provider: fakeProvider([1, 4]),
      languages: ["eng"],
    });
    expect(doc.pages.filter((p) => p.status === "failed").map((p) => p.index)).toEqual([1, 4]);
  });

  it("keeps pages in index order", async () => {
    const doc = await runPipeline(sources(4), {
      provider: fakeProvider(),
      languages: ["eng"],
    });
    expect(doc.pages.map((p) => p.index)).toEqual([0, 1, 2, 3]);
  });

  it("reports monotonically increasing progress ending at 1", async () => {
    const seen: number[] = [];
    await runPipeline(sources(3), {
      provider: fakeProvider(),
      languages: ["eng"],
      onProgress: (p) => seen.push(p.fraction),
    });
    expect(seen[seen.length - 1]).toBe(1);
    for (let i = 1; i < seen.length; i++) {
      expect(seen[i]).toBeGreaterThanOrEqual(seen[i - 1]);
    }
  });

  it("reaches the done stage", async () => {
    const stages: string[] = [];
    await runPipeline(sources(2), {
      provider: fakeProvider(),
      languages: ["eng"],
      onProgress: (p) => stages.push(p.stage),
    });
    expect(stages[0]).toBe("preparing");
    expect(stages[stages.length - 1]).toBe("done");
  });

  it("streams each page as it completes", async () => {
    const streamed: number[] = [];
    await runPipeline(sources(3), {
      provider: fakeProvider(),
      languages: ["eng"],
      onPage: (p) => streamed.push(p.index),
    });
    expect(streamed).toEqual([0, 1, 2]);
  });

  it("streams failed pages too, so the UI can offer a retry", async () => {
    const streamed: string[] = [];
    await runPipeline(sources(3), {
      provider: fakeProvider([1]),
      languages: ["eng"],
      onPage: (p) => streamed.push(p.status),
    });
    expect(streamed).toEqual(["ok", "failed", "ok"]);
  });

  it("does not re-OCR a page that already has a native text layer", async () => {
    const provider = fakeProvider();
    const spy = vi.spyOn(provider, "recognize");
    const native = recognizedPage(0, "native text layer content");
    const doc = await runPipeline([{ index: 0, render: async () => canvas(), native }], {
      provider,
      languages: ["eng"],
    });
    expect(spy).not.toHaveBeenCalled();
    expect(doc.pages[0].source).toBe("native");
    expect(documentText(doc)).toContain("native text layer content");
  });

  it("never calls render for a native page", async () => {
    const render = vi.fn(async () => canvas());
    await runPipeline([{ index: 0, render, native: recognizedPage(0, "already text") }], {
      provider: fakeProvider(),
      languages: ["eng"],
    });
    expect(render).not.toHaveBeenCalled();
  });

  it("stops early when aborted", async () => {
    const controller = new AbortController();
    let seen = 0;
    const srcs: PageSource[] = Array.from({ length: 10 }, (_, i) => ({
      index: i,
      render: async () => {
        seen++;
        if (seen === 2) controller.abort();
        return canvas();
      },
    }));
    const doc = await runPipeline(srcs, {
      provider: fakeProvider(),
      languages: ["eng"],
      signal: controller.signal,
    });
    expect(doc.pages.length).toBeLessThan(10);
  });

  it("records processing metadata", async () => {
    const doc = await runPipeline(sources(1), {
      provider: fakeProvider(),
      languages: ["hin", "eng"],
      fileName: "scan.pdf",
    });
    expect(doc.metadata.providerId).toBe("fake");
    expect(doc.metadata.languages).toEqual(["hin", "eng"]);
    expect(doc.metadata.fileName).toBe("scan.pdf");
    expect(doc.metadata.processingMs).toBeGreaterThanOrEqual(0);
  });

  it("returns an empty document for no sources rather than throwing", async () => {
    const doc = await runPipeline([], { provider: fakeProvider(), languages: ["eng"] });
    expect(doc.pages).toEqual([]);
  });
});

describe("retryPage", () => {
  it("replaces a failed page with a successful re-read", async () => {
    const first = await runPipeline(sources(3), {
      provider: fakeProvider([1]),
      languages: ["eng"],
    });
    expect(first.pages[1].status).toBe("failed");

    const fixed = await retryPage(
      first,
      { index: 1, render: async () => canvas() },
      { provider: fakeProvider(), languages: ["eng"] }
    );
    expect(fixed.pages[1].status).toBe("ok");
    expect(fixed.pages).toHaveLength(3);
  });

  it("does not mutate the original document", async () => {
    const first = await runPipeline(sources(2), {
      provider: fakeProvider([0]),
      languages: ["eng"],
    });
    await retryPage(
      first,
      { index: 0, render: async () => canvas() },
      { provider: fakeProvider(), languages: ["eng"] }
    );
    expect(first.pages[0].status).toBe("failed");
  });

  it("leaves the page failed when the retry also fails", async () => {
    const first = await runPipeline(sources(2), {
      provider: fakeProvider([0]),
      languages: ["eng"],
    });
    const again = await retryPage(
      first,
      { index: 0, render: async () => canvas() },
      { provider: fakeProvider([0]), languages: ["eng"] }
    );
    expect(again.pages[0].status).toBe("failed");
  });
});
