import { SearchTrigger } from "./SearchTrigger";

export function Masthead({ asOf, lastUpdated }: { asOf: string; lastUpdated: string }) {
  return (
    <>
      <nav className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-3 pb-[6px] border-b border-rule">
        <a
          href="/"
          className="font-serif font-black text-[1.4rem] sm:text-[2rem] md:text-brand uppercase tracking-[0.14em] md:tracking-[0.18em] leading-none text-ink no-underline mr-auto hover:text-red"
          style={{ textShadow: "0.5px 0.5px 0 currentColor" }}
        >
          Indian Unicorns
        </a>
        <NavLink href="#headlines">Headlines</NavLink>
        <NavLink href="#class">Latest Class</NavLink>
        <NavLink href="#landscape">Landscape</NavLink>
        <NavLink href="#trends">Trends</NavLink>
        <NavLink href="#investors">Backers</NavLink>
        <NavLink href="#ledger">Ledger</NavLink>
        <SearchTrigger />
      </nav>

      <section className="pt-8 md:pt-10 pb-6 md:pb-8 text-center border-b border-rule">
        <h1 className="font-serif font-black text-[2.1rem] sm:text-[3rem] md:text-masthead leading-[1.02] tracking-[-0.01em] px-2">
          Unicorns of India.
        </h1>
        <p className="font-serif italic text-[1.05rem] md:text-hero text-ink-light mt-2 md:mt-3 px-2">
          Private. A billion dollars or more. Counted.
        </p>
        <div className="mt-6 md:mt-8 font-mono text-btn uppercase tracking-meta text-ink-muted px-2 leading-[1.8]">
          <span className="text-red">How to read:</span>{" "}
          Pick a sector <span className="text-red-dark">→</span> Sort by valuation{" "}
          <span className="text-red-dark">→</span> Compare cohorts{" "}
          <span className="text-red-dark">→</span> Done.
        </div>
        <div className="mt-4 md:mt-6 font-mono text-tag tracking-label uppercase text-ink-muted">
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
