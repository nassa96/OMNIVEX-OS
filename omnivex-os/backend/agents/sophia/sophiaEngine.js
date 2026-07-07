const { getLearningBias } = require("../../chronicle/learningEngine");

function generateSignal(market) {
  const bias = getLearningBias();

  let score = 0.5;

  if (market.trend === "BULLISH") score += 0.25;
  if (market.trend === "BEARISH") score -= 0.25;

  const volatility = (market.price % 100) / 100;
  score += volatility * 0.3;

  // 🧠 LEARNING INJECTION
  score += bias.confidenceBoost;

  score = Math.max(0, Math.min(1, score));

  let action = "HOLD";

  if (score > 0.65 * bias.riskTolerance) action = "BUY";
  if (score < 0.35) action = "SELL";

  return {
    type: "sophia.signal",
    action,
    confidence: score,
    symbol: market.symbol,
    trend: market.trend,
    ts: Date.now()
  };
}

module.exports = { generateSignal };
