"use client";

import { useId, useLayoutEffect, useMemo, useRef, useState } from "react";

/**
 * Two-series categorical palette for the finance charts.
 *
 * Validated against the cream chart surface (#f4efe4): OKLab ΔE 18.8 under
 * protanopia, 25.4 under normal vision, both above the ΔE 8 target, with
 * chroma and 3:1 surface contrast passing for both slots.
 *
 * Do NOT substitute the brand's forest green (#4b6b4e) for the blue: the
 * terracotta↔forest pair collapses to ΔE 3.6 under protanopia, which makes the
 * stacked bands indistinguishable for red-green colourblind readers.
 */
export const SERIES = {
  /** Money the saver or borrower put in. */
  contributed: "#2563a8",
  /** Money the interest produced (or cost). */
  interest: "#b25733",
} as const;

/** Chart surface — the gap colour that separates adjacent stacked fills. */
const SURFACE = "#f4efe4";

const VB_H = 240;
const PAD = { top: 14, right: 12, bottom: 30, left: 52 };
const PLOT_H = VB_H - PAD.top - PAD.bottom;

/**
 * Track the element's rendered width so the SVG viewBox can match CSS pixels
 * 1:1. Scaling a fixed viewBox to the container instead would stretch the axis
 * text horizontally — badly so on a phone, where a 600-unit box renders into
 * about 300px and every label ends up half-width.
 */
function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(600);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const sync = () => setWidth(Math.max(240, Math.round(el.getBoundingClientRect().width)));
    sync();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, width };
}

export type StackPoint = {
  /** x-axis tick label, e.g. a year number. */
  label: string;
  /** Bottom band — contributions / principal. */
  contributed: number;
  /** Top band — interest earned or paid. */
  interest: number;
};

/**
 * Stacked area chart of contributions vs interest over time, with a crosshair
 * and tooltip on hover. Pure SVG — no charting library, no runtime dependency.
 *
 * The wrapper reserves its height up front so the chart appearing never shifts
 * the content below it.
 */
export function StackedAreaChart({
  points,
  format,
  contributedLabel = "Contributions",
  interestLabel = "Interest",
  caption,
}: {
  points: StackPoint[];
  /** Formats a value for the y-axis ticks and the tooltip. */
  format: (n: number) => string;
  contributedLabel?: string;
  interestLabel?: string;
  /** Accessible summary of what the chart shows. */
  caption: string;
}) {
  const titleId = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const { ref: boxRef, width: vbW } = useElementWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const plotW = vbW - PAD.left - PAD.right;

  const { xFor, yFor, contribPath, totalPath, ticks } = useMemo(() => {
    const totals = points.map((p) => p.contributed + p.interest);
    const rawMax = Math.max(1, ...totals);
    // Round the axis top to a clean step so the tick labels read well.
    const step = Math.pow(10, Math.floor(Math.log10(rawMax)));
    const m = Math.ceil(rawMax / (step / 2)) * (step / 2);

    const x = (i: number) =>
      PAD.left + (points.length <= 1 ? plotW : (i / (points.length - 1)) * plotW);
    const y = (v: number) => PAD.top + PLOT_H - (v / m) * PLOT_H;

    const line = (vals: number[]) =>
      vals.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

    const contribVals = points.map((p) => p.contributed);
    const totalVals = totals;
    const base = `L${x(points.length - 1).toFixed(1)},${y(0).toFixed(1)} L${x(0).toFixed(1)},${y(0).toFixed(1)} Z`;

    return {
      xFor: x,
      yFor: y,
      contribPath: `${line(contribVals)} ${base}`,
      // The interest band is the whole stack; the contributions band is painted
      // on top of it, so the visible terracotta area is the interest portion.
      totalPath: `${line(totalVals)} ${base}`,
      ticks: [0, m / 2, m],
    };
  }, [points, plotW]);

  const active = hover != null ? points[hover] : null;

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg || points.length === 0) return;
    const rect = svg.getBoundingClientRect();
    const rel = ((e.clientX - rect.left) / rect.width) * vbW;
    const frac = (rel - PAD.left) / plotW;
    const i = Math.round(frac * (points.length - 1));
    setHover(Math.min(points.length - 1, Math.max(0, i)));
  };

  // Show at most ~7 x labels so they never collide on a narrow screen.
  const labelEvery = Math.max(1, Math.ceil(points.length / 7));

  return (
    <figure className="m-0">
      <div ref={boxRef} className="relative h-[240px] w-full">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${vbW} ${VB_H}`}
          width="100%"
          height="240"
          role="img"
          aria-labelledby={titleId}
          className="block h-full w-full touch-none"
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
        >
          <title id={titleId}>{caption}</title>

          {/* Recessive gridlines and y-axis ticks. */}
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={PAD.left}
                y1={yFor(t)}
                x2={vbW - PAD.right}
                y2={yFor(t)}
                stroke="#e4ddcd"
                strokeWidth={1}
              />
              <text
                x={PAD.left - 8}
                y={yFor(t) + 4}
                textAnchor="end"
                fontSize={11}
                fill="#6c675c"
              >
                {format(t)}
              </text>
            </g>
          ))}

          {/* Interest band (the full stack, painted first). */}
          <path d={totalPath} fill={SERIES.interest} fillOpacity={0.9} />
          {/* Contributions band, over the top. The 2px surface stroke is the
              gap that keeps the two fills from touching. */}
          <path
            d={contribPath}
            fill={SERIES.contributed}
            fillOpacity={0.95}
            stroke={SURFACE}
            strokeWidth={2}
          />

          {/* x-axis baseline. */}
          <line
            x1={PAD.left}
            y1={yFor(0)}
            x2={vbW - PAD.right}
            y2={yFor(0)}
            stroke="#c9c0ab"
            strokeWidth={1}
          />

          {points.map((p, i) =>
            i % labelEvery === 0 || i === points.length - 1 ? (
              <text
                key={p.label}
                x={xFor(i)}
                y={VB_H - 10}
                textAnchor="middle"
                fontSize={11}
                fill="#6c675c"
              >
                {p.label}
              </text>
            ) : null
          )}

          {/* Crosshair. */}
          {hover != null && (
            <g pointerEvents="none">
              <line
                x1={xFor(hover)}
                y1={PAD.top}
                x2={xFor(hover)}
                y2={yFor(0)}
                stroke="#211f1a"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
              <circle
                cx={xFor(hover)}
                cy={yFor(points[hover].contributed + points[hover].interest)}
                r={4}
                fill={SERIES.interest}
                stroke={SURFACE}
                strokeWidth={2}
              />
            </g>
          )}
        </svg>

        {active && hover != null && (
          <div
            className="pointer-events-none absolute top-2 z-10 min-w-[9.5rem] -translate-x-1/2 rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-sm"
            style={{
              left: `${Math.min(88, Math.max(12, (xFor(hover) / vbW) * 100))}%`,
            }}
          >
            <p className="font-medium text-text-primary">{active.label}</p>
            <p className="mt-1.5 flex items-center justify-between gap-3 text-text-muted">
              <span className="flex items-center gap-1.5">
                <span
                  aria-hidden
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: SERIES.contributed }}
                />
                {contributedLabel}
              </span>
              <span className="text-text-primary">{format(active.contributed)}</span>
            </p>
            <p className="mt-1 flex items-center justify-between gap-3 text-text-muted">
              <span className="flex items-center gap-1.5">
                <span
                  aria-hidden
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: SERIES.interest }}
                />
                {interestLabel}
              </span>
              <span className="text-text-primary">{format(active.interest)}</span>
            </p>
            <p className="mt-1.5 flex items-center justify-between gap-3 border-t border-border pt-1.5 text-text-muted">
              <span>Total</span>
              <span className="font-medium text-text-primary">
                {format(active.contributed + active.interest)}
              </span>
            </p>
          </div>
        )}
      </div>

      <Legend contributedLabel={contributedLabel} interestLabel={interestLabel} />
      <figcaption className="sr-only">{caption}</figcaption>
    </figure>
  );
}

/**
 * Horizontal split bar showing what share of a total is contributions and what
 * share is interest. Both segments carry a direct label, so identity never
 * rests on colour alone.
 */
export function SplitBar({
  contributed,
  interest,
  format,
  contributedLabel = "Contributions",
  interestLabel = "Interest",
}: {
  contributed: number;
  interest: number;
  format: (n: number) => string;
  contributedLabel?: string;
  interestLabel?: string;
}) {
  const total = contributed + interest;
  const pct = total > 0 ? (contributed / total) * 100 : 100;

  return (
    <div>
      <div
        className="flex h-8 w-full gap-[2px] overflow-hidden rounded-md"
        role="img"
        aria-label={`${contributedLabel} ${format(contributed)}, ${interestLabel} ${format(
          interest
        )}`}
      >
        <div
          className="h-full rounded-l-md transition-[width] duration-200"
          style={{ width: `${pct}%`, background: SERIES.contributed }}
        />
        <div
          className="h-full flex-1 rounded-r-md transition-[width] duration-200"
          style={{ background: SERIES.interest }}
        />
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-text-muted">
        <span className="flex items-center gap-1.5">
          <span
            aria-hidden
            className="inline-block h-2.5 w-2.5 rounded-sm"
            style={{ background: SERIES.contributed }}
          />
          {contributedLabel}{" "}
          <span className="font-medium text-text-primary">{format(contributed)}</span>
          <span className="tabular-nums">({pct.toFixed(0)}%)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span
            aria-hidden
            className="inline-block h-2.5 w-2.5 rounded-sm"
            style={{ background: SERIES.interest }}
          />
          {interestLabel}{" "}
          <span className="font-medium text-text-primary">{format(interest)}</span>
          <span className="tabular-nums">({(100 - pct).toFixed(0)}%)</span>
        </span>
      </div>
    </div>
  );
}

function Legend({
  contributedLabel,
  interestLabel,
}: {
  contributedLabel: string;
  interestLabel: string;
}) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-text-muted">
      <span className="flex items-center gap-1.5">
        <span
          aria-hidden
          className="inline-block h-2.5 w-2.5 rounded-sm"
          style={{ background: SERIES.contributed }}
        />
        {contributedLabel}
      </span>
      <span className="flex items-center gap-1.5">
        <span
          aria-hidden
          className="inline-block h-2.5 w-2.5 rounded-sm"
          style={{ background: SERIES.interest }}
        />
        {interestLabel}
      </span>
    </div>
  );
}
