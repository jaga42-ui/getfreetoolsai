/**
 * Document assembly and classification.
 *
 * Takes analyzed pages and produces the `DocumentModel` that every exporter and
 * the editor consume. Also guesses the document *kind*, which downstream
 * reconstruction uses to weight its choices (an invoice cares about tables and
 * totals; a paper cares about columns and references).
 *
 * Classification here is deliberately lightweight — keyword and structure
 * signals, no model, no network. It reports a confidence and falls back to
 * "generic", because a wrong confident guess would push reconstruction in the
 * wrong direction, and a low-confidence honest one costs nothing.
 */

import {
  computeQuality,
  type DocumentKind,
  type DocumentMetadata,
  type DocumentModel,
  type Page,
  type QualityScore,
} from "./types";

/* ------------------------------------------------------------------ */
/* Text extraction                                                     */
/* ------------------------------------------------------------------ */

/** All text of a page, blocks in reading order. */
export function pageText(page: Page): string {
  return page.blocks
    .slice()
    .sort((a, b) => a.readingOrder - b.readingOrder)
    .map((b) => b.lines.map((l) => l.words.map((w) => w.text).join(" ")).join("\n"))
    .join("\n\n");
}

/** All text of a document. */
export function documentText(doc: DocumentModel): string {
  return doc.pages
    .filter((p) => p.status === "ok")
    .map(pageText)
    .join("\n\n");
}

/* ------------------------------------------------------------------ */
/* Classification                                                      */
/* ------------------------------------------------------------------ */

/**
 * Keyword evidence per document kind.
 *
 * Kept small and specific. Generic words ("date", "name", "total") appear in
 * far too many document types to be evidence of any one of them.
 */
const KEYWORDS: { kind: DocumentKind; terms: string[] }[] = [
  {
    kind: "invoice",
    terms: ["invoice", "invoice no", "bill to", "amount due", "subtotal", "purchase order", "gstin", "tax invoice"],
  },
  {
    kind: "receipt",
    terms: ["receipt", "cashier", "change due", "thank you for your purchase", "tendered"],
  },
  {
    kind: "resume",
    terms: ["curriculum vitae", "work experience", "professional experience", "education", "skills", "references available"],
  },
  {
    kind: "certificate",
    terms: ["certificate", "is hereby awarded", "has successfully completed", "in recognition of", "certify that"],
  },
  {
    kind: "academicPaper",
    terms: ["abstract", "introduction", "related work", "methodology", "references", "we propose", "et al"],
  },
  {
    kind: "form",
    terms: ["please print", "tick", "check one", "signature of applicant", "for office use only", "declaration"],
  },
  {
    kind: "letter",
    terms: ["dear sir", "dear madam", "yours sincerely", "yours faithfully", "kind regards"],
  },
  {
    kind: "idDocument",
    terms: ["date of birth", "passport no", "licence no", "license no", "nationality", "permanent account number"],
  },
  {
    kind: "report",
    terms: ["executive summary", "annual report", "quarterly", "findings", "recommendations"],
  },
];

export interface KindGuess {
  kind: DocumentKind;
  confidence: number;
}

/**
 * Guess the document kind from text and structure.
 *
 * Scoring is intentionally simple: each matched keyword contributes, and a few
 * structural signals adjust. Confidence is capped well below 1 because this is
 * evidence, not proof.
 */
export function classifyDocument(doc: DocumentModel): KindGuess {
  const text = documentText(doc).toLowerCase();
  if (!text.trim()) return { kind: "generic", confidence: 0 };

  const scores = new Map<DocumentKind, number>();
  for (const { kind, terms } of KEYWORDS) {
    let hits = 0;
    for (const t of terms) if (text.includes(t)) hits++;
    if (hits) scores.set(kind, hits);
  }

  const pages = doc.pages.filter((p) => p.status === "ok");
  const blocks = pages.flatMap((p) => p.blocks);
  const tableCount = blocks.filter((b) => b.type === "table").length;
  const maxColumns = Math.max(
    1,
    ...blocks.map((b) => (b.columnIndex !== undefined && b.columnIndex >= 0 ? b.columnIndex + 1 : 1))
  );

  // Structural nudges, each worth less than a keyword hit so text still leads.
  if (tableCount > 0) {
    scores.set("invoice", (scores.get("invoice") ?? 0) + 0.5);
    scores.set("report", (scores.get("report") ?? 0) + 0.25);
  }
  if (maxColumns >= 2 && pages.length >= 1) {
    scores.set("academicPaper", (scores.get("academicPaper") ?? 0) + 0.5);
  }

  if (!scores.size) return { kind: "generic", confidence: 0.2 };

  let best: DocumentKind = "generic";
  let bestScore = 0;
  // Iterate the declared order for determinism when two kinds tie.
  const order: DocumentKind[] = KEYWORDS.map((k) => k.kind);
  for (const kind of order) {
    const s = scores.get(kind) ?? 0;
    if (s > bestScore) {
      bestScore = s;
      best = kind;
    }
  }

  if (bestScore <= 0) return { kind: "generic", confidence: 0.2 };

  // Two keyword hits is decent evidence; four is about as sure as this method
  // gets. Cap at 0.85 — never claim certainty from keyword matching.
  const confidence = Math.min(0.85, 0.3 + bestScore * 0.14);
  return { kind: best, confidence };
}

/* ------------------------------------------------------------------ */
/* Assembly                                                            */
/* ------------------------------------------------------------------ */

export interface BuildDocumentInput {
  pages: Page[];
  providerId: string;
  languages: string[];
  fileName?: string;
  processingMs?: number;
}

/**
 * Assemble analyzed pages into a document, classifying it on the way.
 *
 * Pages are sorted by index so out-of-order completion from a concurrent
 * pipeline cannot scramble the document.
 */
export function buildDocument(input: BuildDocumentInput): DocumentModel {
  const pages = input.pages.slice().sort((a, b) => a.index - b.index);

  const metadata: DocumentMetadata = {
    fileName: input.fileName,
    kind: "generic",
    kindConfidence: 0,
    languages: input.languages,
    providerId: input.providerId,
    processingMs: input.processingMs,
  };

  const doc: DocumentModel = { metadata, pages };
  const guess = classifyDocument(doc);
  doc.metadata.kind = guess.kind;
  doc.metadata.kindConfidence = guess.confidence;
  return doc;
}

/** Summary counts for the UI, computed from the model rather than guessed. */
export interface DocumentStats {
  pages: number;
  okPages: number;
  failedPages: number;
  blankPages: number;
  words: number;
  headings: number;
  tables: number;
  lists: number;
  figures: number;
  columnsMax: number;
  quality: QualityScore;
}

export function documentStats(doc: DocumentModel): DocumentStats {
  let words = 0;
  let headings = 0;
  let tables = 0;
  let lists = 0;
  let columnsMax = 1;

  for (const page of doc.pages) {
    for (const block of page.blocks) {
      if (block.type === "heading") headings++;
      if (block.type === "table") tables++;
      if (block.type === "list") lists++;
      if (block.columnIndex !== undefined && block.columnIndex >= 0) {
        columnsMax = Math.max(columnsMax, block.columnIndex + 1);
      }
      for (const line of block.lines) {
        words += line.words.filter((w) => w.text.trim()).length;
      }
    }
  }

  return {
    pages: doc.pages.length,
    okPages: doc.pages.filter((p) => p.status === "ok").length,
    failedPages: doc.pages.filter((p) => p.status === "failed").length,
    blankPages: doc.pages.filter((p) => p.status === "blank").length,
    words,
    headings,
    tables,
    lists,
    figures: doc.pages.reduce((s, p) => s + p.images.length, 0),
    columnsMax,
    quality: computeQuality(doc),
  };
}

/**
 * Words the OCR engine was unsure about, for the correction UI.
 *
 * Returns the location of each so the editor can highlight it and scroll to
 * the matching region of the original scan.
 */
export function lowConfidenceWords(
  doc: DocumentModel,
  threshold = 72
): { pageIndex: number; blockId: string; wordId: string; text: string; confidence: number }[] {
  const out: { pageIndex: number; blockId: string; wordId: string; text: string; confidence: number }[] = [];
  for (const page of doc.pages) {
    // A reused native text layer is exact; flagging it would be noise.
    if (page.source === "native") continue;
    for (const block of page.blocks) {
      for (const line of block.lines) {
        for (const word of line.words) {
          if (word.confidence < threshold && word.text.trim()) {
            out.push({
              pageIndex: page.index,
              blockId: block.id,
              wordId: word.id,
              text: word.text,
              confidence: word.confidence,
            });
          }
        }
      }
    }
  }
  return out;
}
