const WebSocket = require("ws");

class BinanceAdapter {
  constructor(bus) {
    this.bus = bus;
    this.ws = null;
  }

  connect() {
    const url = "wss://stream.binance.com:9443/ws/btcusdt@depth@100ms";

    this.ws = new WebSocket(url);

    this.ws.on("message", (msg) => {
      const raw = JSON.parse(msg);

      const book = {
        exchange: "binance",
        symbol: "BTC",
        bids: raw.b || [],
        asks: raw.a || [],
        ts: Date.now()
      };

      this.bus.emitBook(book);
    });

    this.ws.on("open", () => {
      console.log("[BINANCE] connected");
    });

    this.ws.on("close", () => {
      console.log("[BINANCE] disconnected");
    });
  }
}

module.exports = BinanceAdapter;
