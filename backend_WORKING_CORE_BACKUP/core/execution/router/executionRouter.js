"use strict";

import { placeOrder } from "../adapters/exchangeAdapter.js";

/**
 * EXECUTION ROUTER
 * Converts decision → execution → exchange adapter
 */

export function route(decision) {
  const intent = {
    symbol: decision.symbol,
    side: decision.decision,
    size: Math.max(0.01, decision.confidence),
    type: "MARKET",
    confidence: decision.confidence,
    ts: Date.now()
  };

  if (decision.confidence < 0.4 || decision.decision === "HOLD") {
    return {
      status: "REJECTED",
      intent
    };
  }

  const result = placeOrder(intent);

  return {
    status: "ROUTED",
    intent,
    result
  };
}

export default { route };
