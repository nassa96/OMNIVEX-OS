/**
 * =========================================
 * OMNIVEX MARKET FEED v2 (NO GEO BLOCKS)
 * Coinbase primary + safe fallback
 * =========================================
 */

const WebSocket = require("ws");

let latestTick = {
  symbol: "BTC-USD",
  price: 0,
  ts: Date.now(),
  source: "init"
};

let ws = null;

// =========================================================
// COINBASE STREAM (SAFE IN US)
// =========================================================

function connectCoinbase(onTick) {
  const url = "wss://ws-feed.exchange.coinbase.com";

  ws = new WebSocket(url);

  ws.on("open", () => {
    console.log("[COINBASE] CONNECTED");

    ws.send(JSON.stringify({
      type: "subscribe",
      product_ids: ["BTC-USD"],
      channels: ["matches"]
    }));
  });

  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg);

      if (!data.price) return;

      const tick = {
        symbol: "BTC-USD",
        price: parseFloat(data.price),
        ts: Date.now(),
        source: "coinbase"
      };

      latestTick = tick;

      if (onTick) onTick(tick);
    } catch (e) {}
  });

  ws.on("close", () => {
    console.log("[COINBASE] DISCONNECTED — retrying");

    setTimeout(() => connectCoinbase(onTick), 3000);
  });

  ws.on("error", () => {
    ws.close();
  });
}

// =========================================================
// SAFE FALLBACK (ONLY IF EVERYTHING FAILS)
// =========================================================

function fallbackLoop(onTick) {
  console.log("[FALLBACK] using synthetic feed");

  setInterval(() => {
    const drift = (Math.random() - 0.5) * 50;

    const tick = {
      symbol: "BTC-USD",
      price: 65000 + drift,
      ts: Date.now(),
      source: "fallback"
    };

    latestTick = tick;

    if (onTick) onTick(tick);
  }, 1500);
}

// =========================================================

function connect(onTick) {
  try {
    connectCoinbase(onTick);
  } catch (e) {
    fallbackLoop(onTick);
  }
}

function getLatest() {
  return latestTick;
}

module.exports = {
  connect,
  getLatest
};
