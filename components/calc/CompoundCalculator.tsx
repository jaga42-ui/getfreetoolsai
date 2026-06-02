"use client";

import { useMemo, useState } from "react";
import { grp, fmt } from "@/lib/calc";

const FREQ = [
  { label: "Annually", n: 1 },
  { label: "Semi-annually", n: 2 },
  { label: "Quarterly", n: 4 },
  { label: "Monthly", n: 12 },
  { label: "Daily", n: 365 },
];

export default function CompoundCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(5);
  const [freq, setFreq] = useState(12);
  const [monthly, setMonthly] = useState(0);
  const [showTable, setShowTable] = useState(false);

  const { finalAmt, interest, contributed, ear } = useMemo(() => {
    const r = rate / 100;
    const i = r / freq;
    const N = freq * years;
    const fvPrincipal = principal * Math.pow(1 + i, N);
    // Monthly contributions converted to the compounding period.
    const totalContrib = monthly * 12 * years;
    // Approximate contributions as periodic deposits of (monthly*12/freq).
    const perPeriod = (monthly * 12) / freq;
    const fvContrib =
      i === 0 ? perPeriod * N : perPeriod * ((Math.pow(1 + i, N) - 1) / i);
    const fin = fvPrincipal + fvContrib;
    return {
      finalAmt: fin,
      interest: fin - principal - totalContrib,
      contributed: principal + totalContrib,
      ear: (Math.pow(1 + i, freq) - 1) * 100,
    };
  }, [principal, rate, years, freq, monthly]);

  const table = useMemo(() => {
    if (!showTable) return [];
    const r = rate / 100;
    const i = r / freq;
    const perPeriod = (monthly * 12) / freq;
    const rows: { year: number; balance: number }[] = [];
    let bal = principal;
    for (let y = 1; y <= years; y++) {
      for (let p = 0; p < freq; p++) bal = bal * (1 + i) + perPeriod;
      rows.push({ year: y, balance: bal });
    }
    return rows;
  }, [showTable, principal, rate, years, freq, monthly]);

  const field = (label: string, value: number, set: (n: number) => void) => (
    <label className="block text-sm">
      <span className="mb-1 block text-text-muted">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
      />
    </label>
  );

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {field("Principal amount (₹)", principal, setPrincipal)}
        {field("Annual interest rate (%)", rate, setRate)}
        {field("Time period (years)", years, setYears)}
        <label className="block text-sm">
          <span className="mb-1 block text-text-muted">Compounding</span>
          <select
            value={freq}
            onChange={(e) => setFreq(Number(e.target.value))}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
          >
            {FREQ.map((f) => (
              <option key={f.n} value={f.n}>
                {f.label}
              </option>
            ))}
          </select>
        </label>
        {field("Extra monthly deposit (₹, optional)", monthly, setMonthly)}
      </div>

      <div className="mt-6 rounded-xl border border-border bg-background p-5">
        <p className="label">Final amount</p>
        <p className="mt-1 font-display text-4xl font-medium text-primary">
          ₹{grp(finalAmt)}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-text-muted">Total invested</p>
            <p className="font-medium text-text-primary">₹{grp(contributed)}</p>
          </div>
          <div>
            <p className="text-text-muted">Interest earned</p>
            <p className="font-medium text-text-primary">₹{grp(interest)}</p>
          </div>
          <div className="col-span-2">
            <p className="text-text-muted">Effective annual rate (EAR)</p>
            <p className="font-medium text-text-primary">{fmt(ear)}%</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowTable((s) => !s)}
        className="mt-4 rounded-md border border-border px-4 py-2 text-sm text-text-muted hover:text-text-primary"
      >
        {showTable ? "Hide yearly breakdown" : "Show yearly breakdown"}
      </button>

      {showTable && (
        <div className="mt-4 max-h-80 overflow-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-background text-text-muted">
              <tr>
                <th className="p-2">Year</th>
                <th className="p-2">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {table.map((r) => (
                <tr key={r.year} className="text-text-primary">
                  <td className="p-2">{r.year}</td>
                  <td className="p-2">₹{grp(r.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
