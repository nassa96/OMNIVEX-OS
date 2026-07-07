/**
 * LIQUIDITY + ORDER BOOK MODEL v1
 * -------------------------------
 * PURPOSE:
 * - Estimate execution quality
 * - Simulate slippage risk
 * - Provide liquidity scoring for AURIN/SAINT
 */

const bookState = new Map()

/* =========================
   UPDATE BOOK STATE (SIMULATED)
========================= */

export function updateOrderBook(symbol, price, volume = 1) {
  const prev = bookState.get(symbol) || {
    price,
    volume: 0,
    spread: 0.0005,
    depth: []
  }

  const volatilityImpact = Math.random() * 0.002

  const updated = {
    price,
    volume: prev.volume + volume,
    spread: Math.max(0.0002, prev.spread + volatilityImpact),
    depth: [...prev.depth, volume].slice(-20)
  }

  bookState.set(symbol, updated)

  return updated
}

/* =========================
   LIQUIDITY SCORE
========================= */

export function getLiquidityScore(symbol) {
  const book = bookState.get(symbol)

  if (!book) return 0.5

  const avgDepth =
    book.depth.reduce((a, b) => a + b, 0) / book.depth.length

  const spreadPenalty = book.spread * 100

  const score =
    Math.max(0.1, Math.min(1.0, avgDepth / 10 - spreadPenalty))

  return score
}

/* =========================
   SLIPPAGE ESTIMATE
========================= */

export function estimateSlippage(symbol, size) {
  const book = bookState.get(symbol)

  if (!book) return size * 0.001

  const liquidity = getLiquidityScore(symbol)

  const baseSlippage = book.spread * size

  const depthPenalty = size > 1 ? size * 0.002 : 0

  const liquidityPenalty = (1 - liquidity) * size * 0.01

  return baseSlippage + depthPenalty + liquidityPenalty
}

/* =========================
   EXECUTION MODE SELECTOR
========================= */

export function getExecutionMode(symbol, size) {
  const liquidity = getLiquidityScore(symbol)

  if (liquidity > 0.8) return "PASSIVE"
  if (liquidity > 0.5) return "NORMAL"
  return "AGGRESSIVE"
}

/* =========================
   SNAPSHOT
========================= */

export function getBook(symbol) {
  return bookState.get(symbol)
}
