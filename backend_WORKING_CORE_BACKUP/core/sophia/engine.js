/**
 * SOPHIA V2 — Signal Engine
 * Adds real movement sensitivity
 */

function generateSignal(tick, prevTick) {
  if (!prevTick) {
    return {
      signal: "HOLD",
      strength: 0.5,
      reason: "bootstrap"
    };
  }

  const delta = tick.price - prevTick.price;
  const pct = delta / prevTick.price;

  let signal = "HOLD";
  let strength = 0.5;
  let reason = "neutral";

  if (pct > 0.0008) {
    signal = "BUY";
    strength = 0.6 + Math.min(Math.abs(pct) * 50, 0.3);
    reason = "momentum_up";
  }

  if (pct < -0.0008) {
    signal = "SELL";
    strength = 0.6 + Math.min(Math.abs(pct) * 50, 0.3);
    reason = "momentum_down";
  }

  return {
    signal,
    strength: Math.min(strength, 0.95),
    reason
  };
}

module.exports = {
  generateSignal
};
