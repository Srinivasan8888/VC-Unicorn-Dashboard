"use client";

import { useMemo, useState } from "react";
import type { Unicorn, UnicornStatus } from "../types";

type SortKey = "name" | "valuation_bn" | "founded" | "unicorn_year" | "sector" | "city" | "funding_bn";
type SortDir = "asc" | "desc";

const STATUS_LABEL: Record<UnicornStatus, string> = {
  private: "Private",
  ipo: "IPO",
  acquired: "Acquired",
  distressed: "Distressed",
};

const STATUS_CLASS: Record<UnicornStatus, string> = {
  private: "text-ink border-ink",
  ipo: "text-success border-success",
  acquired: "text-warning border-warning",
  distressed: "text-red border-red",
};

function fmtMoney(n: number) {
  if (n === 0) return "—";
  if (n >= 10) return `$${n.toFixed(0)}B`;
  if (n >= 1) return `$${n.toFixed(1)}B`;
  return `$${Math.round(n * 1000)}M`;
}

export function Ledger({ unicorns }: { unicorns: Unicorn[] }) {
  const [q, setQ] = useState("");
  const [sector, setSector] = useState("");
  const [city, setCity] = useState("");
  const [status, setStatus] = useState("");
  const [year, setYear] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("valuation_bn");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sectors = useMemo(
    () => Array.from(new Set(unicorns.map((u) => u.sector))).sort(),
    [unicorns]
  );
  const cities = useMemo(
    () => Array.from(new Set(unicorns.map((u) => u.city))).sort(),
    [unicorns]
  );
  const years = useMemo(
    () =>
      Array.from(new Set(unicorns.map((u) => u.unicorn_year))).sort(
        (a, b) => b - a
      ),
    [unicorns]
  );

  const rows = useMemo(() => {
    const qn = q.trim().toLowerCase();
    const filtered = unicorns.filter((u) => {
      if (sector && u.sector !== sector) return false;
      if (city && u.city !== city) return false;
      if (status && u.status !== status) return false;
      if (year && String(u.unicorn_year) !== year) return false;
      if (!qn) return true;
      const hay = [
        u.name,
        u.sector,
        u.city,
        ...u.founders,
        ...u.investors,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(qn);
    });
    const sorted = [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return sorted;
  }, [unicorns, q, sector, city, status, year, sortKey, sortDir]);

  const clear = () => {
    setQ("");
    setSector("");
    setCity("");
    setStatus("");
    setYear("");
  };
  const hasFilters = q || sector || city || status || year;

  const onSort = (key: SortKey) => {
    if (key === sortKey) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDir(typeof unicorns[0][key] === "number" ? "desc" : "asc");
    }
  };

  return (
    <section id="ledger">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-t-2 border-t-ink border-b border-b-rule pt-3 pb-2 mt-14 md:mt-16">
        <h2 className="font-serif text-[1.05rem] md:text-section uppercase tracking-mast font-bold">
          The Ledger
        </h2>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="font-mono text-tag tracking-label uppercase text-ink-muted">
            Ranked by Valuation · {rows.length} of {unicorns.length}
          </span>
          <button
            onClick={() => exportCsv(rows)}
            className="btn-ghost text-tag"
            aria-label="Export CSV"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] max-md:grid-cols-2 gap-[10px] pt-[14px] pb-[10px] border-b border-rule">
        <div className="max-md:col-span-2">
          <label className="block font-mono text-tag uppercase tracking-meta text-ink-muted mb-1">
            Search
          </label>
          <input
            id="ledger-search"
            className="input-field"
            placeholder="Name, founder, investor… (⌘K)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <FilterSelect label="Sector" value={sector} onChange={setSector} options={sectors} />
        <FilterSelect label="City" value={city} onChange={setCity} options={cities} />
        <FilterSelect
          label="Status"
          value={status}
          onChange={setStatus}
          options={["private", "ipo", "acquired", "distressed"]}
          render={(o) => STATUS_LABEL[o as UnicornStatus]}
        />
        <FilterSelect
          label="Year Entered"
          value={year}
          onChange={setYear}
          options={years.map(String)}
        />
      </div>

      <div className="flex items-baseline justify-between py-[10px] font-mono text-sub text-ink-muted uppercase tracking-wider">
        <span>
          Showing <span className="text-ink">{rows.length}</span> entries
          {hasFilters ? " · filtered" : ""}
        </span>
        {hasFilters ? (
          <button
            onClick={clear}
            className="font-mono text-tag uppercase tracking-label text-red bg-transparent border-none cursor-pointer underline underline-offset-2 hover:text-red-dark"
          >
            Clear filters
          </button>
        ) : null}
      </div>

      {rows.length === 0 ? (
        <div className="text-center py-12 px-6 font-body italic text-ink-muted border border-dashed border-rule mt-4">
          No unicorns match the current filters.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse font-body text-body">
            <thead>
              <tr>
                <th className="th-cell">#</th>
                <SortTh sk="name" label="Company" onSort={onSort} sortKey={sortKey} sortDir={sortDir} />
                <SortTh sk="valuation_bn" label="Valuation" onSort={onSort} sortKey={sortKey} sortDir={sortDir} align="right" />
                <SortTh sk="funding_bn" label="Funding" onSort={onSort} sortKey={sortKey} sortDir={sortDir} align="right" />
                <SortTh sk="sector" label="Sector" onSort={onSort} sortKey={sortKey} sortDir={sortDir} />
                <SortTh sk="city" label="City" onSort={onSort} sortKey={sortKey} sortDir={sortDir} />
                <SortTh sk="founded" label="Founded" onSort={onSort} sortKey={sortKey} sortDir={sortDir} align="right" />
                <SortTh sk="unicorn_year" label="Became Unicorn" onSort={onSort} sortKey={sortKey} sortDir={sortDir} align="right" />
                <th className="th-cell">Status</th>
                <th className="th-cell">Key Investors</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u, i) => (
                <tr key={u.name} className="hover:bg-paper-dark">
                  <td className="td-cell w-9 font-mono text-tag text-ink-muted">{i + 1}</td>
                  <td className="td-cell">
                    <div className="font-serif font-bold text-card leading-tight">{u.name}</div>
                    {u.founders.length ? (
                      <div className="font-body italic text-sub text-ink-muted mt-[2px]">
                        {u.founders.slice(0, 3).join(" · ")}
                        {u.founders.length > 3 ? " …" : ""}
                      </div>
                    ) : null}
                  </td>
                  <td className="td-cell text-right font-mono font-medium text-ink whitespace-nowrap">
                    {fmtMoney(u.valuation_bn)}
                  </td>
                  <td className="td-cell text-right font-mono text-ink-light whitespace-nowrap">
                    {fmtMoney(u.funding_bn)}
                  </td>
                  <td className="td-cell font-mono text-sub uppercase tracking-tight text-ink-light whitespace-nowrap">
                    {u.sector}
                  </td>
                  <td className="td-cell font-mono text-sub uppercase text-ink-light whitespace-nowrap">
                    {u.city}
                  </td>
                  <td className="td-cell text-right font-mono text-sub text-ink-light">{u.founded}</td>
                  <td className="td-cell text-right font-mono text-sub text-ink-light">
                    {u.unicorn_year}
                  </td>
                  <td className="td-cell">
                    <span
                      className={`inline-block font-mono text-tiny uppercase tracking-label px-[7px] py-[2px] border whitespace-nowrap ${STATUS_CLASS[u.status]}`}
                    >
                      {STATUS_LABEL[u.status]}
                    </span>
                  </td>
                  <td className="td-cell text-sub text-ink-light max-w-[260px]">
                    {u.investors.slice(0, 3).join(", ")}
                    {u.investors.length > 3 ? ` · +${u.investors.length - 3}` : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function exportCsv(rows: Unicorn[]) {
  const header = [
    "name",
    "valuation_bn",
    "funding_bn",
    "sector",
    "city",
    "founded",
    "unicorn_year",
    "status",
    "founders",
    "investors",
  ];
  const lines = [header.join(",")];
  for (const u of rows) {
    const vals = [
      csvCell(u.name),
      u.valuation_bn,
      u.funding_bn,
      csvCell(u.sector),
      csvCell(u.city),
      u.founded,
      u.unicorn_year,
      u.status,
      csvCell(u.founders.join("; ")),
      csvCell(u.investors.join("; ")),
    ];
    lines.push(vals.join(","));
  }
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `indian-unicorns-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function csvCell(s: string) {
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  render,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  render?: (o: string) => string;
}) {
  return (
    <div>
      <label className="block font-mono text-tag uppercase tracking-meta text-ink-muted mb-1">
        {label}
      </label>
      <select className="input-field" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">All</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {render ? render(o) : o}
          </option>
        ))}
      </select>
    </div>
  );
}

function SortTh({
  sk,
  label,
  onSort,
  sortKey,
  sortDir,
  align = "left",
}: {
  sk: SortKey;
  label: string;
  onSort: (k: SortKey) => void;
  sortKey: SortKey;
  sortDir: SortDir;
  align?: "left" | "right";
}) {
  const active = sortKey === sk;
  return (
    <th
      className={`th-cell ${active ? "text-red" : ""} ${align === "right" ? "text-right" : ""}`}
      onClick={() => onSort(sk)}
    >
      {label}
      <span className={`ml-1 ${active ? "text-red" : "text-rule-dark"}`}>
        {active ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
      </span>
    </th>
  );
}
