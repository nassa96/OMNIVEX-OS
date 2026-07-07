/**
 * ATLAS STRATEGY HEATMAP ENGINE V1
 * Tracks influence of decision layers per symbol
 */

const STATE = {
  BTC: {},
  ETH: {},
  SOL: {}
};

/* =========================
   UPDATE WEIGHTS
========================= */
export function updateHeatmap(symbol, layers = {}) {
  const {
    sophia = 0,
    regime = 0,
    consensus = 0,
    risk = 0,
    strategy = 0
  } = layers;

  STATE[symbol] = {
    sophia,
    regime,
    consensus,
    risk,
    strategy,
    total: normalize(sophia + regime + consensus + risk + strategy)
  };

  return STATE[symbol];
}

/* =========================
   GET STATE
========================= */
export function getHeatmap(symbol) {
  return STATE[symbol] || {
    sophia: 0,
    regime: 0,
    consensus: 0,
    risk: 0,
    strategy: 0,
    total: 0
  };
}

export function getAllHeatmaps() {
  return STATE;
}

/* =========================
   NORMALIZE
========================= */
function normalize(v) {
  if (!v) return 0;
  return Math.min(1, Math.max(0, v));
}
