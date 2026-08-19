import { describe, it, expect } from "vitest";
import { formatVotes } from "@/lib/voteCount";

describe("formatVotes", () => {
  it("leaves counts under 1000 alone", () => {
    expect(formatVotes(0)).toBe("0");
    expect(formatVotes(7)).toBe("7");
    expect(formatVotes(999)).toBe("999");
  });

  it("switches to thousands at exactly 1000", () => {
    expect(formatVotes(1000)).toBe("1k");
    expect(formatVotes(1500)).toBe("1.5k");
    expect(formatVotes(12400)).toBe("12.4k");
  });

  it("drops a trailing .0 rather than showing 12.0k", () => {
    expect(formatVotes(2000)).toBe("2k");
    expect(formatVotes(9000)).toBe("9k");
  });

  it("keeps one decimal at every magnitude, as the real thing does", () => {
    expect(formatVotes(10500)).toBe("10.5k");
    expect(formatVotes(87600)).toBe("87.6k");
  });

  it("promotes to millions rather than ever showing 1000k", () => {
    expect(formatVotes(1_000_000)).toBe("1m");
    expect(formatVotes(2_400_000)).toBe("2.4m");
    // 999,999 is 999.999k, which would round to "1000.0k" if the unit were
    // picked before rounding.
    expect(formatVotes(999_999)).toBe("1m");
  });

  it("handles negative scores, which downvoted posts really do have", () => {
    expect(formatVotes(-5)).toBe("-5");
    expect(formatVotes(-1500)).toBe("-1.5k");
    expect(formatVotes(-42000)).toBe("-42k");
  });

  it("never returns NaN for junk input", () => {
    expect(formatVotes(NaN)).toBe("0");
    expect(formatVotes(Infinity)).toBe("0");
  });

  it("rounds fractional input rather than showing decimals", () => {
    expect(formatVotes(12.6)).toBe("13");
  });
});
