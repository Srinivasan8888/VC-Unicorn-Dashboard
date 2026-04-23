"use client";

import { useEffect, useRef, useState } from "react";
import type { Unicorn } from "../types";
import { fmtMoney } from "../lib/fmt";

const DURATION_MS = 6000;

export function CardStack({ unicorns }: { unicorns: Unicorn[] }) {
  const top = [...unicorns]
    .sort((a, b) => b.valuation_bn - a.valuation_bn)
    .slice(0, 10);

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  useEffect(() => {
    if (paused) return;
    startRef.current = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - startRef.current) / DURATION_MS, 1);
      setProgress(p);
      if (p >= 1) {
        setActive((a) => (a + 1) % top.length);
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active, paused, top.length]);

  const next = () => setActive((a) => (a + 1) % top.length);
  const prev = () => setActive((a) => (a - 1 + top.length) % top.length);

  return (
    <section id="headlines" className="border-t-2 border-t-ink pt-10 md:pt-14 pb-14 md:pb-20">
      <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* LEFT COLUMN */}
        <div className="text-center md:text-left md:pr-4 order-1 w-full">
          <span className="inline-block py-1 px-3 md:px-4 border border-red/30 bg-red/5 text-red text-[10px] md:text-[11px] font-mono uppercase tracking-[0.18em] mb-4 md:mb-6 font-medium">
            The Headlines
          </span>
          <h2 className="font-serif font-black text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[3.2rem] text-ink mb-4 md:mb-6 leading-[1.03]">
            Top 10
            <br className="hidden md:block" />{" "}
            <span className="italic font-normal">by Valuation</span>
          </h2>
          <p className="font-body text-[1rem] md:text-[1.1rem] text-ink-light leading-[1.6] mb-6 md:mb-8 max-w-md mx-auto md:mx-0">
            The ten largest private companies on India&apos;s unicorn ledger.
            Sector, city, backers, and capital raised — one at a time. Hover a
            card to pause; click to jump.
          </p>
          <div className="hidden md:flex items-center gap-4">
            <div className="flex gap-[6px]">
              {top.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Go to entry ${i + 1}`}
                  className={`w-[10px] h-[10px] transition-all duration-300 rounded-none ${
                    i === active
                      ? "bg-red scale-110"
                      : "bg-ink/15 hover:bg-ink/40"
                  }`}
                />
              ))}
            </div>
            <span className="font-mono text-sub text-ink-muted tabular-nums tracking-wider">
              {String(active + 1).padStart(2, "0")} /{" "}
              {String(top.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* RIGHT: card stack */}
        <div
          className="relative h-[380px] sm:h-[420px] md:h-[500px] w-full order-2"
          style={{ perspective: "1000px" }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="absolute inset-0 flex items-center justify-center px-2 sm:px-4">
            {top.map((u, i) => {
              let offset = (i - active + top.length) % top.length;
              if (offset > top.length / 2) offset -= top.length;
              const abs = Math.abs(offset);
              if (abs > 3) return null;

              const isActive = abs === 0;
              const blur = abs === 0 ? 0 : abs === 1 ? 1 : abs === 2 ? 2 : 3;
              const opacity = abs === 0 ? 1 : abs === 1 ? 0.6 : abs === 2 ? 0.32 : 0;
              const scale = abs === 0 ? 1 : abs === 1 ? 0.92 : abs === 2 ? 0.84 : 0.8;
              const rotateX = abs === 0 ? 0 : (offset > 0 ? -1 : 1) * (abs === 1 ? 5 : abs === 2 ? 8 : 10);
              const translateY = abs === 0 ? 0 : (offset > 0 ? 1 : -1) * (abs === 1 ? 70 : abs === 2 ? 130 : 200);
              const z = 30 - abs * 10;

              return (
                <div
                  key={u.name}
                  onClick={() => setActive(i)}
                  className="absolute w-full max-w-[320px] sm:max-w-[380px] md:max-w-[440px] cursor-pointer"
                  style={{
                    filter: `blur(${blur}px)`,
                    transformStyle: "preserve-3d",
                    opacity,
                    zIndex: z,
                    transform: isActive
                      ? "translateY(0) scale(1) rotateX(0)"
                      : `translateY(${translateY}px) scale(${scale}) rotateX(${rotateX}deg)`,
                    transition: "all 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
                  }}
                >
                  <div
                    className={`p-5 sm:p-6 md:p-7 relative overflow-hidden bg-paper border ${
                      isActive
                        ? "border-red ring-1 ring-red/25 shadow-soft"
                        : "border-rule"
                    }`}
                  >
                    <div className="flex items-start gap-4 md:gap-5 mb-4">
                      <span
                        className={`font-serif text-[1.6rem] md:text-[2.2rem] flex-shrink-0 font-black leading-none tabular-nums ${
                          isActive ? "text-red" : "text-ink/25"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`font-serif font-bold text-[1.15rem] md:text-[1.4rem] leading-[1.2] ${
                            isActive ? "text-ink" : "text-ink/60"
                          }`}
                        >
                          {u.name}
                        </div>
                        <div className="font-mono text-[10px] md:text-tag uppercase tracking-label text-ink-muted mt-1">
                          {u.sector} · {u.city} · Est. {u.founded} · Unicorn{" "}
                          {u.unicorn_year}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-rule">
                      <div>
                        <div className="font-mono text-[10px] md:text-tiny uppercase tracking-label text-ink-muted">
                          Valuation
                        </div>
                        <div className="font-serif font-black text-[1.4rem] md:text-[1.7rem] text-ink leading-none mt-1">
                          {fmtMoney(u.valuation_bn)}
                        </div>
                      </div>
                      <div>
                        <div className="font-mono text-[10px] md:text-tiny uppercase tracking-label text-ink-muted">
                          Capital Raised
                        </div>
                        <div className="font-serif font-black text-[1.4rem] md:text-[1.7rem] text-ink leading-none mt-1">
                          {fmtMoney(u.funding_bn)}
                        </div>
                      </div>
                    </div>
                    {u.investors.length > 0 ? (
                      <div className="mt-3 pt-3 border-t border-rule">
                        <div className="font-mono text-[10px] md:text-tiny uppercase tracking-label text-ink-muted mb-1">
                          Backers
                        </div>
                        <div className="font-body text-sub text-ink-light leading-[1.4]">
                          {u.investors.slice(0, 3).join(" · ")}
                          {u.investors.length > 3
                            ? ` · +${u.investors.length - 3}`
                            : ""}
                        </div>
                      </div>
                    ) : null}
                    {isActive ? (
                      <div
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-red"
                        style={{
                          transform: `scaleX(${progress})`,
                          transformOrigin: "left center",
                          transition: paused ? "none" : "transform 0.05s linear",
                        }}
                      />
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Prev/next (desktop) */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 hidden md:flex gap-2">
            <NavBtn dir="prev" onClick={prev} />
            <NavBtn dir="next" onClick={next} />
          </div>
        </div>

        {/* Mobile nav */}
        <div className="flex md:hidden items-center justify-center gap-3 mt-2 order-3 w-full">
          <NavBtn dir="prev" onClick={prev} small />
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {top.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Go to entry ${i + 1}`}
                  className={`w-[8px] h-[8px] transition-all duration-300 ${
                    i === active ? "bg-red scale-110" : "bg-ink/15"
                  }`}
                />
              ))}
            </div>
            <span className="font-mono text-[11px] text-ink-muted tabular-nums ml-1">
              {String(active + 1).padStart(2, "0")}/
              {String(top.length).padStart(2, "0")}
            </span>
          </div>
          <NavBtn dir="next" onClick={next} small />
        </div>
      </div>
    </section>
  );
}

function NavBtn({
  dir,
  onClick,
  small,
}: {
  dir: "prev" | "next";
  onClick: () => void;
  small?: boolean;
}) {
  const size = small ? "w-8 h-8" : "w-10 h-10";
  const icon = small ? "w-4 h-4" : "w-5 h-5";
  return (
    <button
      onClick={onClick}
      aria-label={dir === "prev" ? "Previous" : "Next"}
      className={`${size} bg-paper border border-rule flex items-center justify-center text-ink-muted hover:bg-ink hover:text-paper hover:border-ink transition-all duration-200`}
    >
      <svg
        className={icon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {dir === "prev" ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
      </svg>
    </button>
  );
}
