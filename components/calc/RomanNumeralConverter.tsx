"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";

import { SegmentedControl } from "@/components/ui";
import { explain, fromRoman, toRoman } from "@/lib/roman";

type Direction = "toRoman" | "toNumber";

/** A few landmarks people actually look up, used as one-tap examples. */
const EXAMPLES = [4, 9, 14, 40, 49, 90, 400, 1987, 2024, 3999];

export default function RomanNumeralConverter() {
  const [direction, setDirection] = useState<Direction>("toRoman");
  const [numberInput, setNumberInput] = useState("2024");
  const [romanInput, setRomanInput] = useState("MMXXIV");

  const result = useMemo(() => {
    if (direction === "toRoman") {
      const trimmed = numberInput.trim();
      if (!trimmed) return null;
      // Reject "12abc" and "1e3", which Number() would happily coerce.
      if (!/^-?\d+$/.test(trimmed)) {
        return { ok: false as const, error: "Enter a whole number." };
      }
      return toRoman(Number(trimmed));
    }
    if (!romanInput.trim()) return null;
    return fromRoman(romanInput);
  }, [direction, numberInput, romanInput]);

  /** Numeric value of whatever is currently valid, for the breakdown panel. */
  const breakdownValue = useMemo(() => {
    if (!result?.ok) return null;
    const n = direction === "toRoman" ? Number(numberInput.trim()) : Number(result.value);
    return Number.isInteger(n) ? n : null;
  }, [result, direction, numberInput]);

  const swap = () => {
    // Carry the current answer across so swapping continues the same thought
    // rather than resetting to defaults.
    if (result?.ok) {
      if (direction === "toRoman") setRomanInput(result.value);
      else setNumberInput(result.value);
    }
    setDirection((d) => (d === "toRoman" ? "toNumber" : "toRoman"));
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <SegmentedControl
          value={direction}
          onChange={setDirection}
          options={[
            { value: "toRoman", label: "Number to Roman" },
            { value: "toNumber", label: "Roman to number" },
          ]}
        />
        <button
          type="button"
          onClick={swap}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-text-muted transition-colors hover:text-text-primary"
        >
          <ArrowLeftRight className="h-3.5 w-3.5" aria-hidden="true" /> Swap
        </button>
      </div>

      <div className="mt-5">
        <label
          htmlFor="roman-input"
          className="mb-2 block text-sm font-medium text-text-primary"
        >
          {direction === "toRoman" ? "Number (1–3999)" : "Roman numeral"}
        </label>
        <input
          id="roman-input"
          type="text"
          inputMode={direction === "toRoman" ? "numeric" : "text"}
          autoComplete="off"
          spellCheck={false}
          value={direction === "toRoman" ? numberInput : romanInput}
          onChange={(e) =>
            direction === "toRoman"
              ? setNumberInput(e.target.value)
              : setRomanInput(e.target.value.toUpperCase())
          }
          placeholder={direction === "toRoman" ? "2024" : "MMXXIV"}
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 font-mono text-lg text-text-primary placeholder:text-text-muted/50 focus:border-primary focus:outline-none"
        />
      </div>

      {result && (
        <div className="mt-5">
          {result.ok ? (
            <div className="rounded-xl border border-border bg-surface p-5 text-center">
              <p className="label text-text-muted/70">Result</p>
              <p className="mt-1 break-all font-mono text-3xl font-medium text-text-primary sm:text-4xl">
                {result.value}
              </p>
            </div>
          ) : (
            <p
              role="alert"
              className="rounded-lg border border-[#c0563a]/40 bg-[#c0563a]/[0.06] p-3.5 text-sm text-[#9c4828]"
            >
              {result.error}
            </p>
          )}
        </div>
      )}

      {breakdownValue !== null && (
        <div className="mt-5 rounded-xl border border-border bg-surface p-5">
          <h3 className="text-sm font-medium text-text-primary">
            How it breaks down
          </h3>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {explain(breakdownValue).map((p, i) => (
              <span key={i} className="inline-flex items-center gap-2">
                {i > 0 && <span className="text-text-muted">+</span>}
                <span className="rounded-md border border-border bg-background px-2.5 py-1.5 text-center">
                  <span className="block font-mono text-sm font-medium text-text-primary">
                    {p.symbol}
                  </span>
                  <span className="block text-[11px] text-text-muted">
                    {p.value.toLocaleString()}
                  </span>
                </span>
              </span>
            ))}
            <span className="text-text-muted">=</span>
            <span className="font-mono text-sm font-medium text-text-primary">
              {breakdownValue.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      <div className="mt-6">
        <p className="label mb-2 text-text-muted/70">Try one</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => {
                setDirection("toRoman");
                setNumberInput(String(n));
              }}
              className="rounded-md border border-border bg-surface px-3 py-1.5 font-mono text-sm text-text-muted transition-colors hover:border-primary/40 hover:text-text-primary"
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
