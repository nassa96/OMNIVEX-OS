class Cerberus {
  constructor(mercury, chronicle) {
    this.mercury = mercury;
    this.chronicle = chronicle;
  }

  score(t) {
    const v = t.volume || 0;
    const l = t.liquidity || 1;
    const c = t.priceChange || 0;

    return Math.min(
      1,
      (v / 1e6) * 0.4 +
      (l / 5e6) * 0.3 +
      Math.abs(c) * 0.3
    );
  }

  analyze(market) {
    return market.map(t => ({
      ...t,
      agent: "CERBERUS",
      score: this.score(t),
      signal: this.score(t) > 0.65 ? "HOT" : "COLD"
    }));
  }

  async tick(market) {
    const data = market || await this.mercury.scan();

    const signals = this.analyze(data);

    this.chronicle.write({
      type: "CERBERUS_TICK",
      signals
    });

    return signals;
  }
}

module.exports = Cerberus;
