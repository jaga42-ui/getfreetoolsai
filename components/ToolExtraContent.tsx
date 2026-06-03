import { Check } from "lucide-react";
import { toolExtraContent } from "@/lib/toolContent";

export function ToolExtraContent({ href }: { href: string }) {
  const c = toolExtraContent[href];
  if (!c) return null;
  return (
    <>
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          {c.benefitsTitle ?? "Why use this tool"}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {c.benefits.map((b, i) => (
            <div key={i} className="rounded-lg border border-border bg-surface p-5">
              <p className="font-display text-[17px] font-medium text-text-primary">{b.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{b.body}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">Common use cases</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {c.useCases.map((u, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-text-muted">
              <Check className="mt-1 h-4 w-4 shrink-0 text-secondary" strokeWidth={2} />
              <span>{u}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
