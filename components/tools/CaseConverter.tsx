"use client";

import { useMemo, useState } from "react";
import { InputArea, OutputArea } from "@/components/tools/text/shared";
import { cn } from "@/lib/utils";

type Mode =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "constant"
  | "alternating";

const MODES: { value: Mode; label: string }[] = [
  { value: "upper", label: "UPPERCASE" },
  { value: "lower", label: "lowercase" },
  { value: "title", label: "Title Case" },
  { value: "sentence", label: "Sentence case" },
  { value: "camel", label: "camelCase" },
  { value: "pascal", label: "PascalCase" },
  { value: "snake", label: "snake_case" },
  { value: "kebab", label: "kebab-case" },
  { value: "constant", label: "CONSTANT_CASE" },
  { value: "alternating", label: "aLtErNaTiNg" },
];

/** Split into word tokens for the identifier-style cases. */
function words(input: string): string[] {
  return (
    input
      // insert a boundary between camelCase humps
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .split(/[^A-Za-z0-9]+/)
      .filter(Boolean)
  );
}

function convert(text: string, mode: Mode): string {
  if (!text) return "";
  switch (mode) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "title":
      return text
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
    case "sentence":
      return text
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
    case "camel":
      return words(text)
        .map((w, i) =>
          i === 0
            ? w.toLowerCase()
            : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
        )
        .join("");
    case "pascal":
      return words(text)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join("");
    case "snake":
      return words(text).map((w) => w.toLowerCase()).join("_");
    case "kebab":
      return words(text).map((w) => w.toLowerCase()).join("-");
    case "constant":
      return words(text).map((w) => w.toUpperCase()).join("_");
    case "alternating":
      return text
        .split("")
        .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
        .join("");
  }
}

export default function CaseConverter() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<Mode>("title");

  const output = useMemo(() => convert(text, mode), [text, mode]);

  const chars = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

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
        <p className="mb-2 text-sm font-medium text-text-primary">Convert to</p>
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

      <OutputArea
        value={output}
        label="Converted text"
        stat={`${wordCount} ${wordCount === 1 ? "word" : "words"} · ${chars} ${
          chars === 1 ? "character" : "characters"
        }`}
      />
    </div>
  );
}
