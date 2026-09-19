"use client";

import { useMemo, useState } from "react";
import { Download, Printer } from "lucide-react";
import { grp, fmt, compactInr, toCsv } from "@/lib/calc";
import { downloadBlob } from "@/lib/utils";
import { StackedAreaChart, SplitBar } from "@/components/calc/charts";

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

  /**
   * Year-by-year schedule, simulated period by period. The chart, the summary
   * figures and the table all read from this one pass, so the headline number
   * can never disagree with the last row of the schedule.
   */
  const rows = useMemo(() => {
    const i = rate / 100 / freq;
    const perPeriod = (monthly * 12) / freq;
    const out: {
      year: number;
      opening: number;
      contributed: number;
      interest: number;
      balance: number;
    }[] = [];
    let bal = principal;
    let contributed = principal;
    const n = Math.max(0, Math.min(100, Math.floor(years)));
    for (let y = 1; y <= n; y++) {
      const opening = bal;
      for (let p = 0; p < freq; p++) {
        bal = bal * (1 + i) + perPeriod;
        contributed += perPeriod;
      }
      out.push({
        year: y,
        opening,
        contributed,
        interest: bal - contributed,
        balance: bal,
      });
    }
    return out;
  }, [principal, rate, years, freq, monthly]);

  const last = rows[rows.length - 1];
  const finalAmt = last ? last.balance : principal;
  const contributed = last ? last.contributed : principal;
  const interest = finalAmt - contributed;
  const ear = (Math.pow(1 + rate / 100 / freq, freq) - 1) * 100;

  const chartPoints = useMemo(
    () => [
      { label: "0", contributed: principal, interest: 0 },
      ...rows.map((r) => ({
        label: String(r.year),
        contributed: r.contributed,
        interest: Math.max(0, r.interest),
      })),
    ],
    [rows, principal]
  );

  const exportCsv = () => {
    const csv = toCsv([
      ["Compound interest schedule"],
      ["Principal", principal],
      ["Annual rate (%)", rate],
      ["Compounding periods per year", freq],
      ["Monthly deposit", monthly],
      ["Term (years)", years],
      [],
      ["Year", "Opening balance", "Total invested", "Interest earned", "Closing balance"],
      ...rows.map((r) => [
        r.year,
        Math.round(r.opening),
        Math.round(r.contributed),
        Math.round(r.interest),
        Math.round(r.balance),
      ]),
    ]);
    downloadBlob(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
      "compound-interest-schedule.csv"
    );
  };

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

        <div className="mt-5 border-t border-border pt-4">
          <SplitBar
            contributed={contributed}
            interest={Math.max(0, interest)}
            format={(n) => `₹${grp(n)}`}
            contributedLabel="Invested"
            interestLabel="Interest"
          />
        </div>
      </div>

      {rows.length > 0 && (
        <div className="mt-6 rounded-xl border border-border bg-background p-4 sm:p-5">
          <p className="label mb-3">Growth over time</p>
          <StackedAreaChart
            points={chartPoints}
            format={(n) => `₹${compactInr(n)}`}
            contributedLabel="Invested"
            interestLabel="Interest"
            caption={`Stacked area chart of the balance over ${rows.length} years, split into money invested and interest earned. The balance grows from ₹${grp(
              principal
            )} to ₹${grp(finalAmt)}.`}
          />
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setShowTable((s) => !s)}
          className="rounded-md border border-border px-4 py-2 text-sm text-text-muted transition-colors hover:text-text-primary"
        >
          {showTable ? "Hide yearly breakdown" : "Show yearly breakdown"}
        </button>
        <button
          onClick={exportCsv}
          disabled={rows.length === 0}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm text-text-muted transition-colors hover:text-text-primary disabled:opacity-40"
        >
          <Download className="h-3.5 w-3.5" aria-hidden width={14} height={14} />
          Export schedule (CSV)
        </button>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm text-text-muted transition-colors hover:text-text-primary"
        >
          <Printer className="h-3.5 w-3.5" aria-hidden width={14} height={14} />
          Print summary
        </button>
      </div>

      {showTable && (
        <div className="mt-4 max-h-80 overflow-auto rounded-xl border border-border">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="sticky top-0 bg-background text-text-muted">
              <tr>
                <th className="p-2 font-medium">Year</th>
                <th className="p-2 font-medium">Invested</th>
                <th className="p-2 font-medium">Interest</th>
                <th className="p-2 font-medium">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r.year} className="text-text-primary">
                  <td className="p-2">{r.year}</td>
                  <td className="p-2">₹{grp(r.contributed)}</td>
                  <td className="p-2">₹{grp(Math.max(0, r.interest))}</td>
                  <td className="p-2 font-medium">₹{grp(r.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
