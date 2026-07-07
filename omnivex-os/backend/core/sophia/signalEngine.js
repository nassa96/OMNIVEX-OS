/**
 * SOPHIA v3 — NORMALIZED REGIME ENGINE
 * ------------------------------------
 * Fixes:
 * - volatility compression bug
 * - regime collapse into LOW_VOLATILITY
 * - lack of cross-asset normalization
 */

const history = {}
const MAX_HISTORY = 100

/* =========================
   HISTORY
========================= */

function push(symbol, price) {
  if (!history[symbol]) history[symbol] = []

  history[symbol].push(price)

  if (history[symbol].length > MAX_HISTORY) {
    history[symbol].shift()
  }
}

/* =========================
   STATS
========================= */

function mean(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

function stddev(arr) {
  const m = mean(arr)
  return Math.sqrt(mean(arr.map(x => (x - m) ** 2)))
}

/* =========================
   NORMALIZED VOLATILITY
========================= */

function volatilityScore(prices) {
  if (prices.length < 10) return 0

  const returns = []

  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1])
  }

  const vol = stddev(returns)

  // normalize into readable range
  return vol * 1000
}

/* =========================
   TREND SCORE
========================= */

function trendScore(prices) {
  if (prices.length < 10) return 0

  const first = prices[0]
  const last = prices[prices.length - 1]

  return (last - first) / first
}

/* =========================
   REGIME CLASSIFIER v3
========================= */

function classify(prices) {
  const vol = volatilityScore(prices)
  const trend = trendScore(prices)

  if (vol > 25) return "HIGH_VOLATILITY"
  if (vol < 8) return "LOW_VOLATILITY"

  if (trend > 0.008) return "TREND_UP"
  if (trend < -0.008) return "TREND_DOWN"

  return "MEAN_REVERSION"
}

/* =========================
   SIGNAL MAPPING v3
========================= */

function signalMap(regime, price, prices) {
  const avg = mean(prices)

  switch (regime) {
    case "TREND_UP":
      return { signal: "BUY", confidence: 0.75 }

    case "TREND_DOWN":
      return { signal: "SELL", confidence: 0.75 }

    case "MEAN_REVERSION": {
      const deviation = (price - avg) / avg

      return {
        signal: deviation < 0 ? "BUY" : "SELL",
        confidence: 0.6
      }
    }

    case "HIGH_VOLATILITY":
      return { signal: "HOLD", confidence: 0.25 }

    case "LOW_VOLATILITY":
      return { signal: "HOLD", confidence: 0.45 }

    default:
      return { signal: "HOLD", confidence: 0.3 }
  }
}

/* =========================
   MAIN EXPORT
========================= */

export function runSophia(symbol, price) {
  push(symbol, price)

  const prices = history[symbol]

  const regime = classify(prices)
  const output = signalMap(regime, price, prices)

  return {
    symbol,
    price,
    regime,
    signal: output.signal,
    confidence: output.confidence
  }
}
