"use client";

import { useEffect, useRef, useState } from "react";
import { Monitor, Maximize2 } from "lucide-react";
import { SegmentedControl } from "@/components/ui";

type Style = "win10" | "win9x";

export default function BlueScreen() {
  const [style, setStyle] = useState<Style>("win10");
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    setProgress(0);
    const id = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 1));
    }, 350);
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

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div ref={wrapRef} className="relative">
        {!active ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-background px-6 py-12 text-center">
            <Monitor className="h-10 w-10 text-primary" strokeWidth={1.5} />
            <p className="mt-3 font-display text-lg font-medium text-text-primary">
              Blue Screen of Death — prank mode
            </p>
            <p className="mt-1 max-w-sm text-sm text-text-muted">
              Opens a convincing full-screen crash screen. Move the mouse or
              press Esc to exit at any time.
            </p>
            <div className="mt-5">
              <SegmentedControl<Style>
                value={style}
                onChange={setStyle}
                options={[
                  { value: "win10", label: "Windows 10/11" },
                  { value: "win9x", label: "Classic (90s)" },
                ]}
              />
            </div>
            <button
              type="button"
              onClick={start}
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-[#fbf8f1] transition-colors hover:bg-[#9c4828]"
            >
              <Maximize2 className="h-4 w-4" /> Start blue screen
            </button>
          </div>
        ) : (
          <div
            onClick={stop}
            className="fixed inset-0 z-[100] flex cursor-pointer flex-col justify-center overflow-hidden text-white"
            style={{ backgroundColor: style === "win10" ? "#0078d7" : "#0000aa" }}
          >
            {style === "win10" ? (
              <div className="mx-auto w-full max-w-2xl px-8">
                <p className="text-[12vw] leading-none sm:text-8xl">:(</p>
                <p className="mt-6 text-lg leading-relaxed sm:text-2xl">
                  Your PC ran into a problem and needs to restart. We&apos;re
                  just collecting some error info, and then we&apos;ll restart
                  for you.
                </p>
                <p className="mt-6 text-lg sm:text-2xl">{progress}% complete</p>
                <div className="mt-8 flex items-start gap-4">
                  <div className="h-24 w-24 shrink-0 bg-white p-1">
                    <div className="grid h-full w-full grid-cols-4 grid-rows-4 gap-px">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div
                          key={i}
                          className={i % 3 === 0 ? "bg-black" : "bg-white"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed opacity-90 sm:text-sm">
                    For more information about this issue and possible fixes,
                    visit https://www.windows.com/stopcode
                    <br />
                    <br />
                    If you call a support person, give them this info:
                    <br />
                    Stop code: CRITICAL_PROCESS_DIED
                  </p>
                </div>
              </div>
            ) : (
              <div className="mx-auto w-full max-w-3xl px-8 font-mono text-sm leading-relaxed sm:text-base">
                <p className="mx-auto mb-6 w-fit bg-[#aaaaaa] px-3 text-[#0000aa]">
                  Windows
                </p>
                <p>
                  A fatal exception 0E has occurred at 0028:C0011E36 in VXD
                  VMM(01) + 00010E36. The current application will be terminated.
                </p>
                <br />
                <p>* Press any key to terminate the current application.</p>
                <p>
                  * Press CTRL+ALT+DEL again to restart your computer. You will
                  lose any unsaved information in all applications.
                </p>
                <br />
                <p className="text-center">Press any key to continue _</p>
              </div>
            )}
            <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] opacity-40">
              (click anywhere or press Esc to exit — this is a prank)
            </p>
          </div>
        )}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-text-muted">
        Harmless fun — nothing crashes and nothing is installed. The screen is
        just a full-screen web page you can dismiss any time with Esc.
      </p>
    </div>
  );
}
