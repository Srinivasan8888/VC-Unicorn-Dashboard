import type { Unicorn } from "../types";
import { SectionHead } from "./SectionHead";
import { fmtMoney } from "../lib/fmt";

type InvestorStats = {
  name: string;
  count: number;
  totalValuation: number;
  topUnicorns: string[];
};

export function TopInvestors({ unicorns }: { unicorns: Unicorn[] }) {
  const map = new Map<string, InvestorStats>();
  for (const u of unicorns) {
    for (const inv of u.investors) {
      const key = normalize(inv);
      if (!key || key === "Bootstrapped") continue;
      if (!map.has(key)) {
        map.set(key, { name: key, count: 0, totalValuation: 0, topUnicorns: [] });
      }
      const s = map.get(key)!;
      s.count += 1;
      s.totalValuation += u.valuation_bn;
      s.topUnicorns.push(u.name);
    }
  }
  const ranked = [...map.values()]
    .sort((a, b) => b.count - a.count || b.totalValuation - a.totalValuation)
    .slice(0, 20);

  const maxCount = ranked[0]?.count || 1;

  return (
    <section id="investors">
      <SectionHead title="The Backers" eyebrow="Top 20 investors by unicorn portfolio" />
      <div className="mt-5 border border-rule">
        <div className="grid grid-cols-[40px_1fr_80px_120px] max-md:grid-cols-[30px_1fr_60px] max-md:[&_.hide-sm]:hidden border-b border-b-ink bg-paper sticky top-0">
          <div className="th-meta">#</div>
          <div className="th-meta">Investor</div>
          <div className="th-meta text-right">Unicorns</div>
          <div className="th-meta text-right hide-sm">Combined Value</div>
        </div>
        {ranked.map((r, i) => (
          <div
            key={r.name}
            className="grid grid-cols-[40px_1fr_80px_120px] max-md:grid-cols-[30px_1fr_60px] max-md:[&_.hide-sm]:hidden items-center border-b border-rule last:border-b-0 hover:bg-paper-dark"
          >
            <div className="px-2 py-[10px] font-mono text-tag text-ink-muted">
              {i + 1}
            </div>
            <div className="px-2 py-[10px]">
              <div className="font-serif font-bold text-card leading-tight">
                {r.name}
              </div>
              <div className="relative h-[4px] bg-paper-dark mt-[6px] max-w-[280px]">
                <div
                  className="absolute left-0 top-0 bottom-0 bg-ink"
                  style={{ width: `${(r.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
            <div className="px-2 py-[10px] text-right font-mono font-medium text-ink">
              {r.count}
            </div>
            <div className="px-2 py-[10px] text-right font-mono text-sub text-ink-light hide-sm whitespace-nowrap">
              {fmtMoney(r.totalValuation)}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 font-mono text-tiny italic tracking-label uppercase text-ink-muted">
        Note: Counts a portfolio hit per publicly-disclosed investor (via Inc42 / Tracxn). Combined
        value sums valuations — not dollars-at-risk.
      </div>
    </section>
  );
}

function normalize(s: string) {
  return s
    .replace(/\s+/g, " ")
    .replace(/^Sequoia( Capital)?( India)?$/i, "Peak XV")
    .trim();
}
