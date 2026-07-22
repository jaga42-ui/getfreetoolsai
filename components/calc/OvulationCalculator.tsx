"use client";

import { useMemo, useState } from "react";

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

const MED = { weekday: "short", month: "short", day: "numeric" } as const;
const LONG = { weekday: "long", month: "long", day: "numeric" } as const;

export default function OvulationCalculator() {
  const [lmp, setLmp] = useState("");
  const [cycle, setCycle] = useState(28);

  const result = useMemo(() => {
    const start = parseDate(lmp);
    if (!start) return null;
    const nextPeriod = addDays(start, cycle);
    // Ovulation ~14 days before the next period (luteal phase).
    const ovulation = addDays(nextPeriod, -14);
    const fertileStart = addDays(ovulation, -5);
    const fertileEnd = addDays(ovulation, 1);
    const dueDate = addDays(ovulation, 266); // ~38 weeks from conception
    return { ovulation, fertileStart, fertileEnd, nextPeriod, dueDate };
  }, [lmp, cycle]);

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block text-text-muted">
            First day of last period
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
          <p className="label">Fertile window</p>
          <p className="mt-1 font-display text-2xl font-medium text-primary sm:text-3xl">
            {result.fertileStart.toLocaleDateString("en-US", MED)} –{" "}
            {result.fertileEnd.toLocaleDateString("en-US", MED)}
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
            <div>
              <p className="text-text-muted">Most fertile (ovulation)</p>
              <p className="font-medium text-secondary">
                {result.ovulation.toLocaleDateString("en-US", LONG)}
              </p>
            </div>
            <div>
              <p className="text-text-muted">Next period expected</p>
              <p className="font-medium text-text-primary">
                {result.nextPeriod.toLocaleDateString("en-US", MED)}
              </p>
            </div>
            <div>
              <p className="text-text-muted">Due date if you conceive</p>
              <p className="font-medium text-text-primary">
                {result.dueDate.toLocaleDateString("en-US", MED)}
              </p>
            </div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-text-muted">
            Your chance of conceiving is highest on ovulation day and the two days
            before it. This estimate assumes regular cycles and a 14-day luteal
            phase.
          </p>
        </div>
      ) : (
        <p className="mt-6 rounded-xl border border-dashed border-border bg-background p-5 text-sm text-text-muted">
          Enter the first day of your last period to see your fertile window.
        </p>
      )}
    </div>
  );
}
