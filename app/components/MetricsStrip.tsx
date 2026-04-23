import type { Unicorn, UnicornDataset } from "../types";

function fmtBn(v: number) {
  return v >= 100 ? v.toFixed(0) : v.toFixed(1);
}

export function MetricsStrip({
  unicorns,
  meta,
}: {
  unicorns: Unicorn[];
  meta: UnicornDataset["meta"];
}) {
  const active = unicorns.filter((u) => u.status === "private").length;
  const agg = unicorns.reduce((s, u) => s + u.valuation_bn, 0);
  const funding = unicorns.reduce((s, u) => s + u.funding_bn, 0);
  const latest = [...unicorns].sort((a, b) => b.unicorn_year - a.unicorn_year)[0];
  const ages = unicorns
    .map((u) => u.unicorn_year - u.founded)
    .filter((n) => n >= 0 && n <= 40)
    .sort((a, b) => a - b);
  const medianAge = ages[Math.floor(ages.length / 2)] ?? 0;

  const items = [
    { label: "On the Ledger", value: unicorns.length.toString(), sub: `Ever-Unicorns (${meta.as_of})` },
    { label: "Still Private", value: active.toString(), sub: `${meta.ipo_exits} listed · ${meta.acquired} acquired` },
    { label: "Aggregate Valuation", value: `$${fmtBn(agg)}B`, sub: "Combined book value", accent: true },
    { label: "Capital Deployed", value: `$${fmtBn(funding)}B`, sub: "Total funding raised" },
    { label: "Median Age", value: `${medianAge}y`, sub: "Founding to $1B" },
    { label: "Latest Entrant", value: latest.name.split(" (")[0], sub: `Class of ${latest.unicorn_year}` },
  ];

  return (
    <section className="grid grid-cols-6 max-lg:grid-cols-3 max-md:grid-cols-2 gap-px bg-rule border-t-2 border-t-ink">
      {items.map((it) => (
        <div key={it.label} className="bg-paper py-[18px] px-3 text-center">
          <div className="font-mono text-tag tracking-label uppercase text-ink-muted mb-[6px] leading-tight">
            {it.label}
          </div>
          <div
            className={`font-serif font-black leading-none text-[1.4rem] md:text-[1.7rem] break-words ${
              it.accent ? "text-red" : "text-ink"
            }`}
          >
            {it.value}
          </div>
          <div className="font-mono text-tiny tracking-wider uppercase text-ink-muted mt-[6px] leading-tight">
            {it.sub}
          </div>
        </div>
      ))}
    </section>
  );
}
