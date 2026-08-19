"use client";

import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import { wrapText, downloadCanvas } from "@/lib/canvasDraw";
import { parseAuthorScript } from "@/lib/chatScript";
import { formatVotes as short } from "@/lib/voteCount";

/**
 * Fake forum post + comment thread screenshot.
 *
 * Comments reuse parseAuthorScript (`name: message`), the same grammar the
 * Discord generator uses, so someone who has used one already knows this one.
 *
 * The part that decides whether it reads as real is the vote column and the
 * metadata line, not the post text -- a thread screenshot with a bare title and
 * body looks like a blog quote. So the score, the comment count and the "Posted
 * by u/... 7h ago" line are all editable, and the comment scores decay down the
 * thread the way real ones do rather than being uniform.
 */
export default function FakeReddit() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dark, setDark] = useState(true);
  const [sub, setSub] = useState("r/mildlyinteresting");
  const [author, setAuthor] = useState("u/throwaway_2026");
  const [age, setAge] = useState("7h");
  const [title, setTitle] = useState(
    "My local library still has a working card catalogue from 1953"
  );
  const [body, setBody] = useState(
    "The librarian said they keep it because three regulars refuse to use the computers. Every card is still filed correctly."
  );
  const [score, setScore] = useState(12400);
  const [raw, setRaw] = useState(
    "u/dewey_decimal: Those regulars are right and I will not be taking questions\nu/quietstacks: The handwriting on these is genuinely beautiful\nu/archivist_pat: We had one until 2019. Binned it. Still think about it."
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scale = 2;
    const W = 640;
    const voteW = 44;
    const padX = 16;
    const contentX = voteW + padX;
    const contentW = W - contentX - padX;

    const titleFont = "600 19px system-ui, -apple-system, sans-serif";
    const bodyFont = "400 14.5px system-ui, sans-serif";
    const metaFont = "400 12.5px system-ui, sans-serif";
    const cAuthorFont = "600 12.5px system-ui, sans-serif";
    const cBodyFont = "400 14px system-ui, sans-serif";

    const comments = parseAuthorScript(raw);

    // Lay everything out first so the canvas can be sized exactly.
    ctx.font = titleFont;
    const titleLines = wrapText(ctx, title, contentW);
    ctx.font = bodyFont;
    const bodyLines = body.trim() ? wrapText(ctx, body, contentW) : [];
    ctx.font = cBodyFont;
    const laidComments = comments.map((c) => ({
      ...c,
      lines: wrapText(ctx, c.text, contentW - 34),
    }));

    const headerH = 42;
    const titleH = titleLines.length * 26;
    const bodyH = bodyLines.length * 21;
    const actionsH = 34;
    const postH = headerH + titleH + (bodyH ? bodyH + 10 : 0) + actionsH + 18;
    const commentsH = laidComments.reduce(
      (s, c) => s + 20 + c.lines.length * 20 + 20,
      0
    );
    const H = postH + (laidComments.length ? commentsH + 14 : 0) + 12;

    canvas.width = W * scale;
    canvas.height = H * scale;
    canvas.style.aspectRatio = `${W} / ${H}`;
    ctx.scale(scale, scale);

    const bg = dark ? "#1a1a1b" : "#ffffff";
    const fg = dark ? "#d7dadc" : "#1a1a1b";
    const muted = dark ? "#818384" : "#7c7c7c";
    const rule = dark ? "#343536" : "#edeff1";
    const rail = dark ? "#161617" : "#f8f9fa";
    const accent = "#ff4500";

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Vote rail
    ctx.fillStyle = rail;
    ctx.fillRect(0, 0, voteW, postH);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // Up arrow (filled, as if voted)
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.moveTo(voteW / 2, 20);
    ctx.lineTo(voteW / 2 + 8, 30);
    ctx.lineTo(voteW / 2 - 8, 30);
    ctx.closePath();
    ctx.fill();
    ctx.font = "700 13px system-ui, sans-serif";
    ctx.fillText(short(score), voteW / 2, 42);
    // Down arrow (outline)
    ctx.fillStyle = muted;
    ctx.beginPath();
    ctx.moveTo(voteW / 2, 66);
    ctx.lineTo(voteW / 2 + 8, 56);
    ctx.lineTo(voteW / 2 - 8, 56);
    ctx.closePath();
    ctx.fill();

    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    // Meta line: r/sub · Posted by u/author · age
    let y = 26;
    ctx.font = "700 12.5px system-ui, sans-serif";
    ctx.fillStyle = fg;
    const subW = ctx.measureText(sub).width;
    ctx.fillText(sub, contentX, y);
    ctx.font = metaFont;
    ctx.fillStyle = muted;
    ctx.fillText(` · Posted by ${author} · ${age} ago`, contentX + subW, y);

    // Title
    y += 24;
    ctx.font = titleFont;
    ctx.fillStyle = fg;
    for (const l of titleLines) {
      ctx.fillText(l, contentX, y);
      y += 26;
    }

    // Body
    if (bodyLines.length) {
      y += 4;
      ctx.font = bodyFont;
      ctx.fillStyle = dark ? "#c8cbcd" : "#1a1a1b";
      for (const l of bodyLines) {
        ctx.fillText(l, contentX, y);
        y += 21;
      }
    }

    // Action row
    y += 18;
    ctx.font = "600 12.5px system-ui, sans-serif";
    ctx.fillStyle = muted;
    ctx.fillText(
      `💬 ${comments.length} Comments      ↗ Share      ⚑ Save`,
      contentX,
      y
    );

    // Comment thread
    if (laidComments.length) {
      y += 16;
      ctx.strokeStyle = rule;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(contentX, y);
      ctx.lineTo(W - padX, y);
      ctx.stroke();
      y += 22;

      laidComments.forEach((c, i) => {
        // Thread line down the left of each comment.
        ctx.strokeStyle = rule;
        ctx.beginPath();
        ctx.moveTo(contentX + 8, y - 10);
        ctx.lineTo(contentX + 8, y + c.lines.length * 20 + 2);
        ctx.stroke();

        // Avatar dot
        ctx.fillStyle = dark ? "#343536" : "#e4e6e7";
        ctx.beginPath();
        ctx.arc(contentX + 8, y - 14, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = cAuthorFont;
        ctx.fillStyle = fg;
        const nameW = ctx.measureText(c.author).width;
        ctx.fillText(c.author, contentX + 24, y - 10);
        ctx.font = metaFont;
        ctx.fillStyle = muted;
        // Scores decay down the thread, as real ones do.
        const cs = Math.max(1, Math.round(score / (14 * (i + 1))));
        ctx.fillText(` · ${short(cs)} points`, contentX + 24 + nameW, y - 10);

        ctx.font = cBodyFont;
        ctx.fillStyle = dark ? "#d7dadc" : "#1a1a1b";
        let cy = y + 8;
        for (const l of c.lines) {
          ctx.fillText(l, contentX + 24, cy);
          cy += 20;
        }
        y = cy + 20;
      });
    }
  }, [dark, sub, author, age, title, body, score, raw]);

  const download = () => {
    if (canvasRef.current) downloadCanvas(canvasRef.current, "fake-reddit-post.png");
  };

  const field =
    "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none";

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block text-text-muted">Subreddit</span>
          <input value={sub} onChange={(e) => setSub(e.target.value)} className={field} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-text-muted">Username</span>
          <input value={author} onChange={(e) => setAuthor(e.target.value)} className={field} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-text-muted">Upvotes</span>
          <input
            type="number"
            value={score}
            onChange={(e) => setScore(Number(e.target.value) || 0)}
            className={field}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-text-muted">Posted (e.g. 7h)</span>
          <input value={age} onChange={(e) => setAge(e.target.value)} className={field} />
        </label>
      </div>

      <label className="mt-4 block text-sm">
        <span className="mb-1 block text-text-muted">Post title</span>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={field} />
      </label>

      <label className="mt-4 block text-sm">
        <span className="mb-1 block text-text-muted">Post body (optional)</span>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          className="w-full resize-y rounded-lg border border-border bg-surface p-3 text-sm text-text-primary focus:border-primary focus:outline-none"
        />
      </label>

      <label className="mt-4 block text-sm">
        <span className="mb-1 block text-text-muted">
          Comments — one per line as{" "}
          <code className="rounded bg-background px-1 py-0.5 text-xs">username: comment</code>
        </span>
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={5}
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
        <canvas ref={canvasRef} className="w-full max-w-[640px] rounded-xl border border-border" />
      </div>

      <button
        type="button"
        onClick={download}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
      >
        <Download className="h-4 w-4" /> Download PNG
      </button>

      <p className="mt-4 text-xs leading-relaxed text-text-muted">
        For memes and jokes only — please don&apos;t use it to put words in a
        real person&apos;s mouth or to pass a made-up thread off as real.
      </p>
    </div>
  );
}
