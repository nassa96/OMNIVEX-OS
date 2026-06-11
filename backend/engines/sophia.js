export function sophia(price, memory) {
  if (price > memory.avg) return "BUY";
  if (price < memory.avg) return "SELL";
  return "HOLD";
}
