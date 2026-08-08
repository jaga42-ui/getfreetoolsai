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

// SCSS pays interest quarterly (not compounded) over a fixed 5-year tenure.
const TENURE_YEARS = 5;

export default function ScssCalculator() {
  const [deposit, setDeposit] = useState(1500000);
  const [rate, setRate] = useState(8.2);

  const { quarterly, annual, totalInterest, schedule } = useMemo(() => {
    const annualInterest = (deposit * rate) / 100;
    // SCSS interest is simple, not compounded — it is paid out each quarter
    // rather than left to grow, so every year's payout is identical. The table
    // exists to show the cumulative total and when the principal comes back.
    const rows = Array.from({ length: TENURE_YEARS }, (_, i) => ({
      year: i + 1,
      paid: annualInterest,
      cumulative: annualInterest * (i + 1),
    }));
    return {
      quarterly: annualInterest / 4,
      annual: annualInterest,
      totalInterest: annualInterest * TENURE_YEARS,
      schedule: rows,
    };
  }, [deposit, rate]);

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Deposit amount (₹)" value={deposit} set={setDeposit} />
        <Field label="Interest rate (% p.a.)" value={rate} set={setRate} step={0.1} />
      </div>
      <p className="mt-3 text-xs text-text-muted">
        SCSS pays interest every quarter over a 5-year tenure; the deposit (max
        ₹30 lakh) is returned at maturity.
      </p>

      <div className="mt-5 rounded-xl border border-border bg-background p-5">
        <p className="label">Quarterly interest payout</p>
        <p className="mt-1 font-display text-4xl font-medium text-primary">₹{grp(quarterly)}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-text-muted">Annual interest</p>
            <p className="font-medium text-text-primary">₹{grp(annual)}</p>
          </div>
          <div>
            <p className="text-text-muted">Total interest (5 yrs)</p>
            <p className="font-medium text-secondary">₹{grp(totalInterest)}</p>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-medium text-text-primary">
          Payout schedule
        </h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[460px] border-collapse text-left text-sm">
            <caption className="sr-only">
              SCSS year-by-year interest paid, quarterly payout and cumulative
              interest over the 5-year tenure
            </caption>
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="py-2 pr-3 font-medium text-text-primary">
                  Year
                </th>
                <th scope="col" className="py-2 pr-3 font-medium text-text-primary">
                  Per quarter
                </th>
                <th scope="col" className="py-2 pr-3 font-medium text-text-primary">
                  Paid that year
                </th>
                <th scope="col" className="py-2 font-medium text-text-primary">
                  Cumulative interest
                </th>
              </tr>
            </thead>
            <tbody className="text-text-muted">
              {schedule.map((r) => (
                <tr key={r.year} className="border-b border-border/60">
                  <th scope="row" className="py-2 pr-3 font-normal text-text-primary">
                    {r.year}
                  </th>
                  <td className="py-2 pr-3">₹{grp(r.paid / 4)}</td>
                  <td className="py-2 pr-3">₹{grp(r.paid)}</td>
                  <td className="py-2 font-medium text-secondary">
                    ₹{grp(r.cumulative)}
                  </td>
                </tr>
              ))}
              <tr className="bg-surface/40">
                <th scope="row" className="py-2 pr-3 font-normal text-text-primary">
                  End
                </th>
                <td className="py-2 pr-3">—</td>
                <td className="py-2 pr-3 font-medium text-text-primary">
                  ₹{grp(deposit)}
                </td>
                <td className="py-2 text-xs">Principal returned at maturity</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-text-muted">
          SCSS interest is simple, not compounded — it is paid out to you each
          quarter rather than left to grow, so every year&apos;s payout is the
          same. Your original deposit comes back at the end of the 5-year term.
        </p>
      </div>
    </div>
  );
}
