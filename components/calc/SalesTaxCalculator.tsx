"use client";

import { useMemo, useState } from "react";
import { SegmentedControl } from "@/components/ui";
import { usd } from "@/lib/calc";

type Mode = "add" | "remove";

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

export default function SalesTaxCalculator() {
  const [mode, setMode] = useState<Mode>("add");
  const [amount, setAmount] = useState(100);
  const [rate, setRate] = useState(7.25);

  const r = useMemo(() => {
    if (mode === "add") {
      const tax = (amount * rate) / 100;
      return { base: amount, tax, total: amount + tax };
    }
    // remove: amount is the tax-inclusive total
    const base = amount / (1 + rate / 100);
    return { base, tax: amount - base, total: amount };
  }, [mode, amount, rate]);

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="mb-4">
        <span className="mb-1.5 block text-sm text-text-muted">Mode</span>
        <SegmentedControl<Mode>
          value={mode}
          onChange={setMode}
          options={[
            { value: "add", label: "Add tax" },
            { value: "remove", label: "Remove tax" },
          ]}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={mode === "add" ? "Pre-tax price ($)" : "Total incl. tax ($)"}
          value={amount}
          set={setAmount}
        />
        <Field label="Sales tax rate (%)" value={rate} set={setRate} step={0.01} />
      </div>

      <div className="mt-6 rounded-xl border border-border bg-background p-5">
        <p className="label">{mode === "add" ? "Total with tax" : "Pre-tax price"}</p>
        <p className="mt-1 font-display text-4xl font-medium text-primary">
          {usd(mode === "add" ? r.total : r.base, 2)}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
          <div>
            <p className="text-text-muted">Sales tax</p>
            <p className="font-medium text-secondary">{usd(r.tax, 2)}</p>
          </div>
          <div>
            <p className="text-text-muted">{mode === "add" ? "Pre-tax price" : "Total incl. tax"}</p>
            <p className="font-medium text-text-primary">
              {usd(mode === "add" ? r.base : r.total, 2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
