/**
 * MEMECOIN EARLY DETECTION ENGINE V1
 * Detects speculative regime shifts before breakout
 */

export function detectMemecoinSignal(symbol, price, prev, history = []) {
  const velocity = (price - prev) / prev;
  const volatility = Math.abs(velocity);

  const acceleration =
    history.length > 2
      ? velocity - history[history.length - 1]
      : 0;

  const spikeScore =
    Math.abs(velocity) * 0.6 +
    Math.abs(acceleration) * 0.4;

  let label = "NONE";

  if (spikeScore > 0.08) label = "EARLY_MEME";
  if (spikeScore > 0.15) label = "HIGH_SPECULATION";
  if (spikeScore > 0.25) label = "PUMP_RISK";

  return {
    symbol,
    velocity,
    acceleration,
    spikeScore,
    label
  };
}
