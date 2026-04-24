import type { Unicorn, UnicornDataset } from "../types";
import { fmtMoney } from "../lib/fmt";
import { GlobalContext } from "./GlobalContext";

export function FrontPage({
  unicorns,
  meta,
}: {
  unicorns: Unicorn[];
  meta: UnicornDataset["meta"];
}) {
  const top10 = [...unicorns]
    .sort((a, b) => b.valuation_bn - a.valuation_bn)
    .slice(0, 10);

  const maxYear = Math.max(...unicorns.map((u) => u.unicorn_year));
  const latest = unicorns
    .filter((u) => u.unicorn_year >= maxYear - 1)
    .sort(
      (a, b) =>
        b.unicorn_year - a.unicorn_year || b.valuation_bn - a.valuation_bn
    );

  const active = unicorns.filter((u) => u.status === "private").length;
  const agg = unicorns.reduce((s, u) => s + u.valuation_bn, 0);
  const funding = unicorns.reduce((s, u) => s + u.funding_bn, 0);
  const ages = unicorns
    .map((u) => u.unicorn_year - u.founded)
    .filter((n) => n >= 0 && n <= 40)
    .sort((a, b) => a - b);
  const medianAge = ages[Math.floor(ages.length / 2)] ?? 0;

  const stats = [
    { value: unicorns.length.toString(), label: "On the Ledger" },
    { value: `$${Math.round(agg)}B`, label: "Aggregate Valuation", accent: true },
    { value: `$${Math.round(funding)}B`, label: "Capital Deployed" },
    { value: `${medianAge}y`, label: "Median Age · Founding → $1B" },
    { value: `${active}`, label: `Still Private · ${meta.ipo_exits} listed · ${meta.acquired} acquired` },
  ];

  return (
    <section
      id="headlines"
      className="border-t-2 border-t-ink pt-6 md:pt-8 pb-4"
    >
      <div className="grid lg:grid-cols-[1fr_300px] gap-8 md:gap-10">
        <HeadlinesColumn rows={top10} />
        <aside className="grid gap-8 lg:gap-10">
          <ByTheNumbers stats={stats} asOf={meta.as_of} />
          <GlobalContext />
          <LatestClass rows={latest} />
        </aside>
      </div>
    </section>
  );
}

/* ───────── Headlines column ───────── */

function HeadlinesColumn({ rows }: { rows: Unicorn[] }) {
  return (
    <div>
      <div className="flex items-baseline justify-between border-b border-b-rule pb-2 mb-1">
        <h2 className="font-serif text-[1.05rem] md:text-section uppercase tracking-mast font-bold">
          The Headlines
        </h2>
        <span className="font-mono text-tag tracking-label uppercase text-ink-muted">
          Top 10 by Valuation
        </span>
      </div>
      <ol className="divide-y divide-rule">
        {rows.map((u, i) => (
          <HeadlineRow key={u.name} u={u} rank={i + 1} />
        ))}
      </ol>
    </div>
  );
}

function HeadlineRow({ u, rank }: { u: Unicorn; rank: number }) {
  return (
    <li className="grid grid-cols-[auto_1fr_auto] gap-3 md:gap-5 py-3 md:py-[14px] items-start transition-colors hover:bg-paper-dark">
      <div className="font-mono text-tag text-ink-muted tabular-nums pt-1 min-w-[22px] text-right">
        {String(rank).padStart(2, "0")}
      </div>
      <div className="min-w-0">
        <div className="font-serif font-bold text-[1rem] md:text-card leading-[1.2]">
          {u.name}
        </div>
        <div className="font-mono text-tag uppercase tracking-label text-ink-muted mt-[2px]">
          {u.sector} · {u.city} · Est. {u.founded} · Unicorn {u.unicorn_year}
        </div>
        {u.investors.length ? (
          <div className="font-body text-sub text-ink-light mt-1 max-md:hidden">
            Backers: {u.investors.slice(0, 3).join(", ")}
            {u.investors.length > 3 ? ` · +${u.investors.length - 3}` : ""}
          </div>
        ) : null}
      </div>
      <div className="text-right whitespace-nowrap pt-1">
        <div className="font-mono font-medium text-[1rem] md:text-card text-ink leading-none">
          {fmtMoney(u.valuation_bn)}
        </div>
        <div className="font-mono text-tag uppercase tracking-label text-ink-muted mt-1">
          raised {fmtMoney(u.funding_bn)}
        </div>
      </div>
    </li>
  );
}

/* ───────── Sidebar: By the Numbers ───────── */

function ByTheNumbers({
  stats,
  asOf,
}: {
  stats: { value: string; label: string; accent?: boolean }[];
  asOf: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between border-b border-b-rule pb-2 mb-3">
        <h2 className="font-serif text-[0.95rem] md:text-[1.05rem] uppercase tracking-mast font-bold">
          By the Numbers
        </h2>
        <span className="font-mono text-tiny tracking-label uppercase text-ink-muted">
          {asOf}
        </span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-y-[14px] gap-x-4">
        {stats.map((s) => (
          <div key={s.label}>
            <div
              className={`font-serif font-black text-[1.5rem] md:text-[1.75rem] leading-none ${
                s.accent ? "text-red" : "text-ink"
              }`}
            >
              {s.value}
            </div>
            <div className="font-mono text-tiny tracking-label uppercase text-ink-muted mt-[3px] leading-[1.35]">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────── Sidebar: Latest Class ───────── */

function LatestClass({ rows }: { rows: Unicorn[] }) {
  const byYear = new Map<number, Unicorn[]>();
  for (const u of rows) {
    if (!byYear.has(u.unicorn_year)) byYear.set(u.unicorn_year, []);
    byYear.get(u.unicorn_year)!.push(u);
  }
  const years = [...byYear.keys()].sort((a, b) => b - a);
  const minY = Math.min(...years);
  const maxY = Math.max(...years);

  return (
    <div id="class">
      <div className="flex items-baseline justify-between border-b border-b-rule pb-2 mb-3">
        <h2 className="font-serif text-[0.95rem] md:text-[1.05rem] uppercase tracking-mast font-bold">
          Latest Class
        </h2>
        <span className="font-mono text-tiny tracking-label uppercase text-ink-muted">
          {rows.length} new · {minY}–{maxY}
        </span>
      </div>
      <ul className="divide-y divide-rule">
        {rows.map((u) => (
          <li
            key={u.name}
            className="grid grid-cols-[auto_1fr_auto] gap-[10px] py-[10px] items-baseline"
          >
            <div className="font-mono text-tag text-ink-muted tabular-nums">
              {u.unicorn_year}
            </div>
            <div className="min-w-0">
              <div className="font-serif font-bold text-[0.95rem] leading-tight truncate">
                {u.name}
              </div>
              <div className="font-mono text-tiny uppercase tracking-label text-ink-muted mt-[1px]">
                {u.sector} · {u.city}
              </div>
            </div>
            <div className="font-mono text-tag text-ink whitespace-nowrap">
              {fmtMoney(u.valuation_bn)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
