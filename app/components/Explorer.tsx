"use client";

import { useMemo, useState } from "react";
import type { Unicorn } from "../types";
import { fmtMoney } from "../lib/fmt";
import { sectorBuckets, cityBuckets, backerBuckets, outcomeBuckets, type Bucket } from "../lib/buckets";
import { SectionHead } from "./SectionHead";

type TabId = "sectors" | "cities" | "backers" | "outcomes";

const TAB_META: Record<
  TabId,
  {
    label: string;
    badge: string;
    icon: React.ReactNode;
    title: React.ReactNode;
    description: string;
    totalLabel: string;
  }
> = {
  sectors: {
    label: "Sectors",
    badge: "Industry",
    icon: <IconLayers />,
    title: (
      <>
        Sectors <span className="italic font-normal">at a Glance</span>
      </>
    ),
    description:
      "The industries where India's unicorns live. Pick one to see its roster, combined book value, and top backers.",
    totalLabel: "Sectors Covered",
  },
  cities: {
    label: "Cities",
    badge: "Geography",
    icon: <IconPin />,
    title: (
      <>
        Cities <span className="italic font-normal">that Matter</span>
      </>
    ),
    description:
      "Every headquarters on the ledger. Bengaluru leads by a wide margin — but the long tail tells its own story.",
    totalLabel: "Cities on the Map",
  },
  backers: {
    label: "Backers",
    badge: "Capital",
    icon: <IconWallet />,
    title: (
      <>
        The <span className="italic font-normal">Backers</span>
      </>
    ),
    description:
      "Funds with the most unicorn hits. Sequoia India and Peak XV are consolidated into one entity.",
    totalLabel: "Top 20 Funds",
  },
  outcomes: {
    label: "Outcomes",
    badge: "Status",
    icon: <IconFlag />,
    title: (
      <>
        How They <span className="italic font-normal">Exit</span>
      </>
    ),
    description:
      "Four possible endings for a unicorn: still private, listed, acquired, or slipped below.",
    totalLabel: "Possible Outcomes",
  },
};

export function Explorer({ unicorns }: { unicorns: Unicorn[] }) {
  const [tab, setTab] = useState<TabId>("sectors");
  const [activeIndex, setActiveIndex] = useState<Record<TabId, number>>({
    sectors: 0,
    cities: 0,
    backers: 0,
    outcomes: 0,
  });

  const buckets = useMemo(
    () => ({
      sectors: sectorBuckets(unicorns),
      cities: cityBuckets(unicorns),
      backers: backerBuckets(unicorns, 20),
      outcomes: outcomeBuckets(unicorns),
    }),
    [unicorns]
  );

  const currentBuckets = buckets[tab];
  const idx = Math.min(activeIndex[tab], currentBuckets.length - 1);
  const current = currentBuckets[idx];
  const meta = TAB_META[tab];
  const totalCount = unicorns.length;
  const aggregateValue = useMemo(
    () => currentBuckets.reduce((s, b) => s + b.combinedValuation, 0),
    [currentBuckets]
  );

  const setIdx = (i: number) =>
    setActiveIndex((p) => ({ ...p, [tab]: Math.max(0, Math.min(i, currentBuckets.length - 1)) }));
  const next = () => setIdx(Math.min(idx + 1, currentBuckets.length - 1));
  const prev = () => setIdx(Math.max(idx - 1, 0));

  return (
    <section id="landscape">
      <SectionHead title="The Landscape" eyebrow="Explore · 4 dimensions" />
      <div className="mt-5 border border-ink bg-paper">
        {/* Tab bar */}
        <div role="tablist" className="grid grid-cols-4 border-b border-ink">
          {(Object.keys(TAB_META) as TabId[]).map((id, i) => {
            const m = TAB_META[id];
            const isActive = id === tab;
            return (
              <button
                key={id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setTab(id)}
                className={`py-4 md:py-5 px-2 md:px-4 font-mono text-[10px] md:text-btn font-medium uppercase tracking-label flex items-center justify-center gap-2 transition-colors duration-150 ${
                  i < 3 ? "border-r border-rule" : ""
                } ${
                  isActive
                    ? "bg-ink text-paper"
                    : "bg-paper text-ink-muted hover:bg-paper-dark hover:text-ink"
                }`}
              >
                <span className={`${isActive ? "text-paper" : "text-ink-muted"}`} aria-hidden>
                  {m.icon}
                </span>
                <span className="hidden sm:inline">{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* LEFT: overview */}
          <div className="lg:col-span-4 p-6 md:p-7 bg-paper-dark/60 lg:border-r border-b lg:border-b-0 border-rule flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-red/10 border border-red/20 flex items-center justify-center text-red">
                {meta.icon}
              </div>
              <span className="font-mono text-[10px] uppercase tracking-label text-ink-muted border border-rule px-2 py-1 bg-paper">
                {meta.badge}
              </span>
            </div>
            <h3 className="font-serif text-[1.35rem] md:text-[1.6rem] lg:text-[1.8rem] font-bold mb-3 leading-[1.1] text-ink">
              {meta.title}
            </h3>
            <p className="font-body text-[0.92rem] md:text-meta text-ink-light leading-[1.55] mb-5">
              {meta.description}
            </p>
            <div className="mb-5 pb-4 border-b border-rule">
              <p className="font-mono text-[10px] font-medium text-red uppercase tracking-label mb-[2px]">
                {meta.totalLabel}
              </p>
              <p className="font-serif text-[1.8rem] md:text-[2.1rem] font-black text-ink leading-none">
                {currentBuckets.length}
              </p>
              <p className="font-mono text-tiny uppercase tracking-label text-ink-muted mt-1">
                Aggregating {totalCount} unicorns · {fmtMoney(aggregateValue)}
              </p>
            </div>
            <div className="flex flex-wrap gap-[6px]">
              {currentBuckets.map((b, i) => (
                <button
                  key={b.key}
                  onClick={() => setIdx(i)}
                  title={`${b.label} · ${b.count}`}
                  className={`font-mono text-[10px] uppercase tracking-label px-2 py-[6px] border transition-colors duration-150 ${
                    i === idx
                      ? "bg-red/10 text-red border-red"
                      : "bg-paper text-ink-muted border-rule hover:border-ink hover:text-ink"
                  }`}
                >
                  <span className="max-w-[140px] truncate inline-block align-bottom">
                    {shortLabel(b.label)}
                  </span>
                  <span className={`ml-[6px] font-medium ${i === idx ? "text-red" : "text-ink"}`}>
                    {b.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: detail */}
          <div className="lg:col-span-8 p-6 md:p-7 bg-paper min-h-[440px] md:min-h-[500px] flex flex-col">
            <div className="flex-1">
              <div className="flex items-start gap-3 md:gap-4 mb-5 pb-5 border-b border-rule">
                <span className="font-serif text-[2rem] md:text-[2.4rem] font-black text-red tabular-nums leading-none">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <h3 className="font-serif text-[1.4rem] md:text-[1.75rem] font-bold text-ink leading-tight">
                      {current.label}
                    </h3>
                    <span className="px-[10px] py-[2px] bg-red text-paper font-mono text-[10px] md:text-tag font-medium uppercase tracking-label">
                      {current.count} unicorn{current.count === 1 ? "" : "s"}
                    </span>
                  </div>
                  <p className="font-mono text-tag uppercase tracking-label text-ink-muted">
                    Combined valuation{" "}
                    <span className="text-ink font-medium">
                      {fmtMoney(current.combinedValuation)}
                    </span>
                    {" · "}Capital raised{" "}
                    <span className="text-ink font-medium">
                      {fmtMoney(current.combinedFunding)}
                    </span>
                  </p>
                </div>
              </div>

              {/* Top companies list */}
              <div className="mb-6">
                <h4 className="font-mono text-[10px] font-medium text-ink uppercase tracking-label mb-3 flex items-center gap-2">
                  <span className="w-4 h-[2px] bg-red" aria-hidden />
                  Top Companies
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {current.topCompanies.map((u, i) => (
                    <li
                      key={u.name}
                      className="flex items-start gap-3 text-ink-light"
                    >
                      <span className="w-5 h-5 rounded-full bg-red/10 flex items-center justify-center flex-shrink-0 mt-[2px]">
                        <svg
                          className="w-[11px] h-[11px] text-red"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </span>
                      <div className="leading-[1.35]">
                        <div className="font-serif font-bold text-ink">
                          {u.name}
                        </div>
                        <div className="font-mono text-tag uppercase tracking-label text-ink-muted">
                          {fmtMoney(u.valuation_bn)}
                          {tab === "sectors" || tab === "outcomes"
                            ? ` · ${u.city}`
                            : ""}
                          {tab === "cities"
                            ? ` · ${u.sector}`
                            : ""}
                          {tab === "backers"
                            ? ` · ${u.sector} · ${u.city}`
                            : ""}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Secondary row: investors for sector/city/outcome, or age-to-unicorn */}
              {tab !== "backers" && current.topInvestors.length > 0 ? (
                <div>
                  <h4 className="font-mono text-[10px] font-medium text-ink uppercase tracking-label mb-3 flex items-center gap-2">
                    <span className="w-4 h-[2px] bg-red" aria-hidden />
                    Top Backers
                  </h4>
                  <div className="flex flex-wrap gap-[6px]">
                    {current.topInvestors.slice(0, 8).map((inv) => (
                      <span
                        key={inv}
                        className="font-mono text-tag uppercase tracking-label px-[8px] py-[3px] border border-rule text-ink-light bg-paper"
                      >
                        {inv}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Carousel nav */}
            <div className="flex items-center justify-between mt-5 pt-5 border-t border-rule">
              <div className="flex items-center gap-2">
                <ArrowBtn dir="prev" onClick={prev} disabled={idx === 0} />
                <ArrowBtn
                  dir="next"
                  onClick={next}
                  disabled={idx >= currentBuckets.length - 1}
                />
              </div>
              <div className="flex items-center gap-[6px] max-md:hidden">
                {currentBuckets.slice(0, 20).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIdx(i)}
                    aria-label={`Go to ${i + 1}`}
                    className={`w-[8px] h-[8px] transition-all duration-200 ${
                      i === idx
                        ? "bg-red scale-110"
                        : "bg-ink/15 hover:bg-ink/40"
                    }`}
                  />
                ))}
              </div>
              <span className="font-mono text-sub text-ink-muted tabular-nums">
                {String(idx + 1).padStart(2, "0")} /{" "}
                {String(currentBuckets.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function shortLabel(s: string) {
  return s.length > 18 ? s.slice(0, 16) + "…" : s;
}

function ArrowBtn({
  dir,
  onClick,
  disabled,
}: {
  dir: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous" : "Next"}
      className="w-9 h-9 md:w-10 md:h-10 border border-rule bg-paper flex items-center justify-center text-ink-muted hover:bg-ink hover:text-paper hover:border-ink transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-paper disabled:hover:text-ink-muted disabled:hover:border-rule"
    >
      <svg
        className="w-4 h-4 md:w-[18px] md:h-[18px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {dir === "prev" ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
      </svg>
    </button>
  );
}

// --- icons ---

function IconLayers() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
      <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
      <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
    </svg>
  );
}
function IconPin() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function IconWallet() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  );
}
function IconFlag() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );
}
