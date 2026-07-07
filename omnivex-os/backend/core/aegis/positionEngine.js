/**
 * AEGIS MULTI-ASSET PORTFOLIO ENGINE
 * ----------------------------------
 * Tracks independent positions per symbol:
 * BTC, ETH, SOL, etc.
 */

const portfolio = {
  USDT: 1000,
  positions: {
    // BTC-USD: { side, entryPrice, size }
  }
}

/* ---------------- CONFIG ---------------- */

const TAKE_PROFIT = 0.003
const STOP_LOSS = 0.002

/* ---------------- HELPERS ---------------- */

function getPosition(symbol) {
  if (!portfolio.positions[symbol]) {
    portfolio.positions[symbol] = {
      side: "FLAT",
      entryPrice: null,
      size: 0
    }
  }
  return portfolio.positions[symbol]
}

/* ---------------- ENTRY ---------------- */

export function canEnter(symbol, signal) {
  const pos = getPosition(symbol)
  return pos.side === "FLAT" && signal === "BUY"
}

export function enter(symbol, price, size = 0.05) {
  const pos = getPosition(symbol)

  pos.side = "LONG"
  pos.entryPrice = price
  pos.size = size

  console.log(`🟢 AEGIS OPEN ${symbol} @ ${price}`)
}

/* ---------------- EXIT ---------------- */

export function shouldExit(symbol, price) {
  const pos = getPosition(symbol)

  if (pos.side !== "LONG") return false

  const pnl = (price - pos.entryPrice) / pos.entryPrice

  return pnl >= TAKE_PROFIT || pnl <= STOP_LOSS
}

export function exit(symbol, price) {
  const pos = getPosition(symbol)

  pos.side = "FLAT"
  pos.entryPrice = null

  console.log(`🔴 AEGIS CLOSE ${symbol} @ ${price}`)
}

/* ---------------- STATE ---------------- */

export function getPortfolio() {
  return portfolio
}

export function getPositionState(symbol) {
  return getPosition(symbol)
}
