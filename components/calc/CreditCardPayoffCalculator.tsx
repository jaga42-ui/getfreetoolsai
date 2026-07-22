"use client";

import { useMemo, useState } from "react";
import { SegmentedControl } from "@/components/ui";
import { monthlyPayment, usd } from "@/lib/calc";

type Mode = "payment" | "timeframe";

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

export default function CreditCardPayoffCalculator() {
  const [mode, setMode] = useState<Mode>("payment");
  const [balance, setBalance] = useState(6000);
  const [apr, setApr] = useState(22);
  const [payment, setPayment] = useState(250);
  const [months, setMonths] = useState(24);

  const r = useMemo(() => {
    const rate = apr / 12 / 100;

    if (mode === "timeframe") {
      const n = Math.max(1, Math.round(months));
      const pay = monthlyPayment(balance, apr, n);
      const interest = pay * n - balance;
      return { neverPaysOff: false, months: n, payment: pay, interest, totalPaid: pay * n };
    }

    // mode === "payment": simulate to a payoff, capped at ~100 years.
    if (payment <= balance * rate + 1e-9 && rate > 0) {
      return { neverPaysOff: true, months: 0, payment, interest: 0, totalPaid: 0 };
    }
    let bal = balance;
    let interest = 0;
    let n = 0;
    while (bal > 0 && n < 1200) {
      const i = bal * rate;
      interest += i;
      bal = bal + i - payment;
      n++;
    }
    // The final payment is only the remaining balance (bal is negative here).
    const totalPaid = balance + interest;
    return { neverPaysOff: false, months: n, payment, interest, totalPaid };
  }, [mode, balance, apr, payment, months]);

  const yrs = Math.floor(r.months / 12);
  const rem = r.months % 12;
  const timeLabel =
    r.months === 0
      ? "—"
      : [yrs > 0 ? `${yrs} yr${yrs > 1 ? "s" : ""}` : "", rem > 0 ? `${rem} mo` : ""]
          .filter(Boolean)
          .join(" ") || "0 mo";

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="mb-4">
        <span className="mb-1.5 block text-sm text-text-muted">Calculate by</span>
        <SegmentedControl<Mode>
          value={mode}
          onChange={setMode}
          options={[
            { value: "payment", label: "Monthly payment" },
            { value: "timeframe", label: "Target timeframe" },
          ]}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Card balance ($)" value={balance} set={setBalance} />
        <Field label="Interest rate (% APR)" value={apr} set={setApr} step={0.1} />
        {mode === "payment" ? (
          <Field label="Monthly payment ($)" value={payment} set={setPayment} />
        ) : (
          <Field label="Pay off in (months)" value={months} set={setMonths} />
        )}
      </div>

      <div className="mt-6 rounded-xl border border-border bg-background p-5">
        {r.neverPaysOff ? (
          <p className="text-sm font-medium text-red-400">
            At {usd(payment)}/month the balance never gets paid off — your payment
            barely covers the monthly interest. Increase the payment above{" "}
            {usd((balance * apr) / 12 / 100, 2)}.
          </p>
        ) : mode === "payment" ? (
          <>
            <p className="label">Time to pay off</p>
            <p className="mt-1 font-display text-4xl font-medium text-primary">{timeLabel}</p>
            <p className="mt-1 text-xs text-text-muted">{r.months} monthly payments</p>
          </>
        ) : (
          <>
            <p className="label">Required monthly payment</p>
            <p className="mt-1 font-display text-4xl font-medium text-primary">
              {usd(r.payment, 2)}
            </p>
            <p className="mt-1 text-xs text-text-muted">to clear the balance in {timeLabel}</p>
          </>
        )}

        {!r.neverPaysOff && (
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
            <div>
              <p className="text-text-muted">Total interest</p>
              <p className="font-medium text-secondary">{usd(r.interest)}</p>
            </div>
            <div>
              <p className="text-text-muted">Total paid</p>
              <p className="font-medium text-text-primary">{usd(r.totalPaid)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
