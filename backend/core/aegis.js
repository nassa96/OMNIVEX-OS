export function runAegis(market) {
  const vol = market?.volatility || Math.random();

  if (vol > 0.7) return "HIGH";
  if (vol > 0.4) return "MEDIUM";
  return "LOW";
}
