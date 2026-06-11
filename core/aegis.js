export function runAegis(signal, market) {
  if (market.volatility === "high" && signal === "BUY") {
    return { allow: false, reason: "HIGH_VOLATILITY_BLOCK" };
  }

  if (signal.confidence < 0.5) {
    return { allow: false, reason: "LOW_CONFIDENCE" };
  }

  return { allow: true };
}
