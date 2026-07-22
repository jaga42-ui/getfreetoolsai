"use client";

import { useMemo, useState } from "react";
import { SegmentedControl } from "@/components/ui";
import { grp } from "@/lib/calc";

type Unit = "years" | "months";

function Field({
  label,
  value,
  set,
  min = 0,
  step,
}: {
  label: string;
  value: number;
  set: (n: number) => void;
  min?: number;
  step?: number;
}) {
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

export default function SimpleInterestCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(8);
  const [term, setTerm] = useState(5);
  const [unit, setUnit] = useState<Unit>("years");

  const { interest, total, years } = useMemo(() => {
    const t = unit === "years" ? term : term / 12;
    const si = (principal * rate * t) / 100;
    return { interest: si, total: principal + si, years: t };
  }, [principal, rate, term, unit]);

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Principal amount (₹)" value={principal} set={setPrincipal} />
        <Field label="Interest rate (% p.a.)" value={rate} set={setRate} step={0.1} />
        <Field label={`Time period (${unit})`} value={term} set={setTerm} step={0.5} />
      </div>

      <div className="mt-4">
        <span className="mb-1.5 block text-sm text-text-muted">Time unit</span>
        <SegmentedControl<Unit>
          value={unit}
          onChange={setUnit}
          options={[
            { value: "years", label: "Years" },
            { value: "months", label: "Months" },
          ]}
        />
      </div>

      <div className="mt-6 rounded-xl border border-border bg-background p-5">
        <p className="label">Total amount</p>
        <p className="mt-1 font-display text-4xl font-medium text-primary">
          ₹{grp(total)}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-text-muted">Principal</p>
            <p className="font-medium text-text-primary">₹{grp(principal)}</p>
          </div>
          <div>
            <p className="text-text-muted">Interest earned</p>
            <p className="font-medium text-secondary">₹{grp(interest)}</p>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-text-muted">
        Simple interest = P × R × T ÷ 100, using {grp(principal)} × {rate}% ×{" "}
        {years % 1 === 0 ? years : years.toFixed(2)} year
        {years === 1 ? "" : "s"}.
      </p>
    </div>
  );
}
