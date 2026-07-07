/**
 * OMNIVEX MERCURY — STABLE SIMULATION FEED
 * ----------------------------------------
 * Replaces external APIs with deterministic market generator
 * Ensures system NEVER breaks due to network/rate limits
 */

const BASE_PRICES = {
  "BTC-USD": 62000,
  "ETH-USD": 3200,
  "SOL-USD": 140
};

function volatility(symbol, ts) {
  const seed = ts % 10000;
  const factor = (Math.sin(seed / 1000) + Math.cos(seed / 500)) * 0.01;

  return BASE_PRICES[symbol] * (1 + factor);
}

export async function fetchBinance(symbol) {
  return {
    source: "SIM_BINANCE",
    symbol,
    price: null,
    ts: Date.now()
  };
}

export async function fetchCoinGecko(symbol) {
  return {
    source: "SIM_COINGECKO",
    symbol,
    price: null,
    ts: Date.now()
  };
}

export async function getMarketBundle() {
  const ts = Date.now();

  return Object.keys(BASE_PRICES).map((symbol) => {
    const price = volatility(symbol, ts);

    return {
      symbol,
      price: Number(price.toFixed(2)),
      binance: null,
      coinGecko: null,
      ts
    };
  });
}

export async function marketTick() {
  return getMarketBundle();
}
