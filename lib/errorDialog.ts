import { wrapText, roundRect } from "@/lib/canvasDraw";
import type { ErrorChrome } from "@/lib/errorStyles";

/**
 * Canvas renderer for the fake error dialog, in six different eras of chrome.
 *
 * Layout is separated from painting on purpose. `layoutDialog` is pure — it
 * takes a measuring context and returns geometry — so button placement and
 * canvas height are unit-testable without a real canvas. `drawDialog` then
 * paints that geometry. The previous version computed positions inline while
 * drawing, which is why the button row could silently overlap the message on
 * long inputs.
 */

export type DialogIcon = "error" | "warning" | "info" | "success";

export type DialogContent = {
  icon: DialogIcon;
  title: string;
  message: string;
  /** Comma-separated in the UI; already split by the time it reaches here. */
  buttons: string[];
};

export type ButtonBox = {
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  /** The default button — accent-filled. macOS puts it last, Windows first. */
  primary: boolean;
};

export type DialogLayout = {
  width: number;
  height: number;
  titleBarH: number;
  /** Wrapped body lines and where they start. */
  lines: string[];
  lineH: number;
  textX: number;
  textY: number;
  /** macOS only: the bold centred headline above the body text. */
  headLines: string[];
  headLineH: number;
  headY: number;
  icon: { x: number; y: number; r: number };
  buttons: ButtonBox[];
};

const PAD = 20;

/** Set `ctx.font` for one of the dialog's text roles. */
function setFont(
  ctx: CanvasRenderingContext2D,
  chrome: ErrorChrome,
  role: "title" | "body" | "button",
  bold = false
) {
  const px =
    role === "title" ? chrome.titleFontPx : role === "body" ? chrome.bodyFontPx : chrome.bodyFontPx;
  ctx.font = `${bold ? "bold " : ""}${px}px ${chrome.font}`;
}

function buttonWidth(ctx: CanvasRenderingContext2D, chrome: ErrorChrome, label: string) {
  return Math.max(chrome.button.minWidth, ctx.measureText(label).width + 28);
}

/**
 * Compute every box in the dialog. Pure: only reads `measureText` and writes
 * `ctx.font`, so a stub context is enough to test it.
 */
export function layoutDialog(
  ctx: CanvasRenderingContext2D,
  chrome: ErrorChrome,
  content: DialogContent
): DialogLayout {
  const W = chrome.width;
  const labels = content.buttons.filter(Boolean);

  if (chrome.layout === "mac") {
    const iconR = 24;
    const textMaxW = W - PAD * 2;

    setFont(ctx, chrome, "title", true);
    const headLines = wrapText(ctx, content.title, textMaxW);
    const headLineH = chrome.titleFontPx + 5;

    setFont(ctx, chrome, "body");
    const lines = wrapText(ctx, content.message, textMaxW);
    const lineH = chrome.bodyFontPx + 5;

    const iconY = 22;
    const headY = iconY + iconR * 2 + 16;
    const textY = headY + headLines.length * headLineH + 8;
    const btnTop = textY + lines.length * lineH + 20;

    // macOS right-aligns a short button row and stacks full-width when it
    // cannot fit — reproduce both rather than letting buttons run off the edge.
    setFont(ctx, chrome, "button");
    const widths = labels.map((l) => buttonWidth(ctx, chrome, l));
    const rowW = widths.reduce((a, b) => a + b, 0) + Math.max(0, labels.length - 1) * 10;
    const bh = chrome.button.height;
    const buttons: ButtonBox[] = [];

    if (rowW <= textMaxW) {
      let bx = W - PAD;
      for (let i = labels.length - 1; i >= 0; i--) {
        bx -= widths[i];
        buttons[i] = { label: labels[i], x: bx, y: btnTop, w: widths[i], h: bh, primary: i === 0 };
        bx -= 10;
      }
    } else {
      labels.forEach((label, i) => {
        buttons.push({
          label,
          x: PAD,
          y: btnTop + i * (bh + 8),
          w: textMaxW,
          h: bh,
          primary: i === 0,
        });
      });
    }

    const lastBtn = buttons[buttons.length - 1];
    const height = (lastBtn ? lastBtn.y + lastBtn.h : btnTop) + 18;

    return {
      width: W,
      height,
      titleBarH: 0,
      lines,
      lineH,
      textX: W / 2,
      textY,
      headLines,
      headLineH,
      headY,
      icon: { x: W / 2 - iconR, y: iconY, r: iconR },
      buttons,
    };
  }

  // ---- Windows layouts -------------------------------------------------
  const titleBarH = chrome.titleBar?.height ?? 0;
  const iconR = 16;
  const textX = PAD + iconR * 2 + 16;
  const textMaxW = W - textX - PAD;

  setFont(ctx, chrome, "body");
  const lines = wrapText(ctx, content.message, textMaxW);
  const lineH = chrome.bodyFontPx + 6;

  const textY = titleBarH + 16;
  const bodyH = Math.max(iconR * 2, lines.length * lineH) + 24;
  const bh = chrome.button.height;
  const btnRowH = bh + 22;
  const height = titleBarH + bodyH + btnRowH;

  setFont(ctx, chrome, "button");
  const buttons: ButtonBox[] = [];
  const by = height - btnRowH + 10;
  let bx = W - 12;
  for (let i = labels.length - 1; i >= 0; i--) {
    const bw = buttonWidth(ctx, chrome, labels[i]);
    bx -= bw;
    buttons[i] = { label: labels[i], x: bx, y: by, w: bw, h: bh, primary: i === 0 };
    bx -= 8;
  }

  return {
    width: W,
    height,
    titleBarH,
    lines,
    lineH,
    textX,
    textY,
    headLines: [],
    headLineH: 0,
    headY: 0,
    icon: { x: PAD, y: titleBarH + 16, r: iconR },
    buttons,
  };
}

/** A 3D bevel — two light edges, two dark. The Windows 95/98 button look. */
function bevel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  raised: boolean
) {
  const tl = raised ? "#ffffff" : "#808080";
  const br = raised ? "#808080" : "#ffffff";
  ctx.fillStyle = tl;
  ctx.fillRect(x, y, w, 1);
  ctx.fillRect(x, y, 1, h);
  ctx.fillStyle = br;
  ctx.fillRect(x, y + h - 1, w, 1);
  ctx.fillRect(x + w - 1, y, 1, h);
  ctx.fillStyle = "#000000";
  ctx.fillRect(x + 1, y + h - 2, w - 2, 1);
  ctx.fillRect(x + w - 2, y + 1, 1, h - 2);
}

function drawIcon(
  ctx: CanvasRenderingContext2D,
  kind: DialogIcon,
  x: number,
  y: number,
  r: number,
  style: ErrorChrome["icon"]
) {
  ctx.save();
  ctx.translate(x + r, y + r);

  if (kind === "warning") {
    ctx.fillStyle = style === "classic" ? "#ffdf00" : "#ffb900";
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(r, r);
    ctx.lineTo(-r, r);
    ctx.closePath();
    ctx.fill();
    if (style === "classic") {
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    ctx.fillStyle = "#000";
    ctx.font = `bold ${r * 1.3}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("!", 0, r * 0.25);
    ctx.restore();
    return;
  }

  const colors = { error: "#e81123", info: "#0078d7", success: "#107c10" };
  const classic = { error: "#d40000", info: "#000080", success: "#008000" };
  ctx.fillStyle = (style === "classic" ? classic : colors)[kind];
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  if (style === "classic") {
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  ctx.strokeStyle = "#fff";
  ctx.fillStyle = "#fff";
  ctx.lineWidth = r * 0.16;
  ctx.lineCap = "round";
  if (kind === "error") {
    const d = r * 0.45;
    ctx.beginPath();
    ctx.moveTo(-d, -d);
    ctx.lineTo(d, d);
    ctx.moveTo(d, -d);
    ctx.lineTo(-d, d);
    ctx.stroke();
  } else if (kind === "success") {
    ctx.beginPath();
    ctx.moveTo(-r * 0.5, 0);
    ctx.lineTo(-r * 0.1, r * 0.4);
    ctx.lineTo(r * 0.55, -r * 0.4);
    ctx.stroke();
  } else {
    ctx.font = `bold ${r * 1.2}px Georgia`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("i", 0, r * 0.05);
  }
  ctx.restore();
}

function drawCloseButton(
  ctx: CanvasRenderingContext2D,
  chrome: ErrorChrome,
  W: number,
  barH: number
) {
  const kind = chrome.close;
  if (kind === "none") return;

  if (kind === "win-red") {
    ctx.fillStyle = "#e81123";
    ctx.fillRect(W - 46, 1, 45, barH - 2);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(W - 29, barH / 2 - 6);
    ctx.lineTo(W - 17, barH / 2 + 6);
    ctx.moveTo(W - 17, barH / 2 - 6);
    ctx.lineTo(W - 29, barH / 2 + 6);
    ctx.stroke();
    return;
  }

  if (kind === "win-dark") {
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(W - 30, barH / 2 - 5);
    ctx.lineTo(W - 20, barH / 2 + 5);
    ctx.moveTo(W - 20, barH / 2 - 5);
    ctx.lineTo(W - 30, barH / 2 + 5);
    ctx.stroke();
    return;
  }

  if (kind === "xp") {
    const s = barH - 12;
    const bx = W - s - 6;
    const by = 6;
    const g = ctx.createLinearGradient(0, by, 0, by + s);
    g.addColorStop(0, "#f08f74");
    g.addColorStop(1, "#c8442a");
    ctx.fillStyle = g;
    roundRect(ctx, bx, by, s, s, 3);
    ctx.fill();
    ctx.strokeStyle = "#8b2b17";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.8;
    const p = s * 0.3;
    ctx.beginPath();
    ctx.moveTo(bx + p, by + p);
    ctx.lineTo(bx + s - p, by + s - p);
    ctx.moveTo(bx + s - p, by + p);
    ctx.lineTo(bx + p, by + s - p);
    ctx.stroke();
    return;
  }

  // Windows 95/98: a small raised grey square with a hairline X.
  const s = barH - 8;
  const bx = W - s - 4;
  const by = 4;
  ctx.fillStyle = "#c0c0c0";
  ctx.fillRect(bx, by, s, s);
  bevel(ctx, bx, by, s, s, true);
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;
  const p = s * 0.32;
  ctx.beginPath();
  ctx.moveTo(bx + p, by + p);
  ctx.lineTo(bx + s - p, by + s - p);
  ctx.moveTo(bx + s - p, by + p);
  ctx.lineTo(bx + p, by + s - p);
  ctx.stroke();
}

function drawButton(
  ctx: CanvasRenderingContext2D,
  chrome: ErrorChrome,
  b: ButtonBox
) {
  const s = chrome.button;
  const fill = b.primary ? s.accentFill : s.fill;
  const border = b.primary ? s.accentBorder : s.border;
  const text = b.primary ? s.accentText : s.text;

  if (s.style === "bevel") {
    ctx.fillStyle = fill;
    ctx.fillRect(b.x, b.y, b.w, b.h);
    bevel(ctx, b.x, b.y, b.w, b.h, true);
    if (b.primary) {
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1;
      ctx.strokeRect(b.x - 1.5, b.y - 1.5, b.w + 3, b.h + 3);
    }
  } else if (s.style === "aero" || s.radius > 0) {
    const g = ctx.createLinearGradient(0, b.y, 0, b.y + b.h);
    if (b.primary && s.accentText === "#ffffff") {
      ctx.fillStyle = fill;
    } else {
      g.addColorStop(0, fill);
      g.addColorStop(1, fill === "#fbfbfb" ? "#f0f0f0" : fill);
      ctx.fillStyle = g;
    }
    roundRect(ctx, b.x, b.y, b.w, b.h, s.radius);
    ctx.fill();
    ctx.strokeStyle = border;
    ctx.lineWidth = 1;
    ctx.stroke();
  } else {
    ctx.fillStyle = fill;
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.strokeStyle = border;
    ctx.lineWidth = 1;
    ctx.strokeRect(b.x + 0.5, b.y + 0.5, b.w - 1, b.h - 1);
  }

  ctx.fillStyle = text;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  setFont(ctx, chrome, "button");
  ctx.fillText(b.label, b.x + b.w / 2, b.y + b.h / 2 + 1);
}

/**
 * Paint the dialog. Sizes the canvas itself (at `scale`x for a crisp export)
 * and returns the layout it used.
 */
export function drawDialog(
  canvas: HTMLCanvasElement,
  chrome: ErrorChrome,
  content: DialogContent,
  scale = 2
): DialogLayout {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable.");

  const L = layoutDialog(ctx, chrome, content);
  canvas.width = L.width * scale;
  canvas.height = L.height * scale;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);

  const { width: W, height: H } = L;

  // Window body.
  ctx.fillStyle = chrome.body;
  if (chrome.radius > 0) {
    roundRect(ctx, 0, 0, W, H, chrome.radius);
    ctx.fill();
    ctx.strokeStyle = chrome.border;
    ctx.lineWidth = 1;
    roundRect(ctx, 0.5, 0.5, W - 1, H - 1, chrome.radius);
    ctx.stroke();
  } else {
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = chrome.border;
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, W - 1, H - 1);
  }

  // Title bar.
  if (chrome.titleBar) {
    const tb = chrome.titleBar;
    ctx.save();
    if (chrome.radius > 0) {
      // Clip to the window so the bar picks up the rounded top corners.
      roundRect(ctx, 0, 0, W, H, chrome.radius);
      ctx.clip();
    }
    if (tb.from === tb.to) {
      ctx.fillStyle = tb.from;
    } else {
      const g = ctx.createLinearGradient(0, 0, 0, tb.height);
      g.addColorStop(0, tb.from);
      g.addColorStop(1, tb.to);
      ctx.fillStyle = g;
    }
    ctx.fillRect(1, 1, W - 2, tb.height - 1);
    ctx.restore();

    ctx.fillStyle = tb.text;
    setFont(ctx, chrome, "title", tb.bold);
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(content.title, 12, tb.height / 2 + 1);

    drawCloseButton(ctx, chrome, W, tb.height);
  }

  drawIcon(ctx, content.icon, L.icon.x, L.icon.y, L.icon.r, chrome.icon);

  // Body text. Windows runs left-aligned beside the icon; macOS is centred
  // with a bold headline of its own.
  ctx.fillStyle = chrome.bodyText;
  if (chrome.layout === "mac") {
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    setFont(ctx, chrome, "title", true);
    L.headLines.forEach((ln, i) => ctx.fillText(ln, L.textX, L.headY + i * L.headLineH));
    setFont(ctx, chrome, "body");
    L.lines.forEach((ln, i) => ctx.fillText(ln, L.textX, L.textY + i * L.lineH));
  } else {
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    setFont(ctx, chrome, "body");
    L.lines.forEach((ln, i) => ctx.fillText(ln, L.textX, L.textY + i * L.lineH));
  }

  for (const b of L.buttons) drawButton(ctx, chrome, b);

  return L;
}

/* ------------------------------------------------------- shareable state */

/**
 * The dialog's state round-trips through the query string so a shared link
 * reopens the exact popup someone made. That is the only link-earning
 * mechanic on this page that does not involve asking anyone for a link:
 * people post the PNG, and the link under it comes back here.
 *
 * Kept deliberately short (`t`/`m`/`i`/`b`) so the URL survives being pasted
 * into chat apps that truncate.
 */
export function encodeDialogState(c: DialogContent): string {
  const p = new URLSearchParams();
  if (c.title) p.set("t", c.title);
  if (c.message) p.set("m", c.message);
  if (c.icon !== "error") p.set("i", c.icon);
  if (c.buttons.length) p.set("b", c.buttons.join(","));
  return p.toString();
}

const ICONS: DialogIcon[] = ["error", "warning", "info", "success"];

/** Parse shared state, falling back to `defaults` for anything absent or invalid. */
export function decodeDialogState(
  query: string,
  defaults: DialogContent
): DialogContent {
  const p = new URLSearchParams(query);
  const icon = p.get("i");
  const buttons = p.get("b");
  return {
    title: p.get("t") ?? defaults.title,
    message: p.get("m") ?? defaults.message,
    icon: icon && ICONS.indexOf(icon as DialogIcon) !== -1 ? (icon as DialogIcon) : defaults.icon,
    buttons: buttons === null
      ? defaults.buttons
      : buttons.split(",").map((b) => b.trim()).filter(Boolean),
  };
}
