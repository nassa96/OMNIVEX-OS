const WebSocket = require("ws");
const bus = require("../../kernel/bus/eventBus.cjs");

class CoinbaseWS {

  constructor(product = "BTC-USD") {
    this.product = product;
    this.ws = null;
  }

  connect() {
    const url = "wss://ws-feed.exchange.coinbase.com";

    console.log("[COINBASE] Connecting...");

    this.ws = new WebSocket(url);

    this.ws.on("open", () => {
      console.log("[COINBASE] Connected");

      this.ws.send(JSON.stringify({
        type: "subscribe",
        product_ids: [this.product],
        channels: ["level2"]
      }));
    });

    this.ws.on("message", (data) => {
      const json = JSON.parse(data.toString());

      if (!json.bids || !json.asks) return;

      const tick = this._normalize(json);

      bus.emitEvent("MARKET_TICK", tick);
    });

    this.ws.on("close", () => {
      console.log("[COINBASE] Disconnected");
    });

    this.ws.on("error", (err) => {
      console.log("[COINBASE ERROR]", err.message);
    });
  }

  _normalize(data) {
    const bids = (data.bids || []).map(x => parseFloat(x[0]));
    const asks = (data.asks || []).map(x => parseFloat(x[0]));

    return {
      source: "coinbase",
      symbol: "BTC",
      bids,
      asks,
      ts: Date.now()
    };
  }
}

module.exports = CoinbaseWS;
