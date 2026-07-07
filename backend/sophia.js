function signal(context) {
  const price = context?.price || 0;

  return {
    signal: price % 2 === 0 ? "BUY" : "HOLD",
    strength: 0.65 + (price % 10) / 100
  };
}

module.exports = { signal };
