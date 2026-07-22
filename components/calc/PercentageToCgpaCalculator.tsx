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

export default function PercentageToCgpaCalculator() {
  const [percentage, setPercentage] = useState(80);
  const [divisor, setDivisor] = useState(9.5);

  const cgpa = useMemo(() => (divisor > 0 ? percentage / divisor : 0), [percentage, divisor]);

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Percentage (%)" value={percentage} set={setPercentage} step={0.1} max={100} />
        <Field label="Divisor" value={divisor} set={setDivisor} step={0.1} />
      </div>
      <p className="mt-3 text-xs text-text-muted">
        CBSE uses a divisor of 9.5 (CGPA = Percentage ÷ 9.5). Change it if your
        board or university uses a different factor.
      </p>

      <div className="mt-5 rounded-xl border border-border bg-background p-5">
        <p className="label">CGPA</p>
        <p className="mt-1 font-display text-4xl font-medium text-primary">{fmt(cgpa, 2)}</p>
        <p className="mt-2 text-sm text-text-muted">
          {fmt(percentage, 2)}% ÷ {fmt(divisor, 1)} = {fmt(cgpa, 2)} CGPA
        </p>
      </div>
    </div>
  );
}
