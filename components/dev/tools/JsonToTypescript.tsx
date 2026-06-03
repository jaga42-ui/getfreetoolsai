"use client";

import { useState } from "react";
import { Wand2, Trash2, FileCode } from "lucide-react";
import { fieldClass, DevButton, CopyButton, Panel, StatusPill } from "@/components/dev/ui";

const SAMPLE = `{"id":1,"name":"Ada","active":true,"roles":["admin","user"],"profile":{"city":"London","age":36},"posts":[{"title":"Hello","likes":3},{"title":"World","likes":7,"pinned":true}]}`;

function pascal(k: string) {
  const c = k.replace(/[^A-Za-z0-9]+(.)/g, (_, ch: string) => ch.toUpperCase()).replace(/[^A-Za-z0-9]/g, "");
  return c.charAt(0).toUpperCase() + c.slice(1) || "Field";
}
function safeKey(k: string) {
  return /^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k);
}

function generate(input: unknown, rootName = "Root"): string {
  const out: string[] = [];

  const typeOf = (v: unknown, name: string): string => {
    if (v === null) return "null";
    if (Array.isArray(v)) return arrType(v, name);
    if (typeof v === "object") return objType(v as Record<string, unknown>, name);
    if (typeof v === "number") return "number";
    if (typeof v === "boolean") return "boolean";
    if (typeof v === "string") return "string";
    return "unknown";
  };

  const objType = (o: Record<string, unknown>, name: string): string => {
    const lines = Object.entries(o).map(([k, v]) => `  ${safeKey(k)}: ${typeOf(v, pascal(k))};`);
    out.push(`export interface ${name} {\n${lines.join("\n")}\n}`);
    return name;
  };

  const arrType = (a: unknown[], name: string): string => {
    if (!a.length) return "unknown[]";
    const allObjects = a.every((x) => x && typeof x === "object" && !Array.isArray(x));
    if (allObjects) {
      const merged: Record<string, unknown[]> = {};
      const counts: Record<string, number> = {};
      (a as Record<string, unknown>[]).forEach((o) =>
        Object.entries(o).forEach(([k, v]) => {
          if (!merged[k]) merged[k] = [];
          merged[k].push(v);
          counts[k] = (counts[k] || 0) + 1;
        })
      );
      const iname = pascal(name.replace(/s$/, "")) || "Item";
      const lines = Object.entries(merged).map(([k, vals]) => {
        const optional = counts[k] < a.length;
        return `  ${safeKey(k)}${optional ? "?" : ""}: ${typeOf(vals[0], pascal(k))};`;
      });
      out.push(`export interface ${iname} {\n${lines.join("\n")}\n}`);
      return `${iname}[]`;
    }
    const types = Array.from(new Set(a.map((x) => typeOf(x, name))));
    return `${types.length === 1 ? types[0] : `(${types.join(" | ")})`}[]`;
  };

  const rootType = typeOf(input, rootName);
  if (!out.some((s) => s.startsWith(`export interface ${rootName} `))) {
    out.push(`export type ${rootName} = ${rootType};`);
  }
  return out.join("\n\n");
}

export default function JsonToTypescript() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<{ s: "ok" | "error" | "idle"; msg: string }>({ s: "idle", msg: "" });

  const convert = (raw?: string) => {
    const src = raw ?? input;
    if (!src.trim()) { setOutput(""); setStatus({ s: "idle", msg: "" }); return; }
    try {
      const parsed = JSON.parse(src);
      setOutput(generate(parsed, "Root"));
      setStatus({ s: "ok", msg: "Generated" });
    } catch (e) {
      setOutput("");
      setStatus({ s: "error", msg: e instanceof Error ? e.message : "Invalid JSON" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <DevButton variant="primary" icon={Wand2} onClick={() => convert()}>Convert</DevButton>
        <DevButton icon={FileCode} onClick={() => { setInput(SAMPLE); convert(SAMPLE); }}>Sample</DevButton>
        <DevButton icon={Trash2} onClick={() => { setInput(""); setOutput(""); setStatus({ s: "idle", msg: "" }); }}>Clear</DevButton>
        <div className="ml-auto"><StatusPill state={status.s}>{status.msg}</StatusPill></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Panel label="JSON">
          <textarea value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} placeholder="Paste JSON here…" className={`${fieldClass} min-h-[18rem]`} />
        </Panel>
        <Panel label="TypeScript" actions={<CopyButton value={output} />}>
          <textarea value={output} readOnly spellCheck={false} placeholder="// interfaces appear here" className={`${fieldClass} min-h-[18rem]`} />
        </Panel>
      </div>
    </div>
  );
}
