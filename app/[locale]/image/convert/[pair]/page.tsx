import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Breadcrumb,
  FaqSection,
  PrivacyNote,
  ToolSkeleton,
} from "@/components/ToolScaffold";
import { JsonLd } from "@/components/JsonLd";
import { LocaleLinks } from "@/components/LocaleLinks";
import { softwareAppSchema, SITE_URL } from "@/lib/seo";
import { getConvertPreset } from "@/lib/convertPresets";
import {
  convertI18n,
  getLocalizedConvert,
  localizedLocalesFor,
} from "@/lib/convertPresetsI18n";
import { routing } from "@/lib/i18n/routing";

const ConvertImage = dynamic(() => import("@/components/tools/ConvertImage"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

/** Only the (pair, locale) combos that actually have a translation render here. */
export function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  return Object.keys(convertI18n)
    .filter((pair) => convertI18n[pair][locale])
    .map((pair) => ({ pair }));
}

/**
 * Open Graph wants `language_TERRITORY` (es_ES), not the bare BCP-47 subtag
 * next-intl routes on (es). Mapped explicitly rather than derived, so adding a
 * locale forces a deliberate choice of territory.
 */
const OG_LOCALE: Record<string, string> = {
  en: "en_US",
  es: "es_ES",
  hi: "hi_IN",
  id: "id_ID",
  "pt-BR": "pt_BR",
};

const enPath = (pair: string) => `${SITE_URL}/image/convert/${pair}`;
const locPath = (locale: string, pair: string) =>
  locale === routing.defaultLocale
    ? enPath(pair)
    : `${SITE_URL}/${locale}/image/convert/${pair}`;

/** hreflang map: English source + every locale that has this pair + x-default. */
function alternateLanguages(pair: string): Record<string, string> {
  const languages: Record<string, string> = {
    "x-default": enPath(pair),
    en: enPath(pair),
  };
  for (const l of localizedLocalesFor(pair)) languages[l] = locPath(l, pair);
  return languages;
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; pair: string };
}): Promise<Metadata> {
  const { locale, pair } = params;
  const c = getLocalizedConvert(pair, locale);
  if (!c) return {};
  return {
    title: { absolute: c.title },
    description: c.description,
    // Without this the page inherits the root layout's en_US, so a Spanish page
    // advertised itself as English to every social/AI crawler that reads OG.
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale] ?? locale.replace("-", "_"),
      url: locPath(locale, pair),
      siteName: "GetFreeToolsAI",
      title: c.title,
      description: c.description,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "GetFreeToolsAI — Free Online Tools",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: c.title,
      description: c.description,
      images: ["/opengraph-image"],
    },
    alternates: {
      canonical: locPath(locale, pair),
      languages: alternateLanguages(pair),
    },
  };
}

export default async function Page({
  params,
}: {
  params: { locale: string; pair: string };
}) {
  const { locale, pair } = params;
  setRequestLocale(locale);

  const preset = getConvertPreset(pair);
  const c = getLocalizedConvert(pair, locale);
  if (!preset || !c) notFound();

  const t = await getTranslations({ locale, namespace: "Convert" });
  const toolHref = "/image/convert";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd
        data={softwareAppSchema({
          name: c.h1,
          description: c.description,
          path: `/${locale}/image/convert/${pair}`,
        })}
      />
      <Breadcrumb section="Convert Image" sectionHref={toolHref} current={c.h1} />

      <header className="mt-6">
        <h1 className="font-display text-3xl font-medium leading-[1.1] text-text-primary sm:text-[2.6rem]">
          {c.h1}
        </h1>
      </header>

      <div className="guide-prose mt-5 max-w-none">{c.intro}</div>

      <div className="mt-8">
        <ConvertImage defaultFormat={preset.to} />
      </div>

      <PrivacyNote>{t("privacy")}</PrivacyNote>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          {t("usesHeading")}
        </h2>
        <ul className="mt-4 space-y-2">
          {c.uses.map((u) => (
            <li key={u} className="flex items-start gap-2 text-[15px] text-text-muted">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" strokeWidth={2.25} />
              {u}
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-8 text-[15px] text-text-muted">
        <Link
          href={toolHref}
          className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
        >
          {t("different")}
        </Link>
      </p>

      <FaqSection items={c.faqs} heading={t("faqHeading")} />

      {/* Reciprocal crawlable links: English source + the sibling locales, so
          the localized cluster is connected in both directions rather than
          being a set of dead ends reachable only from the sitemap. */}
      <LocaleLinks
        label={t("otherLanguages")}
        links={[
          { locale: routing.defaultLocale, href: `${toolHref}/${pair}` },
          ...localizedLocalesFor(pair)
            .filter((l) => l !== locale)
            .map((l) => ({ locale: l, href: `/${l}${toolHref}/${pair}` })),
        ]}
        className="mt-8"
      />

      <div className="mt-10">
        <Link
          href={toolHref}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary"
        >
          {t("back")} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
