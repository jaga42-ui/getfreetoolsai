"use client";

import { useMemo, useState } from "react";
import { grp, fmt, monthlyPayment, amortization } from "@/lib/calc";

const TYPES = ["Personal", "Home", "Car", "Education", "Other"];

export default function LoanCalculator() {
  const [amount, setAmount] = useState(1000000);
  const [rate, setRate] = useState(9);
  const [years, setYears] = useState(10);
  const [type, setType] = useState("Home");
  const [extra, setExtra] = useState(0);
  const [showSchedule, setShowSchedule] = useState(false);

  const months = years * 12;
  const base = useMemo(() => monthlyPayment(amount, rate, months), [amount, rate, months]);
  const schedule = useMemo(
    () => amortization(amount, rate, months, base + extra),
    [amount, rate, months, base, extra]
  );
  const payoffMonths = schedule.length;
  const totalInterest = schedule.reduce((s, r) => s + r.interest, 0);
  const totalPay = amount + totalInterest;
  const payoff = new Date();
  payoff.setMonth(payoff.getMonth() + payoffMonths);

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
        {field("Loan amount (₹)", amount, setAmount)}
        {field("Annual interest rate (%)", rate, setRate)}
        {field("Loan term (years)", years, setYears)}
        <label className="block text-sm">
          <span className="mb-1 block text-text-muted">Loan type</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
          >
            {TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        {field("Extra monthly payment (₹, optional)", extra, setExtra)}
      </div>

      <div className="mt-6 rounded-xl border border-border bg-background p-5">
        <p className="label">Monthly payment</p>
        <p className="mt-1 font-display text-4xl font-medium text-primary">
          ₹{grp(base + extra)}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-text-muted">Total payment</p>
            <p className="font-medium text-text-primary">₹{grp(totalPay)}</p>
          </div>
          <div>
            <p className="text-text-muted">Total interest</p>
            <p className="font-medium text-text-primary">₹{grp(totalInterest)}</p>
          </div>
          <div>
            <p className="text-text-muted">Interest as % of total</p>
            <p className="font-medium text-text-primary">
              {totalPay > 0 ? fmt((totalInterest / totalPay) * 100, 1) : "0"}%
            </p>
          </div>
          <div>
            <p className="text-text-muted">Payoff date</p>
            <p className="font-medium text-text-primary">
              {payoff.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              {extra > 0 && payoffMonths < months ? ` (${months - payoffMonths} mo early)` : ""}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowSchedule((s) => !s)}
        className="mt-4 rounded-md border border-border px-4 py-2 text-sm text-text-muted hover:text-text-primary"
      >
        {showSchedule ? "Hide amortization schedule" : "Show amortization schedule"}
      </button>

      {showSchedule && (
        <div className="mt-4 max-h-96 overflow-auto rounded-xl border border-border">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-background text-text-muted">
              <tr>
                <th className="p-2">#</th>
                <th className="p-2">Payment</th>
                <th className="p-2">Principal</th>
                <th className="p-2">Interest</th>
                <th className="p-2">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {schedule.map((r) => (
                <tr key={r.month} className="text-text-primary">
                  <td className="p-2">{r.month}</td>
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
