"use client";

import { useRouter } from "next/navigation";
import {
  ImageDown,
  Replace,
  Maximize2,
  Crop,
  Eraser,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { setHandoff } from "@/lib/handoff";

type Target = { href: string; label: string; icon: LucideIcon };

const IMAGE_TARGETS: Target[] = [
  { href: "/image/compress", label: "Compress", icon: ImageDown },
  { href: "/image/convert", label: "Convert", icon: Replace },
  { href: "/image/resize", label: "Resize", icon: Maximize2 },
  { href: "/image/crop", label: "Crop", icon: Crop },
  { href: "/image/background-remover", label: "Remove BG", icon: Eraser },
];

/**
 * "Keep editing" chaining row for a tool's result screen. Hands the output
 * file(s) to another tool with no re-upload (see lib/handoff). `getFiles` is
 * called lazily on click so result Files aren't built until needed.
 */
export function ChainResults({
  getFiles,
  count,
  current,
}: {
  getFiles: () => File[];
  count: number;
  current: string;
}) {
  const router = useRouter();
  if (count < 1) return null;
  const targets = IMAGE_TARGETS.filter((t) => t.href !== current);
  if (targets.length === 0) return null;

  return (
    <div className="mt-4 rounded-xl border border-border bg-background/60 p-3 text-left">
      <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-text-muted">
        <ArrowRight className="h-3.5 w-3.5 text-primary" />
        Keep editing {count > 1 ? `all ${count} results` : "this result"} — no
        re-upload
      </p>
      <div className="flex flex-wrap gap-2">
        {targets.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.href}
              type="button"
              onClick={() => {
                const files = getFiles();
                if (!files.length) return;
                setHandoff(files, current);
                router.push(t.href);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-text-primary transition-colors hover:border-primary/50 hover:text-primary"
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
