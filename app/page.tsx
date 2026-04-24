import data from "@/data/unicorns.json";
import type { UnicornDataset } from "./types";
import { Masthead } from "./components/Masthead";
import { FrontPage } from "./components/FrontPage";
import { Explorer } from "./components/Explorer";
import { TrendsBlock } from "./components/TrendsBlock";
import { SerialFounders } from "./components/SerialFounders";
import { Ledger } from "./components/Ledger";
import { FAQ } from "./components/FAQ";
import { ReachOut } from "./components/ReachOut";

export default function Page() {
  const ds = data as UnicornDataset;
  return (
    <main className="max-w-page mx-auto px-4 md:px-6 overflow-x-hidden">
      <Masthead />
      <FrontPage unicorns={ds.unicorns} meta={ds.meta} />
      <Explorer unicorns={ds.unicorns} />
      <TrendsBlock unicorns={ds.unicorns} />
      <SerialFounders unicorns={ds.unicorns} />
      <Ledger unicorns={ds.unicorns} />
      <FAQ />
      <ReachOut />
      <About meta={ds.meta} />
      <Footer />
    </main>
  );
}

function About({ meta }: { meta: UnicornDataset["meta"] }) {
  return (
    <section id="about" className="mt-14 md:mt-16 pt-6 border-t-2 border-t-ink">
      <div className="grid grid-cols-[180px_1fr] max-md:grid-cols-1 gap-6">
        <div className="font-mono text-tag tracking-label uppercase text-ink-muted">
          About
        </div>
        <div className="font-body text-meta text-ink-light max-w-[60ch] leading-[1.65]">
          <p>
            <em>Unicorns</em> is a broadsheet index of India&apos;s $1B+
            private companies — built by the team behind{" "}
            <a href="https://hottakes.vc/" className="text-ink hover:text-red">
              Hot Takes on Indian VCs
            </a>{" "}
            and{" "}
            <a href="https://hub.indianvcs.com/" className="text-ink hover:text-red">
              Indian VC Hub
            </a>
            . Data cross-referenced from Inc42, Failory, and Tracxn; refreshed{" "}
            {meta.last_updated}.
          </p>
          <p className="mt-3">
            Corporate subsidiaries (Reliance Retail/Jio, Tata Passenger EV,
            Mahindra Electric) are omitted: they&apos;re not venture-backed
            startups. Valuations reflect the most recent disclosed round;
            &ldquo;distressed&rdquo; marks companies that have publicly slipped
            below their unicorn valuation. &ldquo;Peak XV&rdquo; covers funds
            formerly branded Sequoia India / SEA.
          </p>
          <p className="mt-3 font-mono text-tag uppercase tracking-label text-ink-muted">
            Methodology ·{" "}
            <a href="#headlines" className="hover:text-red">Headlines</a> ·{" "}
            <a href="#landscape" className="hover:text-red">Landscape</a> ·{" "}
            <a href="#trends" className="hover:text-red">Trends</a> ·{" "}
            <a href="#ledger" className="hover:text-red">Ledger</a> ·{" "}
            <a href="#faq" className="hover:text-red">FAQ</a> ·{" "}
            <a href="#contact" className="hover:text-red">Reach Out</a>
          </p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-10 pt-6 pb-8 border-t border-rule flex flex-wrap items-center justify-between gap-4 font-mono text-btn uppercase tracking-meta text-ink-muted">
      <div className="flex gap-5">
        <a href="#about" className="no-underline hover:text-red">Content Policy</a>
        <a href="#faq" className="no-underline hover:text-red">FAQ</a>
        <a href="#about" className="no-underline hover:text-red">Legal</a>
        <a href="#contact" className="no-underline hover:text-red">Contact</a>
      </div>
      <div>
        © {new Date().getFullYear()} ·{" "}
        <a
          href="https://indianvcs.com/"
          className="no-underline text-ink-muted hover:text-red"
        >
          IndianVCs
        </a>{" "}
        · Bangalore
      </div>
    </footer>
  );
}
