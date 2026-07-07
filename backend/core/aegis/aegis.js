/**
 * =====================================================
 * AEGIS v2 — ADAPTIVE CONSENSUS GATE
 * =====================================================
 * Replaces single-rule gating with scoring consensus
 */

let memoryBias = 1;

function updateBias(replayResult) {
  if (!replayResult) return;

  const pnl = replayResult.finalEquity || 0;

  if (pnl > 10000) memoryBias *= 1.01;
  if (pnl < 0) memoryBias *= 0.99;

  // clamp
  memoryBias = Math.max(0.5, Math.min(2, memoryBias));
}

function evaluateSignal(signal, tick, lastTick) {
  const diff = lastTick ? tick.price - lastTick.price : 0;

  let score = signal.strength * memoryBias;

  // volatility penalty
  if (Math.abs(diff) > 20) score *= 0.8;

  let allowed = score > 0.72;

  let reason = allowed
    ? "AEGIS_APPROVED"
    : "AEGIS_BLOCKED_LOW_SCORE";

  // cooldown override (soft block)
  if (Math.abs(diff) < 1) {
    allowed = false;
    reason = "COOLDOWN_GATED";
  }

  return {
    allowed,
    score,
    reason,
    bias: memoryBias
  };
}

module.exports = {
  evaluateSignal,
  updateBias
};
