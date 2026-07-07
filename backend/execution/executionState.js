/**
 * EXECUTION STATE ENGINE
 * Simulated fill + execution abstraction layer
 */

export function runExecutionEngine(signal, risk) {
  const side =
    signal?.action === "BUY"
      ? "LONG"
      : signal?.action === "SELL"
      ? "SHORT"
      : "FLAT";

  return {
    id: `exec_${Date.now()}`,
    symbol: signal?.symbol || "UNKNOWN",
    side,
    confidence: signal?.confidence || 0.5,
    riskScore: risk?.score || 0,
    status: "EXECUTING"
  };
}

export function simulateFill(execution, price) {
  const slippage = (Math.random() - 0.5) * 0.002;

  const fillPrice = price * (1 + slippage);

  return {
    ...execution,
    status: "FILLED",
    fillPrice,
    slippage,
    timestamp: Date.now()
  };
}
