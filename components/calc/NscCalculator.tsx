"use client";

import { useMemo, useState } from "react";
import { grp } from "@/lib/calc";

function Field({ label, value, set, min = 0, step }: { label: string; value: number; set: (n: number) => void; min?: number; step?: number }) {
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

// NSC has a fixed 5-year tenure with annually-compounded interest.
const TENURE_YEARS = 5;

export default function NscCalculator() {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(7.7);

  const { maturity, interest, schedule } = useMemo(() => {
    // Build the year-by-year accrual rather than only the closed form, so the
    // page can show how the balance actually grows. The final closing balance
    // is identical to amount * (1 + r)^5 — this is the same computation,
    // stepped.
    const rows: { year: number; opening: number; interest: number; closing: number }[] = [];
    let opening = amount;
    for (let year = 1; year <= TENURE_YEARS; year++) {
      const earned = opening * (rate / 100);
      const closing = opening + earned;
      rows.push({ year, opening, interest: earned, closing });
      opening = closing;
    }
    const m = rows.length ? rows[rows.length - 1].closing : amount;
    return { maturity: m, interest: m - amount, schedule: rows };
  }, [amount, rate]);

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Investment amount (₹)" value={amount} set={setAmount} />
        <Field label="Interest rate (% p.a.)" value={rate} set={setRate} step={0.1} />
      </div>
      <p className="mt-3 text-xs text-text-muted">
        NSC has a fixed 5-year tenure with interest compounded annually.
      </p>

      <div className="mt-5 rounded-xl border border-border bg-background p-5">
        <p className="label">Maturity value (after 5 years)</p>
        <p className="mt-1 font-display text-4xl font-medium text-primary">₹{grp(maturity)}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-text-muted">Amount invested</p>
            <p className="font-medium text-text-primary">₹{grp(amount)}</p>
          </div>
          <div>
            <p className="text-text-muted">Total interest</p>
            <p className="font-medium text-secondary">₹{grp(interest)}</p>
          </div>
        </div>
      </div>

      {/*
        Year-by-year accrual. NSC interest is compounded annually and paid only
        at maturity, so the "closing balance" is what the certificate is worth
        on paper that year — not cash you can withdraw.
      */}
      <div className="mt-5">
        <h3 className="text-sm font-medium text-text-primary">
          Year-by-year growth
        </h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-left text-sm">
            <caption className="sr-only">
              NSC year-by-year opening balance, interest earned and closing
              balance over the 5-year tenure
            </caption>
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="py-2 pr-3 font-medium text-text-primary">
                  Year
                </th>
                <th scope="col" className="py-2 pr-3 font-medium text-text-primary">
                  Opening balance
                </th>
                <th scope="col" className="py-2 pr-3 font-medium text-text-primary">
                  Interest earned
                </th>
                <th scope="col" className="py-2 font-medium text-text-primary">
                  Closing balance
                </th>
              </tr>
            </thead>
            <tbody className="text-text-muted">
              {schedule.map((r) => (
                <tr key={r.year} className="border-b border-border/60">
                  <th scope="row" className="py-2 pr-3 font-normal text-text-primary">
                    {r.year}
                  </th>
                  <td className="py-2 pr-3">₹{grp(r.opening)}</td>
                  <td className="py-2 pr-3 text-secondary">₹{grp(r.interest)}</td>
                  <td className="py-2 font-medium text-text-primary">
                    ₹{grp(r.closing)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-text-muted">
          Interest is compounded annually but paid only on maturity — the
          closing balance is the certificate&apos;s accrued value, not a
          withdrawable amount.
        </p>
      </div>
    </div>
  );
}
