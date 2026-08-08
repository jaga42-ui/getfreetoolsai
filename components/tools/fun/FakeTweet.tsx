"use client";

import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import { wrapText, downloadCanvas } from "@/lib/canvasDraw";

const AVATAR_COLORS = ["#f97316", "#0ea5e9", "#22c55e", "#a855f7", "#ef4444", "#14b8a6"];

function colorFor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-text-muted">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
      />
    </label>
  );
}

export default function FakeTweet() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [name, setName] = useState("Jane Doe");
  const [handle, setHandle] = useState("janedoe");
  const [text, setText] = useState("this is a fake tweet — made for a meme, not to fool anyone 😄");
  const [verified, setVerified] = useState(true);
  const [dark, setDark] = useState(true);
  const [replies, setReplies] = useState("88");
  const [retweets, setRetweets] = useState("340");
  const [likes, setLikes] = useState("1.2K");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scale = 2;
    const W = 600;
    const padX = 24;
    const contentW = W - padX * 2;

    const fg = dark ? "#e7e9ea" : "#0f1419";
    const muted = dark ? "#71767b" : "#536471";
    const bg = dark ? "#15202b" : "#ffffff";
    const line = dark ? "#38444d" : "#eff3f4";

    // Measure tweet text with the tweet font.
    ctx.font = "400 24px system-ui, sans-serif";
    const textLines = wrapText(ctx, text, contentW);
    const lineH = 32;

    const headerH = 88;
    const textBlockH = textLines.length * lineH;
    const metaH = 30;
    const statsH = 44;
    const H = headerH + textBlockH + metaH + statsH + 20;

    canvas.width = W * scale;
    canvas.height = H * scale;
    canvas.style.aspectRatio = `${W} / ${H}`;
    ctx.scale(scale, scale);

    // Background
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Avatar
    const ax = padX + 24;
    const ay = 24 + 24;
    ctx.save();
    ctx.beginPath();
    ctx.arc(ax, ay, 24, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.fillStyle = colorFor(name || "?");
    ctx.fillRect(ax - 24, ay - 24, 48, 48);
    ctx.fillStyle = "#ffffff";
    ctx.font = "600 24px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText((name.trim()[0] || "?").toUpperCase(), ax, ay + 1);
    ctx.restore();

    // Name + verified
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = fg;
    ctx.font = "700 17px system-ui, sans-serif";
    const nameX = padX + 60;
    ctx.fillText(name, nameX, 42);
    let afterName = nameX + ctx.measureText(name).width + 6;
    if (verified) {
      ctx.fillStyle = "#1d9bf0";
      ctx.beginPath();
      ctx.arc(afterName + 8, 37, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(afterName + 4, 37);
      ctx.lineTo(afterName + 7, 40);
      ctx.lineTo(afterName + 12, 33);
      ctx.stroke();
      afterName += 20;
    }
    // Handle
    ctx.fillStyle = muted;
    ctx.font = "400 15px system-ui, sans-serif";
    ctx.fillText(`@${handle}`, nameX, 64);

    // Tweet text
    ctx.fillStyle = fg;
    ctx.font = "400 24px system-ui, sans-serif";
    let ty = headerH + 24;
    for (const l of textLines) {
      ctx.fillText(l, padX, ty);
      ty += lineH;
    }

    // Timestamp
    ctx.fillStyle = muted;
    ctx.font = "400 15px system-ui, sans-serif";
    const metaY = ty + 2;
    ctx.fillText("9:45 AM · Jul 22, 2026 · GetFreeToolsAI", padX, metaY);

    // Divider
    ctx.strokeStyle = line;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padX, metaY + 16);
    ctx.lineTo(W - padX, metaY + 16);
    ctx.stroke();

    // Stats
    ctx.font = "400 14px system-ui, sans-serif";
    const statsY = metaY + 40;
    const stats: [string, string][] = [
      [replies, "Replies"],
      [retweets, "Reposts"],
      [likes, "Likes"],
    ];
    let sx = padX;
    for (const [num, label] of stats) {
      ctx.fillStyle = fg;
      ctx.font = "700 14px system-ui, sans-serif";
      ctx.fillText(num, sx, statsY);
      const numW = ctx.measureText(num).width;
      ctx.fillStyle = muted;
      ctx.font = "400 14px system-ui, sans-serif";
      ctx.fillText(` ${label}`, sx + numW + 2, statsY);
      sx += numW + ctx.measureText(` ${label}`).width + 24;
    }
  }, [name, handle, text, verified, dark, replies, retweets, likes]);

  const download = () => {
    if (canvasRef.current) downloadCanvas(canvasRef.current, "fake-tweet.png");
  };

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Display name" value={name} onChange={setName} />
        <Field label="Username (without @)" value={handle} onChange={setHandle} />
      </div>

      <label className="mt-4 block text-sm">
        <span className="mb-1 block text-text-muted">Tweet text</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full resize-y rounded-lg border border-border bg-surface p-3 text-sm text-text-primary focus:border-primary focus:outline-none"
        />
      </label>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Field label="Replies" value={replies} onChange={setReplies} />
        <Field label="Reposts" value={retweets} onChange={setRetweets} />
        <Field label="Likes" value={likes} onChange={setLikes} />
      </div>

      <div className="mt-4 flex flex-wrap gap-4">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-text-muted">
          <input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} className="h-4 w-4 rounded border-border accent-primary" />
          Verified badge
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-text-muted">
          <input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} className="h-4 w-4 rounded border-border accent-primary" />
          Dark mode
        </label>
      </div>

      <div className="mt-6">
        <p className="mb-2 text-sm font-medium text-text-primary">Preview</p>
        <canvas
          ref={canvasRef}
          className="w-full max-w-[600px] rounded-xl border border-border"
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
        For memes and jokes only. Please don&apos;t use it to impersonate real
        people or spread misinformation.
      </p>
    </div>
  );
}
