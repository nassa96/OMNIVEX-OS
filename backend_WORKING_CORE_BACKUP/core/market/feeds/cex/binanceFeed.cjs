const WebSocket = require("ws");

class BinanceFeed {
  constructor(bus) {
    this.bus = bus;
  }

  start() {
    console.log("[BINANCE FEED] connecting...");

    const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@ticker");

    ws.on("message", (raw) => {
      const data = JSON.parse(raw);

      const normalized = {
        source: "binance",
        symbol: "BTCUSDT",
        price: parseFloat(data.c),
        volume: parseFloat(data.v),
        change: parseFloat(data.P),
        timestamp: Date.now()
      };

      this.bus.publish(normalized);
    });

    ws.on("close", () => {
      console.log("[BINANCE FEED] disconnected");
    });
  }
}

module.exports = BinanceFeed;
