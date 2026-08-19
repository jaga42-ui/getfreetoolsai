"use client";

import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import { wrapText, roundRect, downloadCanvas } from "@/lib/canvasDraw";
import { parseSideScript } from "@/lib/chatScript";

/** WhatsApp's double-tick read receipt. Blue when read, grey when delivered. */
function drawTicks(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  read: boolean
) {
  ctx.save();
  ctx.strokeStyle = read ? "#53bdeb" : "#8696a0";
  ctx.lineWidth = 1.4;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const dx of [0, 4.5]) {
    ctx.beginPath();
    ctx.moveTo(x + dx, y + 3);
    ctx.lineTo(x + dx + 2.6, y + 5.6);
    ctx.lineTo(x + dx + 7.4, y);
    ctx.stroke();
  }
  ctx.restore();
}

/** The faint doodle pattern behind WhatsApp chats, approximated with dots. */
function drawWallpaper(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  dark: boolean
) {
  ctx.fillStyle = dark ? "#0b141a" : "#efe7de";
  ctx.fillRect(0, 0, W, H);
  ctx.save();
  ctx.globalAlpha = dark ? 0.05 : 0.06;
  ctx.fillStyle = dark ? "#ffffff" : "#5b4a3f";
  for (let y = 0; y < H; y += 26) {
    for (let x = (y / 26) % 2 === 0 ? 0 : 13; x < W; x += 26) {
      ctx.beginPath();
      ctx.arc(x, y, 1.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

export default function FakeWhatsApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [contact, setContact] = useState("Rahul");
  const [status, setStatus] = useState("online");
  const [defaultTime, setDefaultTime] = useState("10:24");
  const [dark, setDark] = useState(false);
  const [read, setRead] = useState(true);
  const [raw, setRaw] = useState(
    "Have you left yet?\n> Just leaving now @10:22\nOk call me when you reach\n> Will do 👍"
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scale = 2;
    const W = 390;
    const padX = 12;
    const headerH = 88;
    const maxBubbleW = W * 0.76;
    const font = "400 15px system-ui, -apple-system, sans-serif";
    const timeFont = "400 11px system-ui, -apple-system, sans-serif";
    const lineH = 20;
    const bubblePadX = 10;
    const bubblePadY = 7;
    const gap = 6;
    // Reserved width inside the bubble for the timestamp (+ ticks when sent).
    const metaGap = 8;

    // withTime enables the trailing "@10:30" per-message override.
    const msgs = parseSideScript(raw, { withTime: true, defaultTime });

    // --- measure -------------------------------------------------------
    const laid = msgs.map((m) => {
      ctx.font = font;
      const lines = wrapText(ctx, m.text, maxBubbleW - bubblePadX * 2);
      const textW = Math.max(...lines.map((l) => ctx.measureText(l).width), 0);
      const lastLineW = lines.length
        ? ctx.measureText(lines[lines.length - 1]).width
        : 0;

      ctx.font = timeFont;
      const time = m.time ?? defaultTime;
      const metaW = ctx.measureText(time).width + (m.sent ? 16 : 0);

      // The bubble must fit whichever is wider: the longest wrapped line, or
      // the last line with the timestamp sitting beside it (WhatsApp tucks the
      // time onto the final line when there is room, and onto its own line
      // when there isn't — capping at maxBubbleW gives the latter).
      const w = Math.max(textW, lastLineW + metaGap + metaW) + bubblePadX * 2;
      const h = lines.length * lineH + bubblePadY * 2 + 6;
      return { ...m, time, lines, w: Math.min(w, maxBubbleW), h };
    });

    const bodyH = laid.reduce((sum, b) => sum + b.h + gap, 0);
    const H = headerH + bodyH + 18;

    canvas.width = W * scale;
    canvas.height = H * scale;
    canvas.style.aspectRatio = `${W} / ${H}`;
    ctx.scale(scale, scale);

    // --- wallpaper -----------------------------------------------------
    drawWallpaper(ctx, W, H, dark);

    // --- header --------------------------------------------------------
    ctx.fillStyle = dark ? "#202c33" : "#008069";
    ctx.fillRect(0, 0, W, headerH);

    // Back chevron
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(20, 40);
    ctx.lineTo(13, 47);
    ctx.lineTo(20, 54);
    ctx.stroke();

    // Avatar
    ctx.fillStyle = dark ? "#6a7175" : "#dfe5e7";
    ctx.beginPath();
    ctx.arc(50, 47, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = dark ? "#cfd9de" : "#ffffff";
    ctx.font = "600 17px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText((contact.trim()[0] || "?").toUpperCase(), 50, 48);

    // Name + status
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#ffffff";
    ctx.font = "500 16px system-ui, sans-serif";
    ctx.fillText(contact, 76, 44);
    if (status.trim()) {
      ctx.fillStyle = dark ? "#8696a0" : "rgba(255,255,255,0.85)";
      ctx.font = "400 12px system-ui, sans-serif";
      ctx.fillText(status, 76, 61);
    }

    // --- bubbles -------------------------------------------------------
    let y = headerH + 10;
    for (const b of laid) {
      const x = b.sent ? W - padX - b.w : padX;
      const bg = b.sent
        ? dark
          ? "#005c4b"
          : "#d9fdd3"
        : dark
          ? "#202c33"
          : "#ffffff";

      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.13)";
      ctx.shadowBlur = 1.5;
      ctx.shadowOffsetY = 1;
      ctx.fillStyle = bg;
      roundRect(ctx, x, y, b.w, b.h, 8);
      ctx.fill();
      ctx.restore();

      // Bubble tail
      ctx.fillStyle = bg;
      ctx.beginPath();
      if (b.sent) {
        ctx.moveTo(x + b.w - 1, y);
        ctx.lineTo(x + b.w + 7, y);
        ctx.lineTo(x + b.w - 1, y + 10);
      } else {
        ctx.moveTo(x + 1, y);
        ctx.lineTo(x - 7, y);
        ctx.lineTo(x + 1, y + 10);
      }
      ctx.closePath();
      ctx.fill();

      // Text
      ctx.fillStyle = dark ? "#e9edef" : "#111b21";
      ctx.font = font;
      let ty = y + bubblePadY + 14;
      for (const l of b.lines) {
        ctx.fillText(l, x + bubblePadX, ty);
        ty += lineH;
      }

      // Timestamp + ticks, bottom-right inside the bubble
      ctx.font = timeFont;
      ctx.fillStyle = dark ? "#8696a0" : "#667781";
      const tickW = b.sent ? 16 : 0;
      const timeW = ctx.measureText(b.time).width;
      const metaX = x + b.w - bubblePadX - timeW - tickW;
      const metaY = y + b.h - 8;
      ctx.fillText(b.time, metaX, metaY);
      if (b.sent) drawTicks(ctx, metaX + timeW + 4, metaY - 6, read);

      y += b.h + gap;
    }
  }, [contact, status, defaultTime, dark, read, raw]);

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block text-text-muted">Contact name</span>
          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-text-muted">
            Status line (e.g. online, last seen today)
          </span>
          <input
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
          />
        </label>
      </div>

      <label className="mt-4 block text-sm">
        <span className="mb-1 block text-text-muted">
          Messages — one per line. Start a line with{" "}
          <code className="rounded bg-background px-1 py-0.5 text-xs">&gt;</code>{" "}
          for messages you sent. Add{" "}
          <code className="rounded bg-background px-1 py-0.5 text-xs">
            @10:30
          </code>{" "}
          at the end of a line to set that message&apos;s time.
        </span>
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={6}
          spellCheck={false}
          className="w-full resize-y rounded-lg border border-border bg-surface p-3 font-mono text-sm text-text-primary focus:border-primary focus:outline-none"
        />
      </label>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block text-text-muted">Default time</span>
          <input
            value={defaultTime}
            onChange={(e) => setDefaultTime(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
          />
        </label>
        <div className="flex flex-col justify-end gap-2">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-text-muted">
            <input
              type="checkbox"
              checked={dark}
              onChange={(e) => setDark(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-primary"
            />
            Dark mode
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-text-muted">
            <input
              type="checkbox"
              checked={read}
              onChange={(e) => setRead(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-primary"
            />
            Blue ticks (read receipts)
          </label>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-2 text-sm font-medium text-text-primary">Preview</p>
        <canvas
          ref={canvasRef}
          className="w-full max-w-[390px] rounded-xl border border-border"
        />
      </div>

      <button
        type="button"
        onClick={() =>
          canvasRef.current &&
          downloadCanvas(canvasRef.current, "fake-whatsapp-chat.png")
        }
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
      >
        <Download className="h-4 w-4" /> Download PNG
      </button>

      <p className="mt-4 text-xs leading-relaxed text-text-muted">
        For memes, mockups and jokes only — please don&apos;t use it to
        impersonate real people, fabricate evidence or deceive anyone. WhatsApp
        is a trademark of its owner; this tool is not affiliated with it.
      </p>
    </div>
  );
}
