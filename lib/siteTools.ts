import { allTools } from "./tools";
import { readyDevTools } from "./devtools";

/**
 * Every live tool across ALL categories — PDF, image, calculator, audio AND
 * developer tools — normalized to the minimal shape the ItemList schema and
 * headline counts need. Dev tools were previously excluded from the site's
 * primary structured-data list; this is the single source of truth so they
 * are never dropped again and the tool count can't go stale.
 */
export const allSiteTools: { name: string; href: string }[] = [
  ...allTools.filter((t) => t.ready).map((t) => ({ name: t.name, href: t.href })),
  ...readyDevTools.map((t) => ({ name: t.name, href: t.href })),
];

/** Exact number of live tools. */
export const TOOL_COUNT = allSiteTools.length;

/**
 * Conservative, round, always-true headline label (e.g. "60+"). Rounds DOWN to
 * the nearest ten so the claim is never an overstatement, and updates itself as
 * tools are added.
 */
export const TOOL_COUNT_LABEL = `${Math.floor(TOOL_COUNT / 10) * 10}+`;
