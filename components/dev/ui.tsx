"use client";

import { useState, type ReactNode } from "react";
import { Check, Copy, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Shared field styling for code inputs/outputs. */
export const fieldClass =
  "w-full resize-y rounded-lg border border-zinc-800 bg-zinc-900/70 p-3 font-mono text-[13px] leading-relaxed text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30";

/** Single-line input styling. */
export const inputClass =
  "w-full rounded-md border border-zinc-800 bg-zinc-900/70 px-3 py-2 font-mono text-[13px] text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30";

export function Labeled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-xs text-zinc-400">
      <span className="mb-1.5 block font-medium">{label}</span>
      {children}
    </label>
  );
}

export function DevButton({
  children,
  onClick,
  variant = "ghost",
  size = "md",
  icon: Icon,
  disabled,
  type = "button",
  title,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  size?: "sm" | "md";
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  type?: "button" | "submit";
  title?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-3.5 py-2 text-sm",
        variant === "primary"
          ? "bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
          : "border border-zinc-700 bg-zinc-800/60 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {children}
    </button>
  );
}

export function CopyButton({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      disabled={!value}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard unavailable */
        }
      }}
      aria-label="Copy to clipboard"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-800/60 px-2.5 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100 disabled:opacity-40",
        className
      )}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function Panel({
  label,
  actions,
  children,
  className,
}: {
  label: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col", className)}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">{label}</span>
        {actions && <div className="flex items-center gap-1.5">{actions}</div>}
      </div>
      {children}
    </div>
  );
}

export function StatusPill({ state, children }: { state: "ok" | "error" | "idle"; children: ReactNode }) {
  if (state === "idle") return null;
  const ok = state === "ok";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium",
        ok ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
      )}
    >
      {ok ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
      {children}
    </span>
  );
}
