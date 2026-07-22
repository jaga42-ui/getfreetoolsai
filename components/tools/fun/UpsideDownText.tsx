"use client";

import { useMemo, useState } from "react";
import { InputArea, CopyButton } from "@/components/tools/text/shared";
import { upsideDown } from "@/lib/funText";

export default function UpsideDownText() {
  const [text, setText] = useState("Hello world");
  const out = useMemo(() => (text ? upsideDown(text) : ""), [text]);

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

      <div className="mt-4 min-h-[80px] rounded-lg border border-border bg-background p-4">
        <p className="break-words text-xl text-text-primary">
          {out || <span className="text-text-muted/50">…</span>}
        </p>
      </div>

      <div className="mt-4">
        <CopyButton text={out} label="Copy flipped text" />
      </div>

      <p className="mt-4 text-xs leading-relaxed text-text-muted">
        The text is flipped using look-alike Unicode characters and reversed, so
        it reads upside down. Paste it anywhere — usernames, captions or a quick
        prank message.
      </p>
    </div>
  );
}
