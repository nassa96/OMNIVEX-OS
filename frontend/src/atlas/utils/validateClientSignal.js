export function validateClientSignal(signal) {
  if (!signal) return false;
  if (!signal.symbol || !signal.price) return false;
  if (!["BUY", "SELL", "HOLD"].includes(signal.side)) return false;
  return true;
}
