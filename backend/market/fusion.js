export function fuseMarketData(dataSets) {
  const valid = dataSets.filter(Boolean);

  if (!valid.length) {
    return {
      symbol: null,
      price: 0,
      volume24h: 0,
      liquidity: 0,
      volatility: 0,
      sources: [],
      timestamp: Date.now()
    };
  }

  const price =
    valid.reduce((a, b) => a + b.price, 0) / valid.length;

  const volume24h =
    valid.reduce((a, b) => a + (b.volume24h || 0), 0);

  const liquidity =
    valid.reduce((a, b) => a + (b.liquidity || 0), 0);

  const volatility =
    valid.reduce((a, b) => a + (b.volatility || 0), 0) / valid.length;

  return {
    symbol: valid[0].symbol,
    price,
    volume24h,
    liquidity,
    volatility,
    sources: valid.map(v => v.source),
    timestamp: Date.now()
  };
}
