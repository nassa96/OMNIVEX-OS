"use strict";

/**
 * ==========================================
 * WS MARKET STREAM v1
 * LIVE MARKET INGESTION ENGINE
 * ==========================================
 *
 * This is the ONLY entry point for live market data.
 * Registry controls lifecycle.
 */

import WebSocket from "ws";

/**
 * INTERNAL STATE
 */
let ws = null;
let isConnected = false;

/**
 * NORMALIZE RAW MARKET TICK
 */
function normalize(raw) {
  try {
    return {
      symbol: raw?.s || "UNKNOWN",
      price: parseFloat(raw?.p || 0),
      volume: parseFloat(raw?.v || 0),
      change: parseFloat(raw?.c || 0),
      volatility: Math.random() * 0.05, // placeholder regime proxy
      spread: Math.random() * 0.01,
      ts: Date.now()
    };
  } catch (err) {
    return null;
  }
}

/**
 * START MARKET STREAM
 */
export function createMarketStream(onTick) {
  if (!onTick) {
    throw new Error("[WS] onTick handler required");
  }

  console.log("[WS] INIT MARKET STREAM...");

  // Example public crypto feed (replace with Binance/Coinbase/etc)
  ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

  ws.on("open", () => {
    isConnected = true;
    console.log("[WS] CONNECTED TO MARKET FEED");
  });

  ws.on("message", (data) => {
    try {
      const raw = JSON.parse(data.toString());
      const tick = normalize(raw);

      if (!tick) return;

      onTick(tick);
    } catch (err) {
      console.error("[WS] PARSE ERROR", err.message);
    }
  });

  ws.on("close", () => {
    isConnected = false;
    console.log("[WS] DISCONNECTED");
  });

  ws.on("error", (err) => {
    console.error("[WS] ERROR", err.message);
  });

  return {
    close: () => {
      if (ws) ws.close();
    },
    status: () => ({
      connected: isConnected
    })
  };
}

export default {
  createMarketStream
};
