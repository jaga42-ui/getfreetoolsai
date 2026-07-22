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

// SSY: deposits for 15 years, account matures 21 years after opening.
const DEPOSIT_YEARS = 15;
const MATURITY_YEARS = 21;

export default function SsyCalculator() {
  const [yearlyDeposit, setYearlyDeposit] = useState(50000);
  const [rate, setRate] = useState(8.2);

  const { maturity, deposited, interest } = useMemo(() => {
    let bal = 0;
    for (let year = 1; year <= MATURITY_YEARS; year++) {
      if (year <= DEPOSIT_YEARS) bal += yearlyDeposit;
      bal = bal * (1 + rate / 100);
    }
    const dep = yearlyDeposit * DEPOSIT_YEARS;
    return { maturity: bal, deposited: dep, interest: bal - dep };
  }, [yearlyDeposit, rate]);

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Yearly deposit (₹)" value={yearlyDeposit} set={setYearlyDeposit} />
        <Field label="Interest rate (% p.a.)" value={rate} set={setRate} step={0.1} />
      </div>
      <p className="mt-3 text-xs text-text-muted">
        Deposits run for 15 years; the account matures 21 years after it&apos;s opened.
      </p>

      <div className="mt-5 rounded-xl border border-border bg-background p-5">
        <p className="label">Maturity value (after 21 years)</p>
        <p className="mt-1 font-display text-4xl font-medium text-primary">₹{grp(maturity)}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-text-muted">Total deposited</p>
            <p className="font-medium text-text-primary">₹{grp(deposited)}</p>
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
