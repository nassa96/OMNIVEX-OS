"use strict";

const prometheus = require("../opportunity/prometheus");

const memory = [];

function calculateReward(execution) {
  const pnl = execution?.pnl || 0;
  const side = execution?.side || "HOLD";
  return side === "HOLD" ? pnl - 0.01 : pnl;
}

function recordTick(tick) {
  const reward = calculateReward(tick.execution);

  const entry = {
    cycle: tick.cycle,
    market: tick.market,
    signals: tick.signals,
    opportunities: tick.opportunities,
    decision: tick.decision,
    execution: tick.execution,
    reward,
    timestamp: Date.now()
  };

  memory.push(entry);

  if (memory.length > 5000) memory.shift();

  // 🔁 EVOLUTION FEEDBACK LOOP
  prometheus.feedback(entry);

  return entry;
}

function getAvgReward(n = 100) {
  const recent = memory.slice(-n);
  if (!recent.length) return 0;

  return recent.reduce((a, b) => a + (b.reward || 0), 0) / recent.length;
}

module.exports = {
  recordTick,
  getAvgReward
};
