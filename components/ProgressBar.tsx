import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  label,
  className,
}: {
  /** 0 - 100 */
  value: number;
  label?: string;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const isComplete = clamped >= 100;
  // No real progress yet → show an animated indeterminate bar so the tool
  // never looks frozen while a model/large file is being prepared.
  const isIndeterminate = clamped === 0;
  const stepText =
    label ??
    (clamped < 5
      ? "Starting"
      : clamped < 60
      ? "Processing"
      : clamped < 100
      ? "Almost done"
      : "Complete");

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-2 flex items-center justify-between">
        <span className="label">{stepText}</span>
        <span className="font-mono text-xs font-semibold text-text-primary">
          {isIndeterminate ? "…" : `${Math.round(clamped)}%`}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
        {isIndeterminate ? (
          <div className="h-full w-1/4 rounded-full bg-primary animate-indeterminate" />
        ) : (
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300 ease-out",
              isComplete ? "bg-secondary" : "bg-primary"
            )}
            style={{ width: `${clamped}%` }}
          />
        )}
      </div>
    </div>
  );
}
