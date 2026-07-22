"use client";

import { useMemo, useState } from "react";
import { CopyButton, Panel, Labeled, inputClass } from "@/components/dev/ui";

const DIGITS = "0123456789abcdefghijklmnopqrstuvwxyz";

function parseInBase(raw: string, base: number): bigint | null {
  let s = raw.trim().toLowerCase();
  if (s === "") return null;
  let neg = false;
  if (s[0] === "-") {
    neg = true;
    s = s.slice(1);
  }
  // Allow common prefixes when they match the base.
  if (base === 16 && s.startsWith("0x")) s = s.slice(2);
  if (base === 2 && s.startsWith("0b")) s = s.slice(2);
  if (base === 8 && s.startsWith("0o")) s = s.slice(2);
  if (s === "") return null;
  const b = BigInt(base);
  let value = BigInt(0);
  for (const ch of s) {
    const d = DIGITS.indexOf(ch);
    if (d < 0 || d >= base) return null;
    value = value * b + BigInt(d);
  }
  return neg ? -value : value;
}

function formatInBase(v: bigint, base: number): string {
  return v.toString(base);
}

function OutRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2">
      <span className="shrink-0 text-xs text-zinc-500">{label}</span>
      <div className="flex min-w-0 items-center gap-2">
        <code className="truncate font-mono text-[13px] text-zinc-200">{value || "—"}</code>
        <CopyButton value={value} className="shrink-0" />
      </div>
    </div>
  );
}

export default function NumberBaseConverter() {
  const [input, setInput] = useState("255");
  const [inputBase, setInputBase] = useState(10);
  const [customBase, setCustomBase] = useState(32);

  const { value, error } = useMemo(() => {
    const v = parseInBase(input, inputBase);
    if (input.trim() === "") return { value: null as bigint | null, error: "" };
    if (v === null) return { value: null as bigint | null, error: `Not a valid base-${inputBase} number.` };
    return { value: v, error: "" };
  }, [input, inputBase]);

  const out = (base: number) => (value === null ? "" : formatInBase(value, base));

  return (
    <div className="space-y-5">
      <Panel label="Input">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[200px] flex-1">
            <Labeled label="Number">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter a number"
                className={inputClass}
              />
            </Labeled>
          </div>
          <div>
            <Labeled label="From base">
              <select
                value={inputBase}
                onChange={(e) => setInputBase(Number(e.target.value))}
                className={inputClass}
              >
                <option value={2}>2 — Binary</option>
                <option value={8}>8 — Octal</option>
                <option value={10}>10 — Decimal</option>
                <option value={16}>16 — Hexadecimal</option>
              </select>
            </Labeled>
          </div>
        </div>
        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      </Panel>

      <div className="divide-y divide-zinc-800 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/70">
        <OutRow label="Binary (2)" value={out(2)} />
        <OutRow label="Octal (8)" value={out(8)} />
        <OutRow label="Decimal (10)" value={out(10)} />
        <OutRow label="Hexadecimal (16)" value={out(16)} />
      </div>

      <Panel label="Custom base">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <Labeled label="Base (2–36)">
              <input
                type="number"
                min={2}
                max={36}
                value={customBase}
                onChange={(e) =>
                  setCustomBase(Math.max(2, Math.min(36, Number(e.target.value) || 2)))
                }
                className={`${inputClass} w-28`}
              />
            </Labeled>
          </div>
          <div className="min-w-[180px] flex-1">
            <div className="mb-1.5 text-xs font-medium text-zinc-400">
              Result (base {customBase})
            </div>
            <div className="flex items-center gap-2">
              <code className="min-w-0 flex-1 truncate rounded-md border border-zinc-800 bg-zinc-900/70 px-3 py-2 font-mono text-[13px] text-zinc-200">
                {out(customBase) || "—"}
              </code>
              <CopyButton value={out(customBase)} className="shrink-0" />
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
