"use client";

import { useMemo, useState } from "react";
import { SegmentedControl } from "@/components/ui";
import { fmt } from "@/lib/calc";

type Mode = "add" | "remove";
const RATES = [3, 5, 12, 18, 28];

export default function GstCalculator() {
  const [amount, setAmount] = useState(1000);
  const [rate, setRate] = useState(18);
  const [mode, setMode] = useState<Mode>("add");

  const { original, gst, total } = useMemo(() => {
    if (mode === "add") {
      const g = (amount * rate) / 100;
      return { original: amount, gst: g, total: amount + g };
    }
    const orig = amount / (1 + rate / 100);
    return { original: orig, gst: amount - orig, total: amount };
  }, [amount, rate, mode]);

  const row = (label: string, value: number, strong = false) => (
    <div className="flex items-center justify-between border-b border-border py-2 last:border-0">
      <span className="text-text-muted">{label}</span>
      <span className={strong ? "font-semibold text-text-primary" : "text-text-primary"}>
        ₹{fmt(value)}
      </span>
    </div>
  );

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <SegmentedControl<Mode>
        value={mode}
        onChange={setMode}
        options={[
          { value: "add", label: "Add GST" },
          { value: "remove", label: "Remove GST" },
        ]}
      />

      <label className="mt-4 block text-sm">
        <span className="mb-1 block text-text-muted">
          {mode === "add" ? "Original amount (₹)" : "Total amount incl. GST (₹)"}
        </span>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
        />
      </label>

      <div className="mt-4">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-text-muted">
          GST rate
        </p>
        <div className="flex flex-wrap gap-2">
          {RATES.map((r) => (
            <button
              key={r}
              onClick={() => setRate(r)}
              className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                rate === r
                  ? "border-primary bg-primary/10 text-text-primary"
                  : "border-border text-text-muted hover:text-text-primary"
              }`}
            >
              {r}%
            </button>
          ))}
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-20 rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-text-primary focus:border-primary focus:outline-none"
            aria-label="Custom GST rate"
          />
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-background p-5 text-sm">
        {row("Original price", original)}
        {row(`GST (${rate}%)`, gst)}
        {row("CGST", gst / 2)}
        {row("SGST", gst / 2)}
        {row("IGST (inter-state)", gst)}
        {row("Total price", total, true)}
      </div>
    </div>
  );
}
