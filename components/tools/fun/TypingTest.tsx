"use client";

import { useMemo, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";

const PASSAGES = [
  "The quick brown fox jumps over the lazy dog while the sun sets slowly behind the distant hills.",
  "Practice makes perfect, so keep your fingers moving and your eyes on the words ahead of you.",
  "A journey of a thousand miles begins with a single step, and every expert was once a beginner.",
  "Typing fast is useful, but typing accurately matters far more when the words really count.",
  "Clear code, like clear writing, says exactly what it means and nothing that it does not.",
];

function pick(exclude?: string): string {
  const pool = PASSAGES.filter((p) => p !== exclude);
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function TypingTest() {
  const [target, setTarget] = useState(() => PASSAGES[0]);
  const [typed, setTyped] = useState("");
  const [start, setStart] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const done = endTime !== null;

  const onChange = (v: string) => {
    if (done) return;
    const value = v.slice(0, target.length);
    if (start === null && value.length > 0) setStart(Date.now());
    setTyped(value);
    if (value.length === target.length) setEndTime(Date.now());
  };

  const stats = useMemo(() => {
    const elapsedMs = (done ? endTime! : Date.now()) - (start ?? Date.now());
    const minutes = Math.max(elapsedMs / 60000, 1 / 60000);
    let correct = 0;
    for (let i = 0; i < typed.length; i++) if (typed[i] === target[i]) correct++;
    const wpm = start ? Math.round((correct / 5) / minutes) : 0;
    const accuracy = typed.length ? Math.round((correct / typed.length) * 100) : 100;
    return { wpm, accuracy, seconds: start ? (elapsedMs / 1000).toFixed(1) : "0.0" };
  }, [typed, start, endTime, done, target]);

  const reset = (fresh = true) => {
    setTarget(fresh ? pick(target) : target);
    setTyped("");
    setStart(null);
    setEndTime(null);
    inputRef.current?.focus();
  };

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div
        className="cursor-text rounded-xl border border-border bg-background p-4 font-mono text-lg leading-relaxed"
        onClick={() => inputRef.current?.focus()}
      >
        {target.split("").map((ch, i) => {
          let cls = "text-text-muted/50";
          if (i < typed.length) cls = typed[i] === ch ? "text-secondary" : "bg-red-500/20 text-red-400";
          const caret = i === typed.length && !done ? " border-l-2 border-primary" : "";
          return (
            <span key={i} className={cls + caret}>
              {ch}
            </span>
          );
        })}
      </div>

      <input
        ref={inputRef}
        value={typed}
        onChange={(e) => onChange(e.target.value)}
        disabled={done}
        autoFocus
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        placeholder="Start typing here…"
        className="mt-4 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none disabled:opacity-60"
      />

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-border bg-background p-4 text-center">
          <p className="font-display text-3xl font-medium text-primary">{stats.wpm}</p>
          <p className="text-xs text-text-muted">WPM</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4 text-center">
          <p className="font-display text-3xl font-medium text-text-primary">{stats.accuracy}%</p>
          <p className="text-xs text-text-muted">Accuracy</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4 text-center">
          <p className="font-display text-3xl font-medium text-text-primary">{stats.seconds}s</p>
          <p className="text-xs text-text-muted">Time</p>
        </div>
      </div>

      {done && (
        <div className="mt-4 rounded-xl border border-primary/30 bg-primary/5 p-4 text-center text-sm text-text-primary">
          Done! You typed <strong>{stats.wpm} WPM</strong> at{" "}
          <strong>{stats.accuracy}%</strong> accuracy.
        </div>
      )}

      <button
        type="button"
        onClick={() => reset(true)}
        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-primary/40"
      >
        <RefreshCw className="h-4 w-4" /> New text
      </button>
    </div>
  );
}
