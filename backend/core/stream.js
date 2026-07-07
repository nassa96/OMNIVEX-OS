export const SYMBOLS = ["BTC", "ETH", "SOL"];

export function generateMarketState(prev = {}) {
  const state = {};

  for (const s of SYMBOLS) {
    const last = prev[s] ?? 1000 + Math.random() * 60000;
    const drift = (Math.random() - 0.5) * 120;

    state[s] = last + drift;
  }

  return state;
}
