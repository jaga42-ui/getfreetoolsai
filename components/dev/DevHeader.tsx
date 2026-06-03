import Link from "next/link";
import { Terminal, ShieldCheck } from "lucide-react";

export function DevHeader() {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
      <Link href="/dev-tools" className="inline-flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30">
          <Terminal className="h-4 w-4" />
        </span>
        <span className="font-mono text-sm font-semibold tracking-tight text-zinc-100">
          dev<span className="text-emerald-400">/</span>tools
        </span>
      </Link>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-[11px] font-medium text-zinc-400">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> 100% in-browser · nothing uploaded
      </span>
    </div>
  );
}

export function DevSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="h-64 animate-pulse rounded-lg border border-zinc-800 bg-zinc-900/60" />
      <div className="h-64 animate-pulse rounded-lg border border-zinc-800 bg-zinc-900/60" />
    </div>
  );
}
