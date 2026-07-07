const WebSocket = require("ws");
const bus = require("../../kernel/bus/eventBus.cjs");

class BinanceWS {

  constructor(symbol = "btcusdt") {
    this.symbol = symbol;
    this.ws = null;
  }

  connect() {
    const url = `wss://stream.binance.com:9443/ws/${this.symbol}@depth@100ms`;

    console.log("[BINANCE] Connecting:", url);

    this.ws = new WebSocket(url);

    this.ws.on("open", () => {
      console.log("[BINANCE] Connected");
    });

    this.ws.on("message", (data) => {
      const json = JSON.parse(data.toString());

      const tick = this._normalize(json);

      bus.emitEvent("MARKET_TICK", tick);
    });

    this.ws.on("close", () => {
      console.log("[BINANCE] Disconnected");
    });

    this.ws.on("error", (err) => {
      console.log("[BINANCE ERROR]", err.message);
    });
  }

  _normalize(data) {
    const bids = (data.b || []).map(x => parseFloat(x[0]));
    const asks = (data.a || []).map(x => parseFloat(x[0]));

    return {
      source: "binance",
      symbol: "BTC",
      bids,
      asks,
      ts: Date.now()
    };
  }
}

module.exports = BinanceWS;
