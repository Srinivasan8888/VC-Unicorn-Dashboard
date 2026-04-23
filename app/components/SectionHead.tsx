export function SectionHead({
  title,
  eyebrow,
}: {
  title: string;
  eyebrow?: string;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t-2 border-t-ink border-b border-b-rule pt-3 pb-2 mt-14 md:mt-16">
      <h2 className="font-serif text-[1.05rem] md:text-section uppercase tracking-mast font-bold">{title}</h2>
      {eyebrow ? (
        <div className="font-mono text-tag tracking-label uppercase text-ink-muted">
          {eyebrow}
        </div>
      ) : null}
    </div>
  );
}
