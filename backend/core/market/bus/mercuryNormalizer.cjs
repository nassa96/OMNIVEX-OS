class MercuryNormalizer {

  normalize(event) {
    if (!event) return null;

    // BINANCE FORMAT
    if (event.s && event.p) {
      return {
        symbol: event.s,
        price: Number(event.p),
        volume: Number(event.q || 0),
        source: "binance",
        timestamp: Date.now()
      };
    }

    // COINBASE FORMAT
    if (event.product_id && event.price) {
      return {
        symbol: event.product_id.replace("-", ""),
        price: Number(event.price),
        volume: Number(event.last_size || 0),
        source: "coinbase",
        timestamp: Date.now()
      };
    }

    return null;
  }
}

module.exports = new MercuryNormalizer();
