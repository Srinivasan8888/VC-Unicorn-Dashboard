"use client";

import { useEffect } from "react";

export function SearchTrigger() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const el = document.getElementById("ledger-search") as HTMLInputElement | null;
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const focusSearch = () => {
    const el = document.getElementById("ledger-search") as HTMLInputElement | null;
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.focus();
    }
  };

  return (
    <button
      onClick={focusSearch}
      className="flex items-center gap-[10px] border border-rule bg-paper hover:border-ink transition-colors px-3 py-[9px] w-full md:w-auto md:min-w-[360px] lg:min-w-[440px] ml-auto"
      aria-label="Search unicorns"
    >
      <svg
        className="w-[14px] h-[14px] text-ink-muted flex-shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <span className="font-body text-[0.9rem] text-ink-muted flex-1 text-left truncate">
        Search unicorns · Sectors · Backers · Jump to Ledger
      </span>
      <kbd className="px-[6px] py-[2px] border border-rule text-tiny font-mono tracking-normal text-ink-muted flex-shrink-0">
        ⌘K
      </kbd>
    </button>
  );
}
