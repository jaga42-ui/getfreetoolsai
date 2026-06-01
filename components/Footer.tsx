import Link from "next/link";
import { pdfTools, imageTools, type Tool } from "@/lib/tools";

function FooterColumn({ title, tools }: { title: string; tools: Tool[] }) {
  return (
    <div>
      <p className="label">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {tools.map((t) =>
          t.ready ? (
            <li key={t.href}>
              <Link
                href={t.href}
                className="text-sm text-text-muted transition-colors hover:text-text-primary"
              >
                {t.name}
              </Link>
            </li>
          ) : (
            <li key={t.href}>
              <span className="text-sm text-text-muted/45">{t.name}</span>
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-28 border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="font-display text-xl font-semibold tracking-tight"
            >
              <span className="text-text-primary">Getfreetools</span>
              <span className="text-primary">·ai</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-muted">
              Free tools for everyone. Forever. No signup, no limits, and your
              files never leave your device.
            </p>
          </div>
          <FooterColumn title="PDF Tools" tools={pdfTools} />
          <FooterColumn title="Image Tools" tools={imageTools} />
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 text-xs text-text-muted sm:flex-row">
          <p>© 2026 GetFreeToolsAI</p>
          <p className="flex flex-wrap items-center justify-center gap-x-2">
            <span>Privacy Policy</span>
            <span aria-hidden>·</span>
            <span>No data stored</span>
            <span aria-hidden>·</span>
            <span>Built with care</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
