"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type FaqItem = { q: string; a: string };

export function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-border rounded-lg border border-border bg-surface">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-display text-[17px] font-medium text-text-primary">
                {item.q}
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-text-muted transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            </button>
            {isOpen && (
              <p className="px-5 pb-4 text-sm leading-relaxed text-text-muted animate-fade-in">
                {item.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
