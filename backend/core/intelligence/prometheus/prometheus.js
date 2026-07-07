"use strict";

import chronicle from "../../chronicle/ledger.js";

/**
 * PROMETHEUS — SCORING ENGINE
 */

const ADAPTIVE = {
  bias: {
    momentum: 1.0,
    liquidity: 1.0
  }
};

function base(signal) {
  return (signal.change || 0) * 0.6 + (signal.volume || 0) * 0.4;
}

function micro(m) {
  if (!m) return 0;
  const spreadPenalty = Math.min((m.spread || 0.01) * 100, 1);
  const depthBoost = Math.min((m.depth || 1) / 10, 1);
  return (m.imbalance || 0) * 0.5 + depthBoost * 0.3 - spreadPenalty * 0.4;
}

function regimeWeight(r) {
  switch (r) {
    case "BULL_TREND": return 1.2;
    case "BEAR_TREND": return 1.0;
    case "RANGE": return 0.9;
    case "HIGH_VOLATILITY": return 0.6;
    default: return 1.0;
  }
}

export function adaptFromRegime() {
  const r = chronicle.getAdaptationSignal?.();

  if (!r) return;

  switch (r.regime) {
    case "HIGH_VOLATILITY":
      ADAPTIVE.bias.momentum *= 0.8;
      ADAPTIVE.bias.liquidity *= 1.2;
      break;

    case "BULL_TREND":
      ADAPTIVE.bias.momentum *= 1.1;
      break;

    case "BEAR_TREND":
      ADAPTIVE.bias.momentum *= 0.9;
      break;
  }

  for (const k in ADAPTIVE.bias) {
    ADAPTIVE.bias[k] = Math.max(0.5, Math.min(1.5, ADAPTIVE.bias[k]));
  }
}

export function score(signal) {
  const b = base(signal);
  const m = micro(signal.micro);
  const r = signal.meta?.regime || "UNKNOWN";

  const weight =
    regimeWeight(r) * ADAPTIVE.bias.momentum;

  const value = (b + m) * weight;

  return {
    symbol: signal.symbol,
    score: value,
    confidence: Math.min(Math.abs(value), 1),
    regime: r,
    microImpact: m,
    ts: Date.now()
  };
}

export function feedback(entry) {
  chronicle.record(entry);
}

export default { score, feedback, adaptFromRegime };
