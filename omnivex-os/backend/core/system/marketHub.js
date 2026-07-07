import { Mercury } from "../mercury/mercury.js";
import { coinbase } from "../mercury/adapters/coinbase.js";
import { coingecko } from "../mercury/adapters/coingecko.js";
import { dexscreener } from "../mercury/adapters/dexscreener.js";

const mercury = new Mercury([
  { fetch: coinbase },
  { fetch: coingecko },
  { fetch: dexscreener }
]);

export async function getMarketBundle() {
  const symbols = ["BTC-USD", "ETH-USD", "SOL-USD"];

  const data = await Promise.all(
    symbols.map(async (s) => {
      const r = await mercury.get(s);

      return {
        symbol: s,
        price: r.price,
        sources: r.sources,
        confidence: r.confidence,
        ts: r.ts
      };
    })
  );

  return data;
}
