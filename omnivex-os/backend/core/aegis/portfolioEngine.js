/**
 * AEGIS PORTFOLIO ENGINE — P&L FEEDBACK LOOP
 * ------------------------------------------
 * Responsibilities:
 * - Mark-to-market equity calculation
 * - Unrealized PnL tracking
 * - Realized PnL updates
 * - Feeding risk + allocator systems
 */

import { getPositionState } from "../saint/executionEngine.js"
import { setEquity } from "./capitalAllocator.js"

/* =========================
   INTERNAL STATE
========================= */

let realizedPnL = 0

/* =========================
   CALCULATE SINGLE POSITION PnL
========================= */

function calcPnL(pos, currentPrice) {
  if (!pos || !pos.entryPrice || !pos.size) return 0

  return (currentPrice - pos.entryPrice) * pos.size
}

/* =========================
   UPDATE PORTFOLIO EQUITY (MAIN LOOP)
========================= */

export function updatePortfolioEquity(priceMap = {}) {
  let unrealizedPnL = 0

  const symbols = Object.keys(priceMap)

  for (const symbol of symbols) {
    const pos = getPositionState(symbol)

    if (!pos || pos.state === "FLAT") continue

    const price = priceMap[symbol]
    if (!price) continue

    unrealizedPnL += calcPnL(pos, price)
  }

  const totalEquity =
    1000 + // base capital (can later be dynamic exchange balance)
    realizedPnL +
    unrealizedPnL

  setEquity(totalEquity)

  return {
    equity: totalEquity,
    realizedPnL,
    unrealizedPnL
  }
}

/* =========================
   REALIZED PnL UPDATE (ON CLOSE)
========================= */

export function registerRealizedPnL(pnl) {
  if (typeof pnl !== "number") return

  realizedPnL += pnl
}
