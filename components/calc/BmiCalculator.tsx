"use client";

import { useMemo, useState } from "react";
import { SegmentedControl } from "@/components/ui";
import { fmt } from "@/lib/calc";

type Unit = "metric" | "imperial";

const CATEGORIES = [
  { max: 18.5, label: "Underweight", color: "text-sky-500" },
  { max: 25, label: "Normal weight", color: "text-secondary" },
  { max: 30, label: "Overweight", color: "text-yellow-600" },
  { max: 35, label: "Obese Class I", color: "text-orange-500" },
  { max: 40, label: "Obese Class II", color: "text-red-500" },
  { max: Infinity, label: "Obese Class III", color: "text-red-600" },
];

function categoryFor(bmi: number) {
  return CATEGORIES.find((c) => bmi < c.max) ?? CATEGORIES[CATEGORIES.length - 1];
}

export default function BmiCalculator() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [kg, setKg] = useState(70);
  const [cm, setCm] = useState(175);
  const [lbs, setLbs] = useState(154);
  const [ft, setFt] = useState(5);
  const [inch, setInch] = useState(9);

  const { bmi, heightM } = useMemo(() => {
    if (unit === "metric") {
      const m = cm / 100;
      return { bmi: m > 0 ? kg / (m * m) : 0, heightM: m };
    }
    const totalIn = ft * 12 + inch;
    const m = totalIn * 0.0254;
    return {
      bmi: totalIn > 0 ? (lbs / (totalIn * totalIn)) * 703 : 0,
      heightM: m,
    };
  }, [unit, kg, cm, lbs, ft, inch]);

  const cat = categoryFor(bmi);
  const lowKg = 18.5 * heightM * heightM;
  const highKg = 24.9 * heightM * heightM;
  // Position on a 15–40 gauge.
  const pos = Math.max(0, Math.min(100, ((bmi - 15) / (40 - 15)) * 100));

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
      <SegmentedControl<Unit>
        value={unit}
        onChange={setUnit}
        options={[
          { value: "metric", label: "Metric (kg/cm)" },
          { value: "imperial", label: "Imperial (lbs/ft)" },
        ]}
      />

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {unit === "metric" ? (
          <>
            {field("Weight (kg)", kg, setKg)}
            {field("Height (cm)", cm, setCm)}
          </>
        ) : (
          <>
            {field("Weight (lbs)", lbs, setLbs)}
            <div className="grid grid-cols-2 gap-3">
              {field("Height (ft)", ft, setFt)}
              {field("Height (in)", inch, setInch)}
            </div>
          </>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-border bg-background p-5 text-center">
        <p className="label">Your BMI</p>
        <p className="mt-1 font-display text-5xl font-medium text-text-primary">
          {fmt(bmi, 1)}
        </p>
        <p className={`mt-1 text-lg font-medium ${cat.color}`}>{cat.label}</p>

        <div className="relative mt-5 h-2 rounded-full bg-gradient-to-r from-sky-400 via-secondary to-red-500">
          <div
            className="absolute -top-1 h-4 w-1 -translate-x-1/2 rounded bg-text-primary"
            style={{ left: `${pos}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-[11px] text-text-muted">
          <span>15</span>
          <span>18.5</span>
          <span>25</span>
          <span>30</span>
          <span>40</span>
        </div>

        {heightM > 0 && (
          <p className="mt-4 text-sm text-text-muted">
            For your height, a healthy weight is{" "}
            <span className="font-medium text-text-primary">
              {fmt(lowKg, 1)}–{fmt(highKg, 1)} kg
            </span>
            .
          </p>
        )}
      </div>
    </div>
  );
}
