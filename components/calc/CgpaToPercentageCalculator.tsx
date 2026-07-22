"use client";

import { useMemo, useState } from "react";
import { fmt } from "@/lib/calc";

function Field({ label, value, set, min = 0, step, max }: { label: string; value: number; set: (n: number) => void; min?: number; step?: number; max?: number }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-text-muted">{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
      />
    </label>
  );
}

export default function CgpaToPercentageCalculator() {
  const [cgpa, setCgpa] = useState(8.5);
  const [multiplier, setMultiplier] = useState(9.5);

  const percentage = useMemo(() => cgpa * multiplier, [cgpa, multiplier]);

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="CGPA (out of 10)" value={cgpa} set={setCgpa} step={0.1} max={10} />
        <Field label="Multiplier" value={multiplier} set={setMultiplier} step={0.1} />
      </div>
      <p className="mt-3 text-xs text-text-muted">
        CBSE uses a multiplier of 9.5 (Percentage = CGPA × 9.5). Change it if your
        board or university uses a different factor.
      </p>

      <div className="mt-5 rounded-xl border border-border bg-background p-5">
        <p className="label">Percentage</p>
        <p className="mt-1 font-display text-4xl font-medium text-primary">{fmt(percentage, 2)}%</p>
        <p className="mt-2 text-sm text-text-muted">
          {fmt(cgpa, 2)} CGPA × {fmt(multiplier, 1)} = {fmt(percentage, 2)}%
        </p>
      </div>
    </div>
  );
}
