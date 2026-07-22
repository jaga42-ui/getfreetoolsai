"use client";

import { useMemo, useState } from "react";
import { InputArea, OutputArea } from "@/components/tools/text/shared";
import { cn } from "@/lib/utils";

type Order =
  | "az"
  | "za"
  | "lenAsc"
  | "lenDesc"
  | "numAsc"
  | "numDesc"
  | "reverse"
  | "shuffle";

const ORDERS: { value: Order; label: string }[] = [
  { value: "az", label: "A → Z" },
  { value: "za", label: "Z → A" },
  { value: "lenAsc", label: "Length ↑" },
  { value: "lenDesc", label: "Length ↓" },
  { value: "numAsc", label: "Number ↑" },
  { value: "numDesc", label: "Number ↓" },
  { value: "reverse", label: "Reverse" },
  { value: "shuffle", label: "Shuffle" },
];

const numOf = (s: string): number => {
  const m = s.match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : Number.POSITIVE_INFINITY;
};

export default function SortLines() {
  const [text, setText] = useState("");
  const [order, setOrder] = useState<Order>("az");
  const [caseInsensitive, setCaseInsensitive] = useState(true);
  const [trimLines, setTrimLines] = useState(true);
  const [removeDuplicates, setRemoveDuplicates] = useState(false);
  const [ignoreBlank, setIgnoreBlank] = useState(true);

  const { output, lineCount } = useMemo(() => {
    if (!text) return { output: "", lineCount: 0 };
    let lines = text.split("\n");
    if (trimLines) lines = lines.map((l) => l.trim());
    if (ignoreBlank) lines = lines.filter((l) => l.trim() !== "");
    if (removeDuplicates) {
      const seen = new Set<string>();
      lines = lines.filter((l) => {
        const key = caseInsensitive ? l.toLowerCase() : l;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    const cmp = (a: string, b: string) => {
      const x = caseInsensitive ? a.toLowerCase() : a;
      const y = caseInsensitive ? b.toLowerCase() : b;
      return x.localeCompare(y, undefined, { numeric: true });
    };

    switch (order) {
      case "az":
        lines.sort(cmp);
        break;
      case "za":
        lines.sort((a, b) => cmp(b, a));
        break;
      case "lenAsc":
        lines.sort((a, b) => a.length - b.length || cmp(a, b));
        break;
      case "lenDesc":
        lines.sort((a, b) => b.length - a.length || cmp(a, b));
        break;
      case "numAsc":
        lines.sort((a, b) => numOf(a) - numOf(b));
        break;
      case "numDesc":
        lines.sort((a, b) => numOf(b) - numOf(a));
        break;
      case "reverse":
        lines.reverse();
        break;
      case "shuffle":
        for (let i = lines.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [lines[i], lines[j]] = [lines[j], lines[i]];
        }
        break;
    }

    return { output: lines.join("\n"), lineCount: lines.length };
  }, [text, order, caseInsensitive, trimLines, removeDuplicates, ignoreBlank]);

  const toggles: { label: string; on: boolean; set: (b: boolean) => void }[] = [
    { label: "Ignore case", on: caseInsensitive, set: setCaseInsensitive },
    { label: "Trim each line", on: trimLines, set: setTrimLines },
    { label: "Remove duplicates", on: removeDuplicates, set: setRemoveDuplicates },
    { label: "Ignore blank lines", on: ignoreBlank, set: setIgnoreBlank },
  ];

  return (
    <div className="space-y-5">
      <InputArea
        value={text}
        onChange={setText}
        onClear={() => setText("")}
        placeholder={"Paste your list, one item per line…"}
        label="Your list"
      />

      <div>
        <p className="mb-2 text-sm font-medium text-text-primary">Sort order</p>
        <div className="flex flex-wrap gap-2">
          {ORDERS.map((o) => (
            <button
              key={o.value}
              type="button"
              aria-pressed={order === o.value}
              onClick={() => setOrder(o.value)}
              className={cn(
                "rounded-md border px-3 py-1.5 text-sm transition-colors",
                order === o.value
                  ? "border-primary bg-primary/10 font-medium text-primary"
                  : "border-border bg-surface text-text-muted hover:border-primary/40 hover:text-text-primary"
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2">
        {toggles.map((t) => (
          <label
            key={t.label}
            className="flex cursor-pointer items-center gap-2 text-sm text-text-muted"
          >
            <input
              type="checkbox"
              checked={t.on}
              onChange={(e) => t.set(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-primary"
            />
            {t.label}
          </label>
        ))}
      </div>

      <OutputArea
        value={output}
        label="Sorted lines"
        rows={10}
        stat={output ? `${lineCount} ${lineCount === 1 ? "line" : "lines"}` : undefined}
      />
    </div>
  );
}
