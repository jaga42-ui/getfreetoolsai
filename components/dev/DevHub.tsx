"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowUpRight } from "lucide-react";
import { devTools, DEV_CATEGORIES, type DevTool } from "@/lib/devtools";

function DevCard({ tool }: { tool: DevTool }) {
  const Icon = tool.icon;
  const inner = (
    <>
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-zinc-800/80 text-emerald-400 ring-1 ring-zinc-700/60 transition-colors group-hover:bg-emerald-500/10 group-hover:ring-emerald-500/40">
          <Icon className="h-[18px] w-[18px]" />
        </span>
        {tool.ready ? (
          <ArrowUpRight className="h-4 w-4 text-zinc-600 transition-colors group-hover:text-emerald-400" />
        ) : (
          <span className="rounded-full border border-zinc-700 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500">Soon</span>
        )}
      </div>
      <p className="mt-3 font-medium text-zinc-100">{tool.name}</p>
      <p className="mt-1 text-xs leading-relaxed text-zinc-500">{tool.description}</p>
      {tool.tag && <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-zinc-600">{tool.tag}</p>}
    </>
  );
  if (!tool.ready) {
    return <div className="rounded-xl border border-zinc-800/70 bg-zinc-900/30 p-4 opacity-70">{inner}</div>;
  }
  return (
    <Link href={tool.href} className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition-all hover:-translate-y-0.5 hover:border-emerald-500/40 hover:bg-zinc-900 hover:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.7)]">
      {inner}
    </Link>
  );
}

export function DevHub() {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const match = (t: DevTool) =>
    !query ||
    t.name.toLowerCase().includes(query) ||
    t.description.toLowerCase().includes(query) ||
    (t.tag ?? "").toLowerCase().includes(query) ||
    t.category.toLowerCase().includes(query);
  const filtered = devTools.filter(match);

  return (
    <div className="mt-8">
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search developer tools…"
          aria-label="Search developer tools"
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/70 py-2.5 pl-9 pr-3 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30"
        />
      </div>

      <div className="mt-8 space-y-10">
        {DEV_CATEGORIES.map((cat) => {
          const tools = filtered.filter((t) => t.category === cat);
          if (!tools.length) return null;
          return (
            <section key={cat}>
              <div className="flex items-center gap-3">
                <h2 className="font-mono text-xs uppercase tracking-widest text-emerald-400">{cat}</h2>
                <span className="h-px flex-1 bg-zinc-800" />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map((t) => (
                  <DevCard key={t.slug} tool={t} />
                ))}
              </div>
            </section>
          );
        })}
        {filtered.length === 0 && <p className="text-sm text-zinc-500">No tools match “{q}”.</p>}
      </div>
    </div>
  );
}
