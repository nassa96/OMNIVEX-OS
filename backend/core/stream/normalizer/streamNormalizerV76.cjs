/**
 * SAINT V76 — STREAM NORMALIZER
 * Standardizes multi-exchange data formats
 */

class StreamNormalizerV76 {

  normalize(raw) {

    return {
      symbol: raw.s || raw.symbol,
      price: parseFloat(raw.p || raw.price),
      volume: parseFloat(raw.v || raw.volume),
      source: raw.source || "unknown"
    };
  }
}

module.exports = StreamNormalizerV76;
