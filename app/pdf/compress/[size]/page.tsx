import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { SizeLanding } from "@/components/SizeLanding";
import { getSizePreset, sizePresetsByKind } from "@/lib/sizePresets";
import { toolMeta } from "@/lib/seo";

export function generateStaticParams() {
  return sizePresetsByKind("pdf").map((p) => ({ size: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { size: string };
}): Metadata {
  const p = getSizePreset("pdf", params.size);
  if (!p) return {};
  return toolMeta({
    title: p.title,
    description: p.description,
    keywords: p.keywords,
    path: `/pdf/compress/${p.slug}`,
  });
}

const CompressPDF = dynamic(() => import("@/components/tools/CompressPDF"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function Page({ params }: { params: { size: string } }) {
  const preset = getSizePreset("pdf", params.size);
  if (!preset) notFound();
  const others = sizePresetsByKind("pdf").filter((o) => o.slug !== preset.slug);

  return (
    <SizeLanding
      preset={preset}
      others={others}
      tool={<CompressPDF defaultTargetKB={preset.kb} />}
      toolHref="/pdf/compress"
      toolLabel="Compress PDF"
      sectionLabel="PDF Tools"
      guideHref="/guides/pdf/compress-pdf-to-a-specific-size"
      guideLabel="read the guide"
    />
  );
}
