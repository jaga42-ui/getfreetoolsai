"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { CopyButton, Panel, DevButton, Labeled, inputClass, fieldClass } from "@/components/dev/ui";

type Mode = "int" | "dec";
type Sep = "newline" | "comma" | "space";

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

function secureFloat(): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] / 0x100000000;
}

const SEP: Record<Sep, string> = { newline: "\n", comma: ", ", space: " " };

export default function RandomNumberGenerator() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(5);
  const [mode, setMode] = useState<Mode>("int");
  const [decimals, setDecimals] = useState(2);
  const [unique, setUnique] = useState(false);
  const [sort, setSort] = useState(false);
  const [sep, setSep] = useState<Sep>("newline");
  const [results, setResults] = useState<number[]>([]);
  const [note, setNote] = useState("");

  const generate = useCallback(() => {
    let lo = Number(min);
    let hi = Number(max);
    if (!Number.isFinite(lo) || !Number.isFinite(hi)) return;
    if (lo > hi) [lo, hi] = [hi, lo];
    const n = Math.max(1, Math.min(10000, Math.floor(count) || 1));
    setNote("");

    if (mode === "int") {
      lo = Math.ceil(lo);
      hi = Math.floor(hi);
      const range = hi - lo + 1;
      if (range <= 0) {
        setResults([]);
        return;
      }
      if (unique) {
        let want = n;
        if (want > range) {
          want = range;
          setNote(`Only ${range} unique values fit in this range — generated ${range}.`);
        }
        const set = new Set<number>();
        while (set.size < want) set.add(lo + secureInt(range));
        const arr = Array.from(set);
        if (sort) arr.sort((a, b) => a - b);
        setResults(arr);
      } else {
        const arr = Array.from({ length: n }, () => lo + secureInt(range));
        if (sort) arr.sort((a, b) => a - b);
        setResults(arr);
      }
    } else {
      const d = Math.max(0, Math.min(10, Math.floor(decimals) || 0));
      const span = hi - lo;
      const round = (x: number) => Number(x.toFixed(d));
      const make = () => round(lo + secureFloat() * span);
      let arr: number[];
      if (unique) {
        const set = new Set<number>();
        let guard = 0;
        while (set.size < n && guard < n * 200) {
          set.add(make());
          guard++;
        }
        arr = Array.from(set);
        if (arr.length < n) setNote(`Could only find ${arr.length} unique values at this precision.`);
      } else {
        arr = Array.from({ length: n }, make);
      }
      if (sort) arr.sort((a, b) => a - b);
      setResults(arr);
    }
  }, [min, max, count, mode, decimals, unique, sort]);

  useEffect(() => {
    generate();
  }, [generate]);

  const text = results.join(SEP[sep]);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <Labeled label="Minimum">
          <input type="number" value={min} onChange={(e) => setMin(Number(e.target.value))} className={inputClass} />
        </Labeled>
        <Labeled label="Maximum">
          <input type="number" value={max} onChange={(e) => setMax(Number(e.target.value))} className={inputClass} />
        </Labeled>
        <Labeled label="How many">
          <input type="number" min={1} max={10000} value={count} onChange={(e) => setCount(Number(e.target.value))} className={inputClass} />
        </Labeled>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="inline-flex rounded-lg border border-zinc-800 bg-zinc-900/50 p-0.5">
          {(
            [
              ["int", "Integers"],
              ["dec", "Decimals"],
            ] as [Mode, string][]
          ).map(([m, label]) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors " +
                (mode === m ? "bg-emerald-500 text-zinc-950" : "text-zinc-400 hover:text-zinc-200")
              }
            >
              {label}
            </button>
          ))}
        </div>

        {mode === "dec" && (
          <label className="inline-flex items-center gap-2 text-xs text-zinc-400">
            Decimal places
            <input
              type="number"
              min={0}
              max={10}
              value={decimals}
              onChange={(e) => setDecimals(Number(e.target.value))}
              className={`${inputClass} w-16`}
            />
          </label>
        )}

        <label className="inline-flex items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} className="accent-emerald-500" />
          Unique
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" checked={sort} onChange={(e) => setSort(e.target.checked)} className="accent-emerald-500" />
          Sort ascending
        </label>
      </div>

      <div className="flex items-center gap-3">
        <DevButton variant="primary" icon={RefreshCw} onClick={generate}>
          Generate
        </DevButton>
        <label className="inline-flex items-center gap-2 text-xs text-zinc-400">
          Separator
          <select value={sep} onChange={(e) => setSep(e.target.value as Sep)} className={`${inputClass} w-32`}>
            <option value="newline">New line</option>
            <option value="comma">Comma</option>
            <option value="space">Space</option>
          </select>
        </label>
      </div>

      {note && <p className="text-xs text-amber-400">{note}</p>}

      <Panel label={`${results.length} number${results.length === 1 ? "" : "s"}`} actions={<CopyButton value={text} />}>
        <textarea value={text} readOnly rows={8} spellCheck={false} className={fieldClass} placeholder="Numbers appear here…" />
      </Panel>
    </div>
  );
}
