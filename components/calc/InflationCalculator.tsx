"use client";

import { useMemo, useState } from "react";
import { grp } from "@/lib/calc";

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

export default function InflationCalculator() {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(6);
  const [years, setYears] = useState(10);

  const { futureCost, buyingPower } = useMemo(() => {
    const factor = Math.pow(1 + rate / 100, years);
    return { futureCost: amount * factor, buyingPower: amount / factor };
  }, [amount, rate, years]);

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Amount today (₹)" value={amount} set={setAmount} />
        <Field label="Inflation rate (% p.a.)" value={rate} set={setRate} step={0.1} />
        <Field label="Number of years" value={years} set={setYears} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-background p-5">
          <p className="label">Future cost</p>
          <p className="mt-1 font-display text-3xl font-medium text-primary">₹{grp(futureCost)}</p>
          <p className="mt-2 text-sm text-text-muted">
            What costs ₹{grp(amount)} today will cost this in {years} years.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-background p-5">
          <p className="label">Future buying power</p>
          <p className="mt-1 font-display text-3xl font-medium text-secondary">₹{grp(buyingPower)}</p>
          <p className="mt-2 text-sm text-text-muted">
            ₹{grp(amount)} today will buy only this much in {years} years&apos; terms.
          </p>
        </div>
      </div>
    </div>
  );
}
