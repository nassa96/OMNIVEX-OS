/**
 * =========================================================
 * ELOHIM V2 — REGIME WEIGHTED DECISION AUTHORITY
 * =========================================================
 */

function evaluate(signal, regime, capital, learningBias) {
  let weight = signal.strength;

  // regime control
  switch (regime?.regime) {
    case "TREND_UP":
      weight *= 1.2;
      break;

    case "TREND_DOWN":
      weight *= 1.1;
      break;

    case "VOLATILE":
      weight *= 0.6;
      break;

    case "LOW_VOL":
      weight *= 1.0;
      break;

    default:
      weight *= 0.8;
  }

  // learning bias influence
  if (signal.signal === "BUY") weight *= learningBias.buy || 1;
  if (signal.signal === "SELL") weight *= learningBias.sell || 1;

  // capital safety gates
  if (capital.drawdown > 0.25) {
    return { allowed: false, reason: "DRAWDOWN_LOCK" };
  }

  if (weight < 0.55) {
    return { allowed: false, reason: "LOW_CONFIDENCE" };
  }

  if (signal.signal === "HOLD") {
    return { allowed: false, reason: "HOLD_STATE" };
  }

  return {
    allowed: true,
    reason: "APPROVED",
    weight
  };
}

module.exports = {
  evaluate
};
