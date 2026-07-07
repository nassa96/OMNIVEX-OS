const WebSocket = require("ws");

class BinanceWS {

  constructor(symbol = "btcusdt") {
    this.symbol = symbol;
    this.ws = null;
  }

  connect(onUpdate) {

    const url = `wss://stream.binance.com:9443/ws/${this.symbol}@depth@100ms`;

    console.log("[BINANCE WS] connecting...");

    this.ws = new WebSocket(url);

    this.ws.on("open", () => {
      console.log("[BINANCE WS] connected");
    });

    this.ws.on("message", (raw) => {
      try {
        const msg = JSON.parse(raw);

        const market = {
          bids: msg.b?.map(([p,s]) => [parseFloat(p), parseFloat(s)]) || [],
          asks: msg.a?.map(([p,s]) => [parseFloat(p), parseFloat(s)]) || [],
          ts: Date.now()
        };

        onUpdate?.(market);

      } catch (e) {}
    });
  }
}

module.exports = BinanceWS;
