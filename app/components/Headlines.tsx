import type { Unicorn } from "../types";
import { SectionHead } from "./SectionHead";
import { fmtMoney } from "../lib/fmt";

export function Headlines({ unicorns }: { unicorns: Unicorn[] }) {
  const top = [...unicorns]
    .sort((a, b) => b.valuation_bn - a.valuation_bn)
    .slice(0, 10);

  return (
    <section id="headlines">
      <SectionHead title="The Headlines" eyebrow="Top 10 by Valuation" />
      <ol className="mt-4 divide-y divide-rule border-b border-rule">
        {top.map((u, i) => (
          <li
            key={u.name}
            className="grid grid-cols-[40px_1fr_auto] gap-3 items-start py-[14px] hover:bg-paper-dark transition-colors"
          >
            <div className="flex flex-col items-center gap-[2px] text-ink-muted font-mono text-tag pt-[2px]">
              <span className="text-card font-medium text-ink">{i + 1}</span>
              <span className="text-tiny uppercase tracking-label">rank</span>
            </div>
            <div>
              <div className="font-serif font-bold text-card md:text-[1.2rem] leading-[1.25]">
                {u.name}
              </div>
              <div className="font-mono text-tag uppercase tracking-[0.08em] text-ink-muted mt-1">
                {u.sector} · {u.city} · Founded {u.founded} · Unicorn {u.unicorn_year}
              </div>
              {u.investors.length ? (
                <div className="font-body text-sub text-ink-light mt-1">
                  Backers: {u.investors.slice(0, 3).join(", ")}
                  {u.investors.length > 3 ? ` · +${u.investors.length - 3}` : ""}
                </div>
              ) : null}
            </div>
            <div className="text-right">
              <div className="font-mono font-medium text-[1.05rem] text-ink whitespace-nowrap">
                {fmtMoney(u.valuation_bn)}
              </div>
              <div className="font-mono text-tag uppercase tracking-label text-ink-muted mt-1">
                raised {fmtMoney(u.funding_bn)}
              </div>
              <div className="font-mono text-tag tracking-label uppercase text-red mt-1">
                →
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
