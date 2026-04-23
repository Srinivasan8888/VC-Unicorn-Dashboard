export type UnicornStatus = "private" | "ipo" | "acquired" | "distressed";

export interface Unicorn {
  name: string;
  valuation_bn: number;
  founded: number;
  unicorn_year: number;
  sector: string;
  city: string;
  funding_bn: number;
  founders: string[];
  investors: string[];
  status: UnicornStatus;
}

export interface UnicornDataset {
  meta: {
    source: string;
    last_updated: string;
    as_of: string;
    total_unicorns_ever: number;
    currently_active_private: number;
    ipo_exits: number;
    acquired: number;
    slipped_below_1b: number;
    aggregate_valuation_usd_bn: number;
    aggregate_funding_usd_bn: number;
    notes: string;
  };
  sector_summary: { sector: string; count: number }[];
  city_summary: { city: string; count: number }[];
  unicorns: Unicorn[];
}
