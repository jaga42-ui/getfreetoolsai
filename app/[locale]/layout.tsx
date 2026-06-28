import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing, prefixedLocales } from "@/lib/i18n/routing";
import { HtmlLang } from "@/components/HtmlLang";

/** Only the prefixed (non-default) locales render under [locale]; `en` is served
 *  by the existing top-level routes, so it is intentionally excluded here. */
export function generateStaticParams() {
  return prefixedLocales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Enable static rendering for this locale segment.
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <HtmlLang locale={locale} />
      {children}
    </NextIntlClientProvider>
  );
}
