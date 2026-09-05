import { describe, it, expect } from "vitest";
import {
  VIDEO_PRESETS,
  filterGraph,
  baseName,
  type Fit,
} from "@/lib/videoFormats";

/**
 * The filtergraph is a string handed straight to ffmpeg.wasm. A malformed one
 * fails deep inside the worker with a log that `humanError` flattens to
 * "something went wrong", so it is effectively undiagnosable from the UI.
 * Assert its shape here instead.
 *
 * The graphs below were verified against real ffmpeg (8.1.1) and end-to-end in
 * the browser: both fits export exactly 1080x1920 yuv420p with audio intact.
 */
describe("video presets", () => {
  it("has unique ids", () => {
    const ids = VIDEO_PRESETS.map((p) => p.id);
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
  });

  it("uses only even dimensions — H.264 rejects odd ones", () => {
    for (const p of VIDEO_PRESETS) {
      expect(p.w % 2, `${p.id} width ${p.w}`).toBe(0);
      expect(p.h % 2, `${p.id} height ${p.h}`).toBe(0);
    }
  });

  it("matches each declared ratio to its actual pixel dimensions", () => {
    for (const p of VIDEO_PRESETS) {
      const [rw, rh] = p.ratio.split(":").map(Number);
      expect(p.w / p.h, `${p.id} claims ${p.ratio}`).toBeCloseTo(rw / rh, 2);
    }
  });

  it("exports the short-form frame every platform actually wants", () => {
    const reel = VIDEO_PRESETS.find((p) => p.id === "reel")!;
    expect([reel.w, reel.h]).toEqual([1080, 1920]);
  });
});

describe("filterGraph", () => {
  const fits: Fit[] = ["crop", "blur"];

  it("scales-then-crops for crop, never the reverse", () => {
    const [flag, graph] = filterGraph("crop", 1080, 1920);
    expect(flag).toBe("-vf");
    // force_original_aspect_ratio=increase must come first, or the crop runs
    // on an undersized frame and ffmpeg pads instead of filling.
    expect(graph).toBe(
      "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920"
    );
  });

  it("builds a balanced blur graph with every label consumed", () => {
    const args = filterGraph("blur", 1080, 1920);
    expect(args[0]).toBe("-filter_complex");
    const g = args[1];

    // Every label that is produced must also be consumed exactly once.
    for (const label of ["a", "b", "bg", "fg"]) {
      expect(g.split(`[${label}]`).length - 1, `label ${label}`).toBe(2);
    }
    expect(g).toContain("split[a][b]");
    expect(g).toContain("overlay=(W-w)/2:(H-h)/2[v]");
    // The output label must be mapped, or ffmpeg picks the wrong stream.
    expect(args).toContain("[v]");
    // Audio optional: a silent clip must not fail the job.
    expect(args).toContain("0:a?");
  });

  it("blurs a downscaled copy — full-res gblur is the slowest thing here", () => {
    const g = filterGraph("blur", 1080, 1920)[1];
    const blurScale = g.match(/\[a\]scale=(\d+):(\d+)/)!;
    const bw = Number(blurScale[1]);
    const bh = Number(blurScale[2]);
    expect(bw).toBeLessThan(1080 / 4);
    expect(bh).toBeLessThan(1920 / 4);
    // Even, and the blurred layer is scaled back up to the full target.
    expect(bw % 2).toBe(0);
    expect(bh % 2).toBe(0);
    expect(g).toContain("gblur");
    expect(g).toContain(`scale=1080:1920[bg]`);
  });

  it("keeps the whole picture in blur mode and fills the frame in crop mode", () => {
    // decrease => letterboxed inside the frame, nothing lost.
    expect(filterGraph("blur", 1080, 1920)[1]).toContain(
      "force_original_aspect_ratio=decrease[fg]"
    );
    // increase => frame filled, overflow trimmed.
    expect(filterGraph("crop", 1080, 1920)[1]).toContain(
      "force_original_aspect_ratio=increase"
    );
  });

  it("produces a usable graph for every shipped preset and fit", () => {
    for (const p of VIDEO_PRESETS) {
      for (const fit of fits) {
        const args = filterGraph(fit, p.w, p.h);
        expect(args.length).toBeGreaterThanOrEqual(2);
        for (const a of args) expect(a).not.toContain("NaN");
        expect(args[1]).toContain(`${p.w}:${p.h}`);
      }
    }
  });
});

describe("baseName", () => {
  it("strips the extension so the export can be renamed", () => {
    expect(baseName("holiday.mp4")).toBe("holiday");
    expect(baseName("my.clip.final.mov")).toBe("my.clip.final");
  });

  it("leaves an extensionless name alone", () => {
    expect(baseName("clip")).toBe("clip");
  });
});
