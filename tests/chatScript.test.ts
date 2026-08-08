import { describe, it, expect } from "vitest";
import { parseSideScript, parseAuthorScript } from "@/lib/chatScript";

describe("parseSideScript", () => {
  it("marks '> ' lines as sent and others as received", () => {
    expect(parseSideScript("hey\n> hi back")).toEqual([
      { text: "hey", sent: false },
      { text: "hi back", sent: true },
    ]);
  });

  it("accepts '>' with no following space", () => {
    expect(parseSideScript(">hi")).toEqual([{ text: "hi", sent: true }]);
  });

  it("drops blank lines so trailing newlines make no empty bubbles", () => {
    expect(parseSideScript("a\n\n\nb\n")).toEqual([
      { text: "a", sent: false },
      { text: "b", sent: false },
    ]);
  });

  it("keeps a '>' that appears mid-text", () => {
    expect(parseSideScript("5 > 3")).toEqual([{ text: "5 > 3", sent: false }]);
  });

  describe("with timestamps", () => {
    const opts = { withTime: true, defaultTime: "10:00" };

    it("uses the default time when no @time is given", () => {
      expect(parseSideScript("hello", opts)).toEqual([
        { text: "hello", sent: false, time: "10:00" },
      ]);
    });

    it("extracts a trailing @time and strips it from the text", () => {
      expect(parseSideScript("> on my way @10:22", opts)).toEqual([
        { text: "on my way", sent: true, time: "10:22" },
      ]);
    });

    it("accepts a single-digit hour", () => {
      expect(parseSideScript("late @9:05", opts)).toEqual([
        { text: "late", sent: false, time: "9:05" },
      ]);
    });

    it("leaves an email-like @ in the middle of text alone", () => {
      expect(parseSideScript("mail me @ 10:22 sharp", opts)).toEqual([
        { text: "mail me @ 10:22 sharp", sent: false, time: "10:00" },
      ]);
    });
  });
});

describe("parseAuthorScript", () => {
  it("splits 'name: message' lines", () => {
    expect(parseAuthorScript("arjun: hello\nmeera: hi")).toEqual([
      { author: "arjun", text: "hello", bot: false },
      { author: "meera", text: "hi", bot: false },
    ]);
  });

  it("detects and strips the [BOT] tag", () => {
    expect(parseAuthorScript("MEE6 [BOT]: welcome")).toEqual([
      { author: "MEE6", text: "welcome", bot: true },
    ]);
  });

  it("continues the previous author on a line with no name", () => {
    const out = parseAuthorScript("arjun: line one\nline two");
    expect(out).toEqual([
      { author: "arjun", text: "line one\nline two", bot: false },
    ]);
  });

  it("falls back to a generic author when the first line has no name", () => {
    expect(parseAuthorScript("orphan line")).toEqual([
      { author: "user", text: "orphan line", bot: false },
    ]);
  });

  it("treats a very long prefix as continuation, not an author", () => {
    // Over the 32-char author cap, so it must not be parsed as "name: message".
    const long = "a".repeat(40);
    const out = parseAuthorScript(`arjun: hi\n${long}: still me`);
    expect(out).toHaveLength(1);
    expect(out[0].text).toBe(`hi\n${long}: still me`);
  });

  it("skips blank lines", () => {
    expect(parseAuthorScript("a: one\n\nb: two")).toHaveLength(2);
  });
});
