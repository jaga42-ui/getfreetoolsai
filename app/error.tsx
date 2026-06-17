"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, Home } from "lucide-react";

/**
 * Route-level error boundary. Catches render/runtime errors thrown by any tool
 * (e.g. a corrupt PDF passed to pdf-lib) and shows a recoverable, on-brand
 * screen instead of a blank page. The root layout (nav/footer) stays mounted.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log for diagnostics; safe to forward to analytics/Sentry later.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl px-5 py-24 text-center sm:px-8 sm:py-32">
      <p className="label text-secondary">Something went wrong</p>
      <h1 className="mt-4 font-display text-3xl font-medium leading-tight text-text-primary sm:text-4xl">
        This tool hit an unexpected error.
      </h1>
      <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-text-muted">
        Your files were never uploaded, so nothing left your device. Try running
        the tool again — if it keeps happening, the file may be unsupported or
        corrupted.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="group inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-[15px] font-medium text-[#fbf8f1] transition-colors hover:bg-[#9c4828]"
        >
          <RotateCcw className="h-4 w-4" />
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-5 py-3 text-[15px] font-medium text-text-primary transition-colors hover:border-text-muted/40"
        >
          <Home className="h-4 w-4" />
          Back to home
        </Link>
      </div>

      {error.digest && (
        <p className="mt-8 text-xs text-text-muted/60">
          Reference: {error.digest}
        </p>
      )}
    </div>
  );
}
