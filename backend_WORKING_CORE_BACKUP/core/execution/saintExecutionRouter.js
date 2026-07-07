import { BinanceAdapter } from "./adapters/binanceAdapter.js";
import { recordFill } from "./fillMemory.js";
import { updateExecutionLearning } from "../learning/executionLearner.js";
import { shouldExecute } from "./executionOptimizer.js";

const binance = new BinanceAdapter();

/**
 * SAINT v10 Execution Router
 * REAL exchange execution abstraction layer
 */

await binance.connect();

export async function executeOrder(order) {
  const decision = order?.decision || {};
  const positionSize = order?.positionSize || 0;

  const gate = shouldExecute({
    decision,
    positionSize
  });

  if (!gate.allow) {
    return {
      status: "BLOCKED",
      reason: gate.reason,
      score: gate.score
    };
  }

  // -----------------------------
  // BUILD EXCHANGE ORDER
  // -----------------------------
  const exchangeOrder = {
    symbol: order.market?.symbol || "BTCUSDT",
    side: decision.action || "BUY",
    size: positionSize
  };

  // -----------------------------
  // PLACE ORDER
  // -----------------------------
  const placed = await binance.placeOrder(exchangeOrder);

  // -----------------------------
  // SIMULATE FILL CONFIRMATION LOOP
  // -----------------------------
  const status = await binance.getOrderStatus(placed.orderId);

  // -----------------------------
  // RECORD FILL
  // -----------------------------
  const fill = recordFill({
    symbol: exchangeOrder.symbol,
    side: exchangeOrder.side,
    intendedPrice: decision.price || 50000,
    filledPrice: status.filledPrice,
    positionSize,
    executionScore: gate.score,
    status: status.status
  });

  // -----------------------------
  // UPDATE LEARNING LOOP
  // -----------------------------
  const learning = updateExecutionLearning();

  return {
    status: "EXECUTED",
    exchange: "BINANCE",
    order: placed,
    fill,
    learning,
    gate
  };
}
