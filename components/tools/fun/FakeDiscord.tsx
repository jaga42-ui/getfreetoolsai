"use client";

import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import { wrapText, roundRect, downloadCanvas } from "@/lib/canvasDraw";
import { parseAuthorScript } from "@/lib/chatScript";

/**
 * Discord's default role colours. Authors are assigned one deterministically
 * from their name so the same person keeps the same colour across renders.
 */
const ROLE_COLORS = [
  "#5865f2",
  "#57f287",
  "#fee75c",
  "#eb459e",
  "#ed4245",
  "#00b0f4",
  "#f47b67",
];

function colorFor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return ROLE_COLORS[h % ROLE_COLORS.length];
}

export default function FakeDiscord() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [channel, setChannel] = useState("general");
  const [timestamp, setTimestamp] = useState("Today at 9:41 PM");
  const [light, setLight] = useState(false);
  const [raw, setRaw] = useState(
    "arjun: anyone up for a game tonight?\nmeera: im in\nMEE6 [BOT]: 3 players needed for the lobby\narjun: perfect"
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scale = 2;
    const W = 460;
    const headerH = 48;
    const avatarX = 16;
    const avatarR = 20;
    const textX = avatarX + avatarR * 2 + 16;
    const contentW = W - textX - 16;
    const font = "400 15px system-ui, -apple-system, sans-serif";
    const lineH = 21;

    const msgs = parseAuthorScript(raw);

    ctx.font = font;
    const laid = msgs.map((m, i) => {
      const lines = wrapText(ctx, m.text, contentW);
      // Discord collapses the avatar + name header when the same author posts
      // again consecutively.
      const grouped = i > 0 && msgs[i - 1].author === m.author;
      const h = lines.length * lineH + (grouped ? 0 : 24);
      return { ...m, lines, grouped, h };
    });

    const bodyH = laid.reduce((s, m) => s + m.h + 8, 0);
    const H = headerH + bodyH + 20;

    canvas.width = W * scale;
    canvas.height = H * scale;
    canvas.style.aspectRatio = `${W} / ${H}`;
    ctx.scale(scale, scale);

    const bg = light ? "#ffffff" : "#313338";
    const headerBg = light ? "#f2f3f5" : "#2b2d31";
    const bodyText = light ? "#313338" : "#dbdee1";
    const subtle = light ? "#5c5e66" : "#949ba4";

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // --- channel header ------------------------------------------------
    ctx.fillStyle = headerBg;
    ctx.fillRect(0, 0, W, headerH);
    ctx.fillStyle = subtle;
    ctx.font = "400 22px system-ui, sans-serif";
    ctx.textBaseline = "middle";
    ctx.fillText("#", 16, headerH / 2 + 1);
    ctx.fillStyle = light ? "#060607" : "#f2f3f5";
    ctx.font = "600 16px system-ui, sans-serif";
    ctx.fillText(channel, 34, headerH / 2 + 1);
    ctx.textBaseline = "alphabetic";

    // --- messages --------------------------------------------------------
    let y = headerH + 16;
    for (const m of laid) {
      if (!m.grouped) {
        // Avatar
        const cy = y + avatarR - 4;
        ctx.fillStyle = colorFor(m.author);
        ctx.beginPath();
        ctx.arc(avatarX + avatarR, cy, avatarR, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "600 16px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          (m.author.trim()[0] || "?").toUpperCase(),
          avatarX + avatarR,
          cy + 1
        );
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";

        // Author name
        ctx.fillStyle = colorFor(m.author);
        ctx.font = "500 15px system-ui, sans-serif";
        ctx.fillText(m.author, textX, y + 12);
        let after = textX + ctx.measureText(m.author).width + 6;

        // BOT tag
        if (m.bot) {
          ctx.font = "600 10px system-ui, sans-serif";
          const label = "BOT";
          const tw = ctx.measureText(label).width;
          ctx.fillStyle = "#5865f2";
          roundRect(ctx, after, y + 2, tw + 10, 14, 3);
          ctx.fill();
          ctx.fillStyle = "#ffffff";
          ctx.fillText(label, after + 5, y + 12);
          after += tw + 16;
        }

        // Timestamp
        ctx.fillStyle = subtle;
        ctx.font = "400 12px system-ui, sans-serif";
        ctx.fillText(timestamp, after, y + 12);

        y += 24;
      }

      ctx.fillStyle = bodyText;
      ctx.font = font;
      for (const l of m.lines) {
        ctx.fillText(l, textX, y + 15);
        y += lineH;
      }
      y += 8;
    }
  }, [channel, timestamp, light, raw]);

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block text-text-muted">Channel name</span>
          <input
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-text-muted">Timestamp</span>
          <input
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
          />
        </label>
      </div>

      <label className="mt-4 block text-sm">
        <span className="mb-1 block text-text-muted">
          Messages — one per line as{" "}
          <code className="rounded bg-background px-1 py-0.5 text-xs">
            name: message
          </code>
          . A line with no name continues the previous message. Add{" "}
          <code className="rounded bg-background px-1 py-0.5 text-xs">
            [BOT]
          </code>{" "}
          after a name for the bot tag.
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
        <input
          type="checkbox"
          checked={light}
          onChange={(e) => setLight(e.target.checked)}
          className="h-4 w-4 rounded border-border accent-primary"
        />
        Light theme
      </label>

      <div className="mt-6">
        <p className="mb-2 text-sm font-medium text-text-primary">Preview</p>
        <canvas
          ref={canvasRef}
          className="w-full max-w-[460px] rounded-xl border border-border"
        />
      </div>

      <button
        type="button"
        onClick={() =>
          canvasRef.current &&
          downloadCanvas(canvasRef.current, "fake-discord-chat.png")
        }
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
      >
        <Download className="h-4 w-4" /> Download PNG
      </button>

      <p className="mt-4 text-xs leading-relaxed text-text-muted">
        For memes, mockups and jokes only — please don&apos;t use it to
        impersonate real people, fabricate evidence or deceive anyone. Discord
        is a trademark of its owner; this tool is not affiliated with it.
      </p>
    </div>
  );
}
