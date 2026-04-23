export function fmtMoney(n: number): string {
  if (!n) return "—";
  if (n >= 10) return `$${n.toFixed(0)}B`;
  if (n >= 1) return `$${n.toFixed(1)}B`;
  return `$${Math.round(n * 1000)}M`;
}

export function fmtPct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

export function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
