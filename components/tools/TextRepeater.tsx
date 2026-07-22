"use client";

import { useMemo, useState } from "react";
import { InputArea, OutputArea } from "@/components/tools/text/shared";
import { cn } from "@/lib/utils";

type Sep = "newline" | "space" | "comma" | "none" | "custom";

const SEPS: { value: Sep; label: string }[] = [
  { value: "newline", label: "New line" },
  { value: "space", label: "Space" },
  { value: "comma", label: "Comma" },
  { value: "none", label: "None" },
  { value: "custom", label: "Custom" },
];

const MAX = 10000;

function sepString(sep: Sep, custom: string): string {
  switch (sep) {
    case "newline":
      return "\n";
    case "space":
      return " ";
    case "comma":
      return ", ";
    case "none":
      return "";
    case "custom":
      return custom;
  }
}

export default function TextRepeater() {
  const [text, setText] = useState("");
  const [count, setCount] = useState(10);
  const [sep, setSep] = useState<Sep>("newline");
  const [custom, setCustom] = useState(" | ");
  const [numbered, setNumbered] = useState(false);

  const n = Math.max(1, Math.min(MAX, Math.floor(count) || 1));

  const output = useMemo(() => {
    if (!text) return "";
    const glue = sepString(sep, custom);
    const parts: string[] = [];
    for (let i = 1; i <= n; i++) parts.push(numbered ? `${i}. ${text}` : text);
    return parts.join(glue);
  }, [text, n, sep, custom, numbered]);

  return (
    <div className="space-y-5">
      <InputArea
        value={text}
        onChange={setText}
        onClear={() => setText("")}
        placeholder="Type the text you want to repeat…"
        label="Your text"
        rows={4}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-text-primary">
            Number of times
          </span>
          <input
            type="number"
            min={1}
            max={MAX}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
          />
        </label>

        <div>
          <span className="mb-1.5 block text-sm font-medium text-text-primary">
            Separator between copies
          </span>
          <div className="flex flex-wrap gap-2">
            {SEPS.map((s) => (
              <button
                key={s.value}
                type="button"
                aria-pressed={sep === s.value}
                onClick={() => setSep(s.value)}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-sm transition-colors",
                  sep === s.value
                    ? "border-primary bg-primary/10 font-medium text-primary"
                    : "border-border bg-surface text-text-muted hover:border-primary/40 hover:text-text-primary"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {sep === "custom" && (
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-text-primary">
            Custom separator
          </span>
          <input
            type="text"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 font-mono text-sm text-text-primary focus:border-primary focus:outline-none"
          />
        </label>
      )}

      <label className="flex cursor-pointer items-center gap-2 text-sm text-text-muted">
        <input
          type="checkbox"
          checked={numbered}
          onChange={(e) => setNumbered(e.target.checked)}
          className="h-4 w-4 rounded border-border accent-primary"
        />
        Number each copy (1. 2. 3. …)
      </label>

      <OutputArea
        value={output}
        label="Repeated text"
        rows={10}
        stat={output ? `${n} copies · ${output.length} characters` : undefined}
      />
    </div>
  );
}
