/** Format a number with grouping and a fixed number of decimals. */
export function fmt(n: number, decimals = 2): string {
  if (!isFinite(n)) return "0";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Format an integer amount with Indian-style grouping (no currency symbol). */
export function grp(n: number): string {
  if (!isFinite(n)) return "0";
  return Math.round(n).toLocaleString("en-IN");
}

/** Equated monthly payment for a loan. P principal, annualRate %, n months. */
export function monthlyPayment(
  principal: number,
  annualRatePct: number,
  months: number
): number {
  const r = annualRatePct / 12 / 100;
  if (months <= 0) return 0;
  if (r === 0) return principal / months;
  const pow = Math.pow(1 + r, months);
  return (principal * r * pow) / (pow - 1);
}

/** Build an amortization schedule. */
export function amortization(
  principal: number,
  annualRatePct: number,
  months: number,
  emi: number
) {
  const r = annualRatePct / 12 / 100;
  const rows: {
    month: number;
    opening: number;
    emi: number;
    principal: number;
    interest: number;
    closing: number;
  }[] = [];
  let balance = principal;
  for (let m = 1; m <= months; m++) {
    const interest = balance * r;
    let principalPaid = emi - interest;
    if (principalPaid > balance) principalPaid = balance;
    const closing = Math.max(0, balance - principalPaid);
    rows.push({
      month: m,
      opening: balance,
      emi: principalPaid + interest,
      principal: principalPaid,
      interest,
      closing,
    });
    balance = closing;
    if (balance <= 0) break;
  }
  return rows;
}
