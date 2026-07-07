class MemeEngine {
  detect(signal) {
    const score =
      (signal.volume / 500000) +
      Math.abs(signal.priceChange) * 2;

    return {
      ...signal,
      memeScore: score,
      isEarly: score > 2.5
    };
  }
}

module.exports = MemeEngine;
