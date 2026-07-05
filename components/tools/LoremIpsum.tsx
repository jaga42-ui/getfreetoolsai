"use client";

import { useMemo, useState } from "react";
import { Button, SegmentedControl } from "@/components/ui";
import { OutputArea } from "@/components/tools/text/shared";
import { RefreshCw } from "lucide-react";

type Unit = "paragraphs" | "sentences" | "words";

const WORDS =
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(
    " "
  );

const rand = (n: number) => Math.floor(Math.random() * n);
const pick = () => WORDS[rand(WORDS.length)];

function makeSentence(): string {
  const len = 8 + rand(9); // 8–16 words
  const parts: string[] = [];
  for (let i = 0; i < len; i++) {
    let w = pick();
    // sprinkle in a comma occasionally
    if (i > 0 && i < len - 1 && rand(9) === 0) w += ",";
    parts.push(w);
  }
  const s = parts.join(" ");
  return s.charAt(0).toUpperCase() + s.slice(1) + ".";
}

function makeParagraph(): string {
  const len = 3 + rand(4); // 3–6 sentences
  return Array.from({ length: len }, makeSentence).join(" ");
}

function generate(count: number, unit: Unit, classic: boolean): string {
  const n = Math.max(1, Math.min(count, 200));
  let out: string;
  if (unit === "words") {
    out = Array.from({ length: n }, pick).join(" ");
    out = out.charAt(0).toUpperCase() + out.slice(1) + ".";
  } else if (unit === "sentences") {
    out = Array.from({ length: n }, makeSentence).join(" ");
  } else {
    out = Array.from({ length: n }, makeParagraph).join("\n\n");
  }
  if (classic) {
    const lead = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";
    out = lead + out.charAt(0).toLowerCase() + out.slice(1);
  }
  return out;
}

export default function LoremIpsum() {
  const [count, setCount] = useState(3);
  const [unit, setUnit] = useState<Unit>("paragraphs");
  const [classic, setClassic] = useState(true);
  const [seed, setSeed] = useState(0);

  // Regenerate on any control change or explicit refresh (seed).
  const output = useMemo(
    () => generate(count, unit, classic),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [count, unit, classic, seed]
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-text-primary">
            How many
          </label>
          <input
            type="number"
            min={1}
            max={200}
            value={count}
            onChange={(e) => setCount(Number(e.target.value) || 1)}
            className="w-24 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-text-primary">
            Unit
          </label>
          <SegmentedControl
            value={unit}
            onChange={setUnit}
            options={[
              { value: "paragraphs", label: "Paragraphs" },
              { value: "sentences", label: "Sentences" },
              { value: "words", label: "Words" },
            ]}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-text-primary">
        <input
          type="checkbox"
          checked={classic}
          onChange={(e) => setClassic(e.target.checked)}
          className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
        />
        Start with “Lorem ipsum dolor sit amet…”
      </label>

      <div className="flex flex-wrap gap-2">
        <Button icon={RefreshCw} onClick={() => setSeed((s) => s + 1)}>
          Regenerate
        </Button>
      </div>

      <OutputArea
        value={output}
        label="Generated text"
        rows={10}
        stat={`${output.length} characters`}
      />
    </div>
  );
}
