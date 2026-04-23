import { SearchTrigger } from "./SearchTrigger";

export function Masthead({ asOf, lastUpdated }: { asOf: string; lastUpdated: string }) {
  return (
    <>
      <nav className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-3 pb-[6px] border-b border-rule">
        <a
          href="/"
          className="font-serif font-black text-[1.1rem] sm:text-[1.35rem] md:text-[1.65rem] uppercase tracking-[0.14em] md:tracking-[0.16em] leading-none text-ink no-underline mr-auto hover:text-red transition-colors duration-150"
        >
          Indian Unicorns
        </a>
        <NavLink href="#headlines">Headlines</NavLink>
        <NavLink href="#class">Latest Class</NavLink>
        <NavLink href="#landscape">Landscape</NavLink>
        <NavLink href="#trends">Trends</NavLink>
        <NavLink href="#ledger">Ledger</NavLink>
        <NavLink href="#faq">FAQ</NavLink>
        <SearchTrigger />
      </nav>

      <section className="pt-8 md:pt-10 pb-8 md:pb-10 text-center">
        <h1
          className="font-serif font-black leading-[1.15] tracking-[-0.01em] px-2"
          style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)" }}
        >
          Unicorns of India.
        </h1>
        <p className="font-serif italic text-[0.95rem] md:text-[1rem] text-ink-light mt-2 px-2">
          Private. A billion dollars or more. Counted.
        </p>
        <div className="mt-5 md:mt-6 font-mono text-btn uppercase tracking-meta text-ink-muted px-2 leading-[1.7]">
          <span className="text-red">How to read:</span>{" "}
          Pick a sector <span className="text-red-dark">→</span> Sort by valuation{" "}
          <span className="text-red-dark">→</span> Compare cohorts{" "}
          <span className="text-red-dark">→</span> Done.
        </div>
        <div className="mt-4 md:mt-5 font-mono text-tag tracking-label uppercase text-ink-muted">
          Updated {asOf} · Refreshed {lastUpdated}
        </div>
      </section>
    </>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="font-mono text-btn uppercase tracking-meta text-ink-muted no-underline hover:text-red"
    >
      {children}
    </a>
  );
}
