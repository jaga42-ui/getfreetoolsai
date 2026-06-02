"use client";

import { useMemo, useState } from "react";
import { SegmentedControl } from "@/components/ui";
import { grp, monthlyPayment, amortization } from "@/lib/calc";

function Donut({ principal, interest }: { principal: number; interest: number }) {
  const total = principal + interest || 1;
  const pPct = (principal / total) * 100;
  const C = 2 * Math.PI * 42;
  const pLen = (pPct / 100) * C;
  return (
    <div className="flex items-center gap-5">
      <svg viewBox="0 0 100 100" className="h-32 w-32 -rotate-90">
        <circle cx="50" cy="50" r="42" fill="none" stroke="#4b6b4e" strokeWidth="14" />
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="#b25733"
          strokeWidth="14"
          strokeDasharray={`${C - pLen} ${pLen}`}
          strokeDashoffset={C - pLen}
        />
      </svg>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-secondary" />
          <span className="text-text-muted">
            Principal · {pPct.toFixed(1)}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-primary" />
          <span className="text-text-muted">
            Interest · {(100 - pPct).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default function EmiCalculator() {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(10);
  const [tenure, setTenure] = useState(5);
  const [unit, setUnit] = useState<"years" | "months">("years");
  const [showSchedule, setShowSchedule] = useState(false);

  const months = unit === "years" ? tenure * 12 : tenure;
  const emi = useMemo(
    () => monthlyPayment(amount, rate, months),
    [amount, rate, months]
  );
  const totalPay = emi * months;
  const totalInterest = totalPay - amount;
  const schedule = useMemo(
    () => (showSchedule ? amortization(amount, rate, months, emi) : []),
    [showSchedule, amount, rate, months, emi]
  );

  const field = (
    label: string,
    value: number,
    set: (n: number) => void,
    props: { min?: number; max?: number; step?: number; placeholder?: string } = {}
  ) => (
    <label className="block text-sm">
      <span className="mb-1 block text-text-muted">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        {...props}
        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
      />
    </label>
  );

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {field("Loan amount (₹)", amount, setAmount, { min: 1000, placeholder: "e.g. 500000" })}
        {field("Annual interest rate (%)", rate, setRate, { min: 0.1, max: 50, step: 0.1, placeholder: "e.g. 8.5" })}
        <div>
          {field("Loan tenure", tenure, setTenure, { min: 1 })}
        </div>
        <div className="flex items-end">
          <SegmentedControl<"years" | "months">
            value={unit}
            onChange={setUnit}
            options={[
              { value: "years", label: "Years" },
              { value: "months", label: "Months" },
            ]}
          />
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-background p-5">
        <p className="label">Monthly EMI</p>
        <p className="mt-1 font-display text-4xl font-medium text-primary">
          ₹{grp(emi)}
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
          <Donut principal={amount} interest={Math.max(0, totalInterest)} />
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-text-muted">Principal</p>
              <p className="font-medium text-text-primary">₹{grp(amount)}</p>
            </div>
            <div>
              <p className="text-text-muted">Total interest</p>
              <p className="font-medium text-text-primary">₹{grp(Math.max(0, totalInterest))}</p>
            </div>
            <div className="col-span-2">
              <p className="text-text-muted">Total amount payable</p>
              <p className="font-medium text-text-primary">₹{grp(totalPay)}</p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowSchedule((s) => !s)}
        className="mt-4 rounded-md border border-border px-4 py-2 text-sm text-text-muted hover:text-text-primary"
      >
        {showSchedule ? "Hide payment schedule" : "Show payment schedule"}
      </button>

      {showSchedule && (
        <div className="mt-4 max-h-96 overflow-auto rounded-xl border border-border">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-background text-text-muted">
              <tr>
                <th className="p-2">Month</th>
                <th className="p-2">Opening</th>
                <th className="p-2">EMI</th>
                <th className="p-2">Principal</th>
                <th className="p-2">Interest</th>
                <th className="p-2">Closing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {schedule.map((r) => (
                <tr key={r.month} className="text-text-primary">
                  <td className="p-2">{r.month}</td>
                  <td className="p-2">₹{grp(r.opening)}</td>
                  <td className="p-2">₹{grp(r.emi)}</td>
                  <td className="p-2">₹{grp(r.principal)}</td>
                  <td className="p-2">₹{grp(r.interest)}</td>
                  <td className="p-2">₹{grp(r.closing)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
