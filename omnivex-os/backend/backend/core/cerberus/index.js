class Cerberus {
  constructor(mercury, chronicle) {
    this.mercury = mercury;
    this.chronicle = chronicle;
    this.latest = [];
  }

  score(t) {
    const volume = t.volume || 0;
    const liq = t.liquidity || 1;
    const change = t.priceChange || 0;

    const score =
      (volume / 1000000) * 0.4 +
      (liq / 5000000) * 0.3 +
      Math.abs(change) * 0.3;

    return Math.min(1, score);
  }

  async tick() {
    const market = await this.mercury.scan();

    this.latest = market.map(t => ({
      ...t,
      score: this.score(t),
      signal: this.score(t) > 0.65 ? "HOT" : "COLD"
    }));

    this.chronicle.write({
      type: "CERBERUS_TICK",
      data: this.latest
    });

    return this.latest;
  }

  getLatest() {
    return this.latest;
  }
}

module.exports = Cerberus;
