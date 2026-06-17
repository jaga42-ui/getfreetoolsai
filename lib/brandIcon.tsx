import { ImageResponse } from "next/og";

// Shared renderer for the GFT app icons (PNG, generated at the edge — no image
// tooling dependency). Used by the icon route handlers and kept in one place so
// the brand mark can't drift between sizes.

const INK = "#211f1a";
const RUST = "#b25733";
const CREAM = "#fbf8f1";
const BORDER = "#d8cfba";

/**
 * @param size   square px (192 / 512)
 * @param maskable when true, fills the whole square (full-bleed) and shrinks the
 *   mark into the ~80% safe zone so Android launcher masking never clips it.
 */
export function renderBrandIcon(size: number, maskable = false): ImageResponse {
  const pad = maskable ? Math.round(size * 0.16) : 0;
  const inner = size - pad * 2;
  const fontSize = maskable ? Math.round(size * 0.32) : Math.round(size * 0.46);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // Full-bleed cream for maskable; transparent for the rounded "any" tile.
          background: maskable ? CREAM : "transparent",
        }}
      >
        <div
          style={{
            width: inner,
            height: inner,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: CREAM,
            borderRadius: maskable ? 0 : Math.round(size * 0.22),
            border: maskable ? "none" : `${Math.round(size * 0.016)}px solid ${BORDER}`,
            fontFamily: "sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize,
              fontWeight: 800,
              letterSpacing: `-${Math.round(size * 0.03)}px`,
            }}
          >
            <span style={{ color: INK }}>GF</span>
            <span style={{ color: RUST }}>T</span>
          </div>
        </div>
      </div>
    ),
    { width: size, height: size }
  );
}
