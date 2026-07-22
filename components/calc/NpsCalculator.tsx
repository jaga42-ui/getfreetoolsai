"use client";

import { useMemo, useState } from "react";
import { grp } from "@/lib/calc";

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

export default function NpsCalculator() {
  const [age, setAge] = useState(30);
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(9);
  const [annuityPct, setAnnuityPct] = useState(40);
  const [annuityRate, setAnnuityRate] = useState(6);

  const r = useMemo(() => {
    const years = Math.max(0, 60 - age);
    const n = years * 12;
    const i = rate / 12 / 100;
    const invested = monthly * n;
    const corpus =
      i === 0 ? invested : monthly * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const annuityCorpus = (corpus * annuityPct) / 100;
    const lumpSum = corpus - annuityCorpus;
    const pension = (annuityCorpus * (annuityRate / 100)) / 12;
    return { years, invested, corpus, annuityCorpus, lumpSum, pension };
  }, [age, monthly, rate, annuityPct, annuityRate]);

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your current age" value={age} set={setAge} min={18} />
        <Field label="Monthly contribution (₹)" value={monthly} set={setMonthly} />
        <Field label="Expected return (% p.a.)" value={rate} set={setRate} step={0.1} />
        <Field label="Annuity purchased (%)" value={annuityPct} set={setAnnuityPct} min={40} />
        <Field label="Annuity return (% p.a.)" value={annuityRate} set={setAnnuityRate} step={0.1} />
      </div>

      <div className="mt-6 rounded-xl border border-border bg-background p-5">
        <p className="label">Corpus at age 60</p>
        <p className="mt-1 font-display text-4xl font-medium text-primary">
          ₹{grp(r.corpus)}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          <div>
            <p className="text-text-muted">Total invested</p>
            <p className="font-medium text-text-primary">₹{grp(r.invested)}</p>
          </div>
          <div>
            <p className="text-text-muted">Lump sum (tax-free)</p>
            <p className="font-medium text-text-primary">₹{grp(r.lumpSum)}</p>
          </div>
          <div>
            <p className="text-text-muted">Monthly pension</p>
            <p className="font-medium text-secondary">₹{grp(r.pension)}</p>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-text-muted">
        At 60 you must use at least 40% of the corpus to buy an annuity (your
        pension); the rest can be withdrawn tax-free. Figures assume contributions
        continue until 60 and are estimates only.
      </p>
    </div>
  );
}
