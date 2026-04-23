export function ReachOut() {
  return (
    <section
      id="contact"
      className="bg-ink text-paper mt-14 md:mt-16 py-10 md:py-14 px-6 md:px-10 border-t-2 border-t-red"
    >
      <div className="font-mono text-tag uppercase tracking-label text-paper/60 mb-4">
        Reach Out
      </div>
      <div className="grid grid-cols-[1fr_auto] max-md:grid-cols-1 gap-6 md:gap-10 items-end">
        <h2 className="font-serif text-[1.8rem] sm:text-[2.4rem] md:text-[3rem] leading-[1.05] font-black max-w-[22ch]">
          Spotted a bad datum?
          <br />
          <span className="text-red italic font-normal">Tell us.</span>
        </h2>
        <a
          href="mailto:corrections@indianvcs.com?subject=Unicorn%20Ledger%20correction"
          className="inline-block font-mono text-btn uppercase tracking-meta border border-paper text-paper px-5 py-[10px] no-underline hover:bg-paper hover:text-ink transition-colors self-start md:self-end whitespace-nowrap"
        >
          corrections@indianvcs.com →
        </a>
      </div>
      <p className="font-serif italic text-[1.05rem] md:text-hero mt-6 text-paper/70 max-w-[55ch]">
        Source-linked corrections ship within a week. We credit the sender in
        the next refresh.
      </p>
      <div className="mt-8 pt-6 border-t border-paper/15 grid grid-cols-3 max-md:grid-cols-1 gap-6 font-mono text-tag tracking-label uppercase text-paper/60">
        <div>
          <div className="text-paper mb-1">Missing data</div>
          Mail a source link + the field you&apos;d change.
        </div>
        <div>
          <div className="text-paper mb-1">Status change</div>
          IPO, acquisition, shutdown — we&apos;ll flip the tag.
        </div>
        <div>
          <div className="text-paper mb-1">Bulk contribution</div>
          Sending a sheet? CSV works. JSON works. Notion link works.
        </div>
      </div>
    </section>
  );
}
