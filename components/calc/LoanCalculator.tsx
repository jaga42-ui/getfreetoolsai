"use client";

import { useMemo, useState } from "react";
import { Download, Printer } from "lucide-react";
import { grp, fmt, compactInr, toCsv, monthlyPayment, amortization } from "@/lib/calc";
import { downloadBlob } from "@/lib/utils";
import { StackedAreaChart, SplitBar } from "@/components/calc/charts";

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

  /**
   * The same loan with no extra payment, kept so the "interest saved" figure
   * is a real comparison rather than an estimate.
   */
  const baseline = useMemo(
    () => (extra > 0 ? amortization(amount, rate, months, base) : schedule),
    [extra, amount, rate, months, base, schedule]
  );

  const payoffMonths = schedule.length;
  const totalInterest = schedule.reduce((s, r) => s + r.interest, 0);
  const baselineInterest = baseline.reduce((s, r) => s + r.interest, 0);
  const interestSaved = Math.max(0, baselineInterest - totalInterest);
  const totalPay = amount + totalInterest;
  const payoff = new Date();
  payoff.setMonth(payoff.getMonth() + payoffMonths);

  /** Cumulative principal and interest paid, aggregated by year for the chart. */
  const chartPoints = useMemo(() => {
    const pts = [{ label: "0", contributed: 0, interest: 0 }];
    let principalPaid = 0;
    let interestPaid = 0;
    schedule.forEach((r, idx) => {
      principalPaid += r.principal;
      interestPaid += r.interest;
      if ((idx + 1) % 12 === 0 || idx === schedule.length - 1) {
        pts.push({
          label: String(Math.ceil((idx + 1) / 12)),
          contributed: principalPaid,
          interest: interestPaid,
        });
      }
    });
    return pts;
  }, [schedule]);

  const exportCsv = () => {
    const csv = toCsv([
      ["Loan amortization schedule"],
      ["Loan type", type],
      ["Loan amount", amount],
      ["Annual rate (%)", rate],
      ["Term (years)", years],
      ["Extra monthly payment", extra],
      ["Monthly payment", Math.round(base + extra)],
      ["Total interest", Math.round(totalInterest)],
      ...(extra > 0 ? [["Interest saved vs no extra payment", Math.round(interestSaved)]] : []),
      [],
      ["Month", "Opening balance", "Payment", "Principal", "Interest", "Closing balance"],
      ...schedule.map((r) => [
        r.month,
        Math.round(r.opening),
        Math.round(r.emi),
        Math.round(r.principal),
        Math.round(r.interest),
        Math.round(r.closing),
      ]),
    ]);
    downloadBlob(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
      "loan-amortization-schedule.csv"
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
          {extra > 0 && interestSaved > 0 && (
            <div className="col-span-2 rounded-lg bg-secondary/10 px-3 py-2.5">
              <p className="text-text-muted">Interest saved by paying ₹{grp(extra)} extra</p>
              <p className="font-medium text-secondary">₹{grp(interestSaved)}</p>
            </div>
          )}
        </div>

        <div className="mt-5 border-t border-border pt-4">
          <SplitBar
            contributed={amount}
            interest={totalInterest}
            format={(n) => `₹${grp(n)}`}
            contributedLabel="Principal"
            interestLabel="Interest"
          />
        </div>
      </div>

      {chartPoints.length > 1 && (
        <div className="mt-6 rounded-xl border border-border bg-background p-4 sm:p-5">
          <p className="label mb-3">What you have paid, year by year</p>
          <StackedAreaChart
            points={chartPoints}
            format={(n) => `₹${compactInr(n)}`}
            contributedLabel="Principal paid"
            interestLabel="Interest paid"
            caption={`Stacked area chart of cumulative payments over ${Math.ceil(
              payoffMonths / 12
            )} years, split into principal and interest. Total interest is ₹${grp(
              totalInterest
            )} on a ₹${grp(amount)} loan.`}
          />
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setShowSchedule((s) => !s)}
          className="rounded-md border border-border px-4 py-2 text-sm text-text-muted transition-colors hover:text-text-primary"
        >
          {showSchedule ? "Hide amortization schedule" : "Show amortization schedule"}
        </button>
        <button
          onClick={exportCsv}
          disabled={schedule.length === 0}
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

      {showSchedule && (
        <div className="mt-4 max-h-96 overflow-auto rounded-xl border border-border">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-background text-text-muted">
              <tr>
                <th className="p-2 font-medium">#</th>
                <th className="p-2 font-medium">Payment</th>
                <th className="p-2 font-medium">Principal</th>
                <th className="p-2 font-medium">Interest</th>
                <th className="p-2 font-medium">Balance</th>
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
