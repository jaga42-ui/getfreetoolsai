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

// NSC has a fixed 5-year tenure with annually-compounded interest.
const TENURE_YEARS = 5;

export default function NscCalculator() {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(7.7);

  const { maturity, interest } = useMemo(() => {
    const m = amount * Math.pow(1 + rate / 100, TENURE_YEARS);
    return { maturity: m, interest: m - amount };
  }, [amount, rate]);

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Investment amount (₹)" value={amount} set={setAmount} />
        <Field label="Interest rate (% p.a.)" value={rate} set={setRate} step={0.1} />
      </div>
      <p className="mt-3 text-xs text-text-muted">
        NSC has a fixed 5-year tenure with interest compounded annually.
      </p>

      <div className="mt-5 rounded-xl border border-border bg-background p-5">
        <p className="label">Maturity value (after 5 years)</p>
        <p className="mt-1 font-display text-4xl font-medium text-primary">₹{grp(maturity)}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-text-muted">Amount invested</p>
            <p className="font-medium text-text-primary">₹{grp(amount)}</p>
          </div>
          <div>
            <p className="text-text-muted">Total interest</p>
            <p className="font-medium text-secondary">₹{grp(interest)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
