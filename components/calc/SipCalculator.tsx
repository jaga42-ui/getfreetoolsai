"use client";

import { useMemo, useState } from "react";
import { SegmentedControl } from "@/components/ui";
import { grp } from "@/lib/calc";

type Mode = "sip" | "lumpsum";

export default function SipCalculator() {
  const [mode, setMode] = useState<Mode>("sip");
  const [monthly, setMonthly] = useState(10000);
  const [lump, setLump] = useState(100000);
  const [annual, setAnnual] = useState(12);
  const [years, setYears] = useState(10);
  const [inflation, setInflation] = useState(0);

  const { invested, maturity } = useMemo(() => {
    if (mode === "sip") {
      const r = annual / 12 / 100;
      const n = years * 12;
      const fv = r === 0 ? monthly * n : monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      return { invested: monthly * n, maturity: fv };
    }
    const fv = lump * Math.pow(1 + annual / 100, years);
    return { invested: lump, maturity: fv };
  }, [mode, monthly, lump, annual, years]);

  const returns = maturity - invested;
  const realValue = inflation > 0 ? maturity / Math.pow(1 + inflation / 100, years) : null;

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
      <SegmentedControl<Mode>
        value={mode}
        onChange={setMode}
        options={[
          { value: "sip", label: "Monthly SIP" },
          { value: "lumpsum", label: "Lump sum" },
        ]}
      />

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {mode === "sip"
          ? field("Monthly investment (₹)", monthly, setMonthly)
          : field("Lump sum amount (₹)", lump, setLump)}
        {field("Expected annual return (%)", annual, setAnnual)}
        {field("Investment period (years)", years, setYears)}
        {field("Inflation rate (%, optional)", inflation, setInflation)}
      </div>

      <div className="mt-6 rounded-xl border border-border bg-background p-5">
        <p className="label">Maturity value</p>
        <p className="mt-1 font-display text-4xl font-medium text-primary">
          ₹{grp(maturity)}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-text-muted">Total invested</p>
            <p className="font-medium text-text-primary">₹{grp(invested)}</p>
          </div>
          <div>
            <p className="text-text-muted">Estimated returns</p>
            <p className="font-medium text-secondary">₹{grp(returns)}</p>
          </div>
          {realValue !== null && (
            <div className="col-span-2">
              <p className="text-text-muted">Inflation-adjusted value</p>
              <p className="font-medium text-text-primary">₹{grp(realValue)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
