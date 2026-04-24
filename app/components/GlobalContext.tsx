const COUNTRIES = [
  { name: "United States", count: 1130 },
  { name: "China", count: 247 },
  { name: "India", count: 127, accent: true },
  { name: "United Kingdom", count: 47 },
  { name: "Germany", count: 29 },
];
const TOTAL_GLOBAL = 1336;

export function GlobalContext() {
  const max = Math.max(...COUNTRIES.map((c) => c.count));
  const indiaShare = Math.round(
    ((COUNTRIES.find((c) => c.name === "India")?.count ?? 0) / TOTAL_GLOBAL) *
      100
  );
  return (
    <div>
      <div className="flex items-baseline justify-between border-b border-b-rule pb-2 mb-3">
        <h2 className="font-serif text-[0.95rem] md:text-[1.05rem] uppercase tracking-mast font-bold">
          In the World
        </h2>
        <span className="font-mono text-tiny tracking-label uppercase text-ink-muted">
          #3 of 48
        </span>
      </div>
      <div className="mb-3">
        {COUNTRIES.map((c) => {
          const pct = Math.round((c.count / max) * 100);
          return (
            <div
              key={c.name}
              className="grid grid-cols-[78px_1fr_40px] gap-[10px] items-center py-[5px] border-b border-dotted border-rule last:border-b-0"
            >
              <div
                className={`font-mono text-tag uppercase tracking-tight truncate ${
                  c.accent ? "text-red font-medium" : "text-ink"
                }`}
              >
                {c.name}
              </div>
              <div className="relative h-[8px] border-b border-rule">
                <div
                  className={`absolute left-0 top-0 bottom-0 ${
                    c.accent ? "bg-red" : "bg-ink"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="font-mono text-tag text-right text-ink-muted tabular-nums">
                {c.count.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
      <p className="font-body text-sub text-ink-light italic leading-[1.5]">
        India holds roughly {indiaShare}% of the world&apos;s{" "}
        {TOTAL_GLOBAL.toLocaleString()} unicorns — third behind the US and
        China. Scope: 48 countries.
      </p>
    </div>
  );
}
