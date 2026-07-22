"use client";

import { useMemo, useState } from "react";

/** Parse a yyyy-mm-dd input value into a local Date at noon (TZ-safe). */
function parseDate(v: string): Date | null {
  if (!v) return null;
  const [y, m, d] = v.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d, 12, 0, 0);
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

const LONG = { weekday: "long", year: "numeric", month: "long", day: "numeric" } as const;

export default function DueDateCalculator() {
  const [lmp, setLmp] = useState("");
  const [cycle, setCycle] = useState(28);

  const result = useMemo(() => {
    const start = parseDate(lmp);
    if (!start) return null;
    // Naegele's rule, adjusted for cycle length (28-day baseline).
    const due = addDays(start, 280 + (cycle - 28));
    const conception = addDays(start, cycle - 14);
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const diffDays = Math.floor(
      (today.getTime() - start.getTime()) / 86400000
    );
    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;
    const trimester =
      weeks < 0 ? 0 : weeks < 13 ? 1 : weeks < 27 ? 2 : 3;
    const daysLeft = Math.ceil((due.getTime() - today.getTime()) / 86400000);
    return { due, conception, weeks, days, trimester, daysLeft, diffDays };
  }, [lmp, cycle]);

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block text-text-muted">
            First day of last period (LMP)
          </span>
          <input
            type="date"
            value={lmp}
            onChange={(e) => setLmp(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-text-muted">
            Average cycle length (days)
          </span>
          <input
            type="number"
            min={20}
            max={45}
            value={cycle}
            onChange={(e) => setCycle(Number(e.target.value))}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
          />
        </label>
      </div>

      {result ? (
        <div className="mt-6 rounded-xl border border-border bg-background p-5">
          <p className="label">Estimated due date</p>
          <p className="mt-1 font-display text-3xl font-medium text-primary sm:text-4xl">
            {result.due.toLocaleDateString("en-US", LONG)}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            <div>
              <p className="text-text-muted">How far along</p>
              <p className="font-medium text-text-primary">
                {result.diffDays < 0
                  ? "Not yet"
                  : `${result.weeks}w ${result.days}d`}
              </p>
            </div>
            <div>
              <p className="text-text-muted">Trimester</p>
              <p className="font-medium text-text-primary">
                {result.trimester === 0
                  ? "—"
                  : ["", "First", "Second", "Third"][result.trimester]}
              </p>
            </div>
            <div>
              <p className="text-text-muted">Days to go</p>
              <p className="font-medium text-secondary">
                {result.daysLeft > 0 ? result.daysLeft : "Due / overdue"}
              </p>
            </div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-text-muted">
            Estimated conception around{" "}
            {result.conception.toLocaleDateString("en-US", LONG)}. Only about 5%
            of babies arrive on the exact due date.
          </p>
        </div>
      ) : (
        <p className="mt-6 rounded-xl border border-dashed border-border bg-background p-5 text-sm text-text-muted">
          Enter the first day of your last menstrual period to see your due date.
        </p>
      )}
    </div>
  );
}
