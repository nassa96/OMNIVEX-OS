"use strict";

/**
 * ==========================================
 * INSTITUTIONAL RISK KILL SWITCH v1
 * GLOBAL EXECUTION CIRCUIT BREAKER
 * ==========================================
 *
 * ROLE:
 * - prevent catastrophic execution states
 * - enforce drawdown + volatility limits
 * - act as global system safety governor
 */

import chronicle from "../../chronicle/ledger.js";

/**
 * ==========================
 * GLOBAL RISK STATE
 * ==========================
 */
const RISK = {
  enabled: true,
  maxDrawdown: -5,        // percent
  maxVolatility: 2.5,     // arbitrary scale
  currentDrawdown: 0,
  circuitBroken: false
};

/**
 * ==========================
 * EVALUATE SYSTEM HEALTH
 * ==========================
 */
function evaluateRisk(latestSignal) {
  const regime = chronicle.getRegime?.() || "UNKNOWN";

  /**
   * HIGH VOLATILITY HARD STOP
   */
  if (regime === "HIGH_VOLATILITY") {
    RISK.circuitBroken = true;
    return false;
  }

  /**
   * DRAWDOWN CHECK (from chronicle pnl history)
   */
  const pnlHistory = chronicle.getLedger?.() || [];
  const recent = pnlHistory.slice(-50);

  const pnl = recent.reduce((a, b) => a + (b.pnl || 0), 0);

  RISK.currentDrawdown = pnl;

  if (pnl <= RISK.maxDrawdown) {
    RISK.circuitBroken = true;
    return false;
  }

  return !RISK.circuitBroken;
}

/**
 * ==========================
 * KILL SWITCH CHECK
 * ==========================
 */
export function allowExecution(signal) {
  if (!RISK.enabled) return true;

  const ok = evaluateRisk(signal);

  if (!ok) {
    return {
      allowed: false,
      reason: RISK.circuitBroken
        ? "CIRCUIT_BREAK"
        : "RISK_LIMIT"
    };
  }

  return {
    allowed: true
  };
}

/**
 * ==========================
 * MANUAL CONTROL METHODS
 * ==========================
 */
export function disable() {
  RISK.enabled = false;
}

export function enable() {
  RISK.enabled = true;
  RISK.circuitBroken = false;
}

export function getRiskState() {
  return RISK;
}

export default {
  allowExecution,
  disable,
  enable,
  getRiskState
};
