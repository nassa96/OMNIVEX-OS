function generateSignal(tick) {
  if (!tick) return { signal: "HOLD", strength: 0 };

  const mod = tick.price % 10;

  return {
    signal: mod > 6 ? "BUY" : mod < 3 ? "SELL" : "HOLD",
    strength: mod > 6 ? 0.8 : mod < 3 ? 0.78 : 0.55,
    weight: 1
  };
}

module.exports = { generateSignal };
