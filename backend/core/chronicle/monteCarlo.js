"use strict";

/**
 * ==========================================
 * MONTE CARLO MARKET FORESIGHT ENGINE v1
 * MULTI-PATH FUTURE SIMULATION SYSTEM
 * ==========================================
 */

/**
 * GENERATE FUTURE PRICE PATHS
 */
function generatePaths(market, steps = 10, simulations = 50) {
  const paths = [];

  const basePrice = market.price || 100;
  const volatility = market.volatility || 0.02;

  for (let i = 0; i < simulations; i++) {
    let price = basePrice;
    const path = [price];

    for (let t = 0; t < steps; t++) {
      const shock = (Math.random() - 0.5) * volatility * price;
      price = Math.max(0.01, price + shock);
      path.push(price);
    }

    paths.push(path);
  }

  return paths;
}

/**
 * ANALYZE PATH OUTCOMES
 */
function analyzePaths(paths, decision) {
  let wins = 0;
  let losses = 0;
  let totalReturn = 0;

  for (const path of paths) {
    const start = path[0];
    const end = path[path.length - 1];

    let pnl = 0;

    if (decision.action === "BUY") {
      pnl = end - start;
    } else if (decision.action === "SELL") {
      pnl = start - end;
    }

    totalReturn += pnl;

    if (pnl > 0) wins++;
    else losses++;
  }

  return {
    winRate: wins / paths.length,
    expectedReturn: totalReturn / paths.length,
    samples: paths.length
  };
}

/**
 * FINAL FORECAST SCORE
 */
function scoreForecast(analysis) {
  return (
    analysis.winRate * 0.7 +
    Math.tanh(analysis.expectedReturn) * 0.3
  );
}

export default {
  generatePaths,
  analyzePaths,
  scoreForecast
};
