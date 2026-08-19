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

// SSY: deposits for 15 years, account matures 21 years after opening.
const DEPOSIT_YEARS = 15;
const MATURITY_YEARS = 21;

export default function SsyCalculator() {
  const [yearlyDeposit, setYearlyDeposit] = useState(50000);
  const [rate, setRate] = useState(8.2);

  const { maturity, deposited, interest, schedule } = useMemo(() => {
    // Same accrual as before, but each year is captured so the page can show
    // the balance building — including the six years after deposits stop, when
    // the account keeps compounding on its own.
    const rows: {
      year: number;
      deposit: number;
      interest: number;
      closing: number;
    }[] = [];
    let bal = 0;
    for (let year = 1; year <= MATURITY_YEARS; year++) {
      const deposit = year <= DEPOSIT_YEARS ? yearlyDeposit : 0;
      bal += deposit;
      const earned = bal * (rate / 100);
      bal = bal + earned;
      rows.push({ year, deposit, interest: earned, closing: bal });
    }
    const dep = yearlyDeposit * DEPOSIT_YEARS;
    return { maturity: bal, deposited: dep, interest: bal - dep, schedule: rows };
  }, [yearlyDeposit, rate]);

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Yearly deposit (₹)" value={yearlyDeposit} set={setYearlyDeposit} />
        <Field label="Interest rate (% p.a.)" value={rate} set={setRate} step={0.1} />
      </div>
      <p className="mt-3 text-xs text-text-muted">
        Deposits run for 15 years; the account matures 21 years after it&apos;s opened.
      </p>

      <div className="mt-5 rounded-xl border border-border bg-background p-5">
        <p className="label">Maturity value (after 21 years)</p>
        <p className="mt-1 font-display text-4xl font-medium text-primary">₹{grp(maturity)}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-text-muted">Total deposited</p>
            <p className="font-medium text-text-primary">₹{grp(deposited)}</p>
          </div>
          <div>
            <p className="text-text-muted">Total interest</p>
            <p className="font-medium text-secondary">₹{grp(interest)}</p>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-medium text-text-primary">
          Year-by-year balance
        </h3>
        <div className="mt-3 max-h-[420px] overflow-auto rounded-lg border border-border">
          <table className="w-full min-w-[420px] border-collapse text-left text-sm">
            <caption className="sr-only">
              Sukanya Samriddhi Yojana year-by-year deposit, interest earned and
              closing balance across the 21-year term
            </caption>
            <thead className="sticky top-0 bg-background">
              <tr className="border-b border-border">
                <th scope="col" className="px-3 py-2 font-medium text-text-primary">
                  Year
                </th>
                <th scope="col" className="px-3 py-2 font-medium text-text-primary">
                  Deposit
                </th>
                <th scope="col" className="px-3 py-2 font-medium text-text-primary">
                  Interest
                </th>
                <th scope="col" className="px-3 py-2 font-medium text-text-primary">
                  Closing balance
                </th>
              </tr>
            </thead>
            <tbody className="text-text-muted">
              {schedule.map((r) => (
                <tr
                  key={r.year}
                  className={
                    r.deposit === 0
                      ? "border-b border-border/60 bg-surface/40"
                      : "border-b border-border/60"
                  }
                >
                  <th
                    scope="row"
                    className="px-3 py-2 font-normal text-text-primary"
                  >
                    {r.year}
                  </th>
                  <td className="px-3 py-2">
                    {r.deposit ? `₹${grp(r.deposit)}` : "—"}
                  </td>
                  <td className="px-3 py-2 text-secondary">₹{grp(r.interest)}</td>
                  <td className="px-3 py-2 font-medium text-text-primary">
                    ₹{grp(r.closing)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-text-muted">
          Shaded rows are years 16–21, after deposits stop. The account keeps
          earning interest until maturity, which is where a large share of the
          final amount comes from.
        </p>
      </div>
    </div>
  );
}
