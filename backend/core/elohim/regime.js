/**
 * =========================================================
 * OMNIVEX — MARKET REGIME ENGINE V1
 * Lightweight adaptive classification (no ML dependency)
 * =========================================================
 */

const window = [];

function mean(arr) {
  return arr.reduce((a, b) => a + b, 0) / Math.max(arr.length, 1);
}

function variance(arr) {
  const m = mean(arr);
  return mean(arr.map(x => (x - m) ** 2));
}

function detectRegime(tick) {
  window.push(tick.price);

  if (window.length > 40) window.shift();

  if (window.length < 10) {
    return {
      regime: "WARMUP",
      volatility: 0,
      trend: 0
    };
  }

  const first = window[0];
  const last = window[window.length - 1];

  const trend = (last - first) / first;
  const vol = variance(window);

  let regime = "CHOP";

  if (vol > 120) regime = "VOLATILE";
  else if (trend > 0.004) regime = "TREND_UP";
  else if (trend < -0.004) regime = "TREND_DOWN";
  else if (vol < 30) regime = "LOW_VOL";

  return {
    regime,
    volatility: vol,
    trend
  };
}

module.exports = { detectRegime };
