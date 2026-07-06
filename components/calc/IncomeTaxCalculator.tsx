"use client";

import { useMemo, useState } from "react";
import { grp, slabTax } from "@/lib/calc";
import { cn } from "@/lib/utils";

// FY 2025-26 (AY 2026-27), resident individual below 60.
const NEW_SLABS = [
  { upTo: 400000, rate: 0 },
  { upTo: 800000, rate: 5 },
  { upTo: 1200000, rate: 10 },
  { upTo: 1600000, rate: 15 },
  { upTo: 2000000, rate: 20 },
  { upTo: 2400000, rate: 25 },
  { upTo: Infinity, rate: 30 },
];
const OLD_SLABS = [
  { upTo: 250000, rate: 0 },
  { upTo: 500000, rate: 5 },
  { upTo: 1000000, rate: 20 },
  { upTo: Infinity, rate: 30 },
];

function Field({
  label,
  value,
  set,
  hint,
}: {
  label: string;
  value: number;
  set: (n: number) => void;
  hint?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-text-muted">{label}</span>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
      />
      {hint && <span className="mt-1 block text-xs text-text-muted/80">{hint}</span>}
    </label>
  );
}

function computeNew(income: number) {
  const taxable = Math.max(0, income - 75000); // standard deduction
  let tax = slabTax(taxable, NEW_SLABS);
  if (taxable <= 1200000) tax = 0; // section 87A rebate
  return { taxable, total: Math.round(tax * 1.04) }; // + 4% cess
}

function computeOld(income: number, deductions: number) {
  const taxable = Math.max(0, income - 50000 - deductions); // std ded + others
  let tax = slabTax(taxable, OLD_SLABS);
  if (taxable <= 500000) tax = 0; // section 87A rebate
  return { taxable, total: Math.round(tax * 1.04) }; // + 4% cess
}

function RegimeCard({
  name,
  taxable,
  total,
  best,
}: {
  name: string;
  taxable: number;
  total: number;
  best: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-5",
        best ? "border-secondary/50 bg-secondary/[0.06]" : "border-border bg-background"
      )}
    >
      <div className="flex items-center justify-between">
        <p className="label">{name}</p>
        {best && (
          <span className="rounded-full bg-secondary/15 px-2 py-0.5 text-[11px] font-medium text-secondary">
            Lower tax
          </span>
        )}
      </div>
      <p className="mt-1 font-display text-3xl font-medium text-primary">
        ₹{grp(total)}
      </p>
      <p className="mt-2 text-xs text-text-muted">
        Taxable income ₹{grp(taxable)}
      </p>
    </div>
  );
}

export default function IncomeTaxCalculator() {
  const [income, setIncome] = useState(1200000);
  const [deductions, setDeductions] = useState(150000);

  const { neu, old, saving, better } = useMemo(() => {
    const n = computeNew(income);
    const o = computeOld(income, deductions);
    return {
      neu: n,
      old: o,
      saving: Math.abs(n.total - o.total),
      better: n.total <= o.total ? "new" : "old",
    };
  }, [income, deductions]);

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Gross annual income (₹)"
          value={income}
          set={setIncome}
          hint="Salary before deductions"
        />
        <Field
          label="Deductions — old regime (₹)"
          value={deductions}
          set={setDeductions}
          hint="80C, 80D, home-loan interest, etc."
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <RegimeCard
          name="New regime"
          taxable={neu.taxable}
          total={neu.total}
          best={better === "new"}
        />
        <RegimeCard
          name="Old regime"
          taxable={old.taxable}
          total={old.total}
          best={better === "old"}
        />
      </div>

      <p className="mt-4 rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-primary">
        {saving === 0 ? (
          <>Both regimes give the same tax of <strong>₹{grp(neu.total)}</strong>.</>
        ) : (
          <>
            The <strong>{better} regime</strong> saves you about{" "}
            <strong className="text-secondary">₹{grp(saving)}</strong> a year.
          </>
        )}
      </p>

      <p className="mt-3 text-xs text-text-muted">
        FY 2025-26 (AY 2026-27), resident individual under 60. Includes the ₹75,000
        (new) / ₹50,000 (old) standard deduction, the section 87A rebate and 4%
        cess. Surcharge on incomes above ₹50 lakh, marginal relief and
        senior-citizen slabs are not applied — treat this as an estimate.
      </p>
    </div>
  );
}
