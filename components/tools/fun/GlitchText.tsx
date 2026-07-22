"use client";

import { useMemo, useState } from "react";
import { InputArea, CopyButton } from "@/components/tools/text/shared";
import { glitch } from "@/lib/funText";

export default function GlitchText() {
  const [text, setText] = useState("glitch");
  const [intensity, setIntensity] = useState(5);
  // Re-roll token so identical text+intensity can be regenerated on demand.
  const [seed, setSeed] = useState(0);

  const out = useMemo(
    () => (text ? glitch(text, intensity) : ""),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [text, intensity, seed]
  );

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <InputArea
        value={text}
        onChange={setText}
        onClear={() => setText("")}
        label="Your text"
        rows={2}
        placeholder="Type something…"
      />

      <div className="mt-4">
        <div className="mb-1 flex justify-between text-sm">
          <span className="text-text-muted">Glitch intensity</span>
          <span className="font-mono text-text-primary">{intensity}</span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={intensity}
          onChange={(e) => setIntensity(Number(e.target.value))}
          className="w-full accent-primary"
          aria-label="Glitch intensity"
        />
      </div>

      <div className="mt-4 min-h-[80px] rounded-lg border border-border bg-background p-4">
        <p className="break-words text-xl leading-loose text-text-primary">
          {out || <span className="text-text-muted/50">…</span>}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <CopyButton text={out} label="Copy text" />
        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium text-text-primary transition-colors hover:border-primary/40"
        >
          Regenerate
        </button>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-text-muted">
        Zalgo text stacks combining marks onto each letter. Some apps limit how
        many marks they render, so very high intensity may look tamer once
        pasted.
      </p>
    </div>
  );
}
