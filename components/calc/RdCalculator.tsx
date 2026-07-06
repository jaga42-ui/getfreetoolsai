"use client";

import { useMemo, useState } from "react";
import { grp } from "@/lib/calc";

function Field({
  label,
  value,
  set,
}: {
  label: string;
  value: number;
  set: (n: number) => void;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-text-muted">{label}</span>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
      />
    </label>
  );
}

export default function RdCalculator() {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(7);
  const [months, setMonths] = useState(60);

  const { maturity, invested, interest } = useMemo(() => {
    // Indian RDs compound quarterly. Simulate month by month: add the deposit
    // each month, and credit interest at the end of every quarter.
    let balance = 0;
    const q = rate / 400; // quarterly rate
    for (let m = 1; m <= months; m++) {
      balance += monthly;
      if (m % 3 === 0) balance *= 1 + q;
    }
    // Credit a partial quarter of interest on any leftover months.
    const leftover = months % 3;
    if (leftover > 0) balance *= 1 + (q * leftover) / 3;
    const inv = monthly * months;
    return { maturity: balance, invested: inv, interest: balance - inv };
  }, [monthly, rate, months]);

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Monthly deposit (₹)" value={monthly} set={setMonthly} />
        <Field label="Interest rate (% p.a.)" value={rate} set={setRate} />
        <Field label="Tenure (months)" value={months} set={setMonths} />
      </div>

      <div className="mt-6 rounded-xl border border-border bg-background p-5">
        <p className="label">Maturity value</p>
        <p className="mt-1 font-display text-4xl font-medium text-primary">
          ₹{grp(maturity)}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-text-muted">Total deposited</p>
            <p className="font-medium text-text-primary">₹{grp(invested)}</p>
          </div>
          <div>
            <p className="text-text-muted">Interest earned</p>
            <p className="font-medium text-secondary">₹{grp(interest)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
