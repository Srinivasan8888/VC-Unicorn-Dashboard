"use client";

import { useMemo, useState } from "react";
import type { Unicorn } from "../types";
import { SectionHead } from "./SectionHead";

export function TrendsBlock({ unicorns }: { unicorns: Unicorn[] }) {
  return (
    <section id="trends">
      <SectionHead title="The Trends" eyebrow="Velocity · Outcomes · Age" />
      <div className="grid grid-cols-3 max-lg:grid-cols-1 gap-8 mt-6">
        <CumulativeTimeline unicorns={unicorns} />
        <StatusBreakdown unicorns={unicorns} />
        <AgeToUnicorn unicorns={unicorns} />
      </div>
    </section>
  );
}

/* ───────── Cumulative Timeline ───────── */

function CumulativeTimeline({ unicorns }: { unicorns: Unicorn[] }) {
  const points = useMemo(() => {
    const byYear = new Map<number, number>();
    for (const u of unicorns) byYear.set(u.unicorn_year, (byYear.get(u.unicorn_year) ?? 0) + 1);
    const years = [...byYear.keys()].sort((a, b) => a - b);
    let running = 0;
    return years.map((y) => {
      running += byYear.get(y)!;
      return { year: y, total: running, added: byYear.get(y)! };
    });
  }, [unicorns]);

  const [hover, setHover] = useState<number | null>(null);
  const last = points[points.length - 1];
  const firstY = points[0].year;
  const lastY = last.year;
  const yRange = lastY - firstY || 1;
  const W = 300;
  const H = 140;

  const activeIdx = hover ?? points.findIndex((p) => p.year === lastY);
  const activePoint = points[activeIdx];

  return (
    <ChartCard title="Cumulative Unicorns">
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto block"
          preserveAspectRatio="none"
          onMouseLeave={() => setHover(null)}
        >
          {/* grid */}
          <line x1="0" y1={H} x2={W} y2={H} stroke="#c8bfb0" strokeWidth="1" />
          <line x1="0" y1="0" x2="0" y2={H} stroke="#c8bfb0" strokeWidth="1" />
          {/* path */}
          <polyline
            points={points
              .map((p) => {
                const x = ((p.year - firstY) / yRange) * W;
                const y = H - (p.total / last.total) * (H - 10);
                return `${x},${y}`;
              })
              .join(" ")}
            fill="none"
            stroke="#1a1410"
            strokeWidth="1.5"
          />
          {/* vertical guide */}
          {activePoint ? (
            <line
              x1={((activePoint.year - firstY) / yRange) * W}
              x2={((activePoint.year - firstY) / yRange) * W}
              y1="0"
              y2={H}
              stroke="#c0392b"
              strokeWidth="1"
              strokeDasharray="2 3"
              opacity="0.5"
            />
          ) : null}
          {/* dots + hit areas */}
          {points.map((p, i) => {
            const x = ((p.year - firstY) / yRange) * W;
            const y = H - (p.total / last.total) * (H - 10);
            const isRecent = p.year >= lastY - 1;
            const isActive = i === activeIdx;
            return (
              <g key={p.year}>
                <circle
                  cx={x}
                  cy={y}
                  r={isActive ? 4 : 2.5}
                  fill={isRecent || isActive ? "#c0392b" : "#1a1410"}
                  style={{ transition: "r 0.12s ease-out" }}
                />
                {/* invisible larger hit area for easier hovering */}
                <rect
                  x={x - W / points.length / 2}
                  y={0}
                  width={W / points.length}
                  height={H}
                  fill="transparent"
                  onMouseEnter={() => setHover(i)}
                  style={{ cursor: "crosshair" }}
                />
              </g>
            );
          })}
        </svg>
        {/* tooltip */}
        {activePoint ? (
          <div
            className="absolute top-0 -translate-x-1/2 -translate-y-full pointer-events-none"
            style={{
              left: `${((activePoint.year - firstY) / yRange) * 100}%`,
              marginTop: "-4px",
            }}
          >
            <div className="bg-ink text-paper px-2 py-1 text-tag font-mono uppercase tracking-label whitespace-nowrap">
              {activePoint.year} · {activePoint.total} total
              {activePoint.added > 0 ? ` · +${activePoint.added}` : ""}
            </div>
          </div>
        ) : null}
      </div>
      <div className="flex justify-between font-mono text-tiny uppercase tracking-label text-ink-muted mt-3">
        <span>{firstY} · 1</span>
        <span>
          {lastY} · {last.total}
        </span>
      </div>
      <p className="mt-3 font-body text-sub text-ink-light italic leading-[1.5]">
        Peak velocity in 2021 (+{points.find((p) => p.year === 2021)?.added ?? 0}).
        Hover the line to scrub through years.
      </p>
    </ChartCard>
  );
}

/* ───────── Status Breakdown ───────── */

function StatusBreakdown({ unicorns }: { unicorns: Unicorn[] }) {
  const rows = useMemo(() => {
    const counts = { private: 0, ipo: 0, acquired: 0, distressed: 0 };
    for (const u of unicorns) counts[u.status] += 1;
    const total = unicorns.length;
    const examples = {
      private: unicorns
        .filter((u) => u.status === "private")
        .sort((a, b) => b.valuation_bn - a.valuation_bn)
        .slice(0, 3),
      ipo: unicorns
        .filter((u) => u.status === "ipo")
        .sort((a, b) => b.valuation_bn - a.valuation_bn)
        .slice(0, 3),
      acquired: unicorns
        .filter((u) => u.status === "acquired")
        .sort((a, b) => b.valuation_bn - a.valuation_bn)
        .slice(0, 3),
      distressed: unicorns
        .filter((u) => u.status === "distressed")
        .sort((a, b) => b.valuation_bn - a.valuation_bn)
        .slice(0, 3),
    };
    return [
      { key: "private" as const, label: "Still Private", color: "#1a1410", bg: "bg-ink" },
      { key: "ipo" as const, label: "Went Public", color: "#4a7c59", bg: "bg-success" },
      { key: "acquired" as const, label: "Acquired", color: "#b8860b", bg: "bg-warning" },
      { key: "distressed" as const, label: "Distressed", color: "#c0392b", bg: "bg-red" },
    ].map((r) => ({ ...r, n: counts[r.key], pct: (counts[r.key] / total) * 100, examples: examples[r.key] }));
  }, [unicorns]);

  const [hover, setHover] = useState<string | null>(null);
  const active = rows.find((r) => r.key === hover) ?? rows[0];

  return (
    <ChartCard title="Status Breakdown">
      <div className="flex h-3 border border-rule mb-3" onMouseLeave={() => setHover(null)}>
        {rows.map((r) => {
          if (!r.pct) return null;
          const isActive = r.key === hover;
          return (
            <button
              key={r.key}
              onMouseEnter={() => setHover(r.key)}
              onClick={() => setHover(hover === r.key ? null : r.key)}
              className={`${r.bg} transition-opacity duration-150 ${
                hover && !isActive ? "opacity-40" : "opacity-100"
              }`}
              style={{ width: `${r.pct}%` }}
              title={`${r.label}: ${r.n}`}
              aria-label={`${r.label} ${r.n}`}
            />
          );
        })}
      </div>
      {rows.map((r) => {
        const pct = Math.round((r.n / unicorns.length) * 100);
        const isActive = r.key === hover;
        return (
          <button
            key={r.key}
            onMouseEnter={() => setHover(r.key)}
            onMouseLeave={() => setHover(null)}
            onClick={() => setHover(hover === r.key ? null : r.key)}
            className={`w-full grid grid-cols-[14px_1fr_auto_40px] gap-[10px] items-center py-[6px] border-b border-dotted border-rule last:border-b-0 text-left transition-colors ${
              isActive ? "bg-paper-dark" : ""
            }`}
          >
            <div className={`h-[10px] w-[10px] ${r.bg}`} />
            <div className="font-mono text-sub uppercase tracking-tight text-ink">
              {r.label}
            </div>
            <div className="font-mono text-tag text-ink-muted">{pct}%</div>
            <div className="font-mono text-tag text-right text-ink-light">{r.n}</div>
          </button>
        );
      })}
      <div className="mt-3 font-body text-sub text-ink-light italic leading-[1.5] min-h-[3em]">
        {active.examples.length > 0 ? (
          <>
            <span className="text-ink not-italic font-medium">{active.label}:</span>{" "}
            {active.examples.map((u) => u.name.split(" (")[0]).join(", ")}
            {active.n > active.examples.length ? ` · +${active.n - active.examples.length}` : ""}
          </>
        ) : (
          "Hover a segment or row to see examples."
        )}
      </div>
    </ChartCard>
  );
}

/* ───────── Age to Unicorn ───────── */

function AgeToUnicorn({ unicorns }: { unicorns: Unicorn[] }) {
  const rows = useMemo(() => {
    const bySector = new Map<string, number[]>();
    const exBySector = new Map<string, Unicorn[]>();
    for (const u of unicorns) {
      const age = u.unicorn_year - u.founded;
      if (age < 0 || age > 40) continue;
      if (!bySector.has(u.sector)) bySector.set(u.sector, []);
      bySector.get(u.sector)!.push(age);
      if (!exBySector.has(u.sector)) exBySector.set(u.sector, []);
      exBySector.get(u.sector)!.push(u);
    }
    return [...bySector.entries()]
      .map(([sector, ages]) => ({
        sector,
        median: median(ages),
        n: ages.length,
        examples: (exBySector.get(sector) ?? [])
          .slice()
          .sort((a, b) => a.unicorn_year - a.founded - (b.unicorn_year - b.founded))
          .slice(0, 3),
      }))
      .filter((r) => r.n >= 3)
      .sort((a, b) => a.median - b.median)
      .slice(0, 10);
  }, [unicorns]);

  const [hover, setHover] = useState<string | null>(null);
  const max = Math.max(...rows.map((r) => r.median));
  const active = rows.find((r) => r.sector === hover) ?? rows[0];

  return (
    <ChartCard title="Years to Unicorn (median)">
      <div onMouseLeave={() => setHover(null)}>
        {rows.map((r, i) => {
          const pct = Math.round((r.median / max) * 100);
          const accent = i === 0 || r.sector === hover;
          const isActive = r.sector === hover;
          return (
            <button
              key={r.sector}
              onMouseEnter={() => setHover(r.sector)}
              className={`w-full grid grid-cols-[100px_1fr_34px] gap-[10px] items-center py-[6px] border-b border-dotted border-rule last:border-b-0 text-left transition-colors ${
                isActive ? "bg-paper-dark" : ""
              }`}
            >
              <div className="font-mono text-tag uppercase tracking-tight text-ink truncate">
                {r.sector}
              </div>
              <div className="relative h-[10px] border-b border-rule">
                <div
                  className={`absolute left-0 top-0 bottom-0 transition-all duration-200 ${
                    accent ? "bg-red" : "bg-ink"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="font-mono text-tag text-right text-ink-muted">
                {r.median}y
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-3 font-body text-sub text-ink-light italic leading-[1.5] min-h-[3em]">
        {active ? (
          <>
            <span className="text-ink not-italic font-medium">{active.sector}:</span>{" "}
            median {active.median}y from founding to $1B · {active.n} cos · fastest:{" "}
            {active.examples.map((u) => u.name.split(" (")[0]).join(", ")}
          </>
        ) : (
          "Hover a row to see the fastest examples."
        )}
      </div>
    </ChartCard>
  );
}

/* ───────── Shared ───────── */

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-mono text-btn tracking-label uppercase text-ink-muted border-b border-rule pb-[6px] mb-3">
        {title}
      </div>
      {children}
    </div>
  );
}

function median(xs: number[]) {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
}
