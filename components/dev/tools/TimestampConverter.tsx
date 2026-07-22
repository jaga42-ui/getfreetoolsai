"use client";

import { useEffect, useMemo, useState } from "react";
import { CopyButton, Panel, Labeled, inputClass } from "@/components/dev/ui";

type Unit = "auto" | "s" | "ms";

function toMs(n: number, unit: Unit): number {
  if (unit === "ms") return n;
  if (unit === "s") return n * 1000;
  // auto: 13+ digit integers are almost certainly milliseconds
  return Math.abs(n) >= 1e12 ? n : n * 1000;
}

function relative(ms: number): string {
  const diff = ms - Date.now();
  const abs = Math.abs(diff);
  const units: [number, Intl.RelativeTimeFormatUnit][] = [
    [1000, "second"],
    [60_000, "minute"],
    [3_600_000, "hour"],
    [86_400_000, "day"],
    [2_592_000_000, "month"],
    [31_536_000_000, "year"],
  ];
  let unit: Intl.RelativeTimeFormatUnit = "second";
  let divisor = 1000;
  for (const [d, u] of units) {
    if (abs >= d) {
      divisor = d;
      unit = u;
    }
  }
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  return rtf.format(Math.round(diff / divisor), unit);
}

/** Format a Date as a value for <input type="datetime-local"> in local time. */
function toLocalInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2">
      <span className="shrink-0 text-xs text-zinc-500">{label}</span>
      <div className="flex min-w-0 items-center gap-2">
        <code className="truncate font-mono text-[13px] text-zinc-200">{value}</code>
        <CopyButton value={value} className="shrink-0" />
      </div>
    </div>
  );
}

export default function TimestampConverter() {
  const [now, setNow] = useState(() => Date.now());
  const [ts, setTs] = useState("");
  const [unit, setUnit] = useState<Unit>("auto");
  const [dateInput, setDateInput] = useState(() => toLocalInput(new Date()));

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const fromTs = useMemo(() => {
    const n = Number(ts);
    if (ts.trim() === "" || !Number.isFinite(n)) return null;
    const ms = toMs(n, unit);
    const d = new Date(ms);
    if (Number.isNaN(d.getTime())) return null;
    return {
      iso: d.toISOString(),
      utc: d.toUTCString(),
      local: d.toLocaleString(),
      rel: relative(ms),
    };
  }, [ts, unit]);

  const fromDate = useMemo(() => {
    const d = new Date(dateInput);
    if (Number.isNaN(d.getTime())) return null;
    const ms = d.getTime();
    return { s: String(Math.floor(ms / 1000)), ms: String(ms) };
  }, [dateInput]);

  return (
    <div className="space-y-6">
      {/* Current time */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-zinc-500">Current Unix time</span>
          <div className="flex items-center gap-2">
            <code className="font-mono text-sm text-emerald-300">{Math.floor(now / 1000)}</code>
            <CopyButton value={String(Math.floor(now / 1000))} />
          </div>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-zinc-500">Milliseconds</span>
          <div className="flex items-center gap-2">
            <code className="font-mono text-[13px] text-zinc-300">{now}</code>
            <CopyButton value={String(now)} />
          </div>
        </div>
      </div>

      {/* Timestamp -> date */}
      <Panel label="Timestamp → date">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[200px] flex-1">
            <Labeled label="Unix timestamp">
              <input
                value={ts}
                onChange={(e) => setTs(e.target.value)}
                placeholder="e.g. 1753200000"
                inputMode="numeric"
                className={inputClass}
              />
            </Labeled>
          </div>
          <div>
            <Labeled label="Unit">
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as Unit)}
                className={inputClass}
              >
                <option value="auto">Auto-detect</option>
                <option value="s">Seconds</option>
                <option value="ms">Milliseconds</option>
              </select>
            </Labeled>
          </div>
        </div>
        {fromTs && (
          <div className="mt-3 divide-y divide-zinc-800 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/70">
            <Row label="ISO 8601 (UTC)" value={fromTs.iso} />
            <Row label="UTC" value={fromTs.utc} />
            <Row label="Local" value={fromTs.local} />
            <Row label="Relative" value={fromTs.rel} />
          </div>
        )}
        {ts.trim() !== "" && !fromTs && (
          <p className="mt-2 text-xs text-red-400">Not a valid timestamp.</p>
        )}
      </Panel>

      {/* Date -> timestamp */}
      <Panel label="Date → timestamp">
        <Labeled label="Date & time (your local timezone)">
          <input
            type="datetime-local"
            step={1}
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            className={inputClass}
          />
        </Labeled>
        {fromDate && (
          <div className="mt-3 divide-y divide-zinc-800 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/70">
            <Row label="Seconds" value={fromDate.s} />
            <Row label="Milliseconds" value={fromDate.ms} />
          </div>
        )}
      </Panel>
    </div>
  );
}
