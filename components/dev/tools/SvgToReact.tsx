"use client";

import { useState } from "react";
import { Wand2, Trash2, FileCode } from "lucide-react";
import { fieldClass, inputClass, DevButton, CopyButton, Panel, Labeled, StatusPill } from "@/components/dev/ui";

const SAMPLE = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`;

const camel = (s: string) => s.replace(/[-:]([a-z])/g, (_, c: string) => c.toUpperCase());

function convAttr(name: string): string | null {
  if (name === "class") return "className";
  if (name === "for") return "htmlFor";
  if (name.startsWith("data-") || name.startsWith("aria-")) return name;
  if (name === "xmlns") return "xmlns";
  if (name.startsWith("xmlns:")) return null;
  return camel(name);
}

function styleObject(s: string) {
  const entries = s
    .split(";")
    .map((x) => x.trim())
    .filter(Boolean)
    .map((decl) => {
      const i = decl.indexOf(":");
      const k = camel(decl.slice(0, i).trim());
      const v = decl.slice(i + 1).trim();
      return `${k}: '${v}'`;
    });
  return `{{ ${entries.join(", ")} }}`;
}

function pascal(name: string) {
  const c = name.replace(/[^A-Za-z0-9]/g, "");
  return (c.charAt(0).toUpperCase() + c.slice(1)) || "Icon";
}

function convert(svg: string, componentName: string): string {
  const cleaned = svg.replace(/<\?xml[\s\S]*?\?>/g, "").replace(/<!--[\s\S]*?-->/g, "").trim();
  const doc = new DOMParser().parseFromString(cleaned, "image/svg+xml");
  const svgEl = doc.querySelector("svg");
  if (!svgEl || doc.querySelector("parsererror")) return "// Could not parse SVG — check your markup.";

  const serialize = (el: Element, indent: string): string => {
    const tag = el.tagName;
    const attrs: string[] = [];
    for (const a of Array.from(el.attributes)) {
      const nm = convAttr(a.name);
      if (nm === null) continue;
      if (nm === "style") attrs.push(`style=${styleObject(a.value)}`);
      else attrs.push(`${nm}="${a.value}"`);
    }
    if (el === svgEl) attrs.push("{...props}");
    const open = `${indent}<${tag}${attrs.length ? " " + attrs.join(" ") : ""}`;
    const kids = Array.from(el.childNodes).filter(
      (n) => n.nodeType === 1 || (n.nodeType === 3 && (n.textContent || "").trim())
    );
    if (kids.length === 0) return `${open} />`;
    const inner = kids
      .map((n) =>
        n.nodeType === 3 ? `${indent}  ${(n.textContent || "").trim()}` : serialize(n as Element, indent + "  ")
      )
      .join("\n");
    return `${open}>\n${inner}\n${indent}</${tag}>`;
  };

  const jsx = serialize(svgEl, "    ");
  return `import * as React from "react";\n\nexport function ${componentName}(props: React.SVGProps<SVGSVGElement>) {\n  return (\n${jsx}\n  );\n}\n`;
}

export default function SvgToReact() {
  const [input, setInput] = useState("");
  const [name, setName] = useState("Icon");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<{ s: "ok" | "error" | "idle"; msg: string }>({ s: "idle", msg: "" });

  const run = (raw?: string) => {
    const src = raw ?? input;
    if (!src.trim()) { setOutput(""); setStatus({ s: "idle", msg: "" }); return; }
    const out = convert(src, pascal(name));
    setOutput(out);
    setStatus(out.startsWith("//") ? { s: "error", msg: "Parse error" } : { s: "ok", msg: "Converted" });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <Labeled label="Component name">
          <input value={name} onChange={(e) => setName(e.target.value)} className={`${inputClass} w-44`} placeholder="ArrowIcon" />
        </Labeled>
        <DevButton variant="primary" icon={Wand2} onClick={() => run()}>Convert</DevButton>
        <DevButton icon={FileCode} onClick={() => { setInput(SAMPLE); run(SAMPLE); }}>Sample</DevButton>
        <DevButton icon={Trash2} onClick={() => { setInput(""); setOutput(""); setStatus({ s: "idle", msg: "" }); }}>Clear</DevButton>
        <div className="ml-auto"><StatusPill state={status.s}>{status.msg}</StatusPill></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Panel label="SVG">
          <textarea value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} placeholder="Paste SVG markup…" className={`${fieldClass} min-h-[18rem]`} />
        </Panel>
        <Panel label="React component" actions={<CopyButton value={output} />}>
          <textarea value={output} readOnly spellCheck={false} placeholder="// React component appears here" className={`${fieldClass} min-h-[18rem]`} />
        </Panel>
      </div>
      <p className="text-xs text-zinc-500">Renames attributes to JSX (class → className, stroke-width → strokeWidth), spreads props onto the root, and preserves viewBox. Runs in your browser.</p>
    </div>
  );
}
