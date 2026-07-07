"use strict";

export function generate({ market }) {
  const volatility = 0.5;
  const strength = market?.price ? 0.6 : 0.3;

  const score = strength - volatility;

  const opportunities = [];

  if (score > 0.1) {
    opportunities.push({
      direction: "BUY",
      strength: score,
      symbol: "BTCUSDT"
    });
  }

  return { score, opportunities };
}

export default { generate };
