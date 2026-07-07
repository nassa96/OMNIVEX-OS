/**
 * GLOBAL POLICY GOVERNOR v2 (NETTING-AWARE)
 * -----------------------------------------
 * PURPOSE:
 * - Enforce SYSTEM + PORTFOLIO level risk constraints
 * - Use cross-asset netting engine
 */

import { getAllPositions } from "../saint/executionEngine.js"
import { getStrategy } from "../optimizer/strategyOptimizer.js"

import {
  computeNetExposure,
  getPortfolioRisk,
  getRebalanceSignal
} from "../capital/netting/capitalNettingEngine.js"

/* =========================
   GLOBAL LIMITS
========================= */

const limits = {
  maxPortfolioExposure: 0.60,
  maxAssetExposure: 0.25,
  maxDrawdown: 0.15,
  maxRiskInflation: 1.25,   // NEW (netting-based)
  minRiskInflation: 0.65    // NEW
}

/* =========================
   BASIC EXPOSURE
========================= */

function getPortfolioExposure(positions) {
  let total = 0

  for (const p of positions) {
    total += Math.abs(p.size || 0)
  }

  return total
}

/* =========================
   CORE RISK ENGINE
========================= */

function evaluateRisk(context = {}) {
  const positions = getAllPositions()

  const exposure = getPortfolioExposure(positions)

  const strategy = getStrategy()

  /* =========================
     NETTING ENGINE INPUT
  ========================= */

  const net = computeNetExposure()
  const portfolioRisk = getPortfolioRisk()
  const rebalance = getRebalanceSignal()

  const riskFlags = []

  /* =========================
     RAW EXPOSURE CHECK
  ========================= */

  if (exposure > limits.maxPortfolioExposure) {
    riskFlags.push("PORTFOLIO_EXPOSURE_LIMIT")
  }

  /* =========================
     NET RISK CHECK (NEW CORE LOGIC)
  ========================= */

  if (portfolioRisk.riskInflation > limits.maxRiskInflation) {
    riskFlags.push("CORRELATION_OVEREXPOSURE")
  }

  if (portfolioRisk.riskInflation < limits.minRiskInflation) {
    riskFlags.push("UNDERUTILIZED_CAPITAL")
  }

  /* =========================
     STRATEGY DRIFT CHECK
  ========================= */

  if (strategy.entryThreshold > 1.5) {
    riskFlags.push("ENTRY_THRESHOLD_DRIFT")
  }

  if (strategy.exitThreshold > 1.5) {
    riskFlags.push("EXIT_THRESHOLD_DRIFT")
  }

  /* =========================
     REGIME DRIFT CHECK
  ========================= */

  for (const key in strategy.regimeWeights) {
    const w = strategy.regimeWeights[key]

    if (w > 1.8 || w < 0.2) {
      riskFlags.push(`REGIME_DRIFT_${key}`)
    }
  }

  return {
    safe: riskFlags.length === 0,
    riskFlags,

    exposure,
    netExposure: net,
    portfolioRisk,
    rebalance
  }
}

/* =========================
   EXECUTION GATE
========================= */

export function allowExecution(symbol, size, context = {}) {
  const risk = evaluateRisk(context)

  if (!risk.safe) {
    console.log("🛑 GLOBAL POLICY BLOCK:", risk.riskFlags)
    return false
  }

  if (size > limits.maxAssetExposure) {
    console.log("🛑 ASSET EXPOSURE BLOCK")
    return false
  }

  return true
}

/* =========================
   EMERGENCY MODE
========================= */

export function emergencyMode(reason) {
  console.log("🚨 GLOBAL POLICY EMERGENCY MODE:", reason)

  return {
    tradingEnabled: false,
    reason
  }
}

/* =========================
   DEBUG EXPORT (OPTIONAL)
========================= */

export function getGlobalRiskSnapshot() {
  return evaluateRisk()
}
