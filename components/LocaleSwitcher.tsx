"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { routing } from "@/lib/i18n/routing";

const LABELS: Record<string, string> = {
  en: "English",
  hi: "हिन्दी",
  es: "Español",
  "pt-BR": "Português",
  id: "Bahasa Indonesia",
};

/** Minimal language picker — switches locale while preserving the current path. */
export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  return (
    <label className="inline-flex items-center gap-2 text-sm text-text-muted">
      <span className="sr-only">Language</span>
      <select
        value={locale}
        disabled={isPending}
        onChange={(e) =>
          startTransition(() =>
            router.replace(pathname, { locale: e.target.value })
          )
        }
        className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-text-primary"
      >
        {routing.locales.map((l) => (
          <option key={l} value={l}>
            {LABELS[l] ?? l}
          </option>
        ))}
      </select>
    </label>
  );
}
