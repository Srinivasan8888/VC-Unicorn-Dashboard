import { SearchTrigger } from "./SearchTrigger";

export function Masthead() {
  return (
    <nav className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-5 md:pt-6 pb-5 md:pb-6">
      <a
        href="/"
        className="font-serif font-black text-[1rem] sm:text-[1.15rem] md:text-[1.3rem] uppercase tracking-[0.18em] leading-none text-ink no-underline hover:text-red transition-colors duration-150"
        style={{ textShadow: "0.5px 0.5px 0 currentColor" }}
      >
        Unicorns
      </a>
      <SearchTrigger />
    </nav>
  );
}
