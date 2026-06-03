import type { ReactNode } from "react";

/**
 * Long-form article section for tool pages (light theme). Styles nested
 * h3 / p / ul / strong / a / table via arbitrary variants so page content
 * stays plain, readable JSX.
 */
export function ProseSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-14 max-w-3xl">
      <h2 className="font-display text-2xl font-medium text-text-primary">{title}</h2>
      <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-text-muted [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_h3]:mb-1 [&_h3]:mt-7 [&_h3]:font-display [&_h3]:text-[17px] [&_h3]:font-medium [&_h3]:text-text-primary [&_li]:marker:text-text-muted/50 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5 [&_strong]:font-medium [&_strong]:text-text-primary [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
