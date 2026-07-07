/**
 * REGIME PREDICTION ENGINE (HEURISTIC v1)
 */

function predictRegime(tick, history = []) {

  const volatility = Math.abs(Math.sin(tick.price)) * 100;

  const trend = history.length > 5
    ? tick.price > history[history.length - 1].price
    : true;

  if (volatility > 70) return "VOLATILE";
  if (trend) return "TREND_UP";
  if (!trend) return "TREND_DOWN";

  return "CHOP";
}

module.exports = {
  predictRegime
};
