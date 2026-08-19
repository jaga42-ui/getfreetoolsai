"use client";

import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
// Shared primitives. parseSideScript splits on newlines, so each bubble's text
// never contains one — wrapText's paragraph handling is a no-op here and the
// rendering is identical to the local copies these replaced.
import { wrapText, roundRect, downloadCanvas } from "@/lib/canvasDraw";
import { parseSideScript } from "@/lib/chatScript";

export default function FakeTextMessage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [contact, setContact] = useState("Mom");
  const [green, setGreen] = useState(false);
  const [raw, setRaw] = useState(
    "Where are you?\n> On my way, 5 minutes\nOk drive safe ❤️\n> Always 😄"
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scale = 2;
    const W = 390;
    const padX = 16;
    const headerH = 96;
    const maxBubbleW = W * 0.72;
    const font = "400 17px system-ui, sans-serif";
    const lineH = 22;
    const bubblePadX = 14;
    const bubblePadY = 9;
    const gap = 8;

    const msgs = parseSideScript(raw);

    ctx.font = font;
    const laid = msgs.map((m) => {
      const lines = wrapText(ctx, m.text, maxBubbleW - bubblePadX * 2);
      const textW = Math.max(...lines.map((l) => ctx.measureText(l).width), 0);
      const w = textW + bubblePadX * 2;
      const h = lines.length * lineH + bubblePadY * 2;
      return { ...m, lines, w, h };
    });

    const bodyH = laid.reduce((sum, b) => sum + b.h + gap, 0);
    const H = headerH + bodyH + 20;

    canvas.width = W * scale;
    canvas.height = H * scale;
    canvas.style.aspectRatio = `${W} / ${H}`;
    ctx.scale(scale, scale);

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);

    // Header
    ctx.fillStyle = "#f7f7f7";
    ctx.fillRect(0, 0, W, headerH);
    ctx.strokeStyle = "#d9d9d9";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, headerH);
    ctx.lineTo(W, headerH);
    ctx.stroke();
    // Back chevron
    ctx.strokeStyle = "#0a84ff";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(18, 40);
    ctx.lineTo(11, 47);
    ctx.lineTo(18, 54);
    ctx.stroke();
    // Avatar circle
    ctx.fillStyle = "#c7c7cc";
    ctx.beginPath();
    ctx.arc(W / 2, 40, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "600 20px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText((contact.trim()[0] || "?").toUpperCase(), W / 2, 41);
    // Contact name
    ctx.fillStyle = "#000000";
    ctx.font = "500 13px system-ui, sans-serif";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(contact, W / 2, 82);

    // Bubbles
    ctx.textAlign = "left";
    let y = headerH + 12;
    const sentColor = green ? "#34c759" : "#0a84ff";
    for (const b of laid) {
      const x = b.sent ? W - padX - b.w : padX;
      ctx.fillStyle = b.sent ? sentColor : "#e9e9eb";
      roundRect(ctx, x, y, b.w, b.h, 18);
      ctx.fill();
      ctx.fillStyle = b.sent ? "#ffffff" : "#000000";
      ctx.font = font;
      let ty = y + bubblePadY + 16;
      for (const l of b.lines) {
        ctx.fillText(l, x + bubblePadX, ty);
        ty += lineH;
      }
      y += b.h + gap;
    }
  }, [contact, green, raw]);

  const download = () => {
    if (canvasRef.current)
      downloadCanvas(canvasRef.current, "fake-text-message.png");
  };

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <label className="block text-sm">
        <span className="mb-1 block text-text-muted">Contact name</span>
        <input
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
        />
      </label>

      <label className="mt-4 block text-sm">
        <span className="mb-1 block text-text-muted">
          Messages — one per line. Start a line with{" "}
          <code className="rounded bg-background px-1 py-0.5 text-xs">&gt;</code>{" "}
          for messages you sent.
        </span>
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={6}
          spellCheck={false}
          className="w-full resize-y rounded-lg border border-border bg-surface p-3 font-mono text-sm text-text-primary focus:border-primary focus:outline-none"
        />
      </label>

      <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-text-muted">
        <input type="checkbox" checked={green} onChange={(e) => setGreen(e.target.checked)} className="h-4 w-4 rounded border-border accent-primary" />
        Green (SMS) bubbles instead of blue (iMessage)
      </label>

      <div className="mt-6">
        <p className="mb-2 text-sm font-medium text-text-primary">Preview</p>
        <canvas ref={canvasRef} className="w-full max-w-[390px] rounded-xl border border-border" />
      </div>

      <button
        type="button"
        onClick={download}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
      >
        <Download className="h-4 w-4" /> Download PNG
      </button>

      <p className="mt-4 text-xs leading-relaxed text-text-muted">
        For memes and jokes only — please don&apos;t use it to impersonate real
        people or deceive anyone.
      </p>
    </div>
  );
}
