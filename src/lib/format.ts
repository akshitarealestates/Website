const CRORE = 1_00_00_000;
const LAKH = 1_00_000;

function trimNumber(n: number): string {
  return parseFloat(n.toFixed(2)).toString();
}

/** Format a rupee amount using Indian crore/lakh conventions. */
export function formatINR(amount: number): string {
  if (amount >= CRORE) return `₹${trimNumber(amount / CRORE)} Cr`;
  if (amount >= LAKH) return `₹${trimNumber(amount / LAKH)} L`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

/** Format an area value in square feet. */
export function formatArea(sqft: number): string {
  return `${sqft.toLocaleString('en-IN')} sq ft`;
}
