export function runSaint(decision) {
  if (!decision?.allow) {
    return {
      executed: false,
      reason: "BLOCKED_BY_AEGIS",
    };
  }

  const price = decision.price || 0;

  return {
    executed: true,
    action: decision.signal,
    price,
    timestamp: Date.now(),
  };
}
