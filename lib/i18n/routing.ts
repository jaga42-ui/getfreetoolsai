import { defineRouting } from "next-intl/routing";

/**
 * Central locale config. `en` is the default and stays **unprefixed** — it
 * continues to be served by the existing top-level routes under app/ (e.g.
 * /image/convert). The other locales are path-prefixed (/es, /hi, /pt-BR, /id)
 * and resolve through app/[locale]/.
 *
 * `localePrefix: "as-needed"` keeps every existing English URL byte-identical,
 * so nothing in the current sitemap or index changes.
 */
export const routing = defineRouting({
  locales: ["en", "hi", "es", "pt-BR", "id"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];

/** The non-default locales that render under app/[locale]/. */
export const prefixedLocales = routing.locales.filter(
  (l) => l !== routing.defaultLocale
);
