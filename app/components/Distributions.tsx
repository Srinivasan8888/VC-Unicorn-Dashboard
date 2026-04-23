import type { Unicorn } from "../types";
import { SectionHead } from "./SectionHead";

function countBy<T extends string>(rows: Unicorn[], key: (u: Unicorn) => T) {
  const m = new Map<T, number>();
  for (const u of rows) m.set(key(u), (m.get(key(u)) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

export function Distributions({ unicorns }: { unicorns: Unicorn[] }) {
  const sectors = countBy(unicorns, (u) => u.sector);
  const cities = countBy(unicorns, (u) => u.city);
  const years = [...countBy(unicorns, (u) => u.unicorn_year.toString())].sort(
    (a, b) => Number(a[0]) - Number(b[0])
  );
  const sectorMax = Math.max(...sectors.map(([, n]) => n));
  const cityMax = Math.max(...cities.map(([, n]) => n));
  const yearMax = Math.max(...years.map(([, n]) => n));

  return (
    <section id="landscape">
      <SectionHead title="The Landscape" eyebrow="Distribution · April 2026" />
      <div className="grid grid-cols-3 max-lg:grid-cols-1 gap-8 mt-5">
        <BarColumn
          title="By Sector"
          rows={sectors}
          max={sectorMax}
          accentTop={2}
        />
        <BarColumn title="By City" rows={cities} max={cityMax} accentTop={1} />
        <YearColumn years={years} max={yearMax} />
      </div>
    </section>
  );
}

function BarColumn({
  title,
  rows,
  max,
  accentTop,
}: {
  title: string;
  rows: [string, number][];
  max: number;
  accentTop: number;
}) {
  return (
    <div>
      <div className="font-mono text-btn tracking-label uppercase text-ink-muted border-b border-rule pb-[6px] mb-[10px]">
        {title}
      </div>
      <div>
        {rows.map(([label, n], i) => {
          const pct = Math.round((n / max) * 100);
          const accent = i < accentTop;
          return (
            <div
              key={label}
              className="grid grid-cols-[100px_1fr_32px] sm:grid-cols-[130px_1fr_40px] gap-[10px] items-center py-[5px] border-b border-dotted border-rule last:border-b-0"
            >
              <div className="font-mono text-tag uppercase tracking-[0.05em] text-ink truncate">
                {label}
              </div>
              <div className="relative h-[10px] border-b border-rule">
                <div
                  className={`absolute left-0 top-0 bottom-0 ${
                    accent ? "bg-red" : "bg-ink"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="font-mono text-tag text-right text-ink-muted">{n}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function YearColumn({
  years,
  max,
}: {
  years: [string, number][];
  max: number;
}) {
  const currentYear = new Date().getFullYear();
  return (
    <div>
      <div className="font-mono text-btn tracking-label uppercase text-ink-muted border-b border-rule pb-[6px] mb-[10px]">
        By Year of Unicorn Status
      </div>
      <div className="flex items-end gap-[6px] h-[160px] pb-1 border-b border-rule">
        {years.map(([y, n]) => {
          const h = Math.round((n / max) * 140) + 2;
          const recent = Number(y) >= currentYear - 1;
          return (
            <div key={y} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
              <div className="font-mono text-tiny text-ink">{n}</div>
              <div
                className={`w-full ${recent ? "bg-red" : "bg-ink"}`}
                style={{ height: `${h}px` }}
                title={`${y}: ${n} unicorns`}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-[6px] mt-1">
        {years.map(([y]) => (
          <div
            key={y}
            className="flex-1 text-center font-mono text-tiny text-ink-muted tracking-tight"
          >
            {y.slice(2)}
          </div>
        ))}
      </div>
      <div className="font-mono text-tiny tracking-label uppercase text-ink-muted mt-2 italic">
        Red = {currentYear - 1}–{currentYear}
      </div>
    </div>
  );
}
