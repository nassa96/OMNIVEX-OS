const WebSocket = require("ws");
const EventEmitter = require("events");

class BinanceWS extends EventEmitter {
  constructor(symbol = "btcusdt") {
    super();
    this.symbol = symbol.toLowerCase();
    this.ws = null;
  }

  connect() {
    const url = `wss://stream.binance.com:9443/ws/${this.symbol}@depth@100ms`;

    this.ws = new WebSocket(url);

    this.ws.on("open", () => {
      console.log("[BINANCE WS] connected");
    });

    this.ws.on("message", (raw) => {
      try {
        const data = JSON.parse(raw.toString());

        const book = {
          symbol: this.symbol.toUpperCase(),
          bids: data.bids || [],
          asks: data.asks || [],
          ts: Date.now()
        };

        this.emit("book", book);
      } catch (e) {
        console.log("[BINANCE WS] parse error", e.message);
      }
    });

    this.ws.on("close", () => {
      console.log("[BINANCE WS] closed");
    });

    this.ws.on("error", (err) => {
      console.log("[BINANCE WS] error", err.message);
    });
  }
}

module.exports = BinanceWS;
