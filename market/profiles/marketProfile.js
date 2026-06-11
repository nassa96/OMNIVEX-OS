export function normalizeMarket(raw, source = "unknown") {
  return {
    asset: raw.symbol || raw.pair || raw.asset,
    price: Number(raw.price || raw.close || raw.last || 0),
    volume: Number(raw.volume || 0),
    liquidity: Number(raw.liquidity || 0),
    source,
    timestamp: Date.now()
  };
}
