import type { ReactNode } from "react";
import { DevHeader } from "@/components/dev/DevHeader";

export default function DevToolsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-zinc-950 text-zinc-300">
      <div className="mx-auto min-h-[75vh] max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <DevHeader />
        {children}
      </div>
    </div>
  );
}
