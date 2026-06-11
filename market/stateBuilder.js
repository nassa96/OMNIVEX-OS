import { getCoinGecko } from "../integrations/coingecko.js";
import { getGeckoTerminal } from "../integrations/geckoterminal.js";
import { getMoralisData } from "../integrations/moralis.js";
import { getCovalentData } from "../integrations/covalent.js";

export async function buildMarketState(symbol = "BTC") {
  const [cg, gt, mor, cov] = await Promise.all([
    getCoinGecko(symbol),
    getGeckoTerminal(symbol),
    getMoralisData(symbol),
    getCovalentData(symbol)
  ]);

  return {
    price: {
      spot: cg.price,
      change24h: cg.change24h
    },

    liquidity: {
      dexDepth: gt.liquidity || 0,
      spread: gt.spread || 0
    },

    onchain: {
      whaleNetflow: mor.whaleNetflow || 0,
      activeWallets: mor.activeWallets || 0,
      largeTransfers: cov.largeTransfers || 0
    },

    volatility: {
      atr: cg.atr || 0,
      regime: "UNCLASSIFIED"
    },

    sentiment: {
      score: mor.sentiment || 0
    },

    timestamp: Date.now()
  };
}
