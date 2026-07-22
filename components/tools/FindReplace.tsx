"use client";

import { useMemo, useState } from "react";
import { InputArea, OutputArea } from "@/components/tools/text/shared";

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default function FindReplace() {
  const [text, setText] = useState("");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [useRegex, setUseRegex] = useState(false);

  const { output, count, error } = useMemo(() => {
    if (!text || !find) return { output: text, count: 0, error: "" };
    const flags = "g" + (caseSensitive ? "" : "i");
    let re: RegExp;
    try {
      re = new RegExp(useRegex ? find : escapeRegExp(find), flags);
    } catch {
      return { output: text, count: 0, error: "Invalid regular expression." };
    }
    const matches = text.match(re);
    const out = text.replace(re, useRegex ? replace : replace.replace(/\$/g, "$$$$"));
    return { output: out, count: matches ? matches.length : 0, error: "" };
  }, [text, find, replace, caseSensitive, useRegex]);

  const inputClass =
    "w-full rounded-lg border border-border bg-surface px-3 py-2 font-mono text-sm text-text-primary focus:border-primary focus:outline-none";

  return (
    <div className="space-y-5">
      <InputArea
        value={text}
        onChange={setText}
        onClear={() => setText("")}
        placeholder="Paste the text you want to edit…"
        label="Your text"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-text-primary">Find</span>
          <input
            type="text"
            value={find}
            onChange={(e) => setFind(e.target.value)}
            placeholder={useRegex ? "e.g. \\d+" : "text to find"}
            className={inputClass}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-text-primary">
            Replace with
          </span>
          <input
            type="text"
            value={replace}
            onChange={(e) => setReplace(e.target.value)}
            placeholder="replacement (leave empty to delete)"
            className={inputClass}
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-text-muted">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-primary"
          />
          Case sensitive
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-text-muted">
          <input
            type="checkbox"
            checked={useRegex}
            onChange={(e) => setUseRegex(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-primary"
          />
          Regular expression
        </label>
      </div>

      <OutputArea
        value={output}
        label="Result"
        stat={
          error ? (
            <span className="text-red-400">{error}</span>
          ) : find && text ? (
            `${count} ${count === 1 ? "replacement" : "replacements"} made`
          ) : undefined
        }
      />
    </div>
  );
}
