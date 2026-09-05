import { describe, it, expect } from "vitest";
import {
  layoutDialog,
  encodeDialogState,
  decodeDialogState,
  type DialogContent,
} from "@/lib/errorDialog";
import { errorStyles, getErrorStyle } from "@/lib/errorStyles";

/**
 * Measuring stub. `layoutDialog` only reads `measureText` and writes `font`,
 * so a fixed 8px-per-character metric makes the geometry deterministic.
 */
function fakeCtx(charWidth = 8) {
  return {
    font: "",
    measureText: (s: string) => ({ width: s.length * charWidth }),
  } as unknown as CanvasRenderingContext2D;
}

const content = (over: Partial<DialogContent> = {}): DialogContent => ({
  icon: "error",
  title: "Error",
  message: "Something went wrong.",
  buttons: ["OK", "Cancel"],
  ...over,
});

describe("layoutDialog", () => {
  it("lays out every shipped style without overlapping the button row", () => {
    for (const style of errorStyles) {
      const L = layoutDialog(fakeCtx(), style.chrome, content());
      const textBottom = L.textY + L.lines.length * L.lineH;
      const firstButtonTop = Math.min(...L.buttons.map((b) => b.y));
      expect(
        firstButtonTop,
        `${style.slug}: buttons must sit below the message`
      ).toBeGreaterThanOrEqual(textBottom);
      expect(L.height).toBeGreaterThan(firstButtonTop);
    }
  });

  it("keeps every button inside the dialog", () => {
    for (const style of errorStyles) {
      const L = layoutDialog(fakeCtx(), style.chrome, content({ buttons: ["OK", "Cancel", "Retry"] }));
      for (const b of L.buttons) {
        expect(b.x, `${style.slug}: ${b.label} runs off the left`).toBeGreaterThanOrEqual(0);
        expect(b.x + b.w, `${style.slug}: ${b.label} runs off the right`).toBeLessThanOrEqual(L.width);
        expect(b.y + b.h).toBeLessThanOrEqual(L.height);
      }
    }
  });

  it("grows the dialog to fit a long message instead of clipping it", () => {
    const chrome = getErrorStyle("windows-10")!.chrome;
    const short = layoutDialog(fakeCtx(), chrome, content({ message: "One line." }));
    const long = layoutDialog(
      fakeCtx(),
      chrome,
      content({ message: "word ".repeat(120).trim() })
    );
    expect(long.lines.length).toBeGreaterThan(short.lines.length);
    expect(long.height).toBeGreaterThan(short.height);
  });

  it("marks exactly one default button", () => {
    for (const style of errorStyles) {
      const L = layoutDialog(fakeCtx(), style.chrome, content());
      expect(L.buttons.filter((b) => b.primary)).toHaveLength(1);
    }
  });

  it("stacks macOS buttons full-width when the row would not fit", () => {
    const mac = getErrorStyle("macos")!.chrome;
    const wide = layoutDialog(
      fakeCtx(),
      mac,
      content({ buttons: ["Send Report to Apple", "Reopen Application", "Cancel"] })
    );
    // Stacked: every button shares an x and spans the content width.
    const xs = wide.buttons.map((b) => b.x);
    expect(new Set(xs).size).toBe(1);
    expect(wide.buttons.every((b) => b.w === wide.width - 40)).toBe(true);
  });

  it("gives macOS a headline and no title bar", () => {
    const mac = layoutDialog(fakeCtx(), getErrorStyle("macos")!.chrome, content());
    expect(mac.titleBarH).toBe(0);
    expect(mac.headLines.length).toBeGreaterThan(0);

    const win = layoutDialog(fakeCtx(), getErrorStyle("windows-xp")!.chrome, content());
    expect(win.titleBarH).toBeGreaterThan(0);
    expect(win.headLines).toEqual([]);
  });
});

describe("shareable dialog state", () => {
  it("round-trips a dialog through the query string", () => {
    const c = content({ icon: "warning", title: "Uh oh", buttons: ["Yes", "No"] });
    const back = decodeDialogState(encodeDialogState(c), content());
    expect(back).toEqual(c);
  });

  it("falls back to the page defaults for anything absent", () => {
    const d = content({ icon: "info", title: "Default title" });
    expect(decodeDialogState("", d)).toEqual(d);
    expect(decodeDialogState("?t=Custom", d)).toEqual({ ...d, title: "Custom" });
  });

  it("ignores an out-of-range icon rather than drawing nothing", () => {
    const d = content();
    expect(decodeDialogState("?i=explode", d).icon).toBe(d.icon);
  });

  it("drops empty button labels from a hand-edited link", () => {
    expect(decodeDialogState("?b=OK,,%20,Cancel", content()).buttons).toEqual(["OK", "Cancel"]);
  });

  it("omits defaults it does not need to carry, keeping links short", () => {
    // icon=error is the default, so it should not appear in the query string.
    expect(encodeDialogState(content())).not.toContain("i=");
  });
});

describe("error style registry", () => {
  it("has unique slugs and a resolvable lookup", () => {
    const slugs = errorStyles.map((s) => s.slug);
    expect(slugs.filter((s, i) => slugs.indexOf(s) !== i)).toEqual([]);
    for (const s of slugs) expect(getErrorStyle(s)?.slug).toBe(s);
    expect(getErrorStyle("windows-95")).toBeUndefined();
  });

  it("gives every style its own defaults and at least three FAQs", () => {
    const messages = new Set<string>();
    for (const s of errorStyles) {
      expect(s.faqs.length, `${s.slug}`).toBeGreaterThanOrEqual(3);
      expect(s.uses.length, `${s.slug}`).toBeGreaterThanOrEqual(3);
      messages.add(s.defaults.message);
    }
    // Era-appropriate defaults, not one message copied across six pages.
    expect(messages.size).toBe(errorStyles.length);
  });
});
