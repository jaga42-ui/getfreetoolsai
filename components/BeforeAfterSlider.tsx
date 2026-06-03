"use client";

import { useCallback, useRef, useState } from "react";
import { ChevronsLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Draggable before/after image comparison. Both images must share the same
 * dimensions (the background remover's cutout matches the original). Works with
 * mouse, touch and pen via pointer events.
 */
export function BeforeAfterSlider({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
  checkered = false,
  className,
}: {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
  /** Show a transparency checkerboard behind the "after" image. */
  checkered?: boolean;
  className?: string;
}) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, pct)));
  }, []);

  const checker =
    "bg-white bg-[conic-gradient(#e7e1d3_90deg,transparent_90deg_180deg,#e7e1d3_180deg_270deg,transparent_270deg)] bg-[length:18px_18px]";

  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full select-none overflow-hidden rounded-lg border border-border touch-none",
        checkered && checker,
        className
      )}
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        setFromClientX(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && setFromClientX(e.clientX)}
      onPointerUp={(e) => {
        dragging.current = false;
        try {
          e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
          /* noop */
        }
      }}
      onPointerCancel={() => (dragging.current = false)}
    >
      {/* After (base, sets height) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={after}
        alt={afterLabel}
        draggable={false}
        className="block max-h-72 w-full object-contain"
      />
      {/* Before, clipped from the right to the divider */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={before}
        alt={beforeLabel}
        draggable={false}
        className="absolute inset-0 h-full w-full object-contain"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />

      {/* Labels */}
      <span className="pointer-events-none absolute left-2 top-2 rounded bg-black/55 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute right-2 top-2 rounded bg-black/55 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white">
        {afterLabel}
      </span>

      {/* Divider + handle */}
      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white/90 shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-text-primary shadow-md">
          <ChevronsLeftRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
