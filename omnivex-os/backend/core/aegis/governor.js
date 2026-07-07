/**
 * AEGIS RISK GOVERNOR v1
 * ----------------------
 * PURPOSE:
 * - Prevent overtrading
 * - Enforce exposure limits
 * - Provide kill-switch + risk gating
 */

const riskState = {
  killSwitch: false,
  maxPositionPerAsset: 0.25,
  maxTotalExposure: 0.60,
  maxTradesPerMinute: 10,
  trades: []
}

/* =========================
   RECORD TRADE
========================= */

export function recordTrade(symbol) {
  const now = Date.now()

  riskState.trades.push({ symbol, time: now })

  // cleanup old trades (1 min window)
  riskState.trades = riskState.trades.filter(
    t => now - t.time < 60000
  )
}

/* =========================
   CHECK TRADE LIMIT
========================= */

export function canTrade(symbol, currentPosition = 0) {
  if (riskState.killSwitch) return false

  const tradesLastMinute = riskState.trades.length

  if (tradesLastMinute >= riskState.maxTradesPerMinute) {
    return false
  }

  if (currentPosition >= riskState.maxPositionPerAsset) {
    return false
  }

  return true
}

/* =========================
   GLOBAL EXPOSURE CHECK
========================= */

export function checkExposure(allPositions = []) {
  const total = allPositions.reduce(
    (sum, p) => sum + (p.size || 0),
    0
  )

  return total < riskState.maxTotalExposure
}

/* =========================
   KILL SWITCH
========================= */

export function triggerKillSwitch() {
  riskState.killSwitch = true
}

export function resetKillSwitch() {
  riskState.killSwitch = false
}

export function getRiskState() {
  return riskState
}
