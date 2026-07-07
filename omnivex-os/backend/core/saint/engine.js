import { recordEvent } from "../chronicle/chronicle.js";

/**
 * SAINT EXECUTION ENGINE
 * Stateless execution layer
 */

export function execute(signal, approved, price, symbol = "BTC-USD") {
  const execution = {
    type: "EXECUTION",
    symbol,
    signal,
    price,
    approved,
    ts: Date.now(),
    status: approved ? "EXECUTED" : "REJECTED"
  };

  recordEvent({
    type: "EXECUTION",
    symbol,
    payload: execution
  });

  return execution;
}
