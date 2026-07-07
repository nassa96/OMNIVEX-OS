class Sophia {
  analyze(market) {
    return market.map(m => {
      const stability =
        1 - Math.min(1, Math.abs(m.priceChange || 0) / 20);

      const confidence =
        (m.liquidity / 5e6) * 0.5 +
        stability * 0.5;

      return {
        ...m,
        agent: "SOPHIA",
        score: confidence,
        signal: confidence > 0.6 ? "STABLE" : "UNCERTAIN"
      };
    });
  }
}

module.exports = Sophia;
