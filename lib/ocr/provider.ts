/**
 * The OCR provider boundary.
 *
 * A provider's ONLY job is: given a raster, return glyphs with geometry and
 * confidence, in the normalized shape. It must NOT classify blocks, decide
 * reading order, or detect tables — those are engine-independent decisions made
 * downstream in layout analysis, so that swapping the engine cannot change the
 * document semantics.
 *
 * This split is why the interface returns `RecognizedPage` (raw lines + words)
 * rather than a `Page` (typed blocks in reading order). A provider that happens
 * to emit block hints can expose them via `hints`, and layout analysis may use
 * them as a signal, but never as the answer.
 */

import type { BBox, Line, Word } from "./types";

/** What a provider is handed. Always a raster in analysis space. */
export interface RecognizeInput {
  /**
   * The page raster. A canvas keeps this zero-copy in the browser; a server
   * provider would accept the same via ImageData/bytes at its own boundary.
   */
  image: HTMLCanvasElement | ImageData;
  /** 0-based page index, echoed back for correlation in concurrent runs. */
  pageIndex: number;
  /** Provider-specific language code(s), e.g. ["eng"] or ["hin","eng"]. */
  languages: string[];
  /** Cooperative cancellation for long multi-page runs. */
  signal?: AbortSignal;
}

/**
 * Optional structural hints from engines that expose them (Tesseract's block
 * tree, for example). Advisory only — layout analysis owns the decision.
 */
export interface ProviderHints {
  /** Coarse regions the engine believed were separate, in ITS order. */
  regions?: { bbox: BBox; kind?: string }[];
  /** Engine-reported page rotation in degrees, if any. */
  rotation?: number;
}

/** Raw normalized output for one page — geometry and glyphs, no semantics. */
export interface RecognizedPage {
  pageIndex: number;
  width: number;
  height: number;
  lines: Line[];
  /** Mean confidence the engine reported for the page, 0..100. */
  confidence: number;
  hints?: ProviderHints;
}

export interface LanguageOption {
  /** Provider-specific code passed back in `RecognizeInput.languages`. */
  code: string;
  /** Human-readable name for the UI. */
  label: string;
  /** Writing system, used by the UI to warn on script/language mismatch. */
  script: string;
}

/**
 * Progress during a single page's recognition, 0..1.
 * Providers that cannot report granular progress should simply not call it.
 */
export type ProgressFn = (fraction: number, note?: string) => void;

export interface OCRProvider {
  /** Stable machine id recorded in DocumentMetadata.providerId. */
  readonly id: string;
  readonly displayName: string;
  /**
   * Whether the provider processes locally. Surfaced in the UI, because the
   * privacy claim on this site is load-bearing and must never be implied for
   * a provider that uploads.
   */
  readonly runsLocally: boolean;

  languages(): LanguageOption[];

  /** Prepare the engine (download models, spawn workers). Idempotent. */
  init(languages: string[], onProgress?: ProgressFn): Promise<void>;

  recognize(input: RecognizeInput, onProgress?: ProgressFn): Promise<RecognizedPage>;

  /** Release workers/models. Safe to call when never initialized. */
  terminate(): Promise<void>;
}

/** Thrown when a provider fails on one page. Carries the page for isolation. */
export class OcrPageError extends Error {
  readonly pageIndex: number;
  constructor(pageIndex: number, message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "OcrPageError";
    this.pageIndex = pageIndex;
  }
}

/* ------------------------------------------------------------------ */
/* Registry                                                            */
/* ------------------------------------------------------------------ */

type ProviderFactory = () => OCRProvider;

const registry = new Map<string, ProviderFactory>();

/** Register a provider implementation under its id. */
export function registerProvider(id: string, factory: ProviderFactory): void {
  registry.set(id, factory);
}

/** Instantiate a registered provider. Throws if the id is unknown. */
export function createProvider(id: string): OCRProvider {
  const factory = registry.get(id);
  if (!factory) {
    const known = Array.from(registry.keys()).join(", ") || "none";
    throw new Error(`Unknown OCR provider "${id}". Registered: ${known}.`);
  }
  return factory();
}

/** Ids of every registered provider. */
export function availableProviders(): string[] {
  return Array.from(registry.keys());
}

/** Test seam — drops all registrations. */
export function resetProviders(): void {
  registry.clear();
}
