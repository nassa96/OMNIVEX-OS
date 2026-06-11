export function fuseMarket({ cex, gecko, cmc }) {
  const prices = [cex, gecko, cmc].filter(Boolean);

  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;

  const variance =
    prices.reduce((sum, p) => sum + Math.pow(p - avg, 2), 0) /
    prices.length;

  const volatility = variance > 50 ? "high" : variance > 10 ? "medium" : "low";

  const confidence = Math.max(0, 1 - variance / (avg || 1));

  return {
    price: avg,
    volatility,
    confidence,
    raw: { cex, gecko, cmc }
  };
}
