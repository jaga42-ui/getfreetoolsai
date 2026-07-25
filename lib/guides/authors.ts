export interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
}

/** Author registry — multi-author ready. Reference guides by author id. */
export const AUTHORS: Record<string, Author> = {
  team: {
    id: "team",
    name: "The GetFreeToolsAI Team",
    role: "Tools & document-processing engineers",
    bio: "We build and maintain GetFreeToolsAI's free, browser-based tools. Every guide is written and reviewed by the same engineers who build the tools it describes, and tested against the live product.",
  },
};

export function getAuthor(id: string): Author {
  return AUTHORS[id] ?? AUTHORS.team;
}

export interface Reviewer {
  /** Full real name, e.g. "Ravi Menon". */
  name: string;
  /** Real, verifiable credential, e.g. "CA", "CFP", "CFA". */
  credential: string;
  /** Optional one-line bio for an author page. */
  bio?: string;
}

/**
 * Named subject-matter reviewer for YMYL (tax / finance) calculators.
 *
 * IMPORTANT: Set this to a REAL, consenting, credentialed person only — never a
 * fabricated persona. A made-up "reviewed by CA X" is dishonest author
 * attribution and a Google trust violation, worse than having none.
 *
 * While this is null, calculator pages fall back to an honest
 * "fact-checked by the GetFreeToolsAI team" byline. To enable the named-reviewer
 * byline site-wide, fill in the real name + credential below.
 */
export const CALC_REVIEWER: Reviewer | null = null;
// Example once you have a real reviewer:
// export const CALC_REVIEWER: Reviewer = { name: "Ravi Menon", credential: "CA" };
