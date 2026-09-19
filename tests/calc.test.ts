import { describe, it, expect } from "vitest";
import { fmt, grp, monthlyPayment, amortization, compactInr, toCsv } from "@/lib/calc";

describe("fmt", () => {
  it("groups thousands and fixes decimals", () => {
    expect(fmt(1234.5)).toBe("1,234.50");
  });

  it("respects a custom decimal count", () => {
    expect(fmt(1234.567, 0)).toBe("1,235");
  });

  it("returns '0' for non-finite input", () => {
    expect(fmt(Infinity)).toBe("0");
    expect(fmt(NaN)).toBe("0");
  });
});

describe("grp", () => {
  it("uses Indian-style grouping on a rounded integer", () => {
    expect(grp(1234567)).toBe("12,34,567");
  });

  it("rounds before grouping", () => {
    expect(grp(999.9)).toBe("1,000");
  });

  it("returns '0' for non-finite input", () => {
    expect(grp(NaN)).toBe("0");
  });
});

describe("monthlyPayment", () => {
  it("computes the standard EMI for an interest-bearing loan", () => {
    // 100000 @ 12% for 12 months -> ~8884.88
    expect(monthlyPayment(100000, 12, 12)).toBeCloseTo(8884.88, 2);
  });

  it("splits principal evenly when the rate is zero", () => {
    expect(monthlyPayment(12000, 0, 12)).toBe(1000);
  });

  it("returns 0 for a non-positive term", () => {
    expect(monthlyPayment(100000, 12, 0)).toBe(0);
  });
});

describe("amortization", () => {
  const principal = 100000;
  const rate = 12;
  const months = 12;
  const emi = monthlyPayment(principal, rate, months);
  const rows = amortization(principal, rate, months, emi);

  it("produces one row per month", () => {
    expect(rows).toHaveLength(months);
  });

  it("starts the first row at the full principal", () => {
    expect(rows[0].opening).toBe(principal);
  });

  it("fully repays the loan by the final row", () => {
    expect(rows[rows.length - 1].closing).toBeCloseTo(0, 2);
  });

  it("keeps principal + interest equal to the EMI each month", () => {
    for (const row of rows) {
      expect(row.principal + row.interest).toBeCloseTo(row.emi, 6);
    }
  });

  it("never lets the balance go negative", () => {
    for (const row of rows) {
      expect(row.closing).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("compactInr", () => {
  it("uses lakh and crore units", () => {
    expect(compactInr(181670)).toBe("1.8L");
    expect(compactInr(12300000)).toBe("1.2Cr");
  });

  it("drops the decimal once the unit reaches two digits", () => {
    expect(compactInr(1200000)).toBe("12L");
    expect(compactInr(120000000)).toBe("12Cr");
  });

  it("falls back to thousands and plain integers", () => {
    expect(compactInr(45000)).toBe("45k");
    expect(compactInr(750)).toBe("750");
  });

  it("returns '0' for non-finite input", () => {
    expect(compactInr(NaN)).toBe("0");
  });
});

describe("toCsv", () => {
  const CRLF = "\r\n";

  it("joins rows with CRLF and cells with commas", () => {
    expect(toCsv([["a", "b"], [1, 2]])).toBe(`a,b${CRLF}1,2`);
  });

  it("quotes cells containing a comma or a quote", () => {
    expect(toCsv([["x,y"]])).toBe('"x,y"');
    expect(toCsv([['he said "hi"']])).toBe('"he said ""hi"""');
  });

  it("quotes a cell containing a newline", () => {
    expect(toCsv([["line1\nline2"]])).toBe('"line1\nline2"');
  });

  it("neutralises a leading formula character so a spreadsheet treats it as text", () => {
    // A cell starting with = + - or @ is executed by Excel and Sheets. The tab
    // prefix keeps an exported campaign name inert; the cell is then quoted
    // because it now contains a tab.
    expect(toCsv([["=1+1"]])).toBe('"\t=1+1"');
    expect(toCsv([["@SUM(A1)"]])).toBe('"\t@SUM(A1)"');
  });

  it("leaves an ordinary positive number untouched", () => {
    expect(toCsv([[42]])).toBe("42");
  });
});
