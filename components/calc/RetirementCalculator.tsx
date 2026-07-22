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

export default function RetirementCalculator() {
  const [age, setAge] = useState(30);
  const [retireAge, setRetireAge] = useState(60);
  const [lifeExpectancy, setLifeExpectancy] = useState(85);
  const [monthlyExpense, setMonthlyExpense] = useState(50000);
  const [inflation, setInflation] = useState(6);
  const [postReturn, setPostReturn] = useState(8);

  const { corpus, futureMonthly } = useMemo(() => {
    const yearsToRetire = Math.max(0, retireAge - age);
    const retirementYears = Math.max(1, lifeExpectancy - retireAge);
    const futureMonthly = monthlyExpense * Math.pow(1 + inflation / 100, yearsToRetire);
    const futureAnnual = futureMonthly * 12;
    // Real rate keeps the withdrawal growing with inflation through retirement.
    const realRate = (1 + postReturn / 100) / (1 + inflation / 100) - 1;
    let corpus: number;
    if (Math.abs(realRate) < 1e-9) {
      corpus = futureAnnual * retirementYears;
    } else {
      corpus = (futureAnnual * (1 - Math.pow(1 + realRate, -retirementYears))) / realRate;
    }
    return { corpus, futureMonthly };
  }, [age, retireAge, lifeExpectancy, monthlyExpense, inflation, postReturn]);

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Current age" value={age} set={setAge} />
        <Field label="Retirement age" value={retireAge} set={setRetireAge} />
        <Field label="Life expectancy" value={lifeExpectancy} set={setLifeExpectancy} />
        <Field label="Current monthly expense (₹)" value={monthlyExpense} set={setMonthlyExpense} />
        <Field label="Inflation rate (% p.a.)" value={inflation} set={setInflation} step={0.1} />
        <Field label="Return after retirement (% p.a.)" value={postReturn} set={setPostReturn} step={0.1} />
      </div>
      <p className="mt-3 text-xs text-text-muted">
        Estimates the corpus needed at retirement to fund inflation-adjusted
        expenses until your life expectancy. Assumes withdrawals keep pace with
        inflation.
      </p>

      <div className="mt-5 rounded-xl border border-border bg-background p-5">
        <p className="label">Retirement corpus needed</p>
        <p className="mt-1 font-display text-4xl font-medium text-primary">₹{grp(corpus)}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-text-muted">Monthly expense at retirement</p>
            <p className="font-medium text-text-primary">₹{grp(futureMonthly)}</p>
          </div>
          <div>
            <p className="text-text-muted">Years in retirement</p>
            <p className="font-medium text-text-primary">{Math.max(1, lifeExpectancy - retireAge)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
