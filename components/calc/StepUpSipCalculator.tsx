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

export default function StepUpSipCalculator() {
  const [monthly, setMonthly] = useState(10000);
  const [stepUp, setStepUp] = useState(10);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(15);

  const { maturity, invested, returns } = useMemo(() => {
    const i = rate / 12 / 100;
    let balance = 0;
    let invested = 0;
    for (let m = 0; m < years * 12; m++) {
      const yearIndex = Math.floor(m / 12);
      const sip = monthly * Math.pow(1 + stepUp / 100, yearIndex);
      balance = balance * (1 + i) + sip;
      invested += sip;
    }
    return { maturity: balance, invested, returns: balance - invested };
  }, [monthly, stepUp, rate, years]);

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Monthly SIP (₹)" value={monthly} set={setMonthly} />
        <Field label="Annual step-up (%)" value={stepUp} set={setStepUp} step={0.5} />
        <Field label="Expected return (% p.a.)" value={rate} set={setRate} step={0.1} />
        <Field label="Time period (years)" value={years} set={setYears} />
      </div>

      <div className="mt-6 rounded-xl border border-border bg-background p-5">
        <p className="label">Maturity value</p>
        <p className="mt-1 font-display text-4xl font-medium text-primary">₹{grp(maturity)}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-text-muted">Total invested</p>
            <p className="font-medium text-text-primary">₹{grp(invested)}</p>
          </div>
          <div>
            <p className="text-text-muted">Estimated returns</p>
            <p className="font-medium text-secondary">₹{grp(returns)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
