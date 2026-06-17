import type { Metadata } from "next";
import Link from "next/link";
import { WifiOff } from "lucide-react";

// Served by the service worker when a navigation fails while offline. Kept fully
// static with no client-side data so it always renders from cache. Noindex — it
// is a utility fallback, not real content.
export const metadata: Metadata = {
  title: "You’re offline — GetFreeToolsAI",
  description: "You appear to be offline. Reconnect to use the tools.",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center sm:px-8 sm:py-32">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface text-text-muted">
        <WifiOff className="h-6 w-6" strokeWidth={1.75} />
      </div>
      <h1 className="mt-6 font-display text-3xl font-medium leading-tight text-text-primary sm:text-4xl">
        You’re offline
      </h1>
      <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-text-muted">
        It looks like you’ve lost your connection. Most tools run entirely in your
        browser, so once you’re back online you can pick up right where you left
        off — nothing was lost.
      </p>
      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-[15px] font-medium text-[#fbf8f1] transition-colors hover:bg-[#9c4828]"
        >
          Try again
        </Link>
      </div>
    </div>
  );
}
