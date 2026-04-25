"use client";

import { useEffect } from "react";

export function SearchTrigger() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        focusSearch();
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
      className="nav-search"
      onClick={focusSearch}
      aria-label="Search unicorns, sectors, backers"
    >
      <svg
        className="nav-search-icon"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <span className="nav-search-text">Search unicorns · Sectors · Backers</span>
      <kbd className="nav-search-kbd"> ⌘K </kbd>
      <span className="nav-search-mobile-label">Search unicorns</span>
    </button>
  );
}
