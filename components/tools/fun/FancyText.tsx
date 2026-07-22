"use client";

import { useMemo, useState } from "react";
import { InputArea, CopyButton } from "@/components/tools/text/shared";
import { FANCY_STYLES } from "@/lib/funText";

export default function FancyText() {
  const [text, setText] = useState("Hello world");

  const rows = useMemo(
    () =>
      FANCY_STYLES.map((s) => ({
        name: s.name,
        out: text ? s.transform(text) : "",
      })),
    [text]
  );

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <InputArea
        value={text}
        onChange={setText}
        onClear={() => setText("")}
        label="Your text"
        rows={3}
        placeholder="Type something…"
      />

      <div className="mt-5 space-y-2.5">
        {rows.map((r) => (
          <div
            key={r.name}
            className="flex items-center gap-3 rounded-lg border border-border bg-background p-3"
          >
            <div className="min-w-0 flex-1">
              <p className="mb-0.5 text-[11px] uppercase tracking-widest text-text-muted">
                {r.name}
              </p>
              <p className="truncate text-lg text-text-primary" title={r.out}>
                {r.out || <span className="text-text-muted/50">—</span>}
              </p>
            </div>
            <CopyButton text={r.out} className="shrink-0" />
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-text-muted">
        These are real Unicode characters, so you can paste them straight into
        Instagram, TikTok, Discord, your bio or a username — no app needed.
      </p>
    </div>
  );
}
