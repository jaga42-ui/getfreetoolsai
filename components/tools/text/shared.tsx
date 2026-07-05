"use client";

import { useState } from "react";
import { Check, Copy, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Shared textarea styling so every text tool looks identical. */
const areaClass =
  "w-full resize-y rounded-lg border border-border bg-surface p-3.5 font-mono text-sm leading-relaxed text-text-primary placeholder:text-text-muted/60 focus:border-primary focus:outline-none";

export function InputArea({
  value,
  onChange,
  placeholder,
  rows = 8,
  label = "Your text",
  onClear,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  label?: string;
  onClear?: () => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-text-primary">{label}</label>
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 text-xs text-text-muted transition-colors hover:text-primary"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Clear
          </button>
        )}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        spellCheck={false}
        className={areaClass}
      />
    </div>
  );
}

/** Copies the given text and briefly confirms. */
export function CopyButton({
  text,
  className,
  label = "Copy",
}: {
  text: string;
  className?: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      disabled={!text}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard unavailable — no-op */
        }
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium text-text-primary transition-colors hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      aria-label={label}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-secondary" aria-hidden="true" /> Copied
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" aria-hidden="true" /> {label}
        </>
      )}
    </button>
  );
}

/** Read-only result block with a header, copy button and optional stat line. */
export function OutputArea({
  value,
  label = "Result",
  rows = 8,
  stat,
  empty = "Your result will appear here.",
}: {
  value: string;
  label?: string;
  rows?: number;
  stat?: React.ReactNode;
  empty?: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-text-primary">{label}</label>
        <CopyButton text={value} />
      </div>
      <textarea
        value={value}
        readOnly
        rows={rows}
        placeholder={empty}
        spellCheck={false}
        className={cn(areaClass, "bg-background")}
      />
      {stat && (
        <p className="mt-2 text-xs text-text-muted" aria-live="polite">
          {stat}
        </p>
      )}
    </div>
  );
}
