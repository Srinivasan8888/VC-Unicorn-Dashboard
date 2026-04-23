import { SearchTrigger } from "./SearchTrigger";

export function Masthead({ asOf, lastUpdated }: { asOf: string; lastUpdated: string }) {
  return (
    <>
      <nav className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-5 md:pt-6 pb-4 md:pb-5 border-b border-rule">
        <a
          href="/"
          className="font-serif font-black text-[1rem] sm:text-[1.15rem] md:text-[1.3rem] uppercase tracking-[0.18em] leading-none text-ink no-underline hover:text-red transition-colors duration-150"
          style={{ textShadow: "0.5px 0.5px 0 currentColor" }}
        >
          Unicorns
        </a>
        <SearchTrigger />
      </nav>

      <section className="py-5 md:py-6 text-center">
        <h1
          className="font-serif font-black leading-[1.15] tracking-[-0.01em] px-2"
          style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)" }}
        >
          Unicorns of India.
        </h1>
        <p className="font-serif italic text-[0.95rem] md:text-[1rem] text-ink-light mt-1 px-2">
          Private. A billion dollars or more. Counted.
        </p>
        <div className="mt-3 md:mt-4 font-mono text-tag tracking-label uppercase text-ink-muted px-2">
          Updated {asOf} · Refreshed {lastUpdated}
        </div>
      </section>
    </>
  );
}

