/**
 * =========================================
 * BINANCE MARKET FEED — REAL TIME STREAM
 * No API keys required (public stream)
 * =========================================
 */

const WebSocket = require("ws");

let latestTick = {
  symbol: "BTCUSDT",
  price: 0,
  ts: Date.now(),
  connected: false
};

let ws = null;

function connect(onTick) {
  const url = "wss://stream.binance.com:9443/ws/btcusdt@trade";

  ws = new WebSocket(url);

  ws.on("open", () => {
    latestTick.connected = true;
    console.log("[BINANCE] CONNECTED");
  });

  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg);

      const tick = {
        symbol: "BTCUSDT",
        price: parseFloat(data.p),
        ts: Date.now()
      };

      latestTick = tick;

      if (onTick) onTick(tick);
    } catch (e) {}
  });

  ws.on("close", () => {
    latestTick.connected = false;
    console.log("[BINANCE] DISCONNECTED — RECONNECTING");

    setTimeout(() => connect(onTick), 3000);
  });

  ws.on("error", (err) => {
    console.log("[BINANCE ERROR]", err.message);
  });
}

function getLatest() {
  return latestTick;
}

module.exports = {
  connect,
  getLatest
};
