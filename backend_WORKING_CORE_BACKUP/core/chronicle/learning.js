/**
 * =====================================================
 * CHRONICLE LEARNING LOOP V1
 * =====================================================
 *
 * Learns from replay history (jsonl logs)
 * Adjusts agent weights based on profitability
 */

const fs = require("fs");
const path = require("path");

const LOG_PATH = path.join(__dirname, "../../data/chronicle.jsonl");

// ===============================
// DEFAULT WEIGHTS
// ===============================
const weights = {
  SOPHIA: 0.5,
  FORGE: 0.5
};

// ===============================
// LOAD HISTORY
// ===============================
function loadHistory(limit = 500) {
  if (!fs.existsSync(LOG_PATH)) return [];

  const raw = fs.readFileSync(LOG_PATH, "utf-8")
    .trim()
    .split("\n")
    .filter(Boolean);

  return raw.slice(-limit).map(l => JSON.parse(l));
}

// ===============================
// ANALYZE PERFORMANCE
// ===============================
function analyze(history) {
  let sophiaProfit = 0;
  let forgeProfit = 0;

  for (const h of history) {
    // positive pnl means signal worked
    if (h.pnl === 0) continue;

    if (h.signal === "BUY") {
      sophiaProfit += h.pnl * 0.6;
      forgeProfit += h.pnl * 0.4;
    }

    if (h.signal === "SELL") {
      forgeProfit += h.pnl;
    }
  }

  return { sophiaProfit, forgeProfit };
}

// ===============================
// UPDATE WEIGHTS
// ===============================
function updateWeights(stats) {
  const total = Math.abs(stats.sophiaProfit) + Math.abs(stats.forgeProfit) || 1;

  const sophiaRatio = stats.sophiaProfit / total;
  const forgeRatio = stats.forgeProfit / total;

  weights.SOPHIA = clamp(0.1, 0.9, 0.5 + sophiaRatio);
  weights.FORGE = clamp(0.1, 0.9, 0.5 + forgeRatio);

  normalize();
}

function clamp(min, max, v) {
  return Math.max(min, Math.min(max, v));
}

function normalize() {
  const sum = weights.SOPHIA + weights.FORGE;
  weights.SOPHIA /= sum;
  weights.FORGE /= sum;
}

// ===============================
// PUBLIC API
// ===============================
function runLearning() {
  const history = loadHistory(300);
  const stats = analyze(history);
  updateWeights(stats);

  return {
    weights,
    stats,
    samples: history.length
  };
}

function getWeights() {
  return weights;
}

module.exports = {
  runLearning,
  getWeights
};
