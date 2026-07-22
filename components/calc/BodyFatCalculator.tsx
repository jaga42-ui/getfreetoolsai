"use client";

import { useMemo, useState } from "react";
import { SegmentedControl } from "@/components/ui";
import { fmt } from "@/lib/calc";

type Sex = "male" | "female";
type Units = "metric" | "imperial";

function Field({
  label,
  value,
  set,
  unit,
}: {
  label: string;
  value: number;
  set: (n: number) => void;
  unit: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-text-muted">
        {label} <span className="text-text-muted/70">({unit})</span>
      </span>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
      />
    </label>
  );
}

function category(bf: number, sex: Sex): string {
  const male = [
    [5, "Essential fat"],
    [13, "Athletes"],
    [17, "Fitness"],
    [24, "Average"],
  ] as const;
  const female = [
    [13, "Essential fat"],
    [20, "Athletes"],
    [24, "Fitness"],
    [31, "Average"],
  ] as const;
  for (const [max, label] of sex === "male" ? male : female)
    if (bf <= max) return label;
  return "Obese";
}

export default function BodyFatCalculator() {
  const [sex, setSex] = useState<Sex>("male");
  const [units, setUnits] = useState<Units>("metric");
  const [height, setHeight] = useState(175);
  const [neck, setNeck] = useState(38);
  const [waist, setWaist] = useState(85);
  const [hip, setHip] = useState(95);
  const [weight, setWeight] = useState(75);

  const lenUnit = units === "metric" ? "cm" : "in";
  const wtUnit = units === "metric" ? "kg" : "lb";

  const result = useMemo(() => {
    const k = units === "metric" ? 1 : 2.54; // to cm
    const h = height * k;
    const n = neck * k;
    const w = waist * k;
    const hp = hip * k;
    const inner =
      sex === "male" ? w - n : w + hp - n;
    if (inner <= 0 || h <= 0) return null;
    const bf =
      sex === "male"
        ? 495 /
            (1.0324 -
              0.19077 * Math.log10(inner) +
              0.15456 * Math.log10(h)) -
          450
        : 495 /
            (1.29579 -
              0.35004 * Math.log10(inner) +
              0.221 * Math.log10(h)) -
          450;
    if (!isFinite(bf) || bf <= 0) return null;
    const pct = Math.min(bf, 75);
    const fatMass = (pct / 100) * weight;
    return { pct, fatMass, leanMass: weight - fatMass, label: category(pct, sex) };
  }, [sex, units, height, neck, waist, hip, weight]);

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <span className="mb-1.5 block text-sm text-text-muted">Sex</span>
          <SegmentedControl<Sex>
            value={sex}
            onChange={setSex}
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
          />
        </div>
        <div>
          <span className="mb-1.5 block text-sm text-text-muted">Units</span>
          <SegmentedControl<Units>
            value={units}
            onChange={setUnits}
            options={[
              { value: "metric", label: "Metric" },
              { value: "imperial", label: "Imperial" },
            ]}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Height" value={height} set={setHeight} unit={lenUnit} />
        <Field label="Neck" value={neck} set={setNeck} unit={lenUnit} />
        <Field label="Waist" value={waist} set={setWaist} unit={lenUnit} />
        {sex === "female" && (
          <Field label="Hip" value={hip} set={setHip} unit={lenUnit} />
        )}
        <Field label="Weight" value={weight} set={setWeight} unit={wtUnit} />
      </div>

      {result ? (
        <div className="mt-6 rounded-xl border border-border bg-background p-5">
          <p className="label">Body fat</p>
          <p className="mt-1 font-display text-4xl font-medium text-primary">
            {fmt(result.pct, 1)}%
            <span className="ml-2 align-middle text-base font-normal text-secondary">
              {result.label}
            </span>
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-text-muted">Fat mass</p>
              <p className="font-medium text-text-primary">
                {fmt(result.fatMass, 1)} {wtUnit}
              </p>
            </div>
            <div>
              <p className="text-text-muted">Lean mass</p>
              <p className="font-medium text-text-primary">
                {fmt(result.leanMass, 1)} {wtUnit}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-6 rounded-xl border border-dashed border-border bg-background p-5 text-sm text-text-muted">
          Enter your measurements — waist must be larger than neck
          {sex === "female" ? " (waist + hip)" : ""} for a valid estimate.
        </p>
      )}

      <p className="mt-4 text-xs leading-relaxed text-text-muted">
        Uses the U.S. Navy circumference method. Measure at the belly button
        (waist), below the larynx (neck){sex === "female" ? " and the widest part of the hips" : ""}.
      </p>
    </div>
  );
}
