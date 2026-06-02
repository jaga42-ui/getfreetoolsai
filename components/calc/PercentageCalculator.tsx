"use client";

import { useState } from "react";
import { fmt } from "@/lib/calc";

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <p className="font-display text-base font-medium text-text-primary">
        {title}
      </p>
      <div className="mt-3 space-y-3">{children}</div>
    </div>
  );
}

function Num({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      placeholder={label}
      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/60 focus:border-primary focus:outline-none"
    />
  );
}

function Result({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-text-primary">
      {children}
    </p>
  );
}

const n = (s: string) => (s === "" ? NaN : Number(s));
const ok = (...v: number[]) => v.every((x) => isFinite(x));

export default function PercentageCalculator() {
  // Mode 1
  const [a1, setA1] = useState("15");
  const [b1, setB1] = useState("200");
  // Mode 2
  const [a2, setA2] = useState("30");
  const [b2, setB2] = useState("200");
  // Mode 3
  const [oldV, setOldV] = useState("150");
  const [newV, setNewV] = useState("200");
  // Mode 4/5
  const [base, setBase] = useState("200");
  const [pct, setPct] = useState("15");
  // Mode 6
  const [x6, setX6] = useState("30");
  const [p6, setP6] = useState("15");
  // Mode 7
  const [v1, setV1] = useState("150");
  const [v2, setV2] = useState("200");

  const change = ok(n(oldV), n(newV)) && n(oldV) !== 0 ? ((n(newV) - n(oldV)) / n(oldV)) * 100 : NaN;

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Panel title="What is X% of Y?">
          <div className="flex items-center gap-2">
            <Num value={a1} onChange={setA1} label="X" />
            <span className="text-text-muted">% of</span>
            <Num value={b1} onChange={setB1} label="Y" />
          </div>
          {ok(n(a1), n(b1)) && <Result>= {fmt((n(a1) / 100) * n(b1))}</Result>}
        </Panel>

        <Panel title="X is what % of Y?">
          <div className="flex items-center gap-2">
            <Num value={a2} onChange={setA2} label="X" />
            <span className="text-text-muted">of</span>
            <Num value={b2} onChange={setB2} label="Y" />
          </div>
          {ok(n(a2), n(b2)) && n(b2) !== 0 && (
            <Result>= {fmt((n(a2) / n(b2)) * 100)}%</Result>
          )}
        </Panel>

        <Panel title="Percentage change">
          <div className="flex items-center gap-2">
            <Num value={oldV} onChange={setOldV} label="From" />
            <span className="text-text-muted">→</span>
            <Num value={newV} onChange={setNewV} label="To" />
          </div>
          {isFinite(change) && (
            <Result>
              = {fmt(Math.abs(change))}% {change >= 0 ? "increase" : "decrease"}
            </Result>
          )}
        </Panel>

        <Panel title="Add % to a number">
          <div className="flex items-center gap-2">
            <Num value={base} onChange={setBase} label="Number" />
            <span className="text-text-muted">+</span>
            <Num value={pct} onChange={setPct} label="%" />
          </div>
          {ok(n(base), n(pct)) && (
            <Result>= {fmt(n(base) + (n(base) * n(pct)) / 100)}</Result>
          )}
        </Panel>

        <Panel title="Subtract % from a number">
          <div className="flex items-center gap-2">
            <Num value={base} onChange={setBase} label="Number" />
            <span className="text-text-muted">−</span>
            <Num value={pct} onChange={setPct} label="%" />
          </div>
          {ok(n(base), n(pct)) && (
            <Result>= {fmt(n(base) - (n(base) * n(pct)) / 100)}</Result>
          )}
        </Panel>

        <Panel title="Reverse percentage (X is Y% of?)">
          <div className="flex items-center gap-2">
            <Num value={x6} onChange={setX6} label="X" />
            <span className="text-text-muted">is</span>
            <Num value={p6} onChange={setP6} label="Y" />
            <span className="text-text-muted">% of</span>
          </div>
          {ok(n(x6), n(p6)) && n(p6) !== 0 && (
            <Result>= {fmt(n(x6) / (n(p6) / 100))}</Result>
          )}
        </Panel>

        <Panel title="Percentage difference">
          <div className="flex items-center gap-2">
            <Num value={v1} onChange={setV1} label="Value 1" />
            <span className="text-text-muted">vs</span>
            <Num value={v2} onChange={setV2} label="Value 2" />
          </div>
          {ok(n(v1), n(v2)) && n(v1) + n(v2) !== 0 && (
            <Result>
              ={" "}
              {fmt(
                (Math.abs(n(v1) - n(v2)) / ((n(v1) + n(v2)) / 2)) * 100
              )}
              %
            </Result>
          )}
        </Panel>
      </div>
    </div>
  );
}
