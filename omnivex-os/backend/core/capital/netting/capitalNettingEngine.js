/**
 * CROSS-ASSET CAPITAL NETTING ENGINE v1
 * --------------------------------------
 * PURPOSE:
 * - Aggregate portfolio exposure across all assets
 * - Net correlated positions
 * - Provide true capital usage map
 */

import { getAllPositions } from "../../saint/executionEngine.js"

/* =========================
   CORRELATION MATRIX (SIMPLIFIED)
========================= */

const correlationMap = {
  BTC: { ETH: 0.85, SOL: 0.75 },
  ETH: { BTC: 0.85, SOL: 0.65 },
  SOL: { BTC: 0.75, ETH: 0.65 }
}

/* =========================
   GET CORRELATION
========================= */

function getCorrelation(a, b) {
  if (a === b) return 1
  return correlationMap[a]?.[b] || 0.2
}

/* =========================
   BUILD EXPOSURE MAP
========================= */

function buildExposureMap(positions) {
  const map = {}

  for (const p of positions) {
    if (!p?.symbol) continue

    if (!map[p.symbol]) {
      map[p.symbol] = 0
    }

    map[p.symbol] += p.size || 0
  }

  return map
}

/* =========================
   NETTING ENGINE
========================= */

export function computeNetExposure() {
  const positions = getAllPositions()

  const exposureMap = buildExposureMap(positions)

  const net = {}
  const adjusted = {}

  const symbols = Object.keys(exposureMap)

  for (const sym of symbols) {
    let netExposure = exposureMap[sym]

    for (const other of symbols) {
      if (sym === other) continue

      const corr = getCorrelation(sym, other)

      const otherExposure = exposureMap[other] || 0

      // correlation-weighted exposure reduction
      netExposure -= otherExposure * corr * 0.5
    }

    net[sym] = exposureMap[sym]
    adjusted[sym] = Math.max(0, netExposure)
  }

  return {
    rawExposure: net,
    netExposure: adjusted
  }
}

/* =========================
   PORTFOLIO RISK SCORE
========================= */

export function getPortfolioRisk() {
  const { rawExposure, netExposure } = computeNetExposure()

  let totalRaw = 0
  let totalNet = 0

  for (const k in rawExposure) {
    totalRaw += Math.abs(rawExposure[k])
  }

  for (const k in netExposure) {
    totalNet += Math.abs(netExposure[k])
  }

  const riskInflation = totalNet / (totalRaw || 1)

  return {
    totalRawExposure: totalRaw,
    totalNetExposure: totalNet,
    riskInflation,
    riskState:
      riskInflation > 1.2
        ? "OVEREXPOSED"
        : riskInflation < 0.7
        ? "UNDERUTILIZED"
        : "BALANCED"
  }
}

/* =========================
   CAPITAL REALLOCATION SIGNAL
========================= */

export function getRebalanceSignal() {
  const risk = getPortfolioRisk()

  if (risk.riskState === "OVEREXPOSED") {
    return {
      action: "REDUCE_CORRELATED_EXPOSURE",
      intensity: 0.7
    }
  }

  if (risk.riskState === "UNDERUTILIZED") {
    return {
      action: "INCREASE_CAPITAL_DEPLOYMENT",
      intensity: 0.4
    }
  }

  return {
    action: "NO_ACTION",
    intensity: 0
  }
}
