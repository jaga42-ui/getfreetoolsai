"use client";

import { useMemo, useState } from "react";
import { InputArea, OutputArea } from "@/components/tools/text/shared";
import { SegmentedControl } from "@/components/ui";

function slugify(input: string, sep: string, lower: boolean): string {
  let s = input
    .normalize("NFKD") // split accented letters into base + diacritic
    .replace(/[̀-ͯ]/g, "") // strip the combining diacritics
    .replace(/[^A-Za-z0-9]+/g, sep) // non-alphanumerics → separator
    .replace(new RegExp(`\\${sep}{2,}`, "g"), sep) // collapse repeats
    .replace(new RegExp(`^\\${sep}+|\\${sep}+$`, "g"), ""); // trim ends
  if (lower) s = s.toLowerCase();
  return s;
}

export default function SlugGenerator() {
  const [text, setText] = useState("");
  const [sep, setSep] = useState<"-" | "_">("-");
  const [lower, setLower] = useState(true);

  const output = useMemo(() => {
    if (!text) return "";
    // Slug per line so users can convert a whole list of titles at once.
    return text
      .split(/\r\n|\r|\n/)
      .map((line) => slugify(line, sep, lower))
      .filter(Boolean)
      .join("\n");
  }, [text, sep, lower]);

  return (
    <div className="space-y-5">
      <InputArea
        value={text}
        onChange={setText}
        onClear={() => setText("")}
        placeholder="e.g. 10 Best Ways to Compress a PDF (2026)"
        label="Title or text (one per line)"
        rows={6}
      />

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex items-center gap-3">
          <span className="text-sm text-text-muted">Separator:</span>
          <SegmentedControl
            value={sep}
            onChange={setSep}
            options={[
              { value: "-", label: "Hyphen -" },
              { value: "_", label: "Underscore _" },
            ]}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-text-primary">
          <input
            type="checkbox"
            checked={lower}
            onChange={(e) => setLower(e.target.checked)}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
          Lowercase
        </label>
      </div>

      <OutputArea value={output} label="URL slug" rows={6} />
    </div>
  );
}
