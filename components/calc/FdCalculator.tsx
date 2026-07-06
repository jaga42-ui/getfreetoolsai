"use client";

import { useMemo, useState } from "react";
import { SegmentedControl } from "@/components/ui";
import { grp } from "@/lib/calc";

type Freq = "4" | "12" | "2" | "1"; // compounding periods per year

const FREQ_LABEL: Record<Freq, string> = {
  "4": "Quarterly",
  "12": "Monthly",
  "2": "Half-yearly",
  "1": "Yearly",
};

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

export default function FdCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(5);
  const [months, setMonths] = useState(0);
  const [freq, setFreq] = useState<Freq>("4");

  const { maturity, interest } = useMemo(() => {
    const n = Number(freq);
    const t = years + months / 12;
    const m = principal * Math.pow(1 + rate / (100 * n), n * t);
    return { maturity: m, interest: m - principal };
  }, [principal, rate, years, months, freq]);

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Deposit amount (₹)" value={principal} set={setPrincipal} />
        <Field label="Interest rate (% p.a.)" value={rate} set={setRate} />
        <Field label="Tenure (years)" value={years} set={setYears} />
        <Field label="Tenure (months)" value={months} set={setMonths} />
      </div>

      <div className="mt-4">
        <span className="mb-1.5 block text-sm text-text-muted">
          Compounding frequency
        </span>
        <SegmentedControl<Freq>
          value={freq}
          onChange={setFreq}
          options={(Object.keys(FREQ_LABEL) as Freq[]).map((f) => ({
            value: f,
            label: FREQ_LABEL[f],
          }))}
        />
      </div>

      <div className="mt-6 rounded-xl border border-border bg-background p-5">
        <p className="label">Maturity value</p>
        <p className="mt-1 font-display text-4xl font-medium text-primary">
          ₹{grp(maturity)}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-text-muted">Amount invested</p>
            <p className="font-medium text-text-primary">₹{grp(principal)}</p>
          </div>
          <div>
            <p className="text-text-muted">Interest earned</p>
            <p className="font-medium text-secondary">₹{grp(interest)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
