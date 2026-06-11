// ======================================================
// SAINT OMNIVEX — INDICATOR ENGINE
// File: core/indicators.js
// ======================================================

import { getPriceSeries } from "./market.js";

function sma(period) {
  const series = getPriceSeries();

  if (series.length < period) {
    return null;
  }

  const slice = series.slice(-period);

  const total = slice.reduce((a, b) => a + b, 0);

  return total / period;
}

function ema(period) {
  const series = getPriceSeries();

  if (series.length < period) {
    return null;
  }

  const k = 2 / (period + 1);

  let result = series[0];

  for (let i = 1; i < series.length; i++) {
    result = series[i] * k + result * (1 - k);
  }

  return result;
}

function volatility() {
  const series = getPriceSeries();

  if (series.length < 20) {
    return "LOW";
  }

  const recent = series.slice(-20);

  const high = Math.max(...recent);
  const low = Math.min(...recent);

  const spread = high - low;

  if (spread > 250) {
    return "HIGH";
  }

  if (spread > 120) {
    return "MEDIUM";
  }

  return "LOW";
}

export function calculateIndicators() {
  const ema9 = ema(9);
  const ema21 = ema(21);
  const sma20 = sma(20);

  return {
    ema9,
    ema21,
    sma20,
    volatility: volatility()
  };
}
