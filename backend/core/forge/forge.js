/**
 * FORGE AGENT — SAFE SIGNAL LAYER
 * Standardized contract for Elohim kernel
 */

function signal(context) {
  const price = context?.price || 0;

  // simple volatility heuristic placeholder
  const strength = Math.min(1, Math.abs(Math.sin(price / 1000)));

  return {
    signal: strength > 0.6 ? "BUY" : strength < 0.3 ? "SELL" : "HOLD",
    strength
  };
}

module.exports = { signal };
