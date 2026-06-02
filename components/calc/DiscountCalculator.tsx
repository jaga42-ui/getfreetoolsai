"use client";

import { useState } from "react";
import { SegmentedControl } from "@/components/ui";
import { fmt } from "@/lib/calc";

type Mode = "final" | "percent" | "original" | "double";

export default function DiscountCalculator() {
  const [mode, setMode] = useState<Mode>("final");
  const [price, setPrice] = useState(2000);
  const [disc, setDisc] = useState(20);
  const [sale, setSale] = useState(1500);
  const [d1, setD1] = useState(20);
  const [d2, setD2] = useState(10);

  const num = (label: string, value: number, set: (n: number) => void) => (
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

  const Result = ({ children }: { children: React.ReactNode }) => (
    <div className="mt-4 rounded-xl border border-border bg-background p-5 text-sm">
      {children}
    </div>
  );

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <SegmentedControl<Mode>
        value={mode}
        onChange={setMode}
        options={[
          { value: "final", label: "Final price" },
          { value: "percent", label: "Discount %" },
          { value: "original", label: "Original price" },
          { value: "double", label: "Stacked %" },
        ]}
      />

      {mode === "final" && (
        <>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {num("Original price (₹)", price, setPrice)}
            {num("Discount (%)", disc, setDisc)}
          </div>
          <Result>
            <p className="font-display text-3xl font-medium text-primary">
              ₹{fmt(price * (1 - disc / 100))}
            </p>
            <p className="mt-1 text-text-muted">
              You save ₹{fmt((price * disc) / 100)} ({fmt(disc, 0)}%)
            </p>
          </Result>
        </>
      )}

      {mode === "percent" && (
        <>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {num("Original price (₹)", price, setPrice)}
            {num("Sale price (₹)", sale, setSale)}
          </div>
          <Result>
            <p className="font-display text-3xl font-medium text-primary">
              {price > 0 ? fmt(((price - sale) / price) * 100) : "0"}% off
            </p>
            <p className="mt-1 text-text-muted">
              You save ₹{fmt(price - sale)}
            </p>
          </Result>
        </>
      )}

      {mode === "original" && (
        <>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {num("Sale price (₹)", sale, setSale)}
            {num("Discount (%)", disc, setDisc)}
          </div>
          <Result>
            <p className="text-text-muted">Original price was</p>
            <p className="font-display text-3xl font-medium text-primary">
              ₹{disc < 100 ? fmt(sale / (1 - disc / 100)) : "—"}
            </p>
          </Result>
        </>
      )}

      {mode === "double" && (
        <>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {num("Original price (₹)", price, setPrice)}
            {num("First discount (%)", d1, setD1)}
            {num("Second discount (%)", d2, setD2)}
          </div>
          <Result>
            <p className="font-display text-3xl font-medium text-primary">
              ₹{fmt(price * (1 - d1 / 100) * (1 - d2 / 100))}
            </p>
            <p className="mt-1 text-text-muted">
              Effective discount:{" "}
              {fmt((1 - (1 - d1 / 100) * (1 - d2 / 100)) * 100)}% — note that{" "}
              {fmt(d1, 0)}% + {fmt(d2, 0)}% is <em>not</em> {fmt(d1 + d2, 0)}%,
              because the second discount applies to the already-reduced price.
            </p>
          </Result>
        </>
      )}
    </div>
  );
}
