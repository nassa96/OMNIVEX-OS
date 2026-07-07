export function runAegis(market) {
  const price = Number(market.BTC);
  const prev = Number(market.prevBTC);

  const volatility = Math.abs(price - prev);

  let risk = "LOW";
  if (volatility > 80) risk = "HIGH";
  else if (volatility > 30) risk = "MEDIUM";

  return {
    type: "AEGIS_RISK",
    volatility,
    risk
  };
}
