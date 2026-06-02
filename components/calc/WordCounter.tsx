"use client";

import { useMemo, useState } from "react";

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (word.length <= 3) return word ? 1 : 0;
  const m = word
    .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "")
    .replace(/^y/, "")
    .match(/[aeiouy]{1,2}/g);
  return m ? m.length : 1;
}

export default function WordCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/) : [];
    const wordCount = words.length;
    const charsWith = text.length;
    const charsNo = text.replace(/\s/g, "").length;
    const sentences = (text.match(/[.!?]+(\s|$)/g) || []).length || (trimmed ? 1 : 0);
    const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter(Boolean).length : 0;
    const lines = text ? text.split(/\n/).length : 0;
    const syllables = words.reduce((s, w) => s + countSyllables(w), 0);
    const avgLen = wordCount ? charsNo / wordCount : 0;
    const longest = words.reduce((a, b) => (b.replace(/[^a-zA-Z]/g, "").length > a.length ? b.replace(/[^a-zA-Z]/g, "") : a), "");
    const flesch =
      wordCount && sentences
        ? 206.835 - 1.015 * (wordCount / sentences) - 84.6 * (syllables / wordCount)
        : 0;
    const readMin = wordCount / 200;
    const speakMin = wordCount / 130;
    return {
      wordCount,
      charsWith,
      charsNo,
      sentences,
      paragraphs,
      lines,
      avgLen,
      longest,
      flesch: Math.max(0, Math.min(100, flesch)),
      readMin,
      speakMin,
    };
  }, [text]);

  const fleschLabel =
    stats.flesch >= 80 ? "Very easy" : stats.flesch >= 60 ? "Easy / standard" : stats.flesch >= 30 ? "Difficult" : "Very difficult";
  const time = (m: number) => (m < 1 ? `${Math.round(m * 60)} sec` : `${Math.floor(m)} min ${Math.round((m % 1) * 60)} sec`);

  const stat = (label: string, value: string | number) => (
    <div className="rounded-lg border border-border bg-background p-3">
      <p className="text-xs text-text-muted">{label}</p>
      <p className="font-display text-xl font-medium text-text-primary">{value}</p>
    </div>
  );

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        placeholder="Type or paste your text here…"
        className="w-full rounded-lg border border-border bg-surface p-3 text-sm text-text-primary placeholder:text-text-muted/60 focus:border-primary focus:outline-none"
      />

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stat("Words", stats.wordCount)}
        {stat("Characters", stats.charsWith)}
        {stat("Characters (no spaces)", stats.charsNo)}
        {stat("Sentences", stats.sentences)}
        {stat("Paragraphs", stats.paragraphs)}
        {stat("Lines", stats.lines)}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stat("Reading time", time(stats.readMin))}
        {stat("Speaking time", time(stats.speakMin))}
        {stat("Avg word length", stats.avgLen.toFixed(1))}
        {stat("Readability", `${Math.round(stats.flesch)} · ${fleschLabel}`)}
      </div>
    </div>
  );
}
