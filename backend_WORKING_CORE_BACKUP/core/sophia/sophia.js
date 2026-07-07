/**
 * SOPHIA CORE AGENT
 * Market intelligence + signal generation layer
 * Compatible with Elohim kernel contract
 */

function signal(context) {
  const price = context?.price || 0;
  const volatility = Math.abs(Math.sin(price / 1000));

  // simple directional heuristic (placeholder intelligence layer)
  let strength = volatility;

  let direction = "HOLD";

  if (strength > 0.65) direction = "BUY";
  else if (strength < 0.25) direction = "SELL";

  return {
    signal: direction,
    strength: Math.min(1, strength)
  };
}

module.exports = { signal };
