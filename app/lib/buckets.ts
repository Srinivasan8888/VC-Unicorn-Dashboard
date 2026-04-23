import type { Unicorn, UnicornStatus } from "../types";

export type Bucket = {
  key: string;
  label: string;
  count: number;
  combinedValuation: number;
  combinedFunding: number;
  topCompanies: Unicorn[];
  topInvestors: string[];
  note?: string;
};

function buildBuckets(
  unicorns: Unicorn[],
  keyFn: (u: Unicorn) => string,
  opts: { allowEmpty?: boolean; order?: string[] } = {}
): Bucket[] {
  const map = new Map<string, Unicorn[]>();
  for (const u of unicorns) {
    const k = keyFn(u);
    if (!k) continue;
    if (!map.has(k)) map.set(k, []);
    map.get(k)!.push(u);
  }
  const entries = [...map.entries()].map(([key, rows]) => {
    const sorted = [...rows].sort((a, b) => b.valuation_bn - a.valuation_bn);
    const combinedValuation = rows.reduce((s, u) => s + u.valuation_bn, 0);
    const combinedFunding = rows.reduce((s, u) => s + u.funding_bn, 0);
    const investorFreq = new Map<string, number>();
    for (const u of rows) {
      for (const inv of u.investors) {
        if (!inv || inv === "Bootstrapped") continue;
        investorFreq.set(inv, (investorFreq.get(inv) ?? 0) + 1);
      }
    }
    const topInvestors = [...investorFreq.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);
    return {
      key,
      label: key,
      count: rows.length,
      combinedValuation,
      combinedFunding,
      topCompanies: sorted.slice(0, 5),
      topInvestors,
    };
  });
  const sorted = [...entries];
  if (opts.order) {
    const order = opts.order;
    sorted.sort(
      (a, b) => order.indexOf(a.key) - order.indexOf(b.key)
    );
  } else {
    sorted.sort((a, b) => b.count - a.count);
  }
  return sorted;
}

export function sectorBuckets(unicorns: Unicorn[]): Bucket[] {
  return buildBuckets(unicorns, (u) => u.sector);
}

export function cityBuckets(unicorns: Unicorn[]): Bucket[] {
  return buildBuckets(unicorns, (u) => u.city);
}

export function outcomeBuckets(unicorns: Unicorn[]): Bucket[] {
  const LABELS: Record<UnicornStatus, string> = {
    private: "Still Private",
    ipo: "Went Public",
    acquired: "Acquired",
    distressed: "Distressed",
  };
  const buckets = buildBuckets(unicorns, (u) => u.status, {
    order: ["private", "ipo", "acquired", "distressed"],
  });
  return buckets.map((b) => ({
    ...b,
    label: LABELS[b.key as UnicornStatus] ?? b.label,
  }));
}

export function backerBuckets(unicorns: Unicorn[], limit = 20): Bucket[] {
  const map = new Map<string, Unicorn[]>();
  for (const u of unicorns) {
    for (const inv of u.investors) {
      if (!inv || inv === "Bootstrapped") continue;
      if (!map.has(inv)) map.set(inv, []);
      map.get(inv)!.push(u);
    }
  }
  const list = [...map.entries()].map(([key, rows]) => {
    const sorted = [...rows].sort((a, b) => b.valuation_bn - a.valuation_bn);
    const combinedValuation = rows.reduce((s, u) => s + u.valuation_bn, 0);
    const combinedFunding = rows.reduce((s, u) => s + u.funding_bn, 0);
    return {
      key,
      label: key,
      count: rows.length,
      combinedValuation,
      combinedFunding,
      topCompanies: sorted.slice(0, 5),
      topInvestors: [],
    };
  });
  list.sort(
    (a, b) => b.count - a.count || b.combinedValuation - a.combinedValuation
  );
  return list.slice(0, limit);
}
