import axios from "axios";

export async function getCoinGeckoData(symbol) {
  try {
    const map = {
      BTC: "bitcoin",
      ETH: "ethereum",
      SOL: "solana"
    };

    const id = map[symbol];
    if (!id) return null;

    const res = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${id}`
    );

    const data = res.data.market_data;

    return {
      symbol,
      price: data.current_price.usd,

      bid: data.current_price.usd,
      ask: data.current_price.usd,
      spread: 0,

      volume24h: data.total_volume.usd,
      liquidity: 0,

      fundingRate: null,
      openInterest: null,
      volatility: data.price_change_percentage_24h || 0,

      source: "coingecko",
      timestamp: Date.now()
    };
  } catch (e) {
    return null;
  }
}
