import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Tool } from "@/lib/tools";

export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;

  const inner = (
    <>
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-primary">
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
        </div>
        {tool.ready ? (
          <span className="label text-secondary">Free</span>
        ) : (
          <span className="label text-text-muted/70">Soon</span>
        )}
      </div>
      <div className="mt-4">
        <h3 className="flex items-center gap-1.5 font-display text-lg font-medium text-text-primary">
          {tool.name}
          {tool.ready && (
            <ArrowRight className="h-4 w-4 -translate-x-1 text-text-muted opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
          )}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-text-muted">
          {tool.description}
        </p>
      </div>
    </>
  );

  if (!tool.ready) {
    return (
      <div className="flex cursor-default flex-col rounded-lg border border-border bg-surface/50 p-5 opacity-60">
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={tool.href}
      className="group flex flex-col rounded-lg border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-text-muted/40"
    >
      {inner}
    </Link>
  );
}
