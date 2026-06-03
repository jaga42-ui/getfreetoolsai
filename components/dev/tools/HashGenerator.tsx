"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { fieldClass, DevButton, CopyButton, Panel } from "@/components/dev/ui";

const ALGOS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;

async function hashHex(algo: string, text: string) {
  const buf = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest(algo, buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    if (!input) {
      setHashes({});
      return;
    }
    (async () => {
      const entries = await Promise.all(ALGOS.map(async (a) => [a, await hashHex(a, input)] as const));
      if (active) setHashes(Object.fromEntries(entries));
    })();
    return () => {
      active = false;
    };
  }, [input]);

  return (
    <div className="space-y-4">
      <Panel
        label="Input text"
        actions={<DevButton size="sm" icon={Trash2} onClick={() => setInput("")}>Clear</DevButton>}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
          placeholder="Type or paste text to hash…"
          className={`${fieldClass} min-h-[8rem]`}
        />
      </Panel>
      <div className="space-y-3">
        {ALGOS.map((a) => (
          <Panel key={a} label={a} actions={<CopyButton value={hashes[a] ?? ""} />}>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 py-2.5">
              <code className="block break-all font-mono text-[13px] text-emerald-300">
                {hashes[a] || <span className="text-zinc-600">—</span>}
              </code>
            </div>
          </Panel>
        ))}
      </div>
      <p className="text-xs text-zinc-500">
        Hashes are computed locally with the Web Crypto API. MD5 is intentionally omitted —
        it is cryptographically broken and not supported by browsers.
      </p>
    </div>
  );
}
