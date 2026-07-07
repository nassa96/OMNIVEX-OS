class Elohim {
  constructor(forge) {
    this.forge = forge;
  }

  analyze(market) {
    return market.map(m => {
      const volatility = Math.abs(m.priceChange || 0);
      const liquidity = m.liquidity || 1;

      // Elohim avoids chaos, prefers stability + liquidity
      const stability =
        (liquidity / 5e6) * 0.6 +
        (1 - Math.min(1, volatility / 25)) * 0.4;

      return {
        ...m,
        agent: "ELOHIM",
        score: stability,
        signal: stability > 0.65 ? "COMPOUND" : "HOLD"
      };
    });
  }
}

module.exports = Elohim;
