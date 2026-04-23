import type { Unicorn } from "../types";
import { SectionHead } from "./SectionHead";

export function TrendsBlock({ unicorns }: { unicorns: Unicorn[] }) {
  return (
    <section id="trends">
      <SectionHead title="The Trends" eyebrow="Velocity · Outcomes · Age" />
      <div className="grid grid-cols-3 max-lg:grid-cols-1 gap-8 mt-5">
        <CumulativeTimeline unicorns={unicorns} />
        <StatusBreakdown unicorns={unicorns} />
        <AgeToUnicorn unicorns={unicorns} />
      </div>
    </section>
  );
}

function CumulativeTimeline({ unicorns }: { unicorns: Unicorn[] }) {
  const byYear = new Map<number, number>();
  for (const u of unicorns) byYear.set(u.unicorn_year, (byYear.get(u.unicorn_year) ?? 0) + 1);
  const years = [...byYear.keys()].sort((a, b) => a - b);
  let running = 0;
  const points = years.map((y) => {
    running += byYear.get(y)!;
    return { year: y, total: running, added: byYear.get(y)! };
  });
  const last = points[points.length - 1];
  const firstY = points[0].year;
  const lastY = last.year;
  const yRange = lastY - firstY || 1;

  return (
    <div>
      <div className="font-mono text-btn tracking-label uppercase text-ink-muted border-b border-rule pb-[6px] mb-3">
        Cumulative Unicorns
      </div>
      <svg viewBox="0 0 300 140" className="w-full h-auto" preserveAspectRatio="none">
        <line x1="0" y1="140" x2="300" y2="140" stroke="#c8bfb0" strokeWidth="1" />
        <line x1="0" y1="0" x2="0" y2="140" stroke="#c8bfb0" strokeWidth="1" />
        <polyline
          points={points
            .map((p) => {
              const x = ((p.year - firstY) / yRange) * 300;
              const y = 140 - (p.total / last.total) * 130;
              return `${x},${y}`;
            })
            .join(" ")}
          fill="none"
          stroke="#1a1410"
          strokeWidth="1.5"
        />
        {points.map((p) => {
          const x = ((p.year - firstY) / yRange) * 300;
          const y = 140 - (p.total / last.total) * 130;
          const accent = p.year >= lastY - 1;
          return (
            <circle
              key={p.year}
              cx={x}
              cy={y}
              r="2.5"
              fill={accent ? "#c0392b" : "#1a1410"}
            />
          );
        })}
      </svg>
      <div className="flex justify-between font-mono text-tiny uppercase tracking-label text-ink-muted mt-2">
        <span>{firstY} · 1 unicorn</span>
        <span>
          {lastY} · {last.total} on ledger
        </span>
      </div>
      <div className="mt-3 font-body text-sub text-ink-light italic">
        Peak velocity in 2021 (+
        {points.find((p) => p.year === 2021)?.added ?? 0} unicorns), cooling since.
      </div>
    </div>
  );
}

function StatusBreakdown({ unicorns }: { unicorns: Unicorn[] }) {
  const counts = { private: 0, ipo: 0, acquired: 0, distressed: 0 };
  for (const u of unicorns) counts[u.status] += 1;
  const total = unicorns.length;
  const rows: { key: keyof typeof counts; label: string; color: string }[] = [
    { key: "private", label: "Still Private", color: "bg-ink" },
    { key: "ipo", label: "Went Public", color: "bg-success" },
    { key: "acquired", label: "Acquired", color: "bg-warning" },
    { key: "distressed", label: "Distressed", color: "bg-red" },
  ];

  return (
    <div>
      <div className="font-mono text-btn tracking-label uppercase text-ink-muted border-b border-rule pb-[6px] mb-3">
        Status Breakdown
      </div>
      <div className="flex h-[10px] border border-rule mb-3">
        {rows.map((r) => {
          const pct = (counts[r.key] / total) * 100;
          if (!pct) return null;
          return (
            <div
              key={r.key}
              className={r.color}
              style={{ width: `${pct}%` }}
              title={`${r.label}: ${counts[r.key]}`}
            />
          );
        })}
      </div>
      {rows.map((r) => {
        const n = counts[r.key];
        const pct = Math.round((n / total) * 100);
        return (
          <div
            key={r.key}
            className="grid grid-cols-[14px_1fr_auto_40px] gap-[10px] items-center py-[5px] border-b border-dotted border-rule last:border-b-0"
          >
            <div className={`h-[10px] w-[10px] ${r.color}`} />
            <div className="font-mono text-sub uppercase tracking-tight text-ink">
              {r.label}
            </div>
            <div className="font-mono text-tag text-ink-muted">{pct}%</div>
            <div className="font-mono text-tag text-right text-ink-light">{n}</div>
          </div>
        );
      })}
    </div>
  );
}

function AgeToUnicorn({ unicorns }: { unicorns: Unicorn[] }) {
  const bySector = new Map<string, number[]>();
  for (const u of unicorns) {
    const age = u.unicorn_year - u.founded;
    if (age < 0 || age > 40) continue;
    if (!bySector.has(u.sector)) bySector.set(u.sector, []);
    bySector.get(u.sector)!.push(age);
  }
  const rows = [...bySector.entries()]
    .map(([sector, ages]) => ({
      sector,
      median: median(ages),
      n: ages.length,
    }))
    .filter((r) => r.n >= 3)
    .sort((a, b) => a.median - b.median)
    .slice(0, 10);

  const max = Math.max(...rows.map((r) => r.median));
  const fastest = rows[0];

  return (
    <div>
      <div className="font-mono text-btn tracking-label uppercase text-ink-muted border-b border-rule pb-[6px] mb-3">
        Years to Unicorn (median)
      </div>
      {rows.map((r, i) => {
        const pct = Math.round((r.median / max) * 100);
        const accent = i === 0;
        return (
          <div
            key={r.sector}
            className="grid grid-cols-[100px_1fr_34px] gap-[10px] items-center py-[5px] border-b border-dotted border-rule last:border-b-0"
          >
            <div className="font-mono text-tag uppercase tracking-tight text-ink truncate">
              {r.sector}
            </div>
            <div className="relative h-[10px] border-b border-rule">
              <div
                className={`absolute left-0 top-0 bottom-0 ${
                  accent ? "bg-red" : "bg-ink"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="font-mono text-tag text-right text-ink-muted">
              {r.median}y
            </div>
          </div>
        );
      })}
      {fastest ? (
        <div className="mt-3 font-body text-sub text-ink-light italic">
          Fastest sector: <strong className="text-ink not-italic">{fastest.sector}</strong> — median{" "}
          {fastest.median} years from founding to $1B.
        </div>
      ) : null}
    </div>
  );
}

function median(xs: number[]) {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
}
