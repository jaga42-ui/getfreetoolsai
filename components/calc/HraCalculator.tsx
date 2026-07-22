"use client";

import { useMemo, useState } from "react";
import { SegmentedControl } from "@/components/ui";
import { grp } from "@/lib/calc";

type City = "metro" | "nonmetro";

function Field({
  label,
  value,
  set,
  min = 0,
}: {
  label: string;
  value: number;
  set: (n: number) => void;
  min?: number;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-text-muted">{label}</span>
      <input
        type="number"
        min={min}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
      />
    </label>
  );
}

export default function HraCalculator() {
  const [basic, setBasic] = useState(40000);
  const [hra, setHra] = useState(18000);
  const [rent, setRent] = useState(20000);
  const [city, setCity] = useState<City>("metro");

  const { exempt, taxable } = useMemo(() => {
    const cap = (city === "metro" ? 0.5 : 0.4) * basic;
    const overTenth = Math.max(0, rent - 0.1 * basic);
    const e = Math.max(0, Math.min(hra, overTenth, cap));
    return { exempt: e, taxable: Math.max(0, hra - e) };
  }, [basic, hra, rent, city]);

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Basic salary + DA (per month, ₹)" value={basic} set={setBasic} />
        <Field label="HRA received (per month, ₹)" value={hra} set={setHra} />
        <Field label="Rent paid (per month, ₹)" value={rent} set={setRent} />
      </div>

      <div className="mt-4">
        <span className="mb-1.5 block text-sm text-text-muted">City type</span>
        <SegmentedControl<City>
          value={city}
          onChange={setCity}
          options={[
            { value: "metro", label: "Metro (50%)" },
            { value: "nonmetro", label: "Non-metro (40%)" },
          ]}
        />
      </div>

      <div className="mt-6 rounded-xl border border-border bg-background p-5">
        <p className="label">HRA exempt from tax</p>
        <p className="mt-1 font-display text-4xl font-medium text-primary">
          ₹{grp(exempt)}
          <span className="ml-2 align-middle text-base font-normal text-text-muted">
            / month
          </span>
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-text-muted">Taxable HRA</p>
            <p className="font-medium text-text-primary">₹{grp(taxable)}/mo</p>
          </div>
          <div>
            <p className="text-text-muted">Annual exemption</p>
            <p className="font-medium text-secondary">₹{grp(exempt * 12)}</p>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-text-muted">
        Your exemption is the least of: actual HRA received, rent paid minus 10%
        of basic, and {city === "metro" ? "50%" : "40%"} of basic salary.
      </p>
    </div>
  );
}
