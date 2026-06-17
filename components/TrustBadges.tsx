import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type BadgeVariant = "Free" | "No Signup" | "Browser-Based" | "No Watermark";

export function TrustBadges({
  badges = ["Free", "No Signup", "Browser-Based"],
  className,
}: {
  badges?: BadgeVariant[];
  className?: string;
}) {
  return (
    <div
      className={cn("flex flex-wrap items-center gap-2", className)}
    >
      {badges.map((b) => (
        <span
          key={b}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-[13px] font-medium text-text-primary shadow-[0_1px_2px_rgba(33,31,26,0.04)]"
        >
          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-secondary/15">
            <Check className="h-2.5 w-2.5 text-secondary" strokeWidth={3} aria-hidden="true" />
          </span>
          {b}
        </span>
      ))}
    </div>
  );
}
