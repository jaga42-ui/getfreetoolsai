/**
 * Parsers for the little plain-text "scripts" the chat-mockup generators take
 * as input.
 *
 * Two conventions are in use, because the platforms genuinely differ:
 *
 *  - Two-sided chats (iMessage, WhatsApp, Instagram DM) have exactly one "you"
 *    and one "them", so a leading `>` marks a sent message.
 *  - Multi-party chats (Discord) need a name per line, so lines look like
 *    `name: message`.
 *
 * Keeping both here makes them unit-testable — the generators themselves are
 * canvas components that a Node test environment cannot render.
 */

export type SideMessage = { text: string; sent: boolean; time?: string };
export type AuthorMessage = { author: string; text: string; bot: boolean };

/** Trailing "@10:30" (or "@9:05") used to override one message's timestamp. */
const TRAILING_TIME = /\s@(\d{1,2}:\d{2})\s*$/;

/**
 * Parse a two-sided chat script.
 *
 * A line beginning with `>` (with or without a following space) is a sent
 * message; everything else is received. Blank lines are dropped so trailing
 * newlines in a textarea don't produce empty bubbles.
 *
 * When `withTime` is set, a trailing `@HH:MM` is stripped off and returned as
 * that message's `time`; lines without one get `defaultTime`.
 */
export function parseSideScript(
  raw: string,
  opts: { withTime?: boolean; defaultTime?: string } = {}
): SideMessage[] {
  const { withTime = false, defaultTime } = opts;
  return raw
    .split("\n")
    .filter((l) => l.trim() !== "")
    .map((line) => {
      let text = line;
      let sent = false;
      if (text.startsWith("> ")) {
        sent = true;
        text = text.slice(2);
      } else if (text.startsWith(">")) {
        sent = true;
        text = text.slice(1);
      }

      if (!withTime) return { text, sent };

      let time = defaultTime;
      const m = text.match(TRAILING_TIME);
      if (m) {
        time = m[1];
        text = text.slice(0, m.index).trimEnd();
      }
      return { text, sent, time };
    });
}

/** `Name [BOT]` → strip the tag and flag it. */
const BOT_TAG = /\s*\[BOT\]$/i;
/** `name: message`, with the name capped so a URL or long prose isn't eaten. */
const AUTHOR_LINE = /^([^:]{1,32}):\s?(.*)$/;

/**
 * Parse a multi-party chat script.
 *
 * A line without a recognisable `name:` prefix continues the previous author's
 * message (joined with a newline), which is how multi-line posts actually read.
 * A leading continuation line with no preceding author falls back to a generic
 * author rather than being discarded.
 */
export function parseAuthorScript(
  raw: string,
  fallbackAuthor = "user"
): AuthorMessage[] {
  const out: AuthorMessage[] = [];
  for (const line of raw.split("\n")) {
    if (line.trim() === "") continue;
    const m = line.match(AUTHOR_LINE);
    if (m) {
      const rawAuthor = m[1].trim();
      const bot = BOT_TAG.test(rawAuthor);
      out.push({
        author: rawAuthor.replace(BOT_TAG, "").trim() || fallbackAuthor,
        text: m[2],
        bot,
      });
    } else if (out.length) {
      out[out.length - 1].text += "\n" + line;
    } else {
      out.push({ author: fallbackAuthor, text: line, bot: false });
    }
  }
  return out;
}
