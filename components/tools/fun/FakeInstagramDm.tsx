"use client";

import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import { wrapText, roundRect, downloadCanvas } from "@/lib/canvasDraw";
import { parseSideScript } from "@/lib/chatScript";

export default function FakeInstagramDm() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [username, setUsername] = useState("priya.sharma");
  const [status, setStatus] = useState("Active now");
  const [dark, setDark] = useState(true);
  const [seen, setSeen] = useState(true);
  const [raw, setRaw] = useState(
    "did you see the story 😭\n> which one\nthe one from last night\n> omg yes"
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scale = 2;
    const W = 390;
    const padX = 14;
    const headerH = 92;
    const maxBubbleW = W * 0.72;
    const font = "400 15px system-ui, -apple-system, sans-serif";
    const lineH = 20;
    const bubblePadX = 14;
    const bubblePadY = 9;
    const gap = 4;

    const msgs = parseSideScript(raw);

    ctx.font = font;
    const laid = msgs.map((m, i) => {
      const lines = wrapText(ctx, m.text, maxBubbleW - bubblePadX * 2);
      const textW = Math.max(...lines.map((l) => ctx.measureText(l).width), 0);
      // Instagram groups consecutive messages from the same side tightly and
      // opens a larger gap when the speaker changes.
      const prev = msgs[i - 1];
      const grouped = prev ? prev.sent === m.sent : false;
      return {
        ...m,
        lines,
        grouped,
        w: textW + bubblePadX * 2,
        h: lines.length * lineH + bubblePadY * 2,
      };
    });

    const seenH = seen ? 22 : 0;
    const bodyH = laid.reduce(
      (sum, b) => sum + b.h + (b.grouped ? gap : gap + 6),
      0
    );
    const H = headerH + bodyH + 20 + seenH;

    canvas.width = W * scale;
    canvas.height = H * scale;
    canvas.style.aspectRatio = `${W} / ${H}`;
    ctx.scale(scale, scale);

    const bg = dark ? "#000000" : "#ffffff";
    const recvBg = dark ? "#262626" : "#efefef";
    const recvText = dark ? "#ffffff" : "#000000";
    const subtle = dark ? "#a8a8a8" : "#8e8e8e";

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // --- header --------------------------------------------------------
    ctx.strokeStyle = dark ? "#262626" : "#dbdbdb";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, headerH);
    ctx.lineTo(W, headerH);
    ctx.stroke();

    // Back chevron
    ctx.strokeStyle = dark ? "#ffffff" : "#000000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(21, 40);
    ctx.lineTo(14, 47);
    ctx.lineTo(21, 54);
    ctx.stroke();

    // Avatar with Instagram's story ring
    const ax = 52;
    const ay = 47;
    const ring = ctx.createLinearGradient(ax - 20, ay - 20, ax + 20, ay + 20);
    ring.addColorStop(0, "#f9ce34");
    ring.addColorStop(0.5, "#ee2a7b");
    ring.addColorStop(1, "#6228d7");
    ctx.strokeStyle = ring;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ax, ay, 19, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = dark ? "#3a3a3a" : "#dbdbdb";
    ctx.beginPath();
    ctx.arc(ax, ay, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = dark ? "#ffffff" : "#8e8e8e";
    ctx.font = "600 15px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText((username.trim()[0] || "?").toUpperCase(), ax, ay + 1);

    // Username + status
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = dark ? "#ffffff" : "#000000";
    ctx.font = "600 15px system-ui, sans-serif";
    ctx.fillText(username, 80, status.trim() ? 44 : 52);
    if (status.trim()) {
      ctx.fillStyle = subtle;
      ctx.font = "400 12px system-ui, sans-serif";
      ctx.fillText(status, 80, 60);
    }

    // --- bubbles -------------------------------------------------------
    let y = headerH + 14;
    for (const b of laid) {
      if (!b.grouped && y > headerH + 14) y += 6;
      const x = b.sent ? W - padX - b.w : padX;

      if (b.sent) {
        // Instagram's purple→blue gradient on sent messages.
        const g = ctx.createLinearGradient(x, y, x + b.w, y + b.h);
        g.addColorStop(0, "#a033ff");
        g.addColorStop(0.5, "#8034e8");
        g.addColorStop(1, "#4a5cf5");
        ctx.fillStyle = g;
      } else {
        ctx.fillStyle = recvBg;
      }
      roundRect(ctx, x, y, b.w, b.h, 20);
      ctx.fill();

      ctx.fillStyle = b.sent ? "#ffffff" : recvText;
      ctx.font = font;
      let ty = y + bubblePadY + 15;
      for (const l of b.lines) {
        ctx.fillText(l, x + bubblePadX, ty);
        ty += lineH;
      }
      y += b.h + gap;
    }

    if (seen) {
      ctx.fillStyle = subtle;
      ctx.font = "400 11px system-ui, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText("Seen", W - padX, y + 12);
      ctx.textAlign = "left";
    }
  }, [username, status, dark, seen, raw]);

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block text-text-muted">Username</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-text-muted">
            Status line (e.g. Active now)
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

      <div className="mt-4 flex flex-wrap gap-5">
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
            checked={seen}
            onChange={(e) => setSeen(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-primary"
          />
          Show &ldquo;Seen&rdquo;
        </label>
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
          downloadCanvas(canvasRef.current, "fake-instagram-dm.png")
        }
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
      >
        <Download className="h-4 w-4" /> Download PNG
      </button>

      <p className="mt-4 text-xs leading-relaxed text-text-muted">
        For memes, mockups and jokes only — please don&apos;t use it to
        impersonate real people, fabricate evidence or deceive anyone. Instagram
        is a trademark of its owner; this tool is not affiliated with it.
      </p>
    </div>
  );
}
