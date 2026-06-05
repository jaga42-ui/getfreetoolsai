import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * GFT initials badge (ink tile · cream "GF" · rust "T") + GetFreeTools wordmark.
 * Single source used in the navbar and footer so the brand can't drift. The
 * badge fades in gently on load (reduced-motion safe) and lifts on hover.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="GetFreeTools — home"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span
        aria-hidden
        className="logo-mark flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-[#d8cfba] bg-surface font-sans text-[14px] font-extrabold leading-none tracking-[-0.04em] transition-transform duration-300 ease-out group-hover:scale-[1.06] group-hover:border-primary/40"
      >
        <span className="text-text-primary">GF</span>
        <span className="text-primary">T</span>
      </span>
      <span className="font-display text-xl font-semibold tracking-tight">
        <span className="text-text-primary">GetFree</span>
        <span className="text-primary">Tools</span>
      </span>
    </Link>
  );
}
