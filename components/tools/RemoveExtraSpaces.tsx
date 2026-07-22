"use client";

import { useMemo, useState } from "react";
import { InputArea, OutputArea } from "@/components/tools/text/shared";

export default function RemoveExtraSpaces() {
  const [text, setText] = useState("");
  const [collapse, setCollapse] = useState(true);
  const [trimLines, setTrimLines] = useState(true);
  const [removeBlank, setRemoveBlank] = useState(false);
  const [tabsToSpace, setTabsToSpace] = useState(true);

  const output = useMemo(() => {
    if (!text) return "";
    let out = text;
    if (tabsToSpace) out = out.replace(/\t/g, " ");
    // Collapse runs of spaces/tabs (not newlines) into a single space.
    if (collapse) out = out.replace(/[^\S\n]{2,}/g, " ");
    if (trimLines)
      out = out
        .split("\n")
        .map((l) => l.replace(/^[^\S\n]+|[^\S\n]+$/g, ""))
        .join("\n");
    if (removeBlank)
      out = out
        .split("\n")
        .filter((l) => l.trim() !== "")
        .join("\n");
    return out;
  }, [text, collapse, trimLines, removeBlank, tabsToSpace]);

  const removed = text.length - output.length;

  const toggles: { label: string; on: boolean; set: (b: boolean) => void }[] = [
    { label: "Collapse multiple spaces into one", on: collapse, set: setCollapse },
    { label: "Trim spaces at start & end of each line", on: trimLines, set: setTrimLines },
    { label: "Convert tabs to spaces", on: tabsToSpace, set: setTabsToSpace },
    { label: "Remove blank lines", on: removeBlank, set: setRemoveBlank },
  ];

  return (
    <div className="space-y-5">
      <InputArea
        value={text}
        onChange={setText}
        onClear={() => setText("")}
        placeholder="Paste text with messy spacing…"
        label="Your text"
      />

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
        label="Cleaned text"
        stat={
          text ? `${removed > 0 ? removed : 0} characters removed` : undefined
        }
      />
    </div>
  );
}
