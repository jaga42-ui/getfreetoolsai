"use client";

import { Loader2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Button({
  children,
  onClick,
  disabled,
  loading,
  variant = "primary",
  size = "md",
  icon: Icon,
  type = "button",
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "success" | "outline" | "ghost";
  size?: "md" | "lg";
  icon?: LucideIcon;
  type?: "button" | "submit";
  className?: string;
}) {
  const variants = {
    primary:
      "bg-primary text-[#fbf8f1] hover:bg-[#9c4828] disabled:bg-primary/40",
    success:
      "bg-secondary text-[#fbf8f1] hover:bg-[#3d5840] disabled:bg-secondary/40",
    outline:
      "border border-border bg-surface text-text-primary hover:border-text-muted/50 disabled:opacity-50",
    ghost: "text-text-muted hover:text-text-primary hover:bg-background",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:cursor-not-allowed",
        size === "lg" ? "px-6 py-3 text-[15px]" : "px-4 py-2.5 text-sm",
        variants[variant],
        className
      )}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        Icon && <Icon className="h-4 w-4" aria-hidden="true" />
      )}
      {children}
    </button>
  );
}

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-lg border border-border bg-background p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          aria-pressed={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm transition-colors",
            value === opt.value
              ? "bg-surface font-medium text-text-primary shadow-[0_1px_2px_rgba(33,31,26,0.08)]"
              : "text-text-muted hover:text-text-primary"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function ErrorMessage({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="mt-4 flex flex-col gap-3 rounded-lg border border-[#c0563a]/40 bg-[#c0563a]/[0.06] p-4 text-sm text-[#9c4828] sm:flex-row sm:items-center sm:justify-between"
    >
      <span>{message}</span>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 rounded-md border border-[#c0563a]/40 px-3 py-1.5 font-medium text-[#9c4828] hover:bg-[#c0563a]/10"
        >
          Try again
        </button>
      )}
    </div>
  );
}
