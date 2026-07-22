"use client";

import { useEffect, useRef, useState } from "react";

const COLORS = ["#b25733", "#4b6b4e", "#c77d4a", "#3f7d6e", "#a6484e", "#6b7f3a", "#4a6b8a", "#8a5a9e"];

function secureRand(): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] / 0x100000000;
}

export default function SpinWheel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [raw, setRaw] = useState("Alice\nBob\nCharlie\nDiana\nEve\nFrank");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const options = raw.split("\n").map((s) => s.trim()).filter(Boolean);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const scale = 2;
    const S = 360;
    canvas.width = S * scale;
    canvas.height = S * scale;
    ctx.scale(scale, scale);
    ctx.clearRect(0, 0, S, S);

    const cx = S / 2, cy = S / 2, r = S / 2 - 4;
    const n = Math.max(options.length, 1);
    const seg = (2 * Math.PI) / n;

    for (let i = 0; i < n; i++) {
      // Segment i is centered at the top (−90°) when rotation aligns it there.
      const start = -Math.PI / 2 + i * seg;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, start + seg);
      ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();

      // Label
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + seg / 2);
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#fff";
      ctx.font = "600 14px system-ui, sans-serif";
      const label = options[i] ?? "";
      ctx.fillText(label.length > 14 ? label.slice(0, 13) + "…" : label, r - 14, 0);
      ctx.restore();
    }
    // Hub
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();
  }, [raw]); // eslint-disable-line react-hooks/exhaustive-deps

  const spin = () => {
    if (spinning || options.length < 2) return;
    setWinner(null);
    setSpinning(true);
    const n = options.length;
    const seg = 360 / n;
    const target = Math.floor(secureRand() * n);
    // Land target's centre under the top pointer. Segment i's centre sits at
    // (i*seg + seg/2) clockwise from top at rotation 0, so rotate it back to 0.
    const landing = 360 - (target * seg + seg / 2);
    const next = rotation - (rotation % 360) + 360 * 6 + landing;
    setRotation(next);
    window.setTimeout(() => {
      setWinner(options[target]);
      setSpinning(false);
    }, 4200);
  };

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-6 md:grid-cols-[360px_1fr] md:items-start">
        <div className="relative mx-auto w-full max-w-[360px]">
          {/* Pointer */}
          <div
            className="absolute left-1/2 top-[-6px] z-10 h-0 w-0 -translate-x-1/2"
            style={{ borderLeft: "12px solid transparent", borderRight: "12px solid transparent", borderTop: "20px solid #1c1917" }}
            aria-hidden
          />
          <canvas
            ref={canvasRef}
            className="w-full select-none rounded-full border border-border shadow-sm"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? "transform 4s cubic-bezier(0.15, 0.9, 0.25, 1)" : "none",
            }}
          />
        </div>

        <div>
          <label className="block text-sm">
            <span className="mb-1 block text-text-muted">Options (one per line)</span>
            <textarea
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              rows={7}
              className="w-full resize-y rounded-lg border border-border bg-surface p-3 text-sm text-text-primary focus:border-primary focus:outline-none"
              placeholder="Type each option on its own line…"
            />
          </label>
          <button
            type="button"
            onClick={spin}
            disabled={spinning || options.length < 2}
            className="mt-4 w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {spinning ? "Spinning…" : "Spin the wheel"}
          </button>
          {options.length < 2 && (
            <p className="mt-2 text-xs text-amber-500">Add at least two options to spin.</p>
          )}
          {winner && (
            <div className="mt-4 rounded-xl border border-primary/30 bg-primary/5 p-4 text-center">
              <p className="text-xs uppercase tracking-widest text-text-muted">Winner</p>
              <p className="mt-1 font-display text-2xl font-medium text-primary">{winner}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
