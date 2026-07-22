"use client";

import { useMemo, useState } from "react";
import { grp, fmt } from "@/lib/calc";

function Field({ label, value, set, min = 0, step }: { label: string; value: number; set: (n: number) => void; min?: number; step?: number }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-text-muted">{label}</span>
      <input
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
      />
    </label>
  );
}

export default function CagrCalculator() {
  const [initial, setInitial] = useState(100000);
  const [final, setFinal] = useState(250000);
  const [years, setYears] = useState(5);

  const { cagr, totalReturn, gain } = useMemo(() => {
    if (initial <= 0 || years <= 0) return { cagr: 0, totalReturn: 0, gain: final - initial };
    const c = (Math.pow(final / initial, 1 / years) - 1) * 100;
    const tr = ((final - initial) / initial) * 100;
    return { cagr: c, totalReturn: tr, gain: final - initial };
  }, [initial, final, years]);

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Initial value (₹)" value={initial} set={setInitial} />
        <Field label="Final value (₹)" value={final} set={setFinal} />
        <Field label="Duration (years)" value={years} set={setYears} step={0.5} />
      </div>

      <div className="mt-6 rounded-xl border border-border bg-background p-5">
        <p className="label">CAGR</p>
        <p className="mt-1 font-display text-4xl font-medium text-primary">{fmt(cagr, 2)}%</p>
        <p className="mt-1 text-xs text-text-muted">Compound annual growth rate</p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-text-muted">Absolute return</p>
            <p className="font-medium text-text-primary">{fmt(totalReturn, 2)}%</p>
          </div>
          <div>
            <p className="text-text-muted">Total gain</p>
            <p className="font-medium text-secondary">₹{grp(gain)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
