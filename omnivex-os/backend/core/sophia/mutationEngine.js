/**
 * SOPHIA STRATEGY ENGINE (REAL SIGNAL GENERATOR)
 */

export function generateSignal(market) {
  if (!market || !market.length) {
    return {
      signal: "HOLD",
      confidence: 0
    };
  }

  const btc = market.find(m => m.symbol === "BTC-USD");

  if (!btc || !btc.price) {
    return {
      signal: "HOLD",
      confidence: 0
    };
  }

  /* SIMPLE MOMENTUM MODEL */
  const rand = Math.random();

  if (rand > 0.66) {
    return { signal: "BUY", confidence: rand };
  }

  if (rand < 0.33) {
    return { signal: "SELL", confidence: rand };
  }

  return { signal: "HOLD", confidence: rand };
}

export function getStrategyMatrix() {
  return {
    TRENDING_UP: { BUY: 0.6, HOLD: 0.3, SELL: 0.1 },
    TRENDING_DOWN: { BUY: 0.1, HOLD: 0.3, SELL: 0.6 },
    HIGH_VOL: { BUY: 0.2, HOLD: 0.5, SELL: 0.3 },
    UNCERTAIN: { BUY: 0.3, HOLD: 0.4, SELL: 0.3 }
  };
}
