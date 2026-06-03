"use client";

import { useState } from "react";
import { Minimize2, Trash2, FileCode } from "lucide-react";
import { fieldClass, DevButton, CopyButton, Panel, StatusPill } from "@/components/dev/ui";

const byteLen = (s: string) => new TextEncoder().encode(s).length;
const fmt = (n: number) => (n < 1024 ? `${n} B` : `${(n / 1024).toFixed(1)} KB`);
const SAMPLE = `function greet(name) {\n  // say hello\n  const message = "Hello, " + name + "!";\n  console.log(message);\n  return message;\n}\ngreet("world");`;

export default function JsMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ s: "ok" | "error" | "idle"; msg: string }>({ s: "idle", msg: "" });

  const run = async (raw?: string) => {
    const src = raw ?? input;
    if (!src.trim()) { setOutput(""); setStatus({ s: "idle", msg: "" }); return; }
    setBusy(true);
    try {
      const { minify } = await import("terser");
      const result = await minify(src, { compress: true, mangle: true });
      const code = result.code ?? "";
      setOutput(code);
      const before = byteLen(src);
      const after = byteLen(code);
      const saved = before ? Math.round((1 - after / before) * 100) : 0;
      setStatus({ s: "ok", msg: `${fmt(before)} → ${fmt(after)} · −${saved}%` });
    } catch (e) {
      setOutput("");
      setStatus({ s: "error", msg: e instanceof Error ? e.message : "Could not minify" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <DevButton variant="primary" icon={Minimize2} onClick={() => run()} disabled={busy}>{busy ? "Minifying…" : "Minify"}</DevButton>
        <DevButton icon={FileCode} onClick={() => { setInput(SAMPLE); run(SAMPLE); }}>Sample</DevButton>
        <DevButton icon={Trash2} onClick={() => { setInput(""); setOutput(""); setStatus({ s: "idle", msg: "" }); }}>Clear</DevButton>
        <div className="ml-auto"><StatusPill state={status.s}>{status.msg}</StatusPill></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Panel label="JavaScript">
          <textarea value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} placeholder="Paste JavaScript…" className={`${fieldClass} min-h-[18rem]`} />
        </Panel>
        <Panel label="Minified" actions={<CopyButton value={output} />}>
          <textarea value={output} readOnly spellCheck={false} placeholder="Minified output appears here…" className={`${fieldClass} min-h-[18rem]`} />
        </Panel>
      </div>
      <p className="text-xs text-zinc-500">Minified with Terser, in your browser. Your code is never uploaded.</p>
    </div>
  );
}
