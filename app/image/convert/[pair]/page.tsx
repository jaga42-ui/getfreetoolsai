import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { ConvertLanding } from "@/components/ConvertLanding";
import { convertPresets, getConvertPreset } from "@/lib/convertPresets";
import { toolMeta } from "@/lib/seo";

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
  return toolMeta({
    title: p.title,
    description: p.description,
    keywords: p.keywords,
    path: `/image/convert/${p.slug}`,
  });
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
