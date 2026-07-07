const MarketEvent = require("./marketEvent.model.cjs");

class MercuryNormalizer {

  normalizeCEX(data, venue) {
    return new MarketEvent({
      source: "CEX",
      venue,
      symbol: data.symbol,
      price: data.price,
      volume: data.volume,
      eventType: "TRADE",
      side: data.side || null,
      metadata: data
    });
  }

  normalizeDEX(data, venue) {
    return new MarketEvent({
      source: "DEX",
      venue,
      symbol: data.token || data.symbol,
      price: data.price,
      liquidity: data.liquidity || null,
      volume: data.volume || null,
      eventType: "SWAP",
      metadata: data
    });
  }

  normalizeCHAIN(data, venue) {
    return new MarketEvent({
      source: "CHAIN",
      venue,
      symbol: data.tokenSymbol || null,
      wallet: data.from || data.wallet || null,
      txHash: data.hash || null,
      eventType: data.type || "TRANSFER",
      metadata: data
    });
  }

}

module.exports = new MercuryNormalizer();
