"use client";

import { useEffect, useRef, useState } from "react";
import { Monitor, Maximize2 } from "lucide-react";
import { SegmentedControl } from "@/components/ui";

type Style = "win10" | "win11";

/**
 * The full-screen "Working on updates" prank.
 *
 * Deliberately built like BlueScreen rather than the canvas generators: the
 * joke is the screen being stuck, so it has to actually occupy the screen. It
 * is not downloadable and produces no image.
 *
 * Two details do the work. The percentage climbs slowly and never reaches 100,
 * because a bar that completes breaks the gag and a bar that jumps looks fake;
 * and the ring spins at Windows' own rate rather than a generic CSS spin, since
 * that cadence is the thing people recognise without being able to name it.
 */
export default function FakeWindowsUpdate() {
  const [style, setStyle] = useState<Style>("win11");
  const [active, setActive] = useState(false);
  const [percent, setPercent] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Climbs in uneven steps and stalls in the 90s -- the way a real update does,
  // and the reason nobody waits it out.
  useEffect(() => {
    if (!active) return;
    setPercent(0);
    const id = setInterval(() => {
      setPercent((p) => {
        if (p >= 99) return 99;
        const step = p > 90 ? 0 : p > 70 ? 1 : 2;
        return Math.min(99, p + step);
      });
    }, 1400);
    return () => clearInterval(id);
  }, [active]);

  // Leaving fullscreen ends the prank.
  useEffect(() => {
    const onFs = () => {
      if (!document.fullscreenElement) setActive(false);
    };
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  // Esc already exits fullscreen, but the overlay can also be shown without it
  // (some browsers block the request), so handle the key directly too.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") stop();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  const start = async () => {
    setActive(true);
    try {
      await wrapRef.current?.requestFullscreen?.();
    } catch {
      /* fullscreen may be blocked; overlay still shows */
    }
  };

  const stop = () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    setActive(false);
  };

  const bg = style === "win11" ? "#000000" : "#0078d7";

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div ref={wrapRef} className="relative">
        {!active ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-background px-6 py-12 text-center">
            <Monitor className="h-10 w-10 text-primary" strokeWidth={1.5} />
            <p className="mt-3 font-display text-lg font-medium text-text-primary">
              Windows Update — prank mode
            </p>
            <p className="mt-1 max-w-sm text-sm text-text-muted">
              Opens a convincing full-screen &ldquo;Working on updates&rdquo;
              screen. Press Esc to exit at any time.
            </p>

            <div className="mt-5">
              <SegmentedControl
                value={style}
                onChange={(v) => setStyle(v as Style)}
                options={[
                  { value: "win11", label: "Windows 11" },
                  { value: "win10", label: "Windows 10" },
                ]}
              />
            </div>

            <button
              type="button"
              onClick={start}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
            >
              <Maximize2 className="h-4 w-4" /> Start full screen
            </button>
          </div>
        ) : (
          <div
            onClick={stop}
            className="fixed inset-0 z-[100] flex cursor-default flex-col items-center justify-center"
            style={{ background: bg }}
          >
            <Spinner />
            <p
              className="mt-9 text-center text-white"
              style={{ fontFamily: "Segoe UI, system-ui, sans-serif", fontSize: 28, fontWeight: 300 }}
            >
              Working on updates {percent}%
            </p>
            <p
              className="mt-2 text-center text-white"
              style={{ fontFamily: "Segoe UI, system-ui, sans-serif", fontSize: 28, fontWeight: 300 }}
            >
              Don&apos;t turn off your computer
            </p>
            <p className="absolute bottom-6 text-xs text-white/40">
              Press Esc or click to exit
            </p>
          </div>
        )}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-text-muted">
        A harmless visual gag — nothing is installed, changed or downloaded, and
        closing the tab ends it. Don&apos;t use it on someone in the middle of
        real work.
      </p>
    </div>
  );
}

/**
 * The Windows boot ring: six dots chasing around a circle. Rendered as
 * individual delayed dots rather than one rotating element, because the real
 * animation has the dots bunch and spread as they travel, which a constant
 * rotation cannot reproduce.
 */
function Spinner() {
  const dots = [0, 1, 2, 3, 4, 5];
  return (
    <>
      <div className="relative h-[60px] w-[60px]">
        {dots.map((i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 block h-[5px] w-[5px] rounded-full bg-white"
            style={{
              marginLeft: -2.5,
              marginTop: -2.5,
              animation: `fwu-orbit 2.2s linear ${i * 0.14}s infinite`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes fwu-orbit {
          0%   { transform: rotate(0deg)   translateY(-26px); opacity: 0; }
          8%   { opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: rotate(360deg) translateY(-26px); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          span[style*="fwu-orbit"] { animation: none !important; opacity: 1 !important; }
        }
      `}</style>
    </>
  );
}
