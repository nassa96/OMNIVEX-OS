require("dotenv").config();
const WebSocket = require("ws");

/**
 * SAINT V52 — BINANCE US ORDERBOOK STREAM
 * - Level 2 depth tracking
 * - No API key needed for public streams
 */

class BinanceUSWSV52 {

  constructor(bus) {
    this.bus = bus;
    this.ws = null;

    this.orderbook = {
      bids: [],
      asks: []
    };
  }

  connect() {

    // Binance US public depth stream
    this.ws = new WebSocket(
      "wss://stream.binance.us:9443/ws/ethusd@depth10@100ms"
    );

    this.ws.on("message", (msg) => {

      try {

        const data = JSON.parse(msg);

        if (!data.bids || !data.asks) return;

        this.orderbook = {
          bids: data.bids,
          asks: data.asks
        };

        const bestBid = parseFloat(data.bids[0][0]);
        const bestAsk = parseFloat(data.asks[0][0]);

        const mid = (bestBid + bestAsk) / 2;
        const spread = bestAsk - bestBid;

        this.bus.updatePrice("ETH-USD", mid, "BINANCE_US");

        this.bus.state.liquidity["ETH-USD"] = {
          spread,
          bestBid,
          bestAsk,
          imbalance: this.computeImbalance()
        };

      } catch (e) {}
    });

    this.ws.on("error", (err) => {
      console.log("[BINANCE US WS ERROR]", err.message);
    });
  }

  computeImbalance() {

    const bids = this.orderbook.bids;
    const asks = this.orderbook.asks;

    const bidVol = bids.reduce((a, b) => a + parseFloat(b[1]), 0);
    const askVol = asks.reduce((a, b) => a + parseFloat(b[1]), 0);

    return (bidVol - askVol) / (bidVol + askVol + 1e-9);
  }
}

module.exports = BinanceUSWSV52;
