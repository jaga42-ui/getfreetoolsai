"use client";

import { useMemo, useState } from "react";
import { SegmentedControl } from "@/components/ui";
import { grp, fmt } from "@/lib/calc";

type Regime = "new" | "old";
const NEW_SLABS: [number, number][] = [
  [300000, 0], [700000, 0.05], [1000000, 0.1], [1200000, 0.15], [1500000, 0.2], [Infinity, 0.3],
];
const OLD_SLABS: [number, number][] = [
  [250000, 0], [500000, 0.05], [1000000, 0.2], [Infinity, 0.3],
];

function progressiveTax(income: number, slabs: [number, number][]) {
  let tax = 0;
  let lower = 0;
  for (const [upper, rate] of slabs) {
    if (income > lower) tax += (Math.min(income, upper) - lower) * rate;
    lower = upper;
    if (income <= upper) break;
  }
  return tax;
}

/** Returns annual income tax incl. 4% cess, applying the 87A rebate. */
function incomeTax(taxable: number, regime: Regime) {
  const slabs = regime === "new" ? NEW_SLABS : OLD_SLABS;
  const rebateLimit = regime === "new" ? 700000 : 500000;
  if (taxable <= rebateLimit) return 0;
  return progressiveTax(taxable, slabs) * 1.04;
}

export default function SalaryCalculator() {
  const [ctc, setCtc] = useState(1200000);
  const [basicPct, setBasicPct] = useState(45);
  const [regime, setRegime] = useState<Regime>("new");
  const [deduction80c, setDeduction80c] = useState(0);

  const calc = useMemo(() => {
    const basic = (ctc * basicPct) / 100;
    const employerPF = 0.12 * basic;
    const employeePF = 0.12 * basic;
    const professionalTax = 2400;
    const gross = ctc - employerPF; // employer PF is part of CTC, not gross pay
    const stdDeduction = regime === "new" ? 75000 : 50000;

    const compute = (r: Regime) => {
      const std = r === "new" ? 75000 : 50000;
      let taxable = gross - std - employeePF;
      if (r === "old") taxable -= Math.min(deduction80c, 150000);
      taxable = Math.max(0, taxable);
      const tax = incomeTax(taxable, r);
      const netAnnual = gross - employeePF - professionalTax - tax;
      return { tax, netAnnual };
    };

    const chosen = compute(regime);
    return {
      basic,
      gross,
      employeePF,
      employerPF,
      professionalTax,
      stdDeduction,
      tax: chosen.tax,
      netAnnual: chosen.netAnnual,
      netMonthly: chosen.netAnnual / 12,
      effRate: gross > 0 ? (chosen.tax / gross) * 100 : 0,
      newNet: compute("new").netAnnual,
      oldNet: compute("old").netAnnual,
    };
  }, [ctc, basicPct, regime, deduction80c]);

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
  const row = (label: string, value: number, strong = false) => (
    <div className="flex items-center justify-between border-b border-border py-2 last:border-0">
      <span className="text-text-muted">{label}</span>
      <span className={strong ? "font-semibold text-text-primary" : "text-text-primary"}>
        ₹{grp(value)}
      </span>
    </div>
  );

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {field("Annual CTC (₹)", ctc, setCtc)}
        {field("Basic salary (% of CTC)", basicPct, setBasicPct)}
        <label className="block text-sm">
          <span className="mb-1 block text-text-muted">Tax regime</span>
          <SegmentedControl<Regime>
            value={regime}
            onChange={setRegime}
            options={[
              { value: "new", label: "New regime" },
              { value: "old", label: "Old regime" },
            ]}
          />
        </label>
        {regime === "old" &&
          field("80C deductions (₹, max 1.5L)", deduction80c, setDeduction80c)}
      </div>

      <div className="mt-6 rounded-xl border border-border bg-background p-5">
        <p className="label">Net in-hand (monthly)</p>
        <p className="mt-1 font-display text-4xl font-medium text-primary">
          ₹{grp(calc.netMonthly)}
        </p>
        <p className="mt-1 text-sm text-text-muted">
          ₹{grp(calc.netAnnual)} per year · effective tax {fmt(calc.effRate, 1)}%
        </p>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-background p-5 text-sm">
        {row("Gross salary (excl. employer PF)", calc.gross)}
        {row("Employee PF (12% of basic)", calc.employeePF)}
        {row("Professional tax", calc.professionalTax)}
        {row("Income tax (incl. 4% cess)", calc.tax)}
        {row("Net annual in-hand", calc.netAnnual, true)}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border border-border bg-background p-3">
          <p className="text-text-muted">New regime net/yr</p>
          <p className="font-medium text-text-primary">₹{grp(calc.newNet)}</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-3">
          <p className="text-text-muted">Old regime net/yr</p>
          <p className="font-medium text-text-primary">₹{grp(calc.oldNet)}</p>
        </div>
      </div>
      <p className="mt-2 text-xs text-text-muted">
        {calc.newNet >= calc.oldNet ? "New" : "Old"} regime gives a higher
        in-hand here (by ₹{grp(Math.abs(calc.newNet - calc.oldNet))}/yr).
        HRA and other exemptions can change this — confirm with your employer.
      </p>
    </div>
  );
}
