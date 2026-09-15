import { SITE_URL } from "@/lib/seo";
import { routing } from "./routing";

/** Absolute URL for a locale's homepage (the default locale stays unprefixed). */
export const localeHome = (locale: string) =>
  locale === routing.defaultLocale ? `${SITE_URL}/` : `${SITE_URL}/${locale}`;

/**
 * The homepage hreflang cluster, shared by the English homepage (app/page.tsx)
 * and every localized homepage (app/[locale]/page.tsx).
 *
 * hreflang is only honoured when the annotations are **reciprocal**: /hi named
 * / as its English counterpart, but / advertised only `en-US` + `x-default`, so
 * Google had no return link and discarded the cluster — the four translated
 * homepages were live and invisible. Both sides now build the map from this one
 * function so they cannot drift apart again.
 *
 * Note the language code is `en`, not `en-US`: it has to match the code the
 * localized pages use for the same URL, which comes from `routing.locales`.
 * The per-tool `en-US` in lib/seo.ts is untouched — those pages are English-only
 * and correctly advertise no alternates.
 */
export function localeHomeLanguages(): Record<string, string> {
  const languages: Record<string, string> = {
    "x-default": localeHome(routing.defaultLocale),
  };
  for (const l of routing.locales) languages[l] = localeHome(l);
  return languages;
}
