"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { DevButton, CopyButton, Panel } from "@/components/dev/ui";

export default function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [upper, setUpper] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [ids, setIds] = useState<string[]>([]);

  const make = useCallback(() => {
    const n = Math.min(Math.max(count || 1, 1), 100);
    const list = Array.from({ length: n }, () => {
      let u = crypto.randomUUID();
      if (!hyphens) u = u.replace(/-/g, "");
      if (upper) u = u.toUpperCase();
      return u;
    });
    setIds(list);
  }, [count, upper, hyphens]);

  useEffect(() => {
    make();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-4">
        <label className="text-xs text-zinc-400">
          How many
          <input type="number" min={1} max={100} value={count} onChange={(e) => setCount(parseInt(e.target.value) || 1)} className="mt-1 block w-24 rounded-md border border-zinc-800 bg-zinc-900/70 px-2 py-1.5 font-mono text-sm text-zinc-100 outline-none focus:border-emerald-500/60" />
        </label>
        <label className="inline-flex items-center gap-2 text-xs text-zinc-400"><input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} className="accent-emerald-500" /> Uppercase</label>
        <label className="inline-flex items-center gap-2 text-xs text-zinc-400"><input type="checkbox" checked={hyphens} onChange={(e) => setHyphens(e.target.checked)} className="accent-emerald-500" /> Hyphens</label>
        <DevButton variant="primary" icon={RefreshCw} onClick={make}>Generate</DevButton>
      </div>
      <Panel label={`${ids.length} × UUID v4`} actions={<CopyButton value={ids.join("\n")} />}>
        <div className="divide-y divide-zinc-800 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/70">
          {ids.map((id, i) => (
            <div key={i} className="flex items-center justify-between gap-3 px-3 py-2">
              <code className="truncate font-mono text-[13px] text-zinc-200">{id}</code>
              <CopyButton value={id} className="shrink-0" />
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
