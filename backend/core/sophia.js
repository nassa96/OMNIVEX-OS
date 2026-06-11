export function runSophia(market) {
  const price = market?.price || Math.random() * 100;
  const volatility = market?.volatility || Math.random();

  if (volatility > 0.8) {
    return { signal: "SELL", confidence: 0.9 };
  }

  if (volatility > 0.5) {
    return { signal: "BUY", confidence: 0.75 };
  }

  return { signal: "HOLD", confidence: 0.4 };
}
