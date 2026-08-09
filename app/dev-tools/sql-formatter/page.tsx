import dynamic from "next/dynamic";
import { DevFrame } from "@/components/dev/DevFrame";
import { DevSkeleton } from "@/components/dev/DevHeader";
import { toolMeta } from "@/lib/seo";

export const metadata = toolMeta({
  title: "SQL Formatter & Beautifier — Free Online",
  description:
    "Format and beautify SQL free online with clean indentation and keyword casing. Supports MySQL, PostgreSQL, SQLite and BigQuery — in your browser.",
  keywords:
    "sql formatter, sql beautifier, format sql online, sql pretty print, mysql formatter, postgresql formatter, sql query formatter",
  path: "/dev-tools/sql-formatter",
});

const Tool = dynamic(() => import("@/components/dev/tools/SqlFormatter"), { ssr: false, loading: () => <DevSkeleton /> });

const about = (
  <>
    <p>
      Paste a cramped, one-line query and get back clean, readable SQL with consistent indentation
      and upper-cased keywords. Pick your dialect — MySQL, PostgreSQL, SQLite, MariaDB, BigQuery,
      Snowflake or PL/SQL — so clauses and functions format the way that engine expects.
    </p>
    <p>
      It is built for reading code reviews, sharing queries and tidying generated SQL. Formatting
      runs entirely in your browser, so your queries stay private.
    </p>
  </>
);

const faqs = [
  { q: "Which SQL dialects are supported?", a: "MySQL, PostgreSQL, MariaDB, SQLite, BigQuery, Snowflake, PL/SQL and standard SQL — pick the one that matches your database." },
  { q: "Does it change my query's logic?", a: "No. It only reformats whitespace, indentation and keyword casing. The statement itself is unchanged." },
  { q: "Is my SQL uploaded anywhere?", a: "No. Formatting happens entirely in your browser; nothing is sent to a server." },
  { q: "Why are keywords uppercased?", a: "Upper-casing keywords (SELECT, FROM, WHERE) is a common convention that makes queries easier to scan. The structure and identifiers keep their original case." },
];

export default function Page() {
  return (
    <DevFrame slug="sql-formatter" about={about} faqs={faqs}>
      <Tool />
    </DevFrame>
  );
}
