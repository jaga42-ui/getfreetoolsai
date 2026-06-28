import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { ConvertLanding } from "@/components/ConvertLanding";
import { convertPresets, getConvertPreset } from "@/lib/convertPresets";
import { localizedLocalesFor } from "@/lib/convertPresetsI18n";
import { toolMeta, SITE_URL } from "@/lib/seo";

export function generateStaticParams() {
  return convertPresets.map((p) => ({ pair: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { pair: string };
}): Metadata {
  const p = getConvertPreset(params.pair);
  if (!p) return {};
  const meta = toolMeta({
    title: p.title,
    description: p.description,
    keywords: p.keywords,
    path: `/image/convert/${p.slug}`,
  });
  // When this pair has localized versions, advertise them via hreflang so the
  // English page and its translations reference each other (bidirectional).
  const locales = localizedLocalesFor(p.slug);
  if (locales.length) {
    const languages: Record<string, string> = {
      "x-default": `${SITE_URL}/image/convert/${p.slug}`,
      en: `${SITE_URL}/image/convert/${p.slug}`,
    };
    for (const l of locales)
      languages[l] = `${SITE_URL}/${l}/image/convert/${p.slug}`;
    meta.alternates = { ...meta.alternates, languages };
  }
  return meta;
}

const ConvertImage = dynamic(() => import("@/components/tools/ConvertImage"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function Page({ params }: { params: { pair: string } }) {
  const preset = getConvertPreset(params.pair);
  if (!preset) notFound();
  const others = convertPresets.filter((o) => o.slug !== preset.slug);

  return (
    <ConvertLanding
      preset={preset}
      others={others}
      tool={<ConvertImage defaultFormat={preset.to} />}
    />
  );
}
