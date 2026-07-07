/**
 * =========================================================
 * CHRONICLE REPLAY ENGINE v2
 * Real PnL + controlled exposure model
 * =========================================================
 */

const { getLedger } = require("../chronicle/ledger");

function runReplay() {
  const ledger = getLedger();

  let cash = 10000;
  let position = 0;
  let avgEntry = 0;

  const results = [];

  for (const event of ledger) {
    const tick = event.tick;
    const signal = event.signal;

    const price = tick.price;

    // =========================
    // BUY LOGIC
    // =========================
    if (signal.signal === "BUY") {
      if (cash > price) {
        position += 1;
        cash -= price;
        avgEntry = (avgEntry * (position - 1) + price) / position;
      }
    }

    // =========================
    // SELL LOGIC
    // =========================
    if (signal.signal === "SELL") {
      if (position > 0) {
        position -= 1;
        cash += price;
      }
    }

    // =========================
    // EQUITY CALCULATION
    // =========================
    const equity = cash + (position * price);

    results.push({
      price,
      signal: signal.signal,
      cash,
      position,
      equity
    });
  }

  const finalPrice = ledger.length
    ? ledger[ledger.length - 1].tick.price
    : 0;

  const finalEquity = cash + (position * finalPrice);

  return {
    finalEquity,
    cash,
    position,
    steps: results.length,
    trace: results
  };
}

module.exports = { runReplay };
