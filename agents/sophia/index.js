export function runSophia(market) {
  return {
    signal: market.price > 60000 ? "BUY" : "SELL",
    confidence: 0.75
  };
}
