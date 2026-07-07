const BinanceWS = require("../feeds/binance/binanceWS.cjs");
const CoinbaseWS = require("../feeds/coinbase/coinbaseWS.cjs");

class MarketStream {

  start() {
    console.log("[SAINT STREAM] Real exchange feeds online");

    const binance = new BinanceWS("btcusdt");
    const coinbase = new CoinbaseWS("BTC-USD");

    binance.connect();
    coinbase.connect();
  }
}

module.exports = MarketStream;
