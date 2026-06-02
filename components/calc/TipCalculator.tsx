"use client";

import { useState } from "react";
import { fmt } from "@/lib/calc";

const PRESETS = [10, 15, 18, 20, 25];

export default function TipCalculator() {
  const [bill, setBill] = useState(1000);
  const [tipPct, setTipPct] = useState(15);
  const [people, setPeople] = useState(2);

  const tip = (bill * tipPct) / 100;
  const total = bill + tip;
  const per = people > 0 ? total / people : total;
  const perTip = people > 0 ? tip / people : tip;

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block text-text-muted">Bill amount (₹)</span>
          <input
            type="number"
            value={bill}
            onChange={(e) => setBill(Number(e.target.value))}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-text-muted">Number of people</span>
          <input
            type="number"
            min={1}
            value={people}
            onChange={(e) => setPeople(Math.max(1, Number(e.target.value)))}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
          />
        </label>
      </div>

      <div className="mt-4">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-text-muted">
          Tip percentage
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => setTipPct(p)}
              className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                tipPct === p
                  ? "border-primary bg-primary/10 text-text-primary"
                  : "border-border text-text-muted hover:text-text-primary"
              }`}
            >
              {p}%
            </button>
          ))}
          <input
            type="number"
            value={tipPct}
            onChange={(e) => setTipPct(Number(e.target.value))}
            className="w-20 rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-text-primary focus:border-primary focus:outline-none"
            aria-label="Custom tip percentage"
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 rounded-xl border border-border bg-background p-5 sm:grid-cols-2">
        <div>
          <p className="text-text-muted">Tip amount</p>
          <p className="font-display text-2xl font-medium text-text-primary">₹{fmt(tip)}</p>
        </div>
        <div>
          <p className="text-text-muted">Total with tip</p>
          <p className="font-display text-2xl font-medium text-text-primary">₹{fmt(total)}</p>
        </div>
        <div>
          <p className="text-text-muted">Per person</p>
          <p className="font-display text-2xl font-medium text-primary">₹{fmt(per)}</p>
        </div>
        <div>
          <p className="text-text-muted">Tip per person</p>
          <p className="font-display text-2xl font-medium text-text-primary">₹{fmt(perTip)}</p>
        </div>
      </div>
    </div>
  );
}
