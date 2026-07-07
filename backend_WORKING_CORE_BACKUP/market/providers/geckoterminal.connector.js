import axios from "axios";

export async function getGeckoTerminalData(symbol) {
  try {
    const res = await axios.get(
      `https://api.geckoterminal.com/api/v2/networks/base/tokens/${symbol}`
    );

    const pool = res.data?.data?.attributes;

    return {
      symbol,
      price: parseFloat(pool?.price_usd || 0),

      bid: null,
      ask: null,
      spread: 0,

      volume24h: parseFloat(pool?.volume_usd?.h24 || 0),
      liquidity: parseFloat(pool?.reserve_in_usd || 0),

      fundingRate: null,
      openInterest: null,
      volatility: 0,

      source: "geckoterminal",
      timestamp: Date.now()
    };
  } catch (e) {
    return null;
  }
}
