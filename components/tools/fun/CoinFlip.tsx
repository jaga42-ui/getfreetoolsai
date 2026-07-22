"use client";

import { useRef, useState } from "react";

function secureBool(): boolean {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % 2 === 0;
}

export default function CoinFlip() {
  const [rot, setRot] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [counts, setCounts] = useState({ heads: 0, tails: 0 });
  const [streak, setStreak] = useState({ side: "", n: 0 });
  const last = useRef<string>("");

  const flip = () => {
    if (flipping) return;
    setFlipping(true);
    const heads = secureBool();
    const face = heads ? 0 : 180;
    setRot((r) => r - (r % 360) + 360 * 5 + face);
    window.setTimeout(() => {
      const side = heads ? "heads" : "tails";
      setCounts((c) => ({ ...c, [side]: c[side as "heads" | "tails"] + 1 }));
      setStreak((s) => (s.side === side ? { side, n: s.n + 1 } : { side, n: 1 }));
      last.current = side;
      setFlipping(false);
    }, 1050);
  };

  const total = counts.heads + counts.tails;

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="flex flex-col items-center">
        <div style={{ perspective: "1000px" }} className="py-6">
          <div
            className="relative h-40 w-40"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateY(${rot}deg)`,
              transition: flipping ? "transform 1s ease-out" : "none",
            }}
          >
            <div
              className="absolute inset-0 flex items-center justify-center rounded-full border-4 border-amber-300 bg-gradient-to-br from-amber-400 to-amber-500 font-display text-2xl font-semibold text-amber-900 shadow-lg"
              style={{ backfaceVisibility: "hidden" }}
            >
              Heads
            </div>
            <div
              className="absolute inset-0 flex items-center justify-center rounded-full border-4 border-amber-300 bg-gradient-to-br from-amber-400 to-amber-500 font-display text-2xl font-semibold text-amber-900 shadow-lg"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              Tails
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={flip}
          disabled={flipping}
          className="w-full max-w-xs rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {flipping ? "Flipping…" : "Flip the coin"}
        </button>

        {total > 0 && (
          <>
            <div className="mt-6 grid w-full max-w-md grid-cols-3 gap-3">
              <div className="rounded-lg border border-border bg-background p-4 text-center">
                <p className="font-display text-2xl font-medium text-text-primary">{counts.heads}</p>
                <p className="text-xs text-text-muted">Heads</p>
              </div>
              <div className="rounded-lg border border-border bg-background p-4 text-center">
                <p className="font-display text-2xl font-medium text-text-primary">{counts.tails}</p>
                <p className="text-xs text-text-muted">Tails</p>
              </div>
              <div className="rounded-lg border border-border bg-background p-4 text-center">
                <p className="font-display text-2xl font-medium text-primary">{total}</p>
                <p className="text-xs text-text-muted">Total flips</p>
              </div>
            </div>
            {streak.n > 1 && (
              <p className="mt-3 text-sm text-text-muted">
                Current streak: <strong className="text-text-primary">{streak.n} {streak.side}</strong> in a row
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
