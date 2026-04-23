import type { Unicorn } from "../types";
import { SectionHead } from "./SectionHead";
import { fmtMoney } from "../lib/fmt";

export function RecentClass({ unicorns }: { unicorns: Unicorn[] }) {
  const maxYear = Math.max(...unicorns.map((u) => u.unicorn_year));
  const recent = unicorns
    .filter((u) => u.unicorn_year >= maxYear - 1)
    .sort((a, b) => b.unicorn_year - a.unicorn_year || b.valuation_bn - a.valuation_bn);

  const byYear = new Map<number, Unicorn[]>();
  for (const u of recent) {
    if (!byYear.has(u.unicorn_year)) byYear.set(u.unicorn_year, []);
    byYear.get(u.unicorn_year)!.push(u);
  }
  const years = [...byYear.keys()].sort((a, b) => b - a);

  return (
    <section id="class">
      <SectionHead
        title="The Latest Class"
        eyebrow={`${recent.length} new unicorns · ${maxYear - 1}–${maxYear}`}
      />
      <div className="grid grid-cols-2 max-md:grid-cols-1 gap-6 mt-5">
        {years.map((y) => (
          <div key={y}>
            <div className="flex items-baseline justify-between border-b border-rule pb-[6px] mb-3">
              <h3 className="font-serif font-bold text-[1.25rem] leading-none">
                Class of {y}
              </h3>
              <span className="font-mono text-tag uppercase tracking-label text-ink-muted">
                {byYear.get(y)!.length} entrant{byYear.get(y)!.length === 1 ? "" : "s"}
              </span>
            </div>
            <ul className="divide-y divide-rule">
              {byYear.get(y)!.map((u) => (
                <li
                  key={u.name}
                  className="grid grid-cols-[1fr_auto] gap-3 py-[10px] items-baseline"
                >
                  <div>
                    <div className="font-serif font-bold text-card leading-tight">
                      {u.name}
                    </div>
                    <div className="font-mono text-tiny uppercase tracking-label text-ink-muted mt-[2px]">
                      {u.sector} · {u.city} · {u.unicorn_year - u.founded} yrs to $1B
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-medium text-meta text-ink whitespace-nowrap">
                      {fmtMoney(u.valuation_bn)}
                    </div>
                    <div className="font-mono text-tiny uppercase tracking-label text-ink-muted">
                      raised {fmtMoney(u.funding_bn)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
