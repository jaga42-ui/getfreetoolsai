"use client";

import { useMemo, useState } from "react";
import { grp } from "@/lib/calc";

const ZODIAC: [number, number, string][] = [
  [1, 20, "Aquarius"], [2, 19, "Pisces"], [3, 21, "Aries"], [4, 20, "Taurus"],
  [5, 21, "Gemini"], [6, 21, "Cancer"], [7, 23, "Leo"], [8, 23, "Virgo"],
  [9, 23, "Libra"], [10, 23, "Scorpio"], [11, 22, "Sagittarius"], [12, 22, "Capricorn"],
];
const CHINESE = ["Monkey","Rooster","Dog","Pig","Rat","Ox","Tiger","Rabbit","Dragon","Snake","Horse","Goat"];

function westernZodiac(m: number, d: number) {
  const z = ZODIAC[m - 1];
  if (d < z[1]) return m === 1 ? "Capricorn" : ZODIAC[m - 2][2];
  return z[2];
}
function generation(y: number) {
  if (y >= 2013) return "Gen Alpha";
  if (y >= 1997) return "Gen Z";
  if (y >= 1981) return "Millennial";
  if (y >= 1965) return "Gen X";
  if (y >= 1946) return "Baby Boomer";
  return "Silent Generation";
}

export default function AgeCalculator() {
  const today = new Date().toISOString().slice(0, 10);
  const [dob, setDob] = useState("");
  const [asOf, setAsOf] = useState(today);

  const result = useMemo(() => {
    if (!dob) return null;
    const b = new Date(dob + "T00:00:00");
    const n = new Date(asOf + "T00:00:00");
    if (isNaN(b.getTime()) || isNaN(n.getTime()) || n < b) return null;

    let years = n.getFullYear() - b.getFullYear();
    let months = n.getMonth() - b.getMonth();
    let days = n.getDate() - b.getDate();
    if (days < 0) {
      months--;
      days += new Date(n.getFullYear(), n.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    const totalDays = Math.floor((n.getTime() - b.getTime()) / 86400000);

    // Next birthday
    let nb = new Date(n.getFullYear(), b.getMonth(), b.getDate());
    if (nb < n) nb = new Date(n.getFullYear() + 1, b.getMonth(), b.getDate());
    const nextBirthday = Math.ceil((nb.getTime() - n.getTime()) / 86400000);

    return {
      years,
      months,
      days,
      totalMonths: years * 12 + months,
      totalWeeks: Math.floor(totalDays / 7),
      totalDays,
      totalHours: totalDays * 24,
      totalMinutes: totalDays * 24 * 60,
      nextBirthday,
      dayOfWeek: b.toLocaleDateString("en-US", { weekday: "long" }),
      western: westernZodiac(b.getMonth() + 1, b.getDate()),
      chinese: CHINESE[b.getFullYear() % 12],
      generation: generation(b.getFullYear()),
    };
  }, [dob, asOf]);

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block text-text-muted">Date of birth</span>
          <input
            type="date"
            value={dob}
            max={today}
            onChange={(e) => setDob(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-text-muted">Age as of</span>
          <input
            type="date"
            value={asOf}
            onChange={(e) => setAsOf(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
          />
        </label>
      </div>

      {result ? (
        <>
          <div className="mt-6 rounded-xl border border-border bg-background p-5 text-center">
            <p className="label">Your age</p>
            <p className="mt-1 font-display text-3xl font-medium text-primary sm:text-4xl">
              {result.years} years, {result.months} months, {result.days} days
            </p>
            <p className="mt-2 text-sm text-text-muted">
              🎂 Next birthday in {result.nextBirthday} days · born on a{" "}
              {result.dayOfWeek}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            {[
              ["Months", result.totalMonths],
              ["Weeks", result.totalWeeks],
              ["Days", result.totalDays],
              ["Hours", result.totalHours],
              ["Minutes", result.totalMinutes],
            ].map(([label, val]) => (
              <div
                key={label as string}
                className="rounded-lg border border-border bg-background p-3"
              >
                <p className="text-text-muted">{label}</p>
                <p className="font-medium text-text-primary">{grp(val as number)}</p>
              </div>
            ))}
            <div className="rounded-lg border border-border bg-background p-3">
              <p className="text-text-muted">Generation</p>
              <p className="font-medium text-text-primary">{result.generation}</p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-sm text-text-muted">
            <span className="rounded-md border border-border px-3 py-1.5">
              ⭐ {result.western}
            </span>
            <span className="rounded-md border border-border px-3 py-1.5">
              🐉 Year of the {result.chinese}
            </span>
          </div>
        </>
      ) : (
        <p className="mt-6 text-sm text-text-muted">
          Enter your date of birth to see your exact age and more.
        </p>
      )}
    </div>
  );
}
