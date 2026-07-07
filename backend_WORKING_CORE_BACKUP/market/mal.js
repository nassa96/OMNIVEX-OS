import { getCoinbaseData } from "./providers/coinbase.connector.js";
import { getKrakenData } from "./providers/kraken.connector.js";
import { getCoinGeckoData } from "./providers/coingecko.connector.js";
import { getGeckoTerminalData } from "./providers/geckoterminal.connector.js";
import { fuseMarketData } from "./fusion.js";

export async function getUnifiedMarket(symbol) {
  const results = await Promise.allSettled([
    getCoinbaseData(symbol),
    getKrakenData(symbol),
    getCoinGeckoData(symbol),
    getGeckoTerminalData(symbol)
  ]);

  const dataSets = results
    .filter(r => r.status === "fulfilled")
    .map(r => r.value)
    .filter(Boolean);

  return fuseMarketData(dataSets);
}
