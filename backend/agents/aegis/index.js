export function runAegis(signal, market) {
  let risk = "LOW";
  let block = false;

  const volatility = Math.abs(market.BTC - market.prevBTC || 0);

  if (volatility > 500) {
    risk = "HIGH";
    block = true;
  }

  if (signal.confidence < 0.3) {
    risk = "HIGH";
    block = true;
  }

  if (signal.signal === "BUY" && risk === "HIGH") {
    block = true;
  }

  return { risk, block };
}
