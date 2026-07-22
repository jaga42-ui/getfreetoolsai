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

export default function SwpCalculator() {
  const [corpus, setCorpus] = useState(1000000);
  const [withdrawal, setWithdrawal] = useState(10000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(10);

  const { finalBalance, totalWithdrawn, lastedMonths, exhausted } = useMemo(() => {
    const i = rate / 12 / 100;
    const months = Math.round(years * 12);
    let bal = corpus;
    let withdrawn = 0;
    let m = 0;
    for (; m < months; m++) {
      bal = bal * (1 + i);
      if (bal >= withdrawal) {
        bal -= withdrawal;
        withdrawn += withdrawal;
      } else {
        withdrawn += bal;
        bal = 0;
        m++;
        break;
      }
    }
    return {
      finalBalance: bal,
      totalWithdrawn: withdrawn,
      lastedMonths: m,
      exhausted: bal <= 0 && m < months,
    };
  }, [corpus, withdrawal, rate, years]);

  const yrs = Math.floor(lastedMonths / 12);
  const mos = lastedMonths % 12;

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Total investment (₹)" value={corpus} set={setCorpus} />
        <Field label="Monthly withdrawal (₹)" value={withdrawal} set={setWithdrawal} />
        <Field label="Expected return (% p.a.)" value={rate} set={setRate} step={0.1} />
        <Field label="Tenure (years)" value={years} set={setYears} />
      </div>

      <div className="mt-6 rounded-xl border border-border bg-background p-5">
        <p className="label">Final value</p>
        <p className="mt-1 font-display text-4xl font-medium text-primary">₹{grp(finalBalance)}</p>
        {exhausted && (
          <p className="mt-1 text-xs font-medium text-red-400">
            Corpus runs out after {yrs > 0 ? `${yrs} yr${yrs > 1 ? "s" : ""} ` : ""}
            {mos > 0 ? `${mos} mo` : ""} — before the full tenure.
          </p>
        )}
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-text-muted">Total invested</p>
            <p className="font-medium text-text-primary">₹{grp(corpus)}</p>
          </div>
          <div>
            <p className="text-text-muted">Total withdrawn</p>
            <p className="font-medium text-secondary">₹{grp(totalWithdrawn)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
