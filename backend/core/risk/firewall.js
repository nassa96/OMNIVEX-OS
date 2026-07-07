"use strict";

/**
 * RISK FIREWALL v1
 * Hard system-level trading protection layer
 */

const STATE = {
  paused: false,
  maxDrawdown: 0.05,
  dailyLoss: 0,
  equity: 1000
};

export function checkRisk({ decision, market }) {
  if (STATE.paused) {
    return { approved: false, reason: "SYSTEM_PAUSED" };
  }

  if (!decision || decision.action === "HOLD") {
    return { approved: false, reason: "NO_TRADE" };
  }

  const riskScore = Math.random() * 0.6; // placeholder until portfolio tracking wired

  if (riskScore > STATE.maxDrawdown) {
    return { approved: false, reason: "DRAWDOWN_BLOCK" };
  }

  return {
    approved: true,
    riskScore
  };
}

export function pauseSystem() {
  STATE.paused = true;
}

export function resumeSystem() {
  STATE.paused = false;
}

export default {
  checkRisk,
  pauseSystem,
  resumeSystem
};
