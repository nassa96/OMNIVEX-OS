export async function runDecision(price) {
  const p = Number(price);

  // basic regime logic (safe default engine)
  let signal = "HOLD";
  let confidence = 0.5;

  if (p > 62500) {
    signal = "SELL";
    confidence = 0.72;
  }

  if (p < 60000) {
    signal = "BUY";
    confidence = 0.78;
  }

  return {
    type: "EXECUTION",
    symbol: "BTC-USD",
    signal,
    price: p,
    confidence,
    approved: true,
    status: "EXECUTED",
    ts: Date.now()
  };
}
