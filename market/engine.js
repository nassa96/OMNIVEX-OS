import { normalizeMarket } from "./profiles/marketProfile.js";

export async function runMarketEngine(sources = []) {
  const normalized = sources
    .flat()
    .map(item => normalizeMarket(item.data || item, item.source))
    .filter(Boolean);

  const grouped = {};

  for (const m of normalized) {
    if (!grouped[m.asset]) grouped[m.asset] = [];
    grouped[m.asset].push(m);
  }

  return grouped;
}
