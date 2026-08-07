import Link from "next/link";

/**
 * Native-name labels for the locales we publish. Native names (not "Spanish")
 * because the link is aimed at a speaker of that language.
 */
export const LOCALE_LABELS: Record<string, string> = {
  en: "English",
  hi: "हिन्दी",
  es: "Español",
  "pt-BR": "Português (BR)",
  id: "Bahasa Indonesia",
};

/**
 * Crawlable cross-locale links for a page that has translations.
 *
 * Why this exists: the localized routes under /[locale] were reachable only via
 * the XML sitemap and `hreflang`. Neither is a discovery-or-authority mechanism
 * — hreflang is a consolidation hint — so all 24 localized pages sat at zero
 * inbound internal links and received no PageRank from the other 339 pages.
 *
 * Deliberately plain <a> elements (via next/link), NOT the <select>-based
 * LocaleSwitcher: a <select> creates no crawlable edge, which is exactly the
 * problem being fixed here.
 */
export function LocaleLinks({
  label,
  links,
  className = "",
}: {
  /** Localized lead-in, e.g. "Also available in". */
  label: string;
  links: { locale: string; href: string }[];
  className?: string;
}) {
  if (!links.length) return null;
  return (
    <p className={`text-[15px] text-text-muted ${className}`}>
      <span>{label}: </span>
      {links.map((l, i) => (
        <span key={l.locale}>
          {i > 0 && <span aria-hidden="true"> · </span>}
          <Link
            href={l.href}
            hrefLang={l.locale}
            className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
          >
            {LOCALE_LABELS[l.locale] ?? l.locale}
          </Link>
        </span>
      ))}
    </p>
  );
}
