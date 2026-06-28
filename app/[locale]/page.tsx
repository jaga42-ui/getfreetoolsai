import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, prefixedLocales } from "@/lib/i18n/routing";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { SITE_URL } from "@/lib/seo";

export function generateStaticParams() {
  return prefixedLocales.map((locale) => ({ locale }));
}

/** Absolute URL for a locale's homepage (default locale stays unprefixed). */
const localeHome = (locale: string) =>
  locale === routing.defaultLocale ? `${SITE_URL}/` : `${SITE_URL}/${locale}`;

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "Home" });

  // hreflang: advertise every locale's counterpart + x-default so Google serves
  // the right language version and treats these as alternates, not duplicates.
  const languages: Record<string, string> = {
    "x-default": localeHome(routing.defaultLocale),
  };
  for (const l of routing.locales) languages[l] = localeHome(l);

  return {
    title: { absolute: `${t("title")} — GetFreeToolsAI` },
    description: t("subtitle"),
    alternates: { canonical: localeHome(locale), languages },
  };
}

export default async function LocaleHome({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Home" });
  const nav = await getTranslations({ locale, namespace: "Common.nav" });

  const hubs = [
    { href: "/pdf-tools", label: nav("pdf") },
    { href: "/image-tools", label: nav("image") },
    { href: "/calculators", label: nav("calculators") },
    { href: "/dev-tools", label: nav("dev") },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="flex justify-end">
        <LocaleSwitcher />
      </div>

      <header className="mt-6">
        <p className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/[0.07] px-4 py-1.5 text-sm font-medium text-secondary">
          <ShieldCheck className="h-4 w-4" />
          {t("privacy")}
        </p>
        <h1 className="mt-6 font-display text-4xl font-medium leading-[1.1] text-text-primary sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-text-muted">
          {t("subtitle")}
        </p>
      </header>

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        {hubs.map((h) => (
          <Link
            key={h.href}
            href={h.href}
            className="group flex items-center justify-between rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary/50"
          >
            <span className="font-display text-lg font-medium text-text-primary">
              {h.label}
            </span>
            <ArrowRight className="h-5 w-5 text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </Link>
        ))}
      </section>

      <div className="mt-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white"
        >
          {t("cta")} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
