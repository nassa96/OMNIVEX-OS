/**
 * CHRONICLE v1
 * lightweight memory + adaptive bias engine
 */

let ledger = [];
let bias = 0.0; // -1 bearish, +1 bullish

function record(entry) {
  ledger.push(entry);

  // simple adaptive bias update
  const recent = ledger.slice(-20);

  let score = 0;
  for (const e of recent) {
    if (e.signal?.signal === "BUY") score += 1;
    if (e.signal?.signal === "SELL") score -= 1;
  }

  bias = score / Math.max(recent.length, 1);
}

function getBias() {
  return bias;
}

function getLedger() {
  return ledger;
}

module.exports = {
  record,
  getBias,
  getLedger
};
