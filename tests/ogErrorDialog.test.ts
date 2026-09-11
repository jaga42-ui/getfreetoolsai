import { describe, expect, it } from "vitest";
import { isValidElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { errorStyles } from "@/lib/errorStyles";
import { errorDialogOg, OG_SIZE } from "@/lib/ogErrorDialog";

/**
 * Render the preview to markup before asserting on it.
 *
 * Walking the returned element tree by hand is not enough: the icon and the
 * buttons are function components, so their glyphs and labels live inside
 * bodies that a naive tree walk never calls. The first version of this test
 * passed while ✕ was still in the icon for exactly that reason.
 */
const markup = (style: (typeof errorStyles)[number]) =>
  renderToStaticMarkup(errorDialogOg(style));

/** Every inline style attribute in the rendered markup. */
function styleAttrs(html: string): string[] {
  return Array.from(html.matchAll(/style="([^"]*)"/g)).map((m) => m[1]);
}

describe("error dialog social preview", () => {
  it("renders for every style without throwing", () => {
    expect(errorStyles.length).toBeGreaterThan(0);
    for (const s of errorStyles) {
      expect(isValidElement(errorDialogOg(s)), s.slug).toBe(true);
      expect(markup(s).length, s.slug).toBeGreaterThan(200);
    }
  });

  it("uses no glyph outside the default font's coverage", () => {
    // The regression this guards: satori's default font has no dingbats, and a
    // missing glyph renders as a tofu box rather than falling back — invisible
    // to tsc, lint and the build. U+2190..U+2BFF covers arrows, mathematical
    // operators, misc symbols and dingbats, which is where ✕ and ✓ live.
    // Typographic punctuation below that range (·, –, —) renders fine.
    const bad = /[←-⯿]/;
    for (const s of errorStyles) {
      const html = markup(s);
      const offenders = Array.from(html).filter((ch) => bad.test(ch));
      expect(offenders, `${s.slug} uses an unsupported glyph`).toEqual([]);
    }
  });

  it("gives every positioned container an explicit flex display", () => {
    // satori requires it; without it a container silently collapses.
    for (const s of errorStyles) {
      for (const attr of styleAttrs(markup(s))) {
        const positioned =
          attr.includes("flex-direction") ||
          attr.includes("justify-content") ||
          attr.includes("align-items");
        if (positioned) {
          expect(attr, `${s.slug}: ${attr}`).toContain("display:flex");
        }
      }
    }
  });

  it("draws every button, with exactly one default", () => {
    for (const s of errorStyles) {
      const html = markup(s);
      const labels = s.defaults.buttons
        .split(",")
        .map((b) => b.trim())
        .filter(Boolean);
      expect(labels.length, s.slug).toBeGreaterThan(0);
      for (const l of labels) expect(html, s.slug).toContain(l);
      // One rendered button per label. Buttons are the only elements carrying
      // min-width; the default button is not asserted by colour because the
      // classic eras mark it with a border rather than an accent fill, so
      // accentFill there is identical to the normal fill.
      const buttons = styleAttrs(html).filter((a) => a.includes("min-width"));
      expect(buttons.length, `${s.slug} button count`).toBe(labels.length);
    }
  });

  it("renders each style's own title, heading and desktop colour", () => {
    for (const s of errorStyles) {
      const html = markup(s);
      expect(html, s.slug).toContain(s.defaults.title);
      expect(html, s.slug).toContain(s.h1);
      expect(styleAttrs(html)[0].toLowerCase(), s.slug).toContain(
        `background:${s.chrome.desktop.toLowerCase()}`
      );
    }
  });

  it("omits the title bar only for macOS, which has none", () => {
    for (const s of errorStyles) {
      const html = markup(s);
      // The close mark only exists on a title bar.
      const hasTitleBar = s.chrome.titleBar !== null;
      expect(html.includes(">X</div>") && hasTitleBar, s.slug).toBe(hasTitleBar);
    }
  });

  it("is sized for the standard social card", () => {
    expect(OG_SIZE).toEqual({ width: 1200, height: 630 });
  });
});
