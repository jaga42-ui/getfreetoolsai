"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { DevButton, CopyButton, Panel } from "@/components/dev/ui";
import { cn } from "@/lib/utils";

const SETS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?/",
} as const;

type SetKey = keyof typeof SETS;

const SET_LABELS: Record<SetKey, string> = {
  upper: "Uppercase (A–Z)",
  lower: "Lowercase (a–z)",
  digits: "Numbers (0–9)",
  symbols: "Symbols (!@#…)",
};

// Characters that are easy to confuse with one another.
const SIMILAR = new Set("il1Lo0O|`'\"".split(""));

/** Unbiased random integer in [0, max) from the crypto RNG (rejection sampling). */
function secureInt(max: number): number {
  const limit = Math.floor(0x100000000 / max) * max;
  const buf = new Uint32Array(1);
  let x: number;
  do {
    crypto.getRandomValues(buf);
    x = buf[0];
  } while (x >= limit);
  return x % max;
}

function pick(pool: string): string {
  return pool[secureInt(pool.length)];
}

function strength(bits: number): { label: string; tier: number } {
  if (bits < 40) return { label: "Weak", tier: 1 };
  if (bits < 60) return { label: "Fair", tier: 2 };
  if (bits < 80) return { label: "Strong", tier: 3 };
  return { label: "Very strong", tier: 4 };
}

const TIER_COLOR = ["", "bg-red-500", "bg-amber-500", "bg-emerald-500", "bg-emerald-400"];

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [enabled, setEnabled] = useState<Record<SetKey, boolean>>({
    upper: true,
    lower: true,
    digits: true,
    symbols: true,
  });
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [password, setPassword] = useState("");
  const [bits, setBits] = useState(0);

  const generate = useCallback(() => {
    const keys = (Object.keys(SETS) as SetKey[]).filter((k) => enabled[k]);
    let pools: string[] = keys.map((k) => SETS[k]);
    if (excludeSimilar)
      pools = pools.map((p) =>
        p
          .split("")
          .filter((c) => !SIMILAR.has(c))
          .join("")
      );
    pools = pools.filter((p) => p.length > 0);

    if (pools.length === 0) {
      setPassword("");
      setBits(0);
      return;
    }

    const full = pools.join("");
    const len = Math.max(4, Math.min(128, length));
    const chars: string[] = [];

    // Guarantee at least one character from each selected set (up to the length).
    for (const p of pools) {
      if (chars.length < len) chars.push(pick(p));
    }
    while (chars.length < len) chars.push(pick(full));

    // Secure Fisher–Yates shuffle so the guaranteed chars aren't front-loaded.
    for (let i = chars.length - 1; i > 0; i--) {
      const j = secureInt(i + 1);
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }

    setPassword(chars.join(""));
    setBits(Math.round(len * Math.log2(full.length)));
  }, [length, enabled, excludeSimilar]);

  useEffect(() => {
    generate();
  }, [generate]);

  const toggle = (k: SetKey) =>
    setEnabled((e) => {
      const next = { ...e, [k]: !e[k] };
      // Never allow zero sets selected.
      if (!Object.values(next).some(Boolean)) return e;
      return next;
    });

  const s = strength(bits);
  const noneSelected = !Object.values(enabled).some(Boolean);

  return (
    <div className="space-y-5">
      {/* Password display */}
      <Panel
        label="Generated password"
        actions={
          <>
            <CopyButton value={password} />
            <DevButton size="sm" icon={RefreshCw} onClick={generate}>
              Regenerate
            </DevButton>
          </>
        }
      >
        <div className="flex min-h-[3.25rem] items-center break-all rounded-lg border border-zinc-800 bg-zinc-900/70 px-4 py-3 font-mono text-lg text-emerald-300">
          {password || (
            <span className="text-sm text-zinc-500">Select at least one character set…</span>
          )}
        </div>

        {/* Strength meter */}
        {password && (
          <div className="mt-3 flex items-center gap-3">
            <div className="flex flex-1 gap-1">
              {[1, 2, 3, 4].map((t) => (
                <div
                  key={t}
                  className={cn(
                    "h-1.5 flex-1 rounded-full",
                    t <= s.tier ? TIER_COLOR[s.tier] : "bg-zinc-800"
                  )}
                />
              ))}
            </div>
            <span className="shrink-0 text-xs font-medium text-zinc-300">
              {s.label} · {bits} bits
            </span>
          </div>
        )}
      </Panel>

      {/* Length */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="pw-length" className="text-xs font-medium text-zinc-400">
            Length
          </label>
          <span className="font-mono text-sm text-zinc-200">{length}</span>
        </div>
        <input
          id="pw-length"
          type="range"
          min={4}
          max={64}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full accent-emerald-500"
        />
      </div>

      {/* Character sets */}
      <div className="grid gap-2.5 sm:grid-cols-2">
        {(Object.keys(SETS) as SetKey[]).map((k) => (
          <label
            key={k}
            className="inline-flex cursor-pointer items-center gap-2 text-sm text-zinc-300"
          >
            <input
              type="checkbox"
              checked={enabled[k]}
              onChange={() => toggle(k)}
              className="accent-emerald-500"
            />
            {SET_LABELS[k]}
          </label>
        ))}
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
          <input
            type="checkbox"
            checked={excludeSimilar}
            onChange={(e) => setExcludeSimilar(e.target.checked)}
            className="accent-emerald-500"
          />
          Exclude similar characters (i, l, 1, O, 0…)
        </label>
      </div>

      {noneSelected && (
        <p className="text-xs text-amber-400">Select at least one character set.</p>
      )}
    </div>
  );
}
