import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

// 404 responses are noindex by status code, but be explicit so no soft-404
// variant ever gets indexed.
export const metadata: Metadata = {
  title: "Page not found — GetFreeToolsAI",
  description:
    "The page you’re looking for doesn’t exist. Browse 50+ free online PDF, image and developer tools instead.",
  robots: { index: false, follow: true },
};

// Hand-picked, high-intent recovery links (kept small so the page stays focused).
const popular: { name: string; href: string }[] = [
  { name: "Compress PDF", href: "/pdf/compress" },
  { name: "Merge PDF", href: "/pdf/merge" },
  { name: "PDF to Word", href: "/pdf/pdf-to-word" },
  { name: "Compress Image", href: "/image/compress" },
  { name: "HEIC to JPG", href: "/image/heic-to-jpg" },
  { name: "Remove Background", href: "/image/background-remover" },
];

const hubs: { name: string; href: string }[] = [
  { name: "PDF Tools", href: "/pdf-tools" },
  { name: "Image Tools", href: "/image-tools" },
  { name: "Calculators", href: "/calculators" },
  { name: "Dev Tools", href: "/dev-tools" },
];

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8 sm:py-32">
      <p className="label text-secondary">Error 404</p>
      <h1 className="mt-4 font-display text-4xl font-medium leading-tight text-text-primary sm:text-5xl">
        We couldn’t find that page.
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-text-muted">
        The link may be broken or the page may have moved. All of our free,
        browser-based tools are still right here — pick up where you left off.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-[15px] font-medium text-[#fbf8f1] transition-colors hover:bg-[#9c4828]"
        >
          Back to home
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-5 py-3 text-[15px] font-medium text-text-primary transition-colors hover:border-text-muted/40"
        >
          <Search className="h-4 w-4" />
          Search all tools
        </Link>
      </div>

      <div className="mt-14 text-left">
        <h2 className="text-center font-display text-lg font-medium text-text-primary">
          Popular tools
        </h2>
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {popular.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="rounded-md border border-border bg-surface px-4 py-3 text-sm font-medium text-text-primary transition-colors hover:border-text-muted/40"
            >
              {t.name}
            </Link>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 border-t border-border pt-6 text-sm text-text-muted">
          {hubs.map((h) => (
            <Link
              key={h.href}
              href={h.href}
              className="transition-colors hover:text-text-primary"
            >
              {h.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
