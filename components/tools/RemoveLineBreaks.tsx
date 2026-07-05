"use client";

import { useMemo, useState } from "react";
import { InputArea, OutputArea } from "@/components/tools/text/shared";

export default function RemoveLineBreaks() {
  const [text, setText] = useState("");
  const [replaceWith, setReplaceWith] = useState<"space" | "nothing">("space");
  const [collapseSpaces, setCollapseSpaces] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(false);
  const [trimLines, setTrimLines] = useState(true);

  const output = useMemo(() => {
    if (!text) return "";
    let lines = text.split(/\r\n|\r|\n/);
    if (trimLines) lines = lines.map((l) => l.trim());
    if (removeEmpty) lines = lines.filter((l) => l.length > 0);
    let out = lines.join(replaceWith === "space" ? " " : "");
    if (collapseSpaces) out = out.replace(/ {2,}/g, " ").trim();
    return out;
  }, [text, replaceWith, collapseSpaces, removeEmpty, trimLines]);

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
        placeholder="Paste text with line breaks you want to remove…"
      />

      <fieldset className="space-y-3 rounded-lg border border-border bg-background/60 p-4">
        <legend className="px-1 text-sm font-medium text-text-primary">
          Options
        </legend>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="text-sm text-text-muted">Replace each break with:</span>
          <Check
            checked={replaceWith === "space"}
            onChange={() => setReplaceWith("space")}
          >
            A space
          </Check>
          <Check
            checked={replaceWith === "nothing"}
            onChange={() => setReplaceWith("nothing")}
          >
            Nothing (join directly)
          </Check>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-3">
          <Check checked={trimLines} onChange={setTrimLines}>
            Trim spaces around each line
          </Check>
          <Check checked={removeEmpty} onChange={setRemoveEmpty}>
            Drop empty lines
          </Check>
          <Check checked={collapseSpaces} onChange={setCollapseSpaces}>
            Collapse repeated spaces
          </Check>
        </div>
      </fieldset>

      <OutputArea
        value={output}
        label="Cleaned text"
        stat={`${output.length} characters`}
      />
    </div>
  );
}
