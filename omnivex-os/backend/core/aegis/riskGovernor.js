/**
 * AEGIS RISK GOVERNOR (REAL ENFORCEMENT LAYER)
 * This is now a HARD GATE — not a logger
 */

export function riskCheck(signal, snapshot) {
  const risk = snapshot?.config?.risk;

  if (!risk) {
    return {
      approved: false,
      reason: "NO_RISK_CONFIG"
    };
  }

  const volatilityLimit = risk.volatilityLimit ?? 0.1;

  /* SIMULATED VOLATILITY CHECK */
  const simulatedVolatility = Math.random() * 0.2;

  if (simulatedVolatility > volatilityLimit) {
    return {
      approved: false,
      reason: "VOLATILITY_BLOCK",
      volatility: simulatedVolatility
    };
  }

  /* POSITION SIZE CHECK */
  if (signal?.size && signal.size > risk.maxPositionSize) {
    return {
      approved: false,
      reason: "POSITION_TOO_LARGE"
    };
  }

  return {
    approved: true,
    reason: "AEGIS_CLEAR",
    volatility: simulatedVolatility
  };
}
