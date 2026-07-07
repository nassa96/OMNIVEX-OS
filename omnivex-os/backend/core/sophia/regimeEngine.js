/**
 * SOPHIA REGIME ENGINE v2.1 (MUTATION WIRED)
 * ------------------------------------------
 * Now incorporates strategy mutation feedback loop
 */

import { getStrategyMatrix } from "./mutationEngine.js";

const priceHistory = {};
const regimeState = {};

/**
 * Update price stream and compute regime
 */
export function updatePrice(symbol, price) {
  if (!priceHistory[symbol]) {
    priceHistory[symbol] = [];
  }

  const history = priceHistory[symbol];
  history.push(price);

  if (history.length > 50) history.shift();

  const regime = detectRegime(history);

  // store state
  regimeState[symbol] = regime;

  return regime;
}

/**
 * Core regime classifier
 */
export function detectRegime(history) {
  if (history.length < 5) return "UNCERTAIN";

  const recent = history.slice(-5);
  const old = history.slice(-20, -5);

  const recentAvg = avg(recent);
  const oldAvg = avg(old.length ? old : recent);

  const volatility = std(recent);

  if (volatility > 50) return "HIGH_VOL";
  if (recentAvg > oldAvg * 1.01) return "TRENDING_UP";
  if (recentAvg < oldAvg * 0.99) return "TRENDING_DOWN";

  return "MEAN_REVERT";
}

/**
 * 🔥 NEW: MUTATION-AWARE SIGNAL GENERATION
 */
export function getSophiaSignal(symbol) {
  const regime = regimeState[symbol] || "UNCERTAIN";

  const matrix = getStrategyMatrix();

  const weights = matrix[regime] || {
    BUY: 0.33,
    SELL: 0.33,
    HOLD: 0.34
  };

  // pick highest weighted action
  const action = Object.entries(weights).reduce((a, b) =>
    a[1] > b[1] ? a : b
  )[0];

  return {
    symbol,
    regime,
    action,
    weights
  };
}

/**
 * Helpers
 */
function avg(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function std(arr) {
  const mean = avg(arr);
  return Math.sqrt(avg(arr.map(x => (x - mean) ** 2)));
}
