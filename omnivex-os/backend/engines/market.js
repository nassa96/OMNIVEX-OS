export function generateMarketTick() {
  return {
    price: 100 + Math.random() * 10,
    volume: Math.random() * 1000,
    volatility: Math.random() * 5,
    ts: Date.now()
  };
}
