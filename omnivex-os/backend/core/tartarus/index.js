class Tartarus {
  disrupt(market) {
    return market.map(m => {
      const volatility = Math.abs(m.priceChange || 0);
      const volume = m.volume || 1;

      // chaos thrives on movement + spikes
      const chaosScore =
        (volatility / 10) * 0.6 +
        (volume / 1e6) * 0.4;

      return {
        ...m,
        agent: "TARTARUS",
        score: Math.min(1, chaosScore),
        signal: chaosScore > 0.6 ? "ATTACK" : "SCOUT"
      };
    });
  }
}

module.exports = Tartarus;
