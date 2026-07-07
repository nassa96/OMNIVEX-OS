class MarketEvent {
  constructor({
    source,        // "CEX" | "DEX" | "CHAIN"
    venue,         // coinbase | binance | uniswap | etherscan | tronscan
    symbol,        // BTC-USD, ETH, etc
    price = null,
    volume = null,
    liquidity = null,
    wallet = null,
    txHash = null,
    eventType,     // TRADE | SWAP | TRANSFER | BLOCK | ORDERBOOK
    side = null,   // BUY | SELL | null
    metadata = {},
    timestamp = Date.now()
  }) {
    this.source = source;
    this.venue = venue;
    this.symbol = symbol;

    this.price = price;
    this.volume = volume;
    this.liquidity = liquidity;

    this.wallet = wallet;
    this.txHash = txHash;

    this.eventType = eventType;
    this.side = side;

    this.metadata = metadata;
    this.timestamp = timestamp;

    this.version = "MERCURY_V1";
  }

  isValid() {
    return !!(this.source && this.venue && this.eventType && this.timestamp);
  }
}

module.exports = MarketEvent;
