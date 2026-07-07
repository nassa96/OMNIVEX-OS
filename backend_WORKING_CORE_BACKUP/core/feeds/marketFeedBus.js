"use strict";

/**
 * ==============================
 * CANONICAL MARKET FEED BUS
 * SINGLE SOURCE OF TRUTH FOR MARKET DATA
 * ==============================
 */

import { runtimeTick } from "../kernel/runtimeKernel.js";
import chronicle from "../chronicle/ledger.js";

let kernelRef = null;

/**
 * Attach kernel runtime
 */
export function attachKernel(kernel) {
  kernelRef = kernel;
}

/**
 * Normalize ANY incoming feed into canonical market format
 */
function normalize(raw) {
  return {
    price: Number(raw.price || raw.p || 0),
    symbol: raw.symbol || "UNKNOWN",
    volume: Number(raw.volume || raw.v || 0),
    timestamp: Date.now(),
    source: raw.source || "ws"
  };
}

/**
 * MAIN ENTRY: WebSocket / Feed ingestion
 */
export async function onMarketData(rawTick) {
  const market = normalize(rawTick);

  // log raw ingestion (pre-kernel memory)
  chronicle.record({
    type: "MARKET_FEED",
    market
  });

  if (!kernelRef) {
    throw new Error("[FEED_BUS] Kernel not attached");
  }

  // SINGLE ENTRY INTO SYSTEM
  return await runtimeTick(market);
}

/**
 * SAFE STREAM WRAPPER
 */
export function stream(handler) {
  return async (rawTick) => {
    try {
      const result = await onMarketData(rawTick);
      if (handler) handler(result);
      return result;
    } catch (err) {
      chronicle.record({
        type: "FEED_ERROR",
        error: err.message
      });
      throw err;
    }
  };
}

export default {
  attachKernel,
  onMarketData,
  stream
};
