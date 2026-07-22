"use client";

import { useEffect, useRef, useState } from "react";

type State = "idle" | "waiting" | "ready" | "result" | "early";

export default function ReactionTime() {
  const [state, setState] = useState<State>("idle");
  const [ms, setMs] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const timer = useRef<number | null>(null);
  const startAt = useRef(0);

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  const beginWait = () => {
    setState("waiting");
    const delay = 1500 + Math.random() * 3000;
    timer.current = window.setTimeout(() => {
      startAt.current = performance.now();
      setState("ready");
    }, delay);
  };

  const handleClick = () => {
    if (state === "idle" || state === "result" || state === "early") {
      beginWait();
    } else if (state === "waiting") {
      if (timer.current) window.clearTimeout(timer.current);
      setState("early");
    } else if (state === "ready") {
      const t = Math.round(performance.now() - startAt.current);
      setMs(t);
      setTimes((prev) => [...prev, t]);
      setState("result");
    }
  };

  const best = times.length ? Math.min(...times) : 0;
  const avg = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;

  const box = {
    idle: { bg: "bg-primary", title: "Reaction Time Test", sub: "Click anywhere in the box to start" },
    waiting: { bg: "bg-red-600", title: "Wait for green…", sub: "Don't click yet" },
    ready: { bg: "bg-emerald-500", title: "Click!", sub: "As fast as you can" },
    result: { bg: "bg-primary", title: `${ms} ms`, sub: "Click to try again" },
    early: { bg: "bg-amber-600", title: "Too soon!", sub: "Click to try again" },
  }[state];

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <button
        type="button"
        onClick={handleClick}
        className={`flex min-h-[280px] w-full flex-col items-center justify-center rounded-xl text-center text-white transition-colors ${box.bg}`}
      >
        <span className="font-display text-4xl font-medium sm:text-5xl">{box.title}</span>
        <span className="mt-3 text-sm opacity-90">{box.sub}</span>
      </button>

      {times.length > 0 && (
        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-border bg-background p-4 text-center">
            <p className="font-display text-2xl font-medium text-primary">{best}</p>
            <p className="text-xs text-text-muted">Best (ms)</p>
          </div>
          <div className="rounded-lg border border-border bg-background p-4 text-center">
            <p className="font-display text-2xl font-medium text-text-primary">{avg}</p>
            <p className="text-xs text-text-muted">Average (ms)</p>
          </div>
          <div className="rounded-lg border border-border bg-background p-4 text-center">
            <p className="font-display text-2xl font-medium text-text-primary">{times.length}</p>
            <p className="text-xs text-text-muted">Attempts</p>
          </div>
        </div>
      )}

      <p className="mt-4 text-xs leading-relaxed text-text-muted">
        A typical human visual reaction time is around 200–300 ms. Reflexes,
        tiredness and your device&apos;s input lag all affect the number.
      </p>
    </div>
  );
}
