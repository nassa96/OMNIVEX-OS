export function runSaint(decision) {
  if (!decision.allow) {
    return { executed: false, reason: "RISK_BLOCKED" };
  }

  // execution stub (NO LIVE TRADES YET)
  return {
    executed: true,
    order: decision.signal,
  };
}
