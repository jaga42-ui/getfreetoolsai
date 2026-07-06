"use client";

import { useMemo, useState } from "react";
import { grp } from "@/lib/calc";

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

const CAP = 2000000; // ₹20 lakh tax-free gratuity cap

export default function GratuityCalculator() {
  const [salary, setSalary] = useState(50000);
  const [years, setYears] = useState(10);
  const [months, setMonths] = useState(0);

  const { gratuity, effYears, eligible, capped } = useMemo(() => {
    // A part-year of 6 months or more counts as a full year.
    const eff = years + (months >= 6 ? 1 : 0);
    const g = (15 * salary * eff) / 26;
    return {
      gratuity: Math.min(g, CAP),
      effYears: eff,
      eligible: years >= 5,
      capped: g > CAP,
    };
  }, [salary, years, months]);

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field
          label="Last drawn salary (₹/month)"
          value={salary}
          set={setSalary}
          hint="Basic + Dearness Allowance"
        />
        <Field label="Years of service" value={years} set={setYears} />
        <Field label="Additional months" value={months} set={setMonths} hint="≥ 6 counts as +1 year" />
      </div>

      <div className="mt-6 rounded-xl border border-border bg-background p-5">
        <p className="label">Gratuity payable</p>
        <p className="mt-1 font-display text-4xl font-medium text-primary">
          ₹{grp(gratuity)}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-text-muted">Service counted</p>
            <p className="font-medium text-text-primary">
              {effYears} {effYears === 1 ? "year" : "years"}
            </p>
          </div>
          <div>
            <p className="text-text-muted">Formula</p>
            <p className="font-medium text-text-primary">15 × salary × years ÷ 26</p>
          </div>
        </div>
        {!eligible && (
          <p className="mt-4 rounded-lg border border-primary/25 bg-primary/[0.06] px-3 py-2 text-xs text-text-primary">
            Gratuity under the Payment of Gratuity Act usually requires at least
            <strong> 5 years</strong> of continuous service.
          </p>
        )}
        {capped && (
          <p className="mt-3 text-xs text-text-muted">
            Shown amount is capped at the ₹20 lakh tax-free limit.
          </p>
        )}
      </div>
    </div>
  );
}
