"use strict";

/**
 * CHRONICLE v2 — REPLAY + TRAINING MEMORY ENGINE
 * ------------------------------------------------
 * Stores truth AND generates learning signals for system evolution
 */

const fs = require("fs");
const path = require("path");

const LOG_PATH = path.join(__dirname, "../../data/chronicle_log.json");

// ===============================
// ENSURE STORAGE
// ===============================
function ensure() {
  if (!fs.existsSync(LOG_PATH)) {
    fs.writeFileSync(LOG_PATH, JSON.stringify([]));
  }
}

// ===============================
// WRITE EVENT
// ===============================
function record(entry) {
  ensure();

  const data = JSON.parse(fs.readFileSync(LOG_PATH));

  const enriched = {
    ...entry,
    ts: Date.now(),
    outcomeScore:
      (entry.execution?.pnl || 0) +
      (entry.decision?.confidence || 0)
  };

  data.push(enriched);

  fs.writeFileSync(LOG_PATH, JSON.stringify(data, null, 2));
}

// ===============================
// REPLAY WINDOW
// ===============================
function replay(limit = 200) {
  ensure();

  const data = JSON.parse(fs.readFileSync(LOG_PATH));
  return data.slice(-limit);
}

// ===============================
// TRAINING SIGNAL GENERATION
// ===============================
function generateLearningSignals(limit = 200) {
  ensure();

  const data = JSON.parse(fs.readFileSync(LOG_PATH)).slice(-limit);

  if (data.length === 0) return null;

  let avgPnL = 0;
  let wins = 0;

  for (const d of data) {
    const pnl = d.execution?.pnl || 0;
    avgPnL += pnl;

    if (pnl > 0) wins++;
  }

  avgPnL /= data.length;

  return {
    avgPnL,
    winRate: wins / data.length,
    sampleSize: data.length
  };
}

// ===============================
// FEED BACK INTO SYSTEM
// ===============================
function feedbackLoop({ prometheus, forge }) {
  const signals = generateLearningSignals();

  if (!signals) return;

  // adjust opportunity sensitivity
  if (prometheus?.tune) {
    prometheus.tune({
      aggressiveness: signals.winRate,
      volatilityBias: signals.avgPnL
    });
  }

  // mutate strategy weights
  if (forge?.adapt) {
    forge.adapt(signals);
  }
}

module.exports = {
  record,
  replay,
  generateLearningSignals,
  feedbackLoop
};
