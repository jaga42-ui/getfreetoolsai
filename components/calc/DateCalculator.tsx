"use client";

import { useState } from "react";
import { SegmentedControl } from "@/components/ui";
import { grp } from "@/lib/calc";

type Mode = "diff" | "addsub" | "week";

function isoWeek(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - day + 3);
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  const diff = date.getTime() - firstThursday.getTime();
  return 1 + Math.round(diff / 604800000);
}

function businessDays(a: Date, b: Date): number {
  let count = 0;
  const cur = new Date(a);
  while (cur < b) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

export default function DateCalculator() {
  const today = new Date().toISOString().slice(0, 10);
  const [mode, setMode] = useState<Mode>("diff");
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(today);
  const [days, setDays] = useState(90);
  const [op, setOp] = useState<"add" | "sub">("add");
  const [single, setSingle] = useState(today);

  const Box = ({ children }: { children: React.ReactNode }) => (
    <div className="mt-6 rounded-xl border border-border bg-background p-5 text-sm">
      {children}
    </div>
  );
  const dateInput = (label: string, v: string, set: (s: string) => void) => (
    <label className="block text-sm">
      <span className="mb-1 block text-text-muted">{label}</span>
      <input
        type="date"
        value={v}
        onChange={(e) => set(e.target.value)}
        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
      />
    </label>
  );

  let diff = null as null | { y: number; m: number; d: number; days: number; biz: number };
  if (mode === "diff") {
    const a = new Date(start + "T00:00:00");
    const b = new Date(end + "T00:00:00");
    if (!isNaN(a.getTime()) && !isNaN(b.getTime()) && b >= a) {
      let y = b.getFullYear() - a.getFullYear();
      let m = b.getMonth() - a.getMonth();
      let d = b.getDate() - a.getDate();
      if (d < 0) {
        m--;
        d += new Date(b.getFullYear(), b.getMonth(), 0).getDate();
      }
      if (m < 0) {
        y--;
        m += 12;
      }
      const totalDays = Math.round((b.getTime() - a.getTime()) / 86400000);
      diff = { y, m, d, days: totalDays, biz: businessDays(a, b) };
    }
  }

  const resultDate = (() => {
    if (mode !== "addsub") return null;
    const s = new Date(single + "T00:00:00");
    if (isNaN(s.getTime())) return null;
    s.setDate(s.getDate() + (op === "add" ? days : -days));
    return s;
  })();

  const weekInfo = (() => {
    if (mode !== "week") return null;
    const d = new Date(start + "T00:00:00");
    if (isNaN(d.getTime())) return null;
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const yearEnd = new Date(d.getFullYear(), 11, 31);
    return {
      week: isoWeek(d),
      quarter: Math.floor(d.getMonth() / 3) + 1,
      sinceStart: Math.round((d.getTime() - yearStart.getTime()) / 86400000),
      untilEnd: Math.round((yearEnd.getTime() - d.getTime()) / 86400000),
    };
  })();

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <SegmentedControl<Mode>
        value={mode}
        onChange={setMode}
        options={[
          { value: "diff", label: "Date difference" },
          { value: "addsub", label: "Add / subtract" },
          { value: "week", label: "Week number" },
        ]}
      />

      {mode === "diff" && (
        <>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {dateInput("From", start, setStart)}
            {dateInput("To", end, setEnd)}
          </div>
          {diff && (
            <Box>
              <p className="font-display text-2xl font-medium text-primary">
                {diff.y} years, {diff.m} months, {diff.d} days
              </p>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <div>
                  <p className="text-text-muted">Total days</p>
                  <p className="font-medium text-text-primary">{grp(diff.days)}</p>
                </div>
                <div>
                  <p className="text-text-muted">Total weeks</p>
                  <p className="font-medium text-text-primary">{grp(Math.floor(diff.days / 7))}</p>
                </div>
                <div>
                  <p className="text-text-muted">Business days</p>
                  <p className="font-medium text-text-primary">{grp(diff.biz)}</p>
                </div>
              </div>
            </Box>
          )}
        </>
      )}

      {mode === "addsub" && (
        <>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {dateInput("Start date", single, setSingle)}
            <div className="flex items-end gap-2">
              <SegmentedControl<"add" | "sub">
                value={op}
                onChange={setOp}
                options={[
                  { value: "add", label: "Add" },
                  { value: "sub", label: "Subtract" },
                ]}
              />
              <input
                type="number"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-24 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
                aria-label="Days"
              />
              <span className="pb-2 text-sm text-text-muted">days</span>
            </div>
          </div>
          {resultDate && (
            <Box>
              <p className="text-text-muted">Resulting date</p>
              <p className="font-display text-2xl font-medium text-primary">
                {resultDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </Box>
          )}
        </>
      )}

      {mode === "week" && (
        <>
          <div className="mt-4 sm:w-1/2">{dateInput("Date", start, setStart)}</div>
          {weekInfo && (
            <Box>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-text-muted">ISO week number</p>
                  <p className="font-display text-2xl font-medium text-primary">
                    Week {weekInfo.week}
                  </p>
                </div>
                <div>
                  <p className="text-text-muted">Quarter</p>
                  <p className="font-display text-2xl font-medium text-text-primary">
                    Q{weekInfo.quarter}
                  </p>
                </div>
                <div>
                  <p className="text-text-muted">Days since Jan 1</p>
                  <p className="font-medium text-text-primary">{weekInfo.sinceStart}</p>
                </div>
                <div>
                  <p className="text-text-muted">Days until year end</p>
                  <p className="font-medium text-text-primary">{weekInfo.untilEnd}</p>
                </div>
              </div>
            </Box>
          )}
        </>
      )}
    </div>
  );
}
