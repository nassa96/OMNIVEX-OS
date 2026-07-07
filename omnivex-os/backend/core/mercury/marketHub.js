import { fetchBinance } from "./connectors/binance.js";
import { fetchCoinGecko } from "./connectors/coingecko.js";

const SYMBOLS = ["BTC-USD", "ETH-USD", "SOL-USD"];

function fallbackPrice(symbol) {
  if (symbol === "BTC-USD") return 62000;
  if (symbol === "ETH-USD") return 3200;
  if (symbol === "SOL-USD") return 140;
  return 0;
}

export async function getMarketBundle() {
  const results = await Promise.all(
    SYMBOLS.map(async (symbol) => {
      const cg = await fetchCoinGecko("bitcoin");
      const bn = await fetchBinance("BTCUSDT");

      const price =
        bn?.price ||
        cg?.price ||
        fallbackPrice(symbol);

      return {
        symbol,
        price,
        binance: bn?.price || null,
        coinGecko: cg?.price || null,
        ts: Date.now(),
        history: []
      };
    })
  );

  return results;
}
