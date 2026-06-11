import axios from "axios";

export async function getCoinbaseData(symbol) {
  try {
    const res = await axios.get(
      `https://api.coinbase.com/v2/prices/${symbol}-USD/spot`
    );

    const price = parseFloat(res.data.data.amount);

    return {
      symbol,
      price,
      bid: price * 0.999,
      ask: price * 1.001,
      spread: price * 0.002,

      volume24h: 0,
      liquidity: 0,

      fundingRate: null,
      openInterest: null,
      volatility: 0,

      source: "coinbase",
      timestamp: Date.now()
    };
  } catch (e) {
    return null;
  }
}
