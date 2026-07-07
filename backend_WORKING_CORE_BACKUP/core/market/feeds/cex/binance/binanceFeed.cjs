const WebSocket = require("ws");

class BinanceFeed {
  constructor(bus) {
    this.bus = bus;
    this.ws = null;
  }

  start() {
    console.log("[BINANCE FEED] starting...");

    this.ws = new WebSocket("wss://stream.binance.us:9443/ws/btcusdt@trade");

    this.ws.on("message", (raw) => {
      const data = JSON.parse(raw);

      const event = {
        source: "binance",
        symbol: data.s,
        price: Number(data.p),
        volume: Number(data.q),
        change: 0,
        timestamp: Date.now()
      };

      this.bus.publish(event);
    });

    this.ws.on("open", () => {
      console.log("[BINANCE FEED] connected");
    });

    this.ws.on("error", (err) => {
      console.log("[BINANCE FEED ERROR]", err.message);
    });
  }
}

module.exports = BinanceFeed;
