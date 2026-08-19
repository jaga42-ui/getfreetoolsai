"use client";

import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import { wrapText, roundRect, downloadCanvas } from "@/lib/canvasDraw";
import { parseSideScript } from "@/lib/chatScript";

/**
 * Fake AI chat screenshot generator.
 *
 * Reuses parseSideScript so the input grammar matches every other chat tool
 * here (`>` prefixes the line you sent), but the layout is deliberately not a
 * two-sided bubble chat: an assistant reply is full-width plain text beside a
 * small avatar, and only the prompt gets a bubble. That asymmetry is the whole
 * visual signature of an AI transcript, and rendering it as matched left/right
 * bubbles is what makes most imitations read as a messaging app instead.
 *
 * The avatar is a plain geometric mark, not any company's logo -- the layout
 * carries the resemblance, and copying a real trademark into a downloadable
 * image is a different thing from parodying a format.
 */
export default function FakeChatGpt() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dark, setDark] = useState(true);
  const [title, setTitle] = useState("Explain quantum computing");
  const [raw, setRaw] = useState(
    "> Explain quantum computing in one sentence\nA quantum computer uses superposition and entanglement to explore many possible answers at once, which makes a few specific problems dramatically faster to solve.\n> Is it going to break encryption?\nEventually, for some of it — but the machines that could are still years away, and the replacement algorithms already exist."
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scale = 2;
    const W = 620;
    const padX = 22;
    const headerH = 52;
    const font = "400 15.5px system-ui, -apple-system, sans-serif";
    const lineH = 25;
    const avatar = 26;
    const gapAfterUser = 22;
    const gapAfterBot = 28;
    const bubblePadX = 16;
    const bubblePadY = 11;
    const userMaxW = W * 0.68;
    const botMaxW = W - padX * 2 - avatar - 12;

    const msgs = parseSideScript(raw);

    ctx.font = font;
    const laid = msgs.map((m) => {
      const maxW = m.sent ? userMaxW - bubblePadX * 2 : botMaxW;
      const lines = wrapText(ctx, m.text, maxW);
      const textW = Math.max(...lines.map((l) => ctx.measureText(l).width), 0);
      const w = m.sent ? textW + bubblePadX * 2 : botMaxW;
      const h = m.sent
        ? lines.length * lineH + bubblePadY * 2
        : lines.length * lineH;
      return { ...m, lines, w, h };
    });

    const bodyH = laid.reduce(
      (sum, b) => sum + b.h + (b.sent ? gapAfterUser : gapAfterBot),
      0
    );
    const H = headerH + bodyH + 26;

    canvas.width = W * scale;
    canvas.height = H * scale;
    canvas.style.aspectRatio = `${W} / ${H}`;
    ctx.scale(scale, scale);

    const bg = dark ? "#212121" : "#ffffff";
    const fg = dark ? "#ececec" : "#0d0d0d";
    const bubble = dark ? "#303030" : "#f4f4f4";
    const rule = dark ? "#2f2f2f" : "#e5e5e5";
    const muted = dark ? "#9b9b9b" : "#8f8f8f";

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Header: conversation title, centred, with a hairline under it.
    ctx.fillStyle = muted;
    ctx.font = "500 14px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(title, W / 2, headerH / 2);
    ctx.strokeStyle = rule;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, headerH);
    ctx.lineTo(W, headerH);
    ctx.stroke();

    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    let y = headerH + 24;

    for (const b of laid) {
      if (b.sent) {
        // Prompt: right-aligned rounded bubble.
        const x = W - padX - b.w;
        ctx.fillStyle = bubble;
        roundRect(ctx, x, y, b.w, b.h, 20);
        ctx.fill();
        ctx.fillStyle = fg;
        ctx.font = font;
        let ty = y + bubblePadY + 17;
        for (const l of b.lines) {
          ctx.fillText(l, x + bubblePadX, ty);
          ty += lineH;
        }
        y += b.h + gapAfterUser;
      } else {
        // Reply: avatar plus full-width plain text, no bubble.
        const cx = padX + avatar / 2;
        const cy = y + avatar / 2 - 4;
        ctx.fillStyle = dark ? "#ffffff" : "#0d0d0d";
        ctx.beginPath();
        ctx.arc(cx, cy, avatar / 2, 0, Math.PI * 2);
        ctx.fill();
        // A simple ring cut into the mark so it reads as an avatar, not a dot.
        ctx.fillStyle = dark ? "#212121" : "#ffffff";
        ctx.beginPath();
        ctx.arc(cx, cy, avatar / 2 - 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = dark ? "#ffffff" : "#0d0d0d";
        ctx.beginPath();
        ctx.arc(cx, cy, 2.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = fg;
        ctx.font = font;
        let ty = y + 17;
        for (const l of b.lines) {
          ctx.fillText(l, padX + avatar + 12, ty);
          ty += lineH;
        }
        y += b.h + gapAfterBot;
      }
    }
  }, [dark, title, raw]);

  const download = () => {
    if (canvasRef.current) downloadCanvas(canvasRef.current, "fake-ai-chat.png");
  };

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <label className="block text-sm">
        <span className="mb-1 block text-text-muted">Conversation title</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
        />
      </label>

      <label className="mt-4 block text-sm">
        <span className="mb-1 block text-text-muted">
          Conversation — one message per line. Start a line with{" "}
          <code className="rounded bg-background px-1 py-0.5 text-xs">&gt;</code>{" "}
          for your prompt; other lines are the reply.
        </span>
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={8}
          spellCheck={false}
          className="w-full resize-y rounded-lg border border-border bg-surface p-3 font-mono text-sm text-text-primary focus:border-primary focus:outline-none"
        />
      </label>

      <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-text-muted">
        <input
          type="checkbox"
          checked={dark}
          onChange={(e) => setDark(e.target.checked)}
          className="h-4 w-4 rounded border-border accent-primary"
        />
        Dark mode
      </label>

      <div className="mt-6">
        <p className="mb-2 text-sm font-medium text-text-primary">Preview</p>
        <canvas
          ref={canvasRef}
          className="w-full max-w-[620px] rounded-xl border border-border"
        />
      </div>

      <button
        type="button"
        onClick={download}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
      >
        <Download className="h-4 w-4" /> Download PNG
      </button>

      <p className="mt-4 text-xs leading-relaxed text-text-muted">
        For memes and jokes only. Don&apos;t pass a made-up answer off as
        something a real assistant actually said.
      </p>
    </div>
  );
}
