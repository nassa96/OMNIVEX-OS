export function runSophia(market) {
  const btc = market.BTC;
  const eth = market.ETH;

  if (!btc || !eth) {
    return {
      signal: "HOLD",
      confidence: 0.1,
    };
  }

  const momentum = btc > market.prevBTC ? 1 : -1;

  if (momentum > 0.5) {
    return { signal: "BUY", confidence: 0.75 };
  }

  if (momentum < -0.5) {
    return { signal: "SELL", confidence: 0.75 };
  }

  return { signal: "HOLD", confidence: 0.5 };
}
