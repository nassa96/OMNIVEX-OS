export function createOrder({ symbol, price, signal, decision, strategy }) {
  return {
    id: `${symbol}-${Date.now()}`,
    symbol,
    price,
    side: decision, // BUY | SELL | HOLD
    signal,
    strategy,
    timestamp: Date.now(),
    type: "PAPER"
  };
}
