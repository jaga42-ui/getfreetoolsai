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
      className={cn(
        "flex flex-wrap items-center gap-x-5 gap-y-1.5",
        className
      )}
    >
      {badges.map((b) => (
        <span
          key={b}
          className="inline-flex items-center gap-1.5 text-sm text-text-muted"
        >
          <Check className="h-3.5 w-3.5 text-secondary" />
          {b}
        </span>
      ))}
    </div>
  );
}
