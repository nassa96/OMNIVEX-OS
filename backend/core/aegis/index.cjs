/**
 * AEGIS v1 - Adaptive Consensus Gate
 * Controls whether a trade is allowed
 */

function evaluate(signal, bias) {
  let score = signal.strength || 0;

  // bias alignment filter
  if (signal.signal === "BUY" && bias < -0.3) score *= 0.5;
  if (signal.signal === "SELL" && bias > 0.3) score *= 0.5;

  const allowed = score > 0.65;

  return {
    allowed,
    score,
    reason: allowed ? "OK" : "AEGIS_BLOCK"
  };
}

module.exports = {
  evaluate
};
