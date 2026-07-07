const EventEmitter = require("events");
const WebSocket = require("ws");

/**
 * SAINT V13+ ORDERBOOK FEED
 * Unified Binance + Coinbase ingestion layer
 */

class OrderbookFeed extends EventEmitter {
  constructor() {
    super();

    this.wsBinance = null;
    this.wsCoinbase = null;

    this.book = {
      symbol: "BTC",
      bids: new Map(),
      asks: new Map(),
      price: 0,
      ts: Date.now()
    };

    this.reconnectAttempts = 0;
  }

  /**
   * ---------------------------
   * START STREAMS
   * ---------------------------
   */
  connect(onMarket) {
    this.onMarket = onMarket;

    this.connectBinance();
    this.connectCoinbase();

    console.log("[ORDERBOOK] stream started");
  }

  /**
   * ---------------------------
   * BINANCE DEPTH STREAM
   * ---------------------------
   */
  connectBinance() {
    const url = "wss://stream.binance.com:9443/ws/btcusdt@depth@100ms";

    this.wsBinance = new WebSocket(url);

    this.wsBinance.on("open", () => {
      console.log("[BINANCE] connected");
      this.reconnectAttempts = 0;
    });

    this.wsBinance.on("message", (raw) => {
      try {
        const data = JSON.parse(raw);

        const bids = data.bids || [];
        const asks = data.asks || [];

        this.updateBook({
          source: "binance",
          bids,
          asks
        });
      } catch (err) {
        console.error("[BINANCE] parse error", err.message);
      }
    });

    this.wsBinance.on("close", () => {
      console.log("[BINANCE] disconnected, retrying...");
      setTimeout(() => this.connectBinance(), 1000);
    });

    this.wsBinance.on("error", (err) => {
      console.log("[BINANCE] error:", err.message);
    });
  }

  /**
   * ---------------------------
   * COINBASE LEVEL2 STREAM
   * ---------------------------
   */
  connectCoinbase() {
    const url = "wss://ws-feed.exchange.coinbase.com";

    this.wsCoinbase = new WebSocket(url);

    this.wsCoinbase.on("open", () => {
      console.log("[COINBASE] connected");

      this.wsCoinbase.send(JSON.stringify({
        type: "subscribe",
        product_ids: ["BTC-USD"],
        channels: ["level2"]
      }));
    });

    this.wsCoinbase.on("message", (raw) => {
      try {
        const msg = JSON.parse(raw);

        if (msg.type !== "snapshot" && msg.type !== "l2update") return;

        let bids = [];
        let asks = [];

        if (msg.changes) {
          for (const change of msg.changes) {
            const [side, price, size] = change;
            if (side === "buy") bids.push([price, size]);
            if (side === "sell") asks.push([price, size]);
          }
        }

        if (msg.bids) bids = msg.bids;
        if (msg.asks) asks = msg.asks;

        this.updateBook({
          source: "coinbase",
          bids,
          asks
        });

      } catch (err) {
        console.error("[COINBASE] parse error", err.message);
      }
    });

    this.wsCoinbase.on("close", () => {
      console.log("[COINBASE] disconnected, retrying...");
      setTimeout(() => this.connectCoinbase(), 1500);
    });

    this.wsCoinbase.on("error", (err) => {
      console.log("[COINBASE] error:", err.message);
    });
  }

  /**
   * ---------------------------
   * BOOK NORMALIZATION
   * ---------------------------
   */
  updateBook({ source, bids, asks }) {
    for (const [p, s] of bids) {
      const price = parseFloat(p);
      const size = parseFloat(s);
      if (!isNaN(price)) this.book.bids.set(price, size);
    }

    for (const [p, s] of asks) {
      const price = parseFloat(p);
      const size = parseFloat(s);
      if (!isNaN(price)) this.book.asks.set(price, size);
    }

    this.book.ts = Date.now();

    const bestBid = Math.max(...this.book.bids.keys());
    const bestAsk = Math.min(...this.book.asks.keys());

    this.book.price = (bestBid + bestAsk) / 2 || this.book.price;

    const snapshot = {
      source,
      symbol: "BTC",
      price: this.book.price,
      bids: Array.from(this.book.bids.entries()).slice(-50),
      asks: Array.from(this.book.asks.entries()).slice(-50),
      ts: this.book.ts
    };

    if (this.onMarket) {
      this.onMarket(snapshot);
    }

    this.emit("book:update", snapshot);
  }

  /**
   * ---------------------------
   * STOP
   * ---------------------------
   */
  stop() {
    if (this.wsBinance) this.wsBinance.close();
    if (this.wsCoinbase) this.wsCoinbase.close();

    console.log("[ORDERBOOK] stopped");
  }
}

module.exports = OrderbookFeed;
