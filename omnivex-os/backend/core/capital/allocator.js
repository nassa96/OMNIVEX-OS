/**
 * CAPITAL ALLOCATOR v3
 * --------------------
 * Dynamic portfolio allocation engine
 * Driven by:
 * - performance
 * - regime
 * - netting engine rebalance signals
 */

import {
  getRebalanceSignal
} from "./netting/capitalNettingEngine.js"

/* =========================
   STATE
========================= */

const allocations = new Map()

const performance = new Map()

const DEFAULT_WEIGHT = 0.10

/* =========================
   INITIALIZE
========================= */

function ensureSymbol(symbol) {
  if (!allocations.has(symbol)) {
    allocations.set(symbol, DEFAULT_WEIGHT)
  }

  if (!performance.has(symbol)) {
    performance.set(symbol, 0)
  }
}

/* =========================
   GET ALLOCATION
========================= */

export function getAllocation(symbol) {
  ensureSymbol(symbol)
  return allocations.get(symbol)
}

/* =========================
   PERFORMANCE UPDATE
========================= */

export function updatePerformance(symbol, pnl) {
  ensureSymbol(symbol)

  const prev = performance.get(symbol)

  performance.set(
    symbol,
    (prev * 0.9) + (pnl * 0.1)
  )
}

/* =========================
   REBALANCE ENGINE
========================= */

export function rotateCapital() {
  const signal = getRebalanceSignal()

  const symbols = [...allocations.keys()]

  if (symbols.length === 0) {
    return
  }

  /* -------------------------
     REDUCE CORRELATED RISK
  ------------------------- */

  if (
    signal.action ===
    "REDUCE_CORRELATED_EXPOSURE"
  ) {
    for (const symbol of symbols) {
      const current = allocations.get(symbol)

      allocations.set(
        symbol,
        Math.max(
          0.02,
          current * (1 - signal.intensity * 0.25)
        )
      )
    }

    console.log(
      "🔻 CAPITAL REALLOCATION:",
      signal.action
    )

    return
  }

  /* -------------------------
     INCREASE DEPLOYMENT
  ------------------------- */

  if (
    signal.action ===
    "INCREASE_CAPITAL_DEPLOYMENT"
  ) {
    for (const symbol of symbols) {
      const current = allocations.get(symbol)

      allocations.set(
        symbol,
        Math.min(
          0.25,
          current * (1 + signal.intensity * 0.25)
        )
      )
    }

    console.log(
      "📈 CAPITAL REALLOCATION:",
      signal.action
    )

    return
  }
}

/* =========================
   WINNER ROTATION
========================= */

export function allocateToStrength() {
  const ranked = [...performance.entries()]
    .sort((a, b) => b[1] - a[1])

  if (ranked.length === 0) {
    return
  }

  const leader = ranked[0][0]

  for (const [symbol] of ranked) {
    if (symbol === leader) {
      allocations.set(
        symbol,
        Math.min(
          0.25,
          getAllocation(symbol) + 0.02
        )
      )
    } else {
      allocations.set(
        symbol,
        Math.max(
          0.02,
          getAllocation(symbol) - 0.01
        )
      )
    }
  }

  console.log(
    "🏆 CAPITAL ROTATED TO:",
    leader
  )
}

/* =========================
   DEBUG
========================= */

export function getAllocationState() {
  return Object.fromEntries(
    allocations.entries()
  )
}
