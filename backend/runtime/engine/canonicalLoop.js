import EventEmitter from "events";
import BinanceOrderbook from "../feeds/binanceOrderbook.js";

/**
 * SAINT V12 - LIVE ORDERBOOK CANONICAL LOOP
 */

export class CanonicalLoop extends EventEmitter {
  constructor() {
    super();

    this.state = {
      running: false
    };

    this.book = null;

    this.learning = {
      buffer: []
    };
  }

  /**
   * ---------------------------
   * START SYSTEM
   * ---------------------------
   */
  start() {
    if (this.state.running) return;

    this.state.running = true;

    console.log("[SAINT V12] Starting canonical loop...");

    // attach live orderbook
    this.book = new BinanceOrderbook("btcusdt");

    this.book.on("update", (market) => {
      this._cycle(market);
    });

    this.book.connect();
  }

  /**
   * ---------------------------
   * CORE LOOP
   * ---------------------------
   */
  _cycle(market) {
    const signal = this._generateSignal(market);

    const decision = this._decide(signal);

    this._learn(signal, decision);

    this.emit("loop", {
      symbol: market.symbol,
      mid: market.mid,
      spread: market.spread,
      signal,
      decision
    });
  }

  /**
   * ---------------------------
   * SIGNAL ENGINE (LIGHTWEIGHT V12)
   * ---------------------------
   */
  _generateSignal(market) {
    const pressure = (market.bestBid + 1) / (market.bestAsk + 1);

    let signal = "HOLD";

    if (pressure > 1.0008) signal = "BUY";
    else if (pressure < 0.9992) signal = "SELL";

    return {
      signal,
      confidence: Math.min(Math.abs(pressure - 1) * 1000, 1)
    };
  }

  /**
   * ---------------------------
   * DECISION ENGINE
   * ---------------------------
   */
  _decide(signal) {
    if (signal.confidence < 0.4) return "HOLD";
    return signal.signal;
  }

  /**
   * ---------------------------
   * LEARNING BUFFER
   * ---------------------------
   */
  _learn(signal, decision) {
    this.learning.buffer.push({
      signal,
      decision,
      ts: Date.now()
    });

    if (this.learning.buffer.length > 300) {
      this.learning.buffer.shift();
    }

    this.emit("learning", { signal, decision });
  }

  /**
   * ---------------------------
   * STOP
   * ---------------------------
   */
  stop() {
    this.state.running = false;

    if (this.book) this.book.disconnect();

    console.log("[SAINT V12] stopped");
  }
}

export default CanonicalLoop;
