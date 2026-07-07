const Binance = require("../core/feeds/binanceOrderbook.cjs");
const Coinbase = require("../core/feeds/coinbaseOrderbook.cjs");
const SAINT = require("../core/execution/saintV15Router.cjs");

class CanonicalLoopV15 {
  constructor() {
    this.binance = new Binance();
    this.coinbase = new Coinbase();
    this.router = new SAINT();

    this.latestBook = null;
  }

  start() {
    console.log("[SAINT V15] Starting microstructure execution loop...");

    this.binance.connect((book) => {
      this.latestBook = book;

      const signal = Math.random() > 0.5 ? "BUY" : "SELL";

      const decision = this.router.decide(signal, book);

      console.log("[V15 LOOP]", {
        mid: book.mid,
        spread: book.spread,
        decision
      });
    });

    this.coinbase.connect((book) => {
      this.latestBook = book;
    });
  }
}

module.exports = CanonicalLoopV15;
