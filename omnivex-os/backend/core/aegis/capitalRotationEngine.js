/**
 * AEGIS CAPITAL ROTATION ENGINE
 * -----------------------------
 * PURPOSE:
 * - Dynamically shift capital weight across assets
 * - Based on SOPHIA regime strength
 * - Based on performance feedback (PnL momentum)
 * - Creates portfolio-level intelligence layer
 */

import { getPortfolio } from "./capitalAllocator.js"

/* =========================
   STATE
========================= */

const assetState = {}

/* =========================
   CONFIG
========================= */

const MIN_WEIGHT = 0.1
const MAX_WEIGHT = 0.6

const DEFAULT_ASSETS = ["BTC-USD", "ETH-USD", "SOL-USD"]

/* =========================
   INITIALIZATION
========================= */

function init() {
  for (const asset of DEFAULT_ASSETS) {
    assetState[asset] = {
      weight: 1 / DEFAULT_ASSETS.length,
      regimeScore: 0,
      pnlScore: 0
    }
  }
}

init()

/* =========================
   UPDATE REGIME SCORE
========================= */

export function updateRegimeScore(symbol, regime, confidence) {
  if (!assetState[symbol]) {
    assetState[symbol] = {
      weight: 0.33,
      regimeScore: 0,
      pnlScore: 0
    }
  }

  let score = 0

  switch (regime) {
    case "TREND_UP":
      score = 1
      break
    case "TREND_DOWN":
      score = -1
      break
    case "MEAN_REVERSION":
      score = 0.2
      break
    case "HIGH_VOLATILITY":
      score = -0.5
      break
    case "LOW_VOLATILITY":
      score = 0.3
      break
    default:
      score = 0
  }

  assetState[symbol].regimeScore =
    assetState[symbol].regimeScore * 0.7 + score * confidence
}

/* =========================
   UPDATE PNL SCORE
========================= */

export function updatePnLScore(symbol, pnl) {
  if (!assetState[symbol]) return

  assetState[symbol].pnlScore =
    assetState[symbol].pnlScore * 0.8 + pnl * 0.2
}

/* =========================
   ROTATION ENGINE
========================= */

export function computeWeights() {
  const assets = Object.keys(assetState)

  let totalScore = 0

  const scores = {}

  for (const asset of assets) {
    const state = assetState[asset]

    // combined intelligence score
    const score =
      state.regimeScore * 0.7 +
      state.pnlScore * 0.3

    scores[asset] = score
    totalScore += Math.abs(score)
  }

  for (const asset of assets) {
    const raw = scores[asset]

    let weight =
      totalScore === 0
        ? 1 / assets.length
        : Math.abs(raw) / totalScore

    // clamp weights
    weight = Math.max(MIN_WEIGHT, Math.min(MAX_WEIGHT, weight))

    assetState[asset].weight = weight
  }

  return assetState
}

/* =========================
   GET CURRENT ALLOCATION PLAN
========================= */

export function getAllocationPlan() {
  const weights = computeWeights()

  return Object.entries(weights).map(([symbol, state]) => ({
    symbol,
    weight: state.weight,
    regimeScore: state.regimeScore,
    pnlScore: state.pnlScore
  }))
}

/* =========================
   EXPORT STATE
========================= */

export function getRotationState() {
  return assetState
}
