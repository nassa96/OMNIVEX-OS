import { getCoinbasePrice } from "./coinbase.js";
import { getCovalentPrice } from "./covalent.js";
import { getMoralisPrice } from "./moralis.js";

export async function getMarketSnapshot(asset = "BTC") {
  const results = await Promise.allSettled([
    getCoinbasePrice(asset),
    getCovalentPrice(asset),
    getMoralisPrice(asset),
  ]);

  const prices = results
    .filter(r => r.status === "fulfilled")
    .map(r => r.value.price)
    .filter(Boolean);

  if (prices.length === 0) {
    return {
      price: null,
      source: "NONE",
    };
  }

  // weighted average (simple fusion kernel)
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;

  return {
    price: avg,
    sources: prices.length,
    raw: prices,
  };
}
