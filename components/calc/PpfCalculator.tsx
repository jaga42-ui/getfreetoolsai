"use client";

import { useMemo, useState } from "react";
import { grp } from "@/lib/calc";

function Field({
  label,
  value,
  set,
  hint,
}: {
  label: string;
  value: number;
  set: (n: number) => void;
  hint?: string;
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
      {hint && <span className="mt-1 block text-xs text-text-muted/80">{hint}</span>}
    </label>
  );
}

export default function PpfCalculator() {
  const [yearly, setYearly] = useState(150000);
  const [rate, setRate] = useState(7.1);
  const [years, setYears] = useState(15);

  const { maturity, invested, interest } = useMemo(() => {
    // PPF: annual deposit, interest compounded yearly. Deposit at the start of
    // the year, interest credited at year end.
    let balance = 0;
    for (let y = 1; y <= years; y++) {
      balance += yearly;
      balance *= 1 + rate / 100;
    }
    const inv = yearly * years;
    return { maturity: balance, invested: inv, interest: balance - inv };
  }, [yearly, rate, years]);

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field
          label="Yearly investment (₹)"
          value={yearly}
          set={setYearly}
          hint="Max ₹1,50,000 per year"
        />
        <Field label="Interest rate (% p.a.)" value={rate} set={setRate} hint="Current: 7.1%" />
        <Field label="Time period (years)" value={years} set={setYears} hint="Min 15 years" />
      </div>

      <div className="mt-6 rounded-xl border border-border bg-background p-5">
        <p className="label">Maturity value</p>
        <p className="mt-1 font-display text-4xl font-medium text-primary">
          ₹{grp(maturity)}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-text-muted">Total invested</p>
            <p className="font-medium text-text-primary">₹{grp(invested)}</p>
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
