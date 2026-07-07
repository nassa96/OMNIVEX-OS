const CoinbaseFeed = require("./coinbase/coinbaseFeed.cjs");
const BinanceFeed = require("./binance/binanceFeed.cjs");

class CEXFeeds {
  constructor(bus) {
    this.bus = bus;
  }

  start() {
    console.log("[CEX BOOT] starting feeds...");

    const coinbase = new CoinbaseFeed(this.bus);
    const binance = new BinanceFeed(this.bus);

    coinbase.start();
    binance.start();
  }
}

module.exports = CEXFeeds;
