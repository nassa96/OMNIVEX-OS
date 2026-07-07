/**
 * STREAMCORE ORDER BOOK MODEL v1
 * ------------------------------
 * PURPOSE:
 * - Simulate liquidity depth
 * - Provide market impact estimates
 * - Feed SAINT execution engine
 * - Replace "perfect fill assumption"
 */

const books = {}

/* =========================
   INITIALIZE BOOK
========================= */

function init(symbol) {
  if (books[symbol]) return

  books[symbol] = {
    mid: 0,
    spread: 0.0008, // 8 bps default
    depth: 100000,  // notional liquidity
    volatility: 0.01
  }
}

/* =========================
   UPDATE PRICE FEED
========================= */

export function updateBook(symbol, price, volatility = 0.01) {
  init(symbol)

  const book = books[symbol]

  book.mid = price

  // spread expands with volatility
  book.spread = 0.0005 + volatility * 1.5

  // liquidity shrinks in high vol
  book.depth = 100000 / (1 + volatility * 50)

  book.volatility = volatility
}

/* =========================
   GET MARKET STATE
========================= */

export function getBook(symbol) {
  init(symbol)
  return books[symbol]
}

/* =========================
   MARKET IMPACT MODEL
========================= */

export function estimateImpact(symbol, size) {
  const book = getBook(symbol)

  const relativeSize = size * 100000 / book.depth

  const impact =
    book.spread +
    (relativeSize * relativeSize) * 0.002

  return Math.min(0.05, impact) // cap at 5%
}

/* =========================
   EXECUTION QUALITY SIGNAL
========================= */

export function liquidityScore(symbol, size) {
  const book = getBook(symbol)

  const impact = estimateImpact(symbol, size)

  const depthRatio = (size * 100000) / book.depth

  let score = 1

  if (impact > 0.02) score -= 0.4
  if (impact > 0.03) score -= 0.2
  if (depthRatio > 0.5) score -= 0.3

  return Math.max(0, Math.min(1, score))
}
