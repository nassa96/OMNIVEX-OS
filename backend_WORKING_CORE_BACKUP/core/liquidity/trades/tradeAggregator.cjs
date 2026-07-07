const BinanceTrades = require("../adapters/trades/binanceTrades.cjs");
const CoinbaseTrades = require("../adapters/trades/coinbaseTrades.cjs");
const CrossExchangeFusion = require("../fusion_flow/crossExchangeFusion.cjs");

/**
 * SAINT V8 — CROSS EXCHANGE FLOW SYSTEM
 */

class TradeAggregator {

  constructor() {

    this.fusion = new CrossExchangeFusion();

    this.binance = new BinanceTrades();
    this.coinbase = new CoinbaseTrades();
  }

  start() {

    console.log("[V8 CROSS EXCHANGE FLOW] online");

    this.binance.connect((t) => {
      this.fusion.ingest(t);
    });

    this.coinbase.connect((t) => {
      this.fusion.ingest(t);
    });

    setInterval(() => {

      const signal = this.fusion.analyze();

      console.log("[V8 FUSED FLOW SIGNAL]", signal);

      // reset micro-batch frame
      this.fusion.reset();

    }, 2000);
  }
}

module.exports = TradeAggregator;
