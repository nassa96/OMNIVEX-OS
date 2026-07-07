export function generateSignal(market) {
  const strength = Math.random();

  return {
    type: strength > 0.5 ? "MOMENTUM" : "NEUTRAL",
    confidence: strength,
    price: market.price
  };
}
