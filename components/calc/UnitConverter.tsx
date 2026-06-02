"use client";

import { useMemo, useState } from "react";
import { Copy, Check } from "lucide-react";

type Factors = Record<string, number>;
const CATS: Record<string, Factors> = {
  Length: { mm: 0.001, cm: 0.01, m: 1, km: 1000, inch: 0.0254, foot: 0.3048, yard: 0.9144, mile: 1609.344 },
  Weight: { mg: 1e-6, g: 0.001, kg: 1, tonne: 1000, oz: 0.0283495, lb: 0.453592, stone: 6.35029 },
  Volume: { ml: 0.001, L: 1, "m³": 1000, "fl oz": 0.0295735, cup: 0.24, pint: 0.473176, quart: 0.946353, gallon: 3.78541 },
  Area: { "mm²": 1e-6, "cm²": 1e-4, "m²": 1, "km²": 1e6, "ft²": 0.092903, "yd²": 0.836127, acre: 4046.86, hectare: 10000 },
  Speed: { "m/s": 1, "km/h": 0.277778, mph: 0.44704, knot: 0.514444 },
  Data: { bit: 0.125, byte: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776 },
  Time: { sec: 1, min: 60, hour: 3600, day: 86400, week: 604800, year: 31536000 },
  Temperature: { "°C": 1, "°F": 1, K: 1 },
};

function toC(v: number, u: string) {
  return u === "°C" ? v : u === "°F" ? ((v - 32) * 5) / 9 : v - 273.15;
}
function fromC(c: number, u: string) {
  return u === "°C" ? c : u === "°F" ? (c * 9) / 5 + 32 : c + 273.15;
}

export default function UnitConverter() {
  const cats = Object.keys(CATS);
  const [cat, setCat] = useState("Length");
  const [value, setValue] = useState(1);
  const units = Object.keys(CATS[cat]);
  const [from, setFrom] = useState(units[0]);
  const [copied, setCopied] = useState("");

  const results = useMemo(() => {
    return units.map((u) => {
      let out: number;
      if (cat === "Temperature") {
        out = fromC(toC(value, from), u);
      } else {
        out = (value * CATS[cat][from]) / CATS[cat][u];
      }
      return { unit: u, value: out };
    });
  }, [cat, value, from, units]);

  const fmtN = (n: number) =>
    Number.isFinite(n)
      ? Math.abs(n) >= 1e9 || (Math.abs(n) < 1e-4 && n !== 0)
        ? n.toExponential(4)
        : parseFloat(n.toFixed(6)).toLocaleString("en-US")
      : "—";

  const copy = (s: string) => {
    navigator.clipboard?.writeText(s).then(() => {
      setCopied(s);
      setTimeout(() => setCopied(""), 1200);
    });
  };

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="flex flex-wrap gap-2">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => {
              setCat(c);
              setFrom(Object.keys(CATS[c])[0]);
            }}
            className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
              cat === c
                ? "border-primary bg-primary/10 text-text-primary"
                : "border-border text-text-muted hover:text-text-primary"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block text-text-muted">Value</span>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-text-muted">From unit</span>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
          >
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {results.map((r) => (
          <button
            key={r.unit}
            onClick={() => copy(fmtN(r.value))}
            className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-left text-sm hover:border-primary/50"
          >
            <span className="text-text-muted">{r.unit}</span>
            <span className="flex items-center gap-2 font-medium text-text-primary">
              {fmtN(r.value)}
              {copied === fmtN(r.value) ? (
                <Check className="h-3.5 w-3.5 text-secondary" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-text-muted" />
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
