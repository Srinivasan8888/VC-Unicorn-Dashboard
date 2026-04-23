import { SectionHead } from "./SectionHead";

const faqs = [
  {
    q: "What counts as an Indian unicorn?",
    a: "A privately-held startup headquartered in India (or founded by Indian entrepreneurs) that has reached a $1B+ valuation in a disclosed funding round. Once a company crosses that mark it stays on the ledger even if it later lists, gets acquired, or slips below — the 'status' column reflects current state.",
  },
  {
    q: "Why are Reliance Retail, Jio, Tata Passenger EV, and Mahindra Electric excluded?",
    a: "Corporate subsidiaries raising private equity to stay off the parent's balance sheet are a different category from venture-backed startups. Inc42, Tracxn, and the global CB Insights list all exclude them — so do we. The point of a unicorn tracker is to measure the startup ecosystem, not corporate balance-sheet optimisation.",
  },
  {
    q: "How is this different from Inc42's tracker?",
    a: "Inc42 is the primary source — we cross-reference it with Failory and Tracxn, then add editorial layers: a Top 10 headline board, a Latest Class spotlight, a median-age-to-unicorn breakdown, and a Backers leaderboard that consolidates Sequoia India / Peak XV into one entity. We also ship the raw JSON and a one-click CSV export.",
  },
  {
    q: "How often is it updated?",
    a: "The dataset refreshes whenever a new unicorn is declared (typically 2–8 times per year since 2024) or a material status change is confirmed (IPO, acquisition, down-round). The 'Refreshed' dateline in the masthead reflects the last touch.",
  },
  {
    q: "Why merge Peak XV with Sequoia India in the Backers leaderboard?",
    a: "Peak XV Partners is the continuation of Sequoia Capital India / SEA after the 2023 brand split. For an investor-level count, treating them as one fund produces the honest picture of portfolio depth.",
  },
  {
    q: "Spotted an error? Can I contribute?",
    a: "Yes — mail the source and the proposed correction to corrections@indianvcs.com. Source-linked corrections ship within a week. We credit the sender in the next refresh.",
  },
];

export function FAQ() {
  return (
    <section id="faq">
      <SectionHead title="Frequently Asked" eyebrow={`${faqs.length} questions`} />
      <div className="mt-5">
        {faqs.map((f, i) => (
          <details
            key={f.q}
            className="group border-b border-rule"
            open={i === 0}
          >
            <summary className="list-none cursor-pointer flex items-start gap-4 py-5 md:py-6 hover:text-red transition-colors">
              <span className="font-mono text-tag tracking-label uppercase text-ink-muted pt-2 min-w-[32px]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 font-serif text-[1.15rem] md:text-[1.4rem] font-bold leading-[1.25]">
                {f.q}
              </span>
              <span
                aria-hidden
                className="font-mono text-[1.4rem] leading-none pt-1 text-ink-muted group-open:text-red group-open:rotate-45 transition-transform"
              >
                +
              </span>
            </summary>
            <div className="pl-[48px] md:pl-[48px] pr-2 pb-6 font-body text-meta text-ink-light leading-[1.65] max-w-[65ch]">
              {f.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
