"use client";

import { useEffect } from "react";

/**
 * The single root <html> lives in app/layout.tsx with lang="en". Until the full
 * route migration moves <html> into the locale layout, this keeps the lang
 * attribute correct for localized (/es, /hi, …) pages so screen readers and
 * search engines see the right language.
 */
export function HtmlLang({ locale }: { locale: string }) {
  useEffect(() => {
    const previous = document.documentElement.lang;
    document.documentElement.lang = locale;
    return () => {
      document.documentElement.lang = previous;
    };
  }, [locale]);
  return null;
}
