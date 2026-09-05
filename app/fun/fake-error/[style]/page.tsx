import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { ErrorStyleLanding } from "@/components/ErrorStyleLanding";
import { errorStyles, getErrorStyle } from "@/lib/errorStyles";
import { toolMeta } from "@/lib/seo";

export function generateStaticParams() {
  return errorStyles.map((s) => ({ style: s.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { style: string };
}): Metadata {
  const s = getErrorStyle(params.style);
  if (!s) return {};
  return toolMeta({
    title: s.title,
    description: s.description,
    keywords: s.keywords,
    path: `/fun/fake-error/${s.slug}`,
  });
}

const Tool = dynamic(() => import("@/components/tools/fun/FakeError"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function Page({ params }: { params: { style: string } }) {
  const style = getErrorStyle(params.style);
  if (!style) notFound();
  const others = errorStyles.filter((o) => o.slug !== style.slug);

  return (
    <ErrorStyleLanding
      style={style}
      others={others}
      tool={
        <Tool
          chrome={style.chrome}
          defaults={style.defaults}
          filename={`fake-error-${style.slug}.png`}
        />
      }
    />
  );
}
