"use client";

import { useMemo, useState } from "react";
import { CopyButton, Panel, DevButton, fieldClass } from "@/components/dev/ui";
import { cn } from "@/lib/utils";

type Dir = "json2csv" | "csv2json";

function escapeCsv(field: string): string {
  if (/[",\r\n]/.test(field)) return `"${field.replace(/"/g, '""')}"`;
  return field;
}

function cell(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

function jsonToCsv(text: string): { out: string; error: string } {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { out: "", error: "Invalid JSON." };
  }
  const rows = Array.isArray(data) ? data : [data];
  if (rows.length === 0) return { out: "", error: "" };
  // Ordered union of keys across all rows.
  const keys: string[] = [];
  for (const r of rows) {
    if (r && typeof r === "object" && !Array.isArray(r)) {
      for (const k of Object.keys(r)) if (!keys.includes(k)) keys.push(k);
    } else {
      return { out: "", error: "Expected an array of objects (or a single object)." };
    }
  }
  const lines = [keys.map(escapeCsv).join(",")];
  for (const r of rows) {
    const obj = r as Record<string, unknown>;
    lines.push(keys.map((k) => escapeCsv(cell(obj[k]))).join(","));
  }
  return { out: lines.join("\n"), error: "" };
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;
  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += c;
      i++;
      continue;
    }
    if (c === '"') {
      inQuotes = true;
      i++;
    } else if (c === ",") {
      row.push(field);
      field = "";
      i++;
    } else if (c === "\r") {
      i++;
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i++;
    } else {
      field += c;
      i++;
    }
  }
  row.push(field);
  rows.push(row);
  // Drop a trailing empty row caused by a final newline.
  if (rows.length > 1) {
    const last = rows[rows.length - 1];
    if (last.length === 1 && last[0] === "") rows.pop();
  }
  return rows;
}

function coerce(s: string): unknown {
  if (s === "") return "";
  if (s === "true") return true;
  if (s === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(s) && Number.isFinite(Number(s))) return Number(s);
  return s;
}

function csvToJson(text: string): { out: string; error: string } {
  if (text.trim() === "") return { out: "", error: "" };
  const rows = parseCsv(text);
  if (rows.length < 1) return { out: "", error: "No rows found." };
  const header = rows[0];
  const objects = rows.slice(1).map((r) => {
    const o: Record<string, unknown> = {};
    header.forEach((h, i) => {
      o[h] = coerce(r[i] ?? "");
    });
    return o;
  });
  return { out: JSON.stringify(objects, null, 2), error: "" };
}

const SAMPLE_JSON = `[
  { "name": "Ada", "role": "Engineer", "active": true },
  { "name": "Grace", "role": "Admiral", "active": false }
]`;

export default function JsonCsvConverter() {
  const [dir, setDir] = useState<Dir>("json2csv");
  const [input, setInput] = useState(SAMPLE_JSON);

  const { out, error } = useMemo(
    () => (dir === "json2csv" ? jsonToCsv(input) : csvToJson(input)),
    [dir, input]
  );

  const switchDir = (d: Dir) => {
    if (d === dir) return;
    // Feed the current output back in as the new input when it's valid.
    if (out && !error) setInput(out);
    setDir(d);
  };

  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-lg border border-zinc-800 bg-zinc-900/50 p-0.5">
        {(
          [
            ["json2csv", "JSON → CSV"],
            ["csv2json", "CSV → JSON"],
          ] as [Dir, string][]
        ).map(([d, label]) => (
          <button
            key={d}
            type="button"
            onClick={() => switchDir(d)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              dir === d ? "bg-emerald-500 text-zinc-950" : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel
          label={dir === "json2csv" ? "JSON input" : "CSV input"}
          actions={
            <DevButton size="sm" onClick={() => setInput("")}>
              Clear
            </DevButton>
          }
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            rows={14}
            placeholder={dir === "json2csv" ? "Paste an array of objects…" : "Paste CSV with a header row…"}
            className={fieldClass}
          />
        </Panel>

        <Panel
          label={dir === "json2csv" ? "CSV output" : "JSON output"}
          actions={<CopyButton value={out} />}
        >
          <textarea
            value={error ? "" : out}
            readOnly
            rows={14}
            spellCheck={false}
            placeholder="Result appears here…"
            className={cn(fieldClass, "bg-zinc-900/40")}
          />
          {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
        </Panel>
      </div>
    </div>
  );
}
