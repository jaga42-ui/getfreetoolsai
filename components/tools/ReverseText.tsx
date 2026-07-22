"use client";

import { useMemo, useState } from "react";
import { InputArea, OutputArea } from "@/components/tools/text/shared";
import { cn } from "@/lib/utils";

type Mode = "chars" | "words" | "lines" | "eachLine";

const MODES: { value: Mode; label: string }[] = [
  { value: "chars", label: "Characters" },
  { value: "words", label: "Word order" },
  { value: "lines", label: "Line order" },
  { value: "eachLine", label: "Each line" },
];

function reverse(text: string, mode: Mode): string {
  if (!text) return "";
  switch (mode) {
    case "chars":
      return Array.from(text).reverse().join("");
    case "words":
      return text.split(/(\s+)/).reverse().join("");
    case "lines":
      return text.split("\n").reverse().join("\n");
    case "eachLine":
      return text
        .split("\n")
        .map((line) => Array.from(line).reverse().join(""))
        .join("\n");
  }
}

export default function ReverseText() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<Mode>("chars");

  const output = useMemo(() => reverse(text, mode), [text, mode]);

  return (
    <div className="space-y-5">
      <InputArea
        value={text}
        onChange={setText}
        onClear={() => setText("")}
        placeholder="Type or paste your text here…"
        label="Your text"
      />

      <div>
        <p className="mb-2 text-sm font-medium text-text-primary">Reverse by</p>
        <div className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <button
              key={m.value}
              type="button"
              aria-pressed={mode === m.value}
              onClick={() => setMode(m.value)}
              className={cn(
                "rounded-md border px-3 py-1.5 text-sm transition-colors",
                mode === m.value
                  ? "border-primary bg-primary/10 font-medium text-primary"
                  : "border-border bg-surface text-text-muted hover:border-primary/40 hover:text-text-primary"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <OutputArea value={output} label="Reversed text" />
    </div>
  );
}
