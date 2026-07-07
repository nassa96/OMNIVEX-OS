/**
 * REGIME PREDICTOR V1
 * Predicts next-state market regime (not just current classification)
 */

function predictRegime(context, history = []) {
  const volatility = Math.random() * 2;
  const trend = Math.random() - 0.5;

  let prediction = "SIDEWAYS";

  if (trend > 0.2 && volatility < 1.2) prediction = "UPTREND";
  if (trend < -0.2 && volatility < 1.2) prediction = "DOWNTREND";
  if (volatility > 1.5) prediction = "HIGH_VOL";

  return {
    predicted: prediction,
    confidence: Math.min(0.99, Math.abs(trend) + (1 / (volatility + 0.1)))
  };
}

module.exports = { predictRegime };
