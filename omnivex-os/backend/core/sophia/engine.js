export function generateSignal(price) {
  const r = Math.random();

  // STRICT SIGNAL STRUCTURE
  if (r < 0.4) {
    return "BUY";
  }

  if (r < 0.7) {
    return "SELL";
  }

  return "HOLD";
}
