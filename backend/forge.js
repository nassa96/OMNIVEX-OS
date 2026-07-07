function analyzeMarket(state) {
  const price = state?.price || 0;

  return {
    signal: price % 3 === 0 ? "SELL" : "HOLD",
    strength: 0.5 + (price % 7) / 120
  };
}

module.exports = {
  analyzeMarket
};
