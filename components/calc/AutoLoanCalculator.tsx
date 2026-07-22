"use client";

import { useMemo, useState } from "react";
import { monthlyPayment, usd } from "@/lib/calc";

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

export default function AutoLoanCalculator() {
  const [price, setPrice] = useState(35000);
  const [down, setDown] = useState(5000);
  const [tradeIn, setTradeIn] = useState(0);
  const [taxPct, setTaxPct] = useState(6);
  const [rate, setRate] = useState(7);
  const [months, setMonths] = useState(60);

  const r = useMemo(() => {
    // Most US states tax the price minus trade-in.
    const taxable = Math.max(0, price - tradeIn);
    const salesTax = (taxable * taxPct) / 100;
    const loan = Math.max(0, price + salesTax - down - tradeIn);
    const payment = monthlyPayment(loan, rate, months);
    const totalInterest = payment * months - loan;
    return { salesTax, loan, payment, totalInterest, totalCost: payment * months };
  }, [price, down, tradeIn, taxPct, rate, months]);

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Vehicle price ($)" value={price} set={setPrice} />
        <Field label="Down payment ($)" value={down} set={setDown} />
        <Field label="Trade-in value ($)" value={tradeIn} set={setTradeIn} />
        <Field label="Sales tax (%)" value={taxPct} set={setTaxPct} step={0.1} />
        <Field label="Interest rate (% APR)" value={rate} set={setRate} step={0.1} />
        <Field label="Loan term (months)" value={months} set={setMonths} />
      </div>

      <div className="mt-6 rounded-xl border border-border bg-background p-5">
        <p className="label">Monthly payment</p>
        <p className="mt-1 font-display text-4xl font-medium text-primary">
          {usd(r.payment, 2)}
        </p>
        <p className="mt-1 text-xs text-text-muted">
          Amount financed {usd(r.loan)} (includes {usd(r.salesTax)} sales tax)
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
          <div>
            <p className="text-text-muted">Total interest</p>
            <p className="font-medium text-secondary">{usd(r.totalInterest)}</p>
          </div>
          <div>
            <p className="text-text-muted">Total of payments</p>
            <p className="font-medium text-text-primary">{usd(r.totalCost)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
