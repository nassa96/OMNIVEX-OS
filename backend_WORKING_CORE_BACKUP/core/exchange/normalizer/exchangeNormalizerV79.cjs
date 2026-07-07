/**
 * SAINT V79 — EXCHANGE NORMALIZER
 * Unifies multi-exchange formats into canonical tick
 */

class ExchangeNormalizerV79 {

  normalize(tick) {

    return {
      symbol: tick.symbol.replace("-", ""),
      price: parseFloat(tick.price),
      volume: parseFloat(tick.volume),
      source: tick.source,
      ts: Date.now()
    };
  }
}

module.exports = ExchangeNormalizerV79;
