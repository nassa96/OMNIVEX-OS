"use strict";

import binance from "../execution/adapters/binanceAdapter.js";
import { runTick } from "../kernel/runtime/runtimeKernel.js";

let running = false;

/**
 * ==========================
 * START LIVE MARKET STREAM
 * ==========================
 */
export function startStream() {
  running = true;

  binance.connectMarketStream("btcusdt", (tick) => {
    if (!running) return;

    const signal = {
      symbol: tick.symbol,
      change: tick.price,
      volume: tick.volume,
      micro: {
        spread: 0,
        imbalance: 0
      },
      meta: {
        source: "BINANCE",
        price: tick.price
      }
    };

    runTick(signal);
  });

  console.log("[FEED] BINANCE LIVE STREAM ACTIVE");
}

/**
 * STOP STREAM
 */
export function stopStream() {
  running = false;
  binance.disconnect();
}

export default {
  startStream,
  stopStream
};
