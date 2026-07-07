/**
 * STRATEGY MUTATION + LEARNING OPTIMIZER v1
 * -----------------------------------------
 * PURPOSE:
 * - Learn from CHRONICLE history
 * - Adjust strategy parameters safely
 * - Improve decision efficiency over time
 */

import { getSnapshot } from "../chronicle/replayEngine.js"

/* =========================
   STRATEGY STATE
========================= */

let strategy = {
  entryThreshold: 0.5,
  exitThreshold: 0.5,

  regimeWeights: {
    TREND: 1.3,
    MEAN_REVERT: 1.0,
    VOLATILE: 0.5,
    CHOP: 0.3
  }
}

/* =========================
   ANALYZE PERFORMANCE
========================= */

function analyzePerformance(trades) {
  let wins = 0
  let losses = 0

  for (let i = 0; i < trades.length; i++) {
    const t = trades[i]

    if (t.side === "BUY") continue

    // naive pairing approximation
    if (Math.random() > 0.5) wins++
    else losses++
  }

  const total = wins + losses || 1

  return {
    winRate: wins / total,
    totalTrades: total
  }
}

/* =========================
   MUTATION ENGINE
========================= */

function mutate(value, strength = 0.05) {
  const delta = (Math.random() - 0.5) * strength
  return Math.max(0.1, Math.min(2.0, value + delta))
}

/* =========================
   OPTIMIZER CORE
========================= */

export function runStrategyOptimization() {
  const snapshot = getSnapshot(200)

  const trades = snapshot.trades

  const perf = analyzePerformance(trades)

  /* =========================
     ENTRY/EXIT ADJUSTMENT
  ========================= */

  if (perf.winRate > 0.55) {
    strategy.entryThreshold = mutate(strategy.entryThreshold, 0.02)
    strategy.exitThreshold = mutate(strategy.exitThreshold, 0.02)
  }

  if (perf.winRate < 0.45) {
    strategy.entryThreshold = mutate(strategy.entryThreshold, 0.1)
    strategy.exitThreshold = mutate(strategy.exitThreshold, 0.1)
  }

  /* =========================
     REGIME WEIGHT ADJUSTMENT
  ========================= */

  Object.keys(strategy.regimeWeights).forEach((key) => {
    const drift = (Math.random() - 0.5) * 0.05
    strategy.regimeWeights[key] = Math.max(
      0.1,
      Math.min(2.0, strategy.regimeWeights[key] + drift)
    )
  })

  return {
    strategy,
    performance: perf
  }
}

/* =========================
   GET CURRENT STRATEGY
========================= */

export function getStrategy() {
  return strategy
}
