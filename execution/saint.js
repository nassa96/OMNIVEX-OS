export function runSaint(decision, price) {
  return {
    executed: true,
    action: decision.signal,
    price,
    timestamp: Date.now()
  };
}
