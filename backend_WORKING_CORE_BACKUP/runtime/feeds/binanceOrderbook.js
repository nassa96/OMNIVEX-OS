import WebSocket from "ws";
import EventEmitter from "events";

/**
 * SAINT V12 - Binance Orderbook Stream
 * Lightweight real-time L2 book ingestion
 */

export class BinanceOrderbook extends EventEmitter {
  constructor(symbol = "btcusdt") {
    super();

    this.symbol = symbol.toLowerCase();

    this.ws = null;

    this.book = {
      bids: new Map(),
      asks: new Map(),
      bestBid: null,
      bestAsk: null,
      spread: null,
      mid: null
    };
  }

  /**
   * ---------------------------
   * CONNECT STREAM
   * ---------------------------
   */
  connect() {
    const url = `wss://stream.binance.com:9443/ws/${this.symbol}@depth@100ms`;

    this.ws = new WebSocket(url);

    console.log("[SAINT V12] Connecting orderbook stream...");

    this.ws.on("open", () => {
      console.log("[SAINT V12] Orderbook stream connected");
    });

    this.ws.on("message", (msg) => {
      const data = JSON.parse(msg.toString());

      this._updateBook(data);
    });

    this.ws.on("close", () => {
      console.log("[SAINT V12] Orderbook stream closed");
    });

    this.ws.on("error", (err) => {
      console.error("[SAINT V12] Stream error:", err.message);
    });
  }

  /**
   * ---------------------------
   * BOOK UPDATE
   * ---------------------------
   */
  _updateBook(data) {
    if (!data.b || !data.a) return;

    // bids
    data.b.forEach(([price, qty]) => {
      this.book.bids.set(parseFloat(price), parseFloat(qty));
    });

    // asks
    data.a.forEach(([price, qty]) => {
      this.book.asks.set(parseFloat(price), parseFloat(qty));
    });

    this._computeMetrics();

    this.emit("update", this.getState());
  }

  /**
   * ---------------------------
   * METRICS ENGINE
   * ---------------------------
   */
  _computeMetrics() {
    const bestBid = Math.max(...this.book.bids.keys());
    const bestAsk = Math.min(...this.book.asks.keys());

    this.book.bestBid = bestBid;
    this.book.bestAsk = bestAsk;

    this.book.spread = bestAsk - bestBid;
    this.book.mid = (bestAsk + bestBid) / 2;
  }

  /**
   * ---------------------------
   * OUTPUT STATE
   * ---------------------------
   */
  getState() {
    return {
      symbol: this.symbol,
      bestBid: this.book.bestBid,
      bestAsk: this.book.bestAsk,
      spread: this.book.spread,
      mid: this.book.mid,
      timestamp: Date.now()
    };
  }

  /**
   * ---------------------------
   * DISCONNECT
   * ---------------------------
   */
  disconnect() {
    if (this.ws) this.ws.close();
  }
}

export default BinanceOrderbook;
