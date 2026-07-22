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

// Employee 12% + employer 3.67% go to the EPF corpus. The employer's remaining
// 8.33% funds EPS (pension) and is not part of the EPF balance.
const EMP_PCT = 12;
const ER_EPF_PCT = 3.67;

export default function EpfCalculator() {
  const [age, setAge] = useState(30);
  const [retireAge, setRetireAge] = useState(58);
  const [basic, setBasic] = useState(30000);
  const [balance, setBalance] = useState(200000);
  const [hike, setHike] = useState(5);
  const [rate, setRate] = useState(8.25);

  const { corpus, empTotal, erTotal, interest } = useMemo(() => {
    const years = Math.max(0, Math.round(retireAge - age));
    const i = rate / 12 / 100;
    let bal = balance;
    let salary = basic;
    let empTotal = 0;
    let erTotal = 0;
    for (let y = 0; y < years; y++) {
      const empMonthly = (salary * EMP_PCT) / 100;
      const erMonthly = (salary * ER_EPF_PCT) / 100;
      const contrib = empMonthly + erMonthly;
      for (let m = 0; m < 12; m++) bal = bal * (1 + i) + contrib;
      empTotal += empMonthly * 12;
      erTotal += erMonthly * 12;
      salary *= 1 + hike / 100;
    }
    return { corpus: bal, empTotal, erTotal, interest: bal - balance - empTotal - erTotal };
  }, [age, retireAge, basic, balance, hike, rate]);

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Current age" value={age} set={setAge} />
        <Field label="Retirement age" value={retireAge} set={setRetireAge} />
        <Field label="Monthly basic + DA (₹)" value={basic} set={setBasic} />
        <Field label="Current EPF balance (₹)" value={balance} set={setBalance} />
        <Field label="Annual salary hike (%)" value={hike} set={setHike} step={0.5} />
        <Field label="Interest rate (% p.a.)" value={rate} set={setRate} step={0.05} />
      </div>
      <p className="mt-3 text-xs text-text-muted">
        Assumes employee 12% + employer 3.67% of basic go to EPF. The
        employer&apos;s other 8.33% funds EPS (pension) and isn&apos;t counted here.
      </p>

      <div className="mt-5 rounded-xl border border-border bg-background p-5">
        <p className="label">EPF corpus at retirement</p>
        <p className="mt-1 font-display text-4xl font-medium text-primary">₹{grp(corpus)}</p>
        <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
          <div>
            <p className="text-text-muted">Your contribution</p>
            <p className="font-medium text-text-primary">₹{grp(empTotal)}</p>
          </div>
          <div>
            <p className="text-text-muted">Employer (EPF)</p>
            <p className="font-medium text-text-primary">₹{grp(erTotal)}</p>
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
