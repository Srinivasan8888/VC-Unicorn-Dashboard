import type { Unicorn } from "../types";
import { SectionHead } from "./SectionHead";
import { fmtMoney } from "../lib/fmt";

export function SerialFounders({ unicorns }: { unicorns: Unicorn[] }) {
  const founderMap = new Map<string, Unicorn[]>();
  for (const u of unicorns) {
    for (const f of u.founders) {
      const name = f?.trim();
      if (!name) continue;
      if (!founderMap.has(name)) founderMap.set(name, []);
      founderMap.get(name)!.push(u);
    }
  }

  const serial = [...founderMap.entries()]
    .filter(([, list]) => list.length >= 2)
    .map(([name, list]) => ({
      name,
      unicorns: [...list].sort((a, b) => b.valuation_bn - a.valuation_bn),
      totalValue: list.reduce((s, u) => s + u.valuation_bn, 0),
    }))
    .sort(
      (a, b) =>
        b.unicorns.length - a.unicorns.length || b.totalValue - a.totalValue
    );

  if (serial.length === 0) return null;

  return (
    <section id="builders">
      <SectionHead
        title="The Builders"
        eyebrow={`Serial founders · ${serial.length} operators · ${serial.reduce((s, r) => s + r.unicorns.length, 0)} unicorns`}
      />
      <p className="font-body italic text-meta text-ink-light leading-[1.55] mt-4 mb-5 max-w-[70ch]">
        Founders who have built more than one unicorn. A rare club: about{" "}
        {Math.round((serial.length / 121) * 100)}% of the builders on this
        ledger have done it twice or more.
      </p>
      <div className="grid grid-cols-2 max-md:grid-cols-1 gap-0 border-l border-t border-rule">
        {serial.map((f, i) => (
          <FounderCard key={f.name} f={f} rank={i + 1} />
        ))}
      </div>
    </section>
  );
}

function FounderCard({
  f,
  rank,
}: {
  f: { name: string; unicorns: Unicorn[]; totalValue: number };
  rank: number;
}) {
  return (
    <article className="border-r border-b border-rule p-5 md:p-6 bg-paper">
      <div className="flex items-baseline justify-between mb-3 pb-3 border-b border-rule">
        <div className="flex items-baseline gap-3 min-w-0">
          <span className="font-mono text-tag text-ink-muted tabular-nums">
            {String(rank).padStart(2, "0")}
          </span>
          <h3 className="font-serif font-bold text-[1.15rem] md:text-[1.25rem] leading-tight truncate">
            {f.name}
          </h3>
        </div>
        <span className="font-mono text-tiny uppercase tracking-label text-red border border-red/40 bg-red/5 px-[6px] py-[2px] whitespace-nowrap">
          {f.unicorns.length}×
        </span>
      </div>
      <ul className="divide-y divide-rule">
        {f.unicorns.map((u) => (
          <li
            key={u.name}
            className="grid grid-cols-[1fr_auto] gap-2 py-[8px] items-baseline"
          >
            <div className="min-w-0">
              <div className="font-serif font-bold text-[0.95rem] leading-tight truncate">
                {u.name}
              </div>
              <div className="font-mono text-tiny uppercase tracking-label text-ink-muted mt-[1px]">
                {u.sector} · Unicorn {u.unicorn_year}
              </div>
            </div>
            <div className="font-mono text-tag text-ink whitespace-nowrap">
              {fmtMoney(u.valuation_bn)}
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-3 pt-3 border-t border-rule font-mono text-tiny uppercase tracking-label text-ink-muted flex items-baseline justify-between">
        <span>Combined book value</span>
        <span className="text-ink font-medium">{fmtMoney(f.totalValue)}</span>
      </div>
    </article>
  );
}
