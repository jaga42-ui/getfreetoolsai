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

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-text-muted">{label}</span>
      <span className={accent ? "font-medium text-secondary" : "font-medium text-text-primary"}>
        {value}
      </span>
    </div>
  );
}

export default function MortgageCalculator() {
  const [price, setPrice] = useState(400000);
  const [down, setDown] = useState(80000);
  const [years, setYears] = useState(30);
  const [rate, setRate] = useState(6.5);
  const [taxAnnual, setTaxAnnual] = useState(4800);
  const [insAnnual, setInsAnnual] = useState(1800);
  const [pmiPct, setPmiPct] = useState(0.5);
  const [hoa, setHoa] = useState(0);

  const r = useMemo(() => {
    const loan = Math.max(0, price - down);
    const n = Math.round(years * 12);
    const pi = monthlyPayment(loan, rate, n);
    const downPct = price > 0 ? (down / price) * 100 : 0;
    // PMI typically applies until 20% equity; approximate by charging it while
    // the down payment is under 20%.
    const monthlyPmi = downPct < 20 ? (loan * (pmiPct / 100)) / 12 : 0;
    const monthlyTax = taxAnnual / 12;
    const monthlyIns = insAnnual / 12;
    const total = pi + monthlyTax + monthlyIns + monthlyPmi + hoa;
    const totalInterest = pi * n - loan;
    return { loan, n, pi, downPct, monthlyPmi, monthlyTax, monthlyIns, total, totalInterest };
  }, [price, down, years, rate, taxAnnual, insAnnual, pmiPct, hoa]);

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Home price ($)" value={price} set={setPrice} />
        <Field label="Down payment ($)" value={down} set={setDown} />
        <Field label="Loan term (years)" value={years} set={setYears} />
        <Field label="Interest rate (% APR)" value={rate} set={setRate} step={0.1} />
        <Field label="Property tax ($/year)" value={taxAnnual} set={setTaxAnnual} />
        <Field label="Home insurance ($/year)" value={insAnnual} set={setInsAnnual} />
        <Field label="PMI (% of loan/year)" value={pmiPct} set={setPmiPct} step={0.1} />
        <Field label="HOA ($/month)" value={hoa} set={setHoa} />
      </div>

      <div className="mt-6 rounded-xl border border-border bg-background p-5">
        <p className="label">Total monthly payment</p>
        <p className="mt-1 font-display text-4xl font-medium text-primary">
          {usd(r.total, 0)}
        </p>
        <p className="mt-1 text-xs text-text-muted">
          Loan amount {usd(r.loan)} · {r.downPct.toFixed(0)}% down
          {r.monthlyPmi === 0 && r.downPct >= 20 ? " · no PMI (20%+ down)" : ""}
        </p>

        <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
          <Row label="Principal & interest" value={usd(r.pi, 0)} />
          <Row label="Property tax" value={usd(r.monthlyTax, 0)} />
          <Row label="Home insurance" value={usd(r.monthlyIns, 0)} />
          {r.monthlyPmi > 0 && <Row label="PMI" value={usd(r.monthlyPmi, 0)} />}
          {hoa > 0 && <Row label="HOA" value={usd(hoa, 0)} />}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
          <div>
            <p className="text-text-muted">Total interest paid</p>
            <p className="font-medium text-secondary">{usd(r.totalInterest)}</p>
          </div>
          <div>
            <p className="text-text-muted">Total of {r.n} payments</p>
            <p className="font-medium text-text-primary">{usd(r.pi * r.n)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
