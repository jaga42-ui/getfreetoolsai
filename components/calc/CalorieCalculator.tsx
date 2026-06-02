"use client";

import { useMemo, useState } from "react";
import { SegmentedControl } from "@/components/ui";
import { grp } from "@/lib/calc";

type Unit = "metric" | "imperial";
const ACTIVITY = [
  { label: "Sedentary (little/no exercise)", mult: 1.2 },
  { label: "Lightly active (1–3 days/week)", mult: 1.375 },
  { label: "Moderately active (3–5 days/week)", mult: 1.55 },
  { label: "Very active (6–7 days/week)", mult: 1.725 },
  { label: "Extra active (athlete/physical job)", mult: 1.9 },
];
const GOALS = [
  { label: "Lose weight fast", delta: -500 },
  { label: "Lose weight", delta: -250 },
  { label: "Maintain weight", delta: 0 },
  { label: "Gain muscle", delta: 250 },
  { label: "Gain fast", delta: 500 },
];

export default function CalorieCalculator() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState(30);
  const [kg, setKg] = useState(70);
  const [cm, setCm] = useState(175);
  const [lbs, setLbs] = useState(154);
  const [ft, setFt] = useState(5);
  const [inch, setInch] = useState(9);
  const [mult, setMult] = useState(1.55);

  const { bmr, tdee, weightKg } = useMemo(() => {
    const w = unit === "metric" ? kg : lbs * 0.453592;
    const h = unit === "metric" ? cm : (ft * 12 + inch) * 2.54;
    const base = 10 * w + 6.25 * h - 5 * age + (gender === "male" ? 5 : -161);
    return { bmr: base, tdee: base * mult, weightKg: w };
  }, [unit, gender, age, kg, cm, lbs, ft, inch, mult]);

  // Macros for maintenance: protein 1.6 g/kg, fat 25% of calories, rest carbs.
  const proteinG = Math.round(1.6 * weightKg);
  const fatG = Math.round((tdee * 0.25) / 9);
  const carbsG = Math.round((tdee - proteinG * 4 - fatG * 9) / 4);

  const field = (label: string, value: number, set: (n: number) => void) => (
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

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="flex flex-wrap gap-3">
        <SegmentedControl<Unit>
          value={unit}
          onChange={setUnit}
          options={[
            { value: "metric", label: "Metric" },
            { value: "imperial", label: "Imperial" },
          ]}
        />
        <SegmentedControl<"male" | "female">
          value={gender}
          onChange={setGender}
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
          ]}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {field("Age", age, setAge)}
        {unit === "metric"
          ? field("Weight (kg)", kg, setKg)
          : field("Weight (lbs)", lbs, setLbs)}
        {unit === "metric" ? (
          field("Height (cm)", cm, setCm)
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {field("Height (ft)", ft, setFt)}
            {field("Height (in)", inch, setInch)}
          </div>
        )}
        <label className="block text-sm">
          <span className="mb-1 block text-text-muted">Activity level</span>
          <select
            value={mult}
            onChange={(e) => setMult(Number(e.target.value))}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
          >
            {ACTIVITY.map((a) => (
              <option key={a.mult} value={a.mult}>
                {a.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 grid gap-4 rounded-xl border border-border bg-background p-5 sm:grid-cols-2">
        <div>
          <p className="text-text-muted">BMR (base metabolic rate)</p>
          <p className="font-display text-2xl font-medium text-text-primary">
            {grp(bmr)} kcal
          </p>
        </div>
        <div>
          <p className="text-text-muted">TDEE (daily energy use)</p>
          <p className="font-display text-2xl font-medium text-primary">
            {grp(tdee)} kcal
          </p>
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-text-muted">
          Daily calories by goal
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {GOALS.map((g) => (
            <div key={g.label} className="rounded-lg border border-border bg-background p-3 text-sm">
              <p className="text-text-muted">{g.label}</p>
              <p className="font-medium text-text-primary">
                {grp(Math.max(0, tdee + g.delta))} kcal
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-border bg-background p-4 text-sm">
        <p className="font-medium text-text-primary">
          Suggested macros (at maintenance)
        </p>
        <div className="mt-2 grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-text-muted">Protein</p>
            <p className="font-medium text-text-primary">{proteinG} g</p>
          </div>
          <div>
            <p className="text-text-muted">Carbs</p>
            <p className="font-medium text-text-primary">{Math.max(0, carbsG)} g</p>
          </div>
          <div>
            <p className="text-text-muted">Fat</p>
            <p className="font-medium text-text-primary">{fatG} g</p>
          </div>
        </div>
      </div>
    </div>
  );
}
