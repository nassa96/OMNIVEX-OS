/**
 * SAINT OMNIVEX — STRATEGY KERNEL (HARDENED CONTRACT)
 * deterministic decision layer
 * NO undefined outputs allowed under any condition
 */

function clamp(n, min, max) {
  if (typeof n !== "number" || isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function safeNumber(n, fallback = 0) {
  return typeof n === "number" && !isNaN(n) ? n : fallback;
}

/**
 * MAIN DECISION KERNEL
 * MUST ALWAYS RETURN A COMPLETE OBJECT
 */
export function decisionKernel(input = {}) {
  const {
    signal,
    confidence,
    risk,
    price,
    volatility
  } = input;

  // Normalize inputs
  const conf = clamp(safeNumber(confidence, 0), 0, 1);
  const px = safeNumber(price, 0);
  const vol = volatility || "LOW";
  const rsk = risk || "MEDIUM";

  // DEFAULT SAFE OUTPUT (NEVER undefined)
  const base = {
    allow: false,
    action: "HOLD",
    confidence: conf,
    reason: "DEFAULT_SAFE_STATE",
    simulatedPnL: 0
  };

  // INVALID MARKET STATE GUARD
  if (px <= 0) {
    return {
      ...base,
      reason: "INVALID_PRICE_BLOCK"
    };
  }

  // VOLATILITY FILTER
  let volMultiplier = 1;
  if (vol === "HIGH") volMultiplier = 0.65;
  if (vol === "MEDIUM") volMultiplier = 0.85;

  // RISK FILTER
  let riskMultiplier = 1;
  if (rsk === "HIGH") riskMultiplier = 0.5;
  if (rsk === "MEDIUM") riskMultiplier = 0.75;

  // SIGNAL NORMALIZATION
  const sig = (signal || "HOLD").toUpperCase();

  // CORE DECISION THRESHOLDS
  const adjustedConfidence = conf * volMultiplier * riskMultiplier;

  let action = "HOLD";
  let allow = false;
  let reason = "NO_CONDITIONS_MET";

  if (sig === "BUY") {
    if (adjustedConfidence >= 0.78) {
      action = "BUY";
      allow = true;
      reason = "BUY_CONFIRMED";
    } else {
      reason = "BUY_REJECTED_LOW_CONFIDENCE";
    }
  }

  if (sig === "SELL") {
    if (adjustedConfidence >= 0.72) {
      action = "SELL";
      allow = true;
      reason = "SELL_CONFIRMED";
    } else {
      reason = "SELL_REJECTED_LOW_CONFIDENCE";
    }
  }

  // HOLD ALWAYS SAFE
  if (sig === "HOLD") {
    action = "HOLD";
    allow = false;
    reason = "HOLD_SIGNAL";
  }

  // PnL MODEL (DETERMINISTIC, NON-RANDOM)
  let simulatedPnL = 0;

  if (allow) {
    const direction = action === "BUY" ? 1 : -1;

    // deterministic movement model (NO Math.random)
    const volatilityFactor =
      vol === "HIGH" ? 0.012 :
      vol === "MEDIUM" ? 0.008 : 0.004;

    simulatedPnL =
      direction *
      px *
      volatilityFactor *
      adjustedConfidence;

    simulatedPnL = safeNumber(simulatedPnL, 0);
  }

  return {
    allow,
    action,
    confidence: adjustedConfidence,
    reason,
    simulatedPnL
  };
}
