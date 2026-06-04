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
