// ============================================================
// SAINT OMNIVEX — MARKET CORE
// File: core/market.js
// SINGLE SOURCE OF TRUTH FOR PRICE ENGINE
// ============================================================

const priceSeries = [];
let lastPrice = 77000;

/**
 * INTERNAL: random walk generator (replace later with real API)
 */
function generatePrice() {
  const move = (Math.random() - 0.5) * 120;
  lastPrice = Math.max(1000, lastPrice + move);
  return parseFloat(lastPrice.toFixed(2));
}

/**
 * PUBLIC: live price feed
 */
export async function fetchLivePrice() {
  const price = generatePrice();
  commitPrice(price);

  return {
    price,
    source: "LIVE"
  };
}

/**
 * CORE STATE MUTATION
 */
export function commitPrice(price) {
  priceSeries.push(price);

  if (priceSeries.length > 500) {
    priceSeries.shift();
  }
}

/**
 * PRICE HISTORY
 */
export function getPriceSeries() {
  return [...priceSeries];
}

/**
 * LAST PRICE
 */
export function getLastPrice() {
  if (priceSeries.length === 0) return lastPrice;
  return priceSeries[priceSeries.length - 1];
}

/**
 * 24H CHANGE SIMULATION
 */
export function get24hChange() {
  if (priceSeries.length < 2) return 0;

  const first = priceSeries[0];
  const last = priceSeries[priceSeries.length - 1];

  return parseFloat((((last - first) / first) * 100).toFixed(2));
}

/**
 * VOLATILITY ENGINE
 */
export function getVolatility() {
  if (priceSeries.length < 10) return "LOW";

  const recent = priceSeries.slice(-20);
  const high = Math.max(...recent);
  const low = Math.min(...recent);

  const spread = ((high - low) / low) * 100;

  if (spread > 2.5) return "HIGH";
  if (spread > 1.2) return "MEDIUM";
  return "LOW";
}
