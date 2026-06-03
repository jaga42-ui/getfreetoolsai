"use client";

import { useState } from "react";
import { Minimize2, Trash2, FileCode } from "lucide-react";
import { fieldClass, DevButton, CopyButton, Panel, StatusPill } from "@/components/dev/ui";

const byteLen = (s: string) => new TextEncoder().encode(s).length;
const fmt = (n: number) => (n < 1024 ? `${n} B` : `${(n / 1024).toFixed(1)} KB`);
const SAMPLE = `/* card */\n.card {\n  margin: 0 auto;\n  padding: 16px 24px;\n  color: #222222;\n  background: #ffffff;\n}\n\n.card:hover { transform: translateY(-2px); }`;

function minifyCss(css: string) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>~+])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();
}

export default function CssMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<{ s: "ok" | "error" | "idle"; msg: string }>({ s: "idle", msg: "" });

  const run = (raw?: string) => {
    const src = raw ?? input;
    if (!src.trim()) { setOutput(""); setStatus({ s: "idle", msg: "" }); return; }
    const out = minifyCss(src);
    setOutput(out);
    const before = byteLen(src), after = byteLen(out);
    setStatus({ s: "ok", msg: `${fmt(before)} → ${fmt(after)} · −${before ? Math.round((1 - after / before) * 100) : 0}%` });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <DevButton variant="primary" icon={Minimize2} onClick={() => run()}>Minify</DevButton>
        <DevButton icon={FileCode} onClick={() => { setInput(SAMPLE); run(SAMPLE); }}>Sample</DevButton>
        <DevButton icon={Trash2} onClick={() => { setInput(""); setOutput(""); setStatus({ s: "idle", msg: "" }); }}>Clear</DevButton>
        <div className="ml-auto"><StatusPill state={status.s}>{status.msg}</StatusPill></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Panel label="CSS">
          <textarea value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} placeholder="Paste CSS…" className={`${fieldClass} min-h-[18rem]`} />
        </Panel>
        <Panel label="Minified" actions={<CopyButton value={output} />}>
          <textarea value={output} readOnly spellCheck={false} placeholder="Minified CSS appears here…" className={`${fieldClass} min-h-[18rem]`} />
        </Panel>
      </div>
      <p className="text-xs text-zinc-500">Lightweight minifier — strips comments and whitespace. Runs entirely in your browser.</p>
    </div>
  );
}
