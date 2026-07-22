"use client";

import { useMemo, useState } from "react";
import { usd } from "@/lib/calc";

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

export default function Retirement401kCalculator() {
  const [age, setAge] = useState(30);
  const [retireAge, setRetireAge] = useState(65);
  const [balance, setBalance] = useState(25000);
  const [salary, setSalary] = useState(70000);
  const [contribPct, setContribPct] = useState(6);
  const [matchPct, setMatchPct] = useState(4);
  const [returnPct, setReturnPct] = useState(7);
  const [raisePct, setRaisePct] = useState(2);

  const r = useMemo(() => {
    const years = Math.max(0, Math.round(retireAge - age));
    const monthlyRate = returnPct / 100 / 12;
    let bal = balance;
    let sal = salary;
    let youTotal = 0;
    let employerTotal = 0;
    for (let y = 0; y < years; y++) {
      const employeeAnnual = (sal * contribPct) / 100;
      // Employer matches up to matchPct of salary, never more than you put in.
      const employerAnnual = (sal * Math.min(contribPct, matchPct)) / 100;
      const monthlyContrib = (employeeAnnual + employerAnnual) / 12;
      for (let m = 0; m < 12; m++) bal = bal * (1 + monthlyRate) + monthlyContrib;
      youTotal += employeeAnnual;
      employerTotal += employerAnnual;
      sal *= 1 + raisePct / 100;
    }
    const growth = bal - balance - youTotal - employerTotal;
    return { years, corpus: bal, youTotal, employerTotal, growth };
  }, [age, retireAge, balance, salary, contribPct, matchPct, returnPct, raisePct]);

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Current age" value={age} set={setAge} />
        <Field label="Retirement age" value={retireAge} set={setRetireAge} />
        <Field label="Current 401(k) balance ($)" value={balance} set={setBalance} />
        <Field label="Annual salary ($)" value={salary} set={setSalary} />
        <Field label="Your contribution (% of salary)" value={contribPct} set={setContribPct} step={0.5} />
        <Field label="Employer match (% of salary)" value={matchPct} set={setMatchPct} step={0.5} />
        <Field label="Annual return (%)" value={returnPct} set={setReturnPct} step={0.1} />
        <Field label="Annual raise (%)" value={raisePct} set={setRaisePct} step={0.1} />
      </div>

      <div className="mt-6 rounded-xl border border-border bg-background p-5">
        <p className="label">Balance at age {retireAge}</p>
        <p className="mt-1 font-display text-4xl font-medium text-primary">
          {usd(r.corpus)}
        </p>
        <p className="mt-1 text-xs text-text-muted">
          After {r.years} years of contributions
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 border-t border-border pt-4 text-sm sm:grid-cols-3">
          <div>
            <p className="text-text-muted">Your contributions</p>
            <p className="font-medium text-text-primary">{usd(r.youTotal)}</p>
          </div>
          <div>
            <p className="text-text-muted">Employer match</p>
            <p className="font-medium text-text-primary">{usd(r.employerTotal)}</p>
          </div>
          <div>
            <p className="text-text-muted">Investment growth</p>
            <p className="font-medium text-secondary">{usd(r.growth)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
