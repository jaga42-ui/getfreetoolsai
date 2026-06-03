"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Lightweight top progress bar that animates on every route change, so
 * navigation feels alive. Pure state + CSS transition — no dependency, no
 * layout shift (fixed overlay), and it respects reduced-motion via the browser.
 */
export function RouteProgress() {
  const pathname = usePathname();
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    setWidth(12);
    const t1 = setTimeout(() => setWidth(72), 90);
    const t2 = setTimeout(() => setWidth(100), 340);
    const t3 = setTimeout(() => setVisible(false), 620);
    const t4 = setTimeout(() => setWidth(0), 760);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [pathname]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px]">
      <div
        className="h-full rounded-r-full bg-primary shadow-[0_0_8px_rgba(178,87,51,0.6)] transition-[width,opacity] duration-300 ease-out"
        style={{ width: `${width}%`, opacity: visible ? 1 : 0 }}
      />
    </div>
  );
}
