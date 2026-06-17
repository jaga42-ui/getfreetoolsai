import { describe, it, expect } from "vitest";
import { fmt, grp, monthlyPayment, amortization } from "@/lib/calc";

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
