// ============================================================
// SAINT OMNIVEX — MARKET FEED
// File: core/marketFeed.js
// Real CoinGecko price feed with signal generation and volatility detection.
// Falls back to simulation if API unavailable.
// ============================================================

const COINGECKO_KEY = process.env.COINGECKO_API_KEY || "";
const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

let priceHistory = [];
const HISTORY_LENGTH = 20;

// Fetch live BTC price from CoinGecko
export async function fetchLivePrice() {
  try {
    const url = `${COINGECKO_BASE}/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true`;
    const headers = COINGECKO_KEY
      ? { "x-cg-demo-api-key": COINGECKO_KEY }
      : {};

    const res = await fetch(url, { headers, signal: AbortSignal.timeout(5000) });

    if (!res.ok) throw new Error(`CoinGecko ${res.status}`);

    const data = await res.json();
    const price = data?.bitcoin?.usd;
    const change24h = data?.bitcoin?.usd_24h_change ?? 0;

    if (!price || typeof price !== "number") throw new Error("Invalid price data");

    return { price, change24h, source: "LIVE" };
  } catch (err) {
    // Fallback: simulate realistic price movement from last known price
    const lastPrice = priceHistory.length > 0
      ? priceHistory[priceHistory.length - 1]
      : 77000;
    const delta = (Math.random() - 0.5) * 200;
    const price = Math.max(10000, lastPrice + delta);
    return { price, change24h: 0, source: "SIM" };
  }
}

// Calculate EMA
function ema(prices, period) {
  if (prices.length < period) return null;
  const k = 2 / (period + 1);
  let emaVal = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = period; i < prices.length; i++) {
    emaVal = prices[i] * k + emaVal * (1 - k);
  }
  return emaVal;
}

// Detect volatility level
function detectVolatility(prices) {
  if (prices.length < 5) return "LOW";
  const recent = prices.slice(-5);
  const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const variance = recent.reduce((sum, p) => sum + Math.pow(p - avg, 2), 0) / recent.length;
  const stdDev = Math.sqrt(variance);
  const pct = (stdDev / avg) * 100;
  if (pct > 3) return "EXTREME";
  if (pct > 1.5) return "HIGH";
  if (pct > 0.5) return "MEDIUM";
  return "LOW";
}

// Generate trading signal from price history + external change data
export function generateSignal(price, change24h) {
  priceHistory.push(price);
  if (priceHistory.length > HISTORY_LENGTH) {
    priceHistory.shift();
  }

  const prices = [...priceHistory];
  const volatility = detectVolatility(prices);

  // Need at least 10 data points for meaningful signal
  if (prices.length < 10) {
    return {
      signal: "HOLD",
      confidence: 0,
      risk: "LOW",
      volatility,
      ema9: null,
      ema21: null,
      reason: "ACCUMULATING_DATA"
    };
  }

  const ema9 = ema(prices, 9);
  const ema21 = ema(prices, Math.min(21, prices.length));

  // Momentum factor from 24h change
  const momentumBoost = Math.abs(change24h) > 3 ? 0.05 : 0;
  const momentumDirection = change24h > 0 ? "BUY" : "SELL";

  let signal = "HOLD";
  let baseConfidence = 0;

  if (ema9 && ema21) {
    const spread = ((ema9 - ema21) / ema21) * 100;

    if (spread > 0.15) {
      signal = "BUY";
      baseConfidence = Math.min(0.95, 0.70 + Math.abs(spread) * 0.8);
      if (momentumDirection === "BUY") baseConfidence = Math.min(0.98, baseConfidence + momentumBoost);
    } else if (spread < -0.15) {
      signal = "SELL";
      baseConfidence = Math.min(0.95, 0.70 + Math.abs(spread) * 0.8);
      if (momentumDirection === "SELL") baseConfidence = Math.min(0.98, baseConfidence + momentumBoost);
    } else {
      signal = "HOLD";
      baseConfidence = 0.3 + Math.random() * 0.2;
    }
  }

  // Volatility adjusts risk
  let risk = "LOW";
  if (volatility === "EXTREME") risk = "HIGH";
  else if (volatility === "HIGH" && baseConfidence < 0.85) risk = "HIGH";
  else if (volatility === "MEDIUM") risk = "MEDIUM";

  return {
    signal,
    confidence: parseFloat(baseConfidence.toFixed(4)),
    risk,
    volatility,
    ema9: ema9 ? parseFloat(ema9.toFixed(2)) : null,
    ema21: ema21 ? parseFloat(ema21.toFixed(2)) : null
  };
}

export function getPriceHistory() {
  return [...priceHistory];
}

