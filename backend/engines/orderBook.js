/**
 * ORDER BOOK SIMULATOR V1
 * Creates synthetic market depth for UI + signal enrichment
 */

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

/* =========================
   BUILD DEPTH LEVELS
========================= */
function buildLevels(midPrice) {
  const levels = [];

  for (let i = 1; i <= 10; i++) {
    const spreadOffset = i * rand(0.5, 2.5);

    levels.push({
      bid: +(midPrice - spreadOffset).toFixed(2),
      ask: +(midPrice + spreadOffset).toFixed(2),
      size: +rand(0.5, 5).toFixed(2)
    });
  }

  return levels;
}

/* =========================
   MARKET PRESSURE CALC
========================= */
function calculateImbalance(levels) {
  let bidPressure = 0;
  let askPressure = 0;

  for (const l of levels) {
    bidPressure += l.size;
    askPressure += l.size * rand(0.8, 1.2);
  }

  const total = bidPressure + askPressure;

  return {
    bidPressure,
    askPressure,
    imbalance: (bidPressure - askPressure) / total
  };
}

/* =========================
   MAIN EXPORT
========================= */
export function runOrderBook(price) {
  const levels = buildLevels(price);
  const pressure = calculateImbalance(levels);

  return {
    type: "ORDER_BOOK",
    mid: price,
    levels,
    pressure,
    signalBias:
      pressure.imbalance > 0.15
        ? "BUY_PRESSURE"
        : pressure.imbalance < -0.15
        ? "SELL_PRESSURE"
        : "NEUTRAL"
  };
}
