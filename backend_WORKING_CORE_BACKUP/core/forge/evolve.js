function mutate(tick) {
  if (!tick) return { signal: "HOLD", strength: 0, weight: 0.5 };

  const noise = (tick.price % 5) / 10;

  return {
    signal: "HOLD",
    strength: 0.5 + noise,
    weight: 0.7
  };
}

module.exports = { mutate };
