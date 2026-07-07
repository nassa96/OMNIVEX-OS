/**
 * AEGIS CROSS-ASSET CAPITAL NETTING ENGINE v1
 * -------------------------------------------
 * PURPOSE:
 * - Aggregate portfolio exposure across assets
 * - Net correlated positions
 * - Prevent overexposure across correlated markets
 * - Feed capital rotation pressure signals
 */

/* =========================
   GLOBAL PORTFOLIO STATE
========================= */

const portfolio = {
  capital: 100000, // synthetic base capital
  positions: {},
  exposure: {},
  pnl: 0
}

/* =========================
   CORRELATION MATRIX (SIMPLIFIED MODEL)
========================= */

const correlation = {
  BTC: { ETH: 0.85, SOL: 0.75 },
  ETH: { BTC: 0.85, SOL: 0.65 },
  SOL: { BTC: 0.75, ETH: 0.65 }
}

/* =========================
   UPDATE POSITION
========================= */

export function updatePosition(symbol, size, pnl = 0) {
  if (!portfolio.positions[symbol]) {
    portfolio.positions[symbol] = { size: 0, pnl: 0 }
  }

  portfolio.positions[symbol].size += size
  portfolio.positions[symbol].pnl += pnl

  recomputeExposure()
}

/* =========================
   EXPOSURE ENGINE
========================= */

function recomputeExposure() {
  portfolio.exposure = {}

  for (const symA of Object.keys(portfolio.positions)) {
    const posA = portfolio.positions[symA]

    let adjusted = posA.size

    for (const symB of Object.keys(portfolio.positions)) {
      if (symA === symB) continue

      const corr = getCorrelation(symA, symB)
      const posB = portfolio.positions[symB]

      // net exposure compression
      adjusted += posB.size * corr * 0.5
    }

    portfolio.exposure[symA] = adjusted
  }
}

/* =========================
   CORRELATION LOOKUP
========================= */

function getCorrelation(a, b) {
  if (correlation[a] && correlation[a][b]) return correlation[a][b]
  return 0.2 // weak default correlation
}

/* =========================
   CAPITAL ALLOCATION SCORE
========================= */

export function allocationPressure(symbol) {
  const exposure = portfolio.exposure[symbol] || 0
  const capitalUsed = Math.abs(exposure) * 10000

  const utilization = capitalUsed / portfolio.capital

  return Math.min(1, utilization)
}

/* =========================
   AVAILABLE CAPITAL
========================= */

export function availableCapital(symbol, riskCap = 0.1) {
  const pressure = allocationPressure(symbol)

  const available = portfolio.capital * riskCap * (1 - pressure)

  return Math.max(0, available)
}

/* =========================
   PnL FEEDBACK LOOP
========================= */

export function registerPnL(symbol, pnl) {
  if (!portfolio.positions[symbol]) {
    portfolio.positions[symbol] = { size: 0, pnl: 0 }
  }

  portfolio.positions[symbol].pnl += pnl
  portfolio.pnl += pnl
}

/* =========================
   CAPITAL ROTATION SIGNAL
========================= */

export function rotationSignal() {
  const signals = {}

  for (const sym of Object.keys(portfolio.positions)) {
    const pnl = portfolio.positions[sym].pnl
    const exposure = portfolio.exposure[sym] || 0

    signals[sym] = pnl * 0.7 - exposure * 0.3
  }

  return signals
}

/* =========================
   PORTFOLIO STATE
========================= */

export function getPortfolioState() {
  return {
    capital: portfolio.capital,
    pnl: portfolio.pnl,
    positions: portfolio.positions,
    exposure: portfolio.exposure
  }
}
