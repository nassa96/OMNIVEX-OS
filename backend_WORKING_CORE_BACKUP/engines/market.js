export function getMarketState(symbols = ["BTC", "ETH", "SOL"]) {
  const state = {};

  for (const s of symbols) {
    const base =
      s === "BTC" ? 76000 :
      s === "ETH" ? 4200 :
      s === "SOL" ? 220 : 100;

    const noise = (Math.random() - 0.5) * base * 0.002;

    const price = base + noise;
    const prev = price - (Math.random() - 0.5) * base * 0.001;

    state[s] = {
      price,
      prev
    };
  }

  return state;
}
