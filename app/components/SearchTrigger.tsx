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
      className="flex items-center gap-[10px] font-mono text-btn uppercase tracking-meta text-ink-muted border border-rule px-3 py-[6px] bg-paper hover:border-ink hover:text-ink transition-colors"
      aria-label="Search unicorns"
    >
      <span>Search</span>
      <kbd className="px-[5px] py-[1px] border border-rule text-tiny font-mono tracking-normal">
        ⌘K
      </kbd>
    </button>
  );
}
