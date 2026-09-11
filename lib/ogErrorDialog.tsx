/**
 * Social-preview rendering of an error dialog.
 *
 * Separate from lib/errorDialog.ts on purpose: that one draws to a 2D canvas in
 * the browser, this one builds flex JSX for satori (next/og), which has no
 * canvas and supports only a subset of CSS. Two renderers, one source of truth
 * for the chrome — both read `ErrorStyle.chrome`, so a colour or metric changed
 * there moves the tool and its preview together.
 *
 * satori constraints that shape the markup below:
 * - every element with more than one child needs an explicit `display: flex`
 * - no canvas, no custom fonts unless they are fetched and passed in, so this
 *   deliberately renders in the default sans stack rather than faking Segoe UI
 */

import type { ErrorStyle } from "@/lib/errorStyles";

export const OG_SIZE = { width: 1200, height: 630 };

/**
 * The dialog icon, drawn from primitives. The canvas renderer has real glyphs;
 * at preview size a disc and a mark read the same and cost no font loading.
 */
function Icon({ classic }: { classic: boolean }) {
  const d = classic ? 34 : 38;
  return (
    <div
      style={{
        width: d,
        height: d,
        borderRadius: d / 2,
        background: classic ? "#d83b3b" : "#c42b1c",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffffff",
        fontSize: classic ? 22 : 24,
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {/* ASCII only: satori's default font has no dingbats, and a missing
          glyph renders as a tofu box rather than falling back. */}
      X
    </div>
  );
}

function Button({
  label,
  primary,
  chrome,
}: {
  label: string;
  primary: boolean;
  chrome: ErrorStyle["chrome"];
}) {
  const b = chrome.button;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: b.height * 1.5,
        minWidth: b.minWidth * 1.5,
        paddingLeft: 18,
        paddingRight: 18,
        borderRadius: b.radius * 1.5,
        border: `1.5px solid ${primary ? b.accentBorder : b.border}`,
        background: primary ? b.accentFill : b.fill,
        color: primary ? b.accentText : b.text,
        fontSize: Math.round(chrome.bodyFontPx * 1.45),
      }}
    >
      {label}
    </div>
  );
}

/**
 * Build the preview for one style. `content` defaults to the style's own
 * era-appropriate seed text, so each variant previews as its own era rather
 * than as a generic box.
 */
export function errorDialogOg(style: ErrorStyle) {
  const c = style.chrome;
  const scale = 1.5;
  const buttons = style.defaults.buttons
    .split(",")
    .map((b) => b.trim())
    .filter(Boolean);
  // macOS puts the default button last, Windows first.
  const primaryIndex = c.layout === "mac" ? buttons.length - 1 : 0;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: c.desktop,
        fontFamily: "sans-serif",
        position: "relative",
      }}
    >
      {/* The dialog */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: c.width * scale,
          borderRadius: c.radius * scale,
          border: `1.5px solid ${c.border}`,
          background: c.body,
          boxShadow: "0 24px 60px rgba(0,0,0,0.42)",
          overflow: "hidden",
        }}
      >
        {/* macOS alerts have no title bar; the title is body copy under a
            centred icon. Every Windows era draws one. */}
        {c.titleBar ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: c.titleBar.height * scale,
              paddingLeft: 18,
              paddingRight: 18,
              background:
                c.titleBar.from === c.titleBar.to
                  ? c.titleBar.from
                  : `linear-gradient(180deg, ${c.titleBar.from}, ${c.titleBar.to})`,
              color: c.titleBar.text,
              fontSize: Math.round(c.titleFontPx * scale),
              fontWeight: c.titleBar.bold ? 700 : 400,
            }}
          >
            <div style={{ display: "flex" }}>{style.defaults.title}</div>
            {c.close === "none" ? null : (
              <div style={{ display: "flex", opacity: 0.75, fontSize: 18, fontWeight: 700 }}>
                X
              </div>
            )}
          </div>
        ) : null}

        <div
          style={{
            display: "flex",
            flexDirection: c.layout === "mac" ? "column" : "row",
            alignItems: c.layout === "mac" ? "center" : "flex-start",
            gap: 20,
            paddingLeft: 28,
            paddingRight: 28,
            paddingTop: 26,
            paddingBottom: 26,
          }}
        >
          <Icon classic={c.icon === "classic"} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: c.layout === "mac" ? "center" : "flex-start",
              color: c.bodyText,
              // satori has no text clamping; the seed messages are short enough
              // to fit, and the first paragraph alone reads correctly.
              maxWidth: (c.width - (c.layout === "mac" ? 56 : 110)) * scale,
            }}
          >
            {c.layout === "mac" ? (
              <div
                style={{
                  display: "flex",
                  fontSize: Math.round(c.titleFontPx * scale),
                  fontWeight: 700,
                  marginBottom: 8,
                  textAlign: "center",
                }}
              >
                {style.defaults.title}
              </div>
            ) : null}
            <div
              style={{
                display: "flex",
                fontSize: Math.round(c.bodyFontPx * scale),
                lineHeight: 1.45,
                textAlign: c.layout === "mac" ? "center" : "left",
              }}
            >
              {style.defaults.message.split("\n\n")[0]}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: c.layout === "mac" ? "center" : "flex-end",
            gap: 12,
            paddingLeft: 28,
            paddingRight: 28,
            paddingBottom: 26,
          }}
        >
          {buttons.map((label, i) => (
            <Button
              key={label}
              label={label}
              primary={i === primaryIndex}
              chrome={c}
            />
          ))}
        </div>
      </div>

      {/* Caption: names the tool the preview belongs to. */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 44,
        }}
      >
        <div
          style={{
            display: "flex",
            color: "#ffffff",
            fontSize: 38,
            fontWeight: 700,
            letterSpacing: -0.5,
          }}
        >
          {style.h1}
        </div>
        <div
          style={{
            display: "flex",
            color: "#ffffff",
            opacity: 0.72,
            fontSize: 23,
            marginTop: 10,
          }}
        >
          getfreetoolsai.com · free, no signup, runs in your browser
        </div>
      </div>
    </div>
  );
}
