import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { SizeLanding } from "@/components/SizeLanding";
import { getSizePreset, sizePresetsByKind } from "@/lib/sizePresets";
import { toolMeta } from "@/lib/seo";

export function generateStaticParams() {
  return sizePresetsByKind("image").map((p) => ({ size: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { size: string };
}): Metadata {
  const p = getSizePreset("image", params.size);
  if (!p) return {};
  return toolMeta({
    title: p.title,
    description: p.description,
    keywords: p.keywords,
    path: `/image/compress/${p.slug}`,
  });
}

const CompressImage = dynamic(() => import("@/components/tools/CompressImage"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function Page({ params }: { params: { size: string } }) {
  const preset = getSizePreset("image", params.size);
  if (!preset) notFound();
  const others = sizePresetsByKind("image").filter((o) => o.slug !== preset.slug);

  return (
    <SizeLanding
      preset={preset}
      others={others}
      tool={<CompressImage defaultTargetKB={preset.kb} />}
      toolHref="/image/compress"
      toolLabel="Compress Image"
      sectionLabel="Image Tools"
      guideHref="/guides/image/compress-images-without-losing-quality"
      guideLabel="read the guide"
    />
  );
}
