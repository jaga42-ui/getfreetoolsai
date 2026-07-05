"use client";

import { useMemo, useState } from "react";
import { InputArea, OutputArea } from "@/components/tools/text/shared";
import { SegmentedControl } from "@/components/ui";

type Sort = "none" | "asc" | "desc";

export default function RemoveDuplicateLines() {
  const [text, setText] = useState("");
  const [caseInsensitive, setCaseInsensitive] = useState(false);
  const [trim, setTrim] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(true);
  const [sort, setSort] = useState<Sort>("none");

  const { output, removed } = useMemo(() => {
    if (!text) return { output: "", removed: 0 };
    let lines = text.split(/\r\n|\r|\n/);
    if (trim) lines = lines.map((l) => l.trim());
    if (removeEmpty) lines = lines.filter((l) => l.length > 0);

    const seen = new Set<string>();
    const unique: string[] = [];
    for (const line of lines) {
      const key = caseInsensitive ? line.toLowerCase() : line;
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(line);
    }

    if (sort !== "none") {
      unique.sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: "base", numeric: true })
      );
      if (sort === "desc") unique.reverse();
    }

    return { output: unique.join("\n"), removed: lines.length - unique.length };
  }, [text, caseInsensitive, trim, removeEmpty, sort]);

  const Check = ({
    checked,
    onChange,
    children,
  }: {
    checked: boolean;
    onChange: (v: boolean) => void;
    children: React.ReactNode;
  }) => (
    <label className="flex items-center gap-2 text-sm text-text-primary">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
      />
      {children}
    </label>
  );

  return (
    <div className="space-y-5">
      <InputArea
        value={text}
        onChange={setText}
        onClear={() => setText("")}
        placeholder="Paste your list — one item per line…"
      />

      <fieldset className="space-y-3 rounded-lg border border-border bg-background/60 p-4">
        <legend className="px-1 text-sm font-medium text-text-primary">
          Options
        </legend>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Check checked={caseInsensitive} onChange={setCaseInsensitive}>
            Ignore case when matching
          </Check>
          <Check checked={trim} onChange={setTrim}>
            Trim each line
          </Check>
          <Check checked={removeEmpty} onChange={setRemoveEmpty}>
            Drop empty lines
          </Check>
        </div>
        <div className="flex flex-wrap items-center gap-3 border-t border-border pt-3">
          <span className="text-sm text-text-muted">Sort:</span>
          <SegmentedControl
            value={sort}
            onChange={setSort}
            options={[
              { value: "none", label: "Keep order" },
              { value: "asc", label: "A → Z" },
              { value: "desc", label: "Z → A" },
            ]}
          />
        </div>
      </fieldset>

      <OutputArea
        value={output}
        label="Result"
        stat={
          text
            ? `${output ? output.split("\n").length : 0} unique ${
                output && output.split("\n").length === 1 ? "line" : "lines"
              } · ${removed} duplicate${removed === 1 ? "" : "s"} removed`
            : undefined
        }
      />
    </div>
  );
}
