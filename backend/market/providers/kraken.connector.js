import axios from "axios";

export async function getKrakenData(symbol) {
  try {
    const res = await axios.get(
      `https://api.kraken.com/0/public/Ticker?pair=${symbol}USD`
    );

    const key = Object.keys(res.data.result)[0];
    const ticker = res.data.result[key];

    const price = parseFloat(ticker.c[0]);

    return {
      symbol,
      price,

      bid: parseFloat(ticker.b[0]),
      ask: parseFloat(ticker.a[0]),
      spread: parseFloat(ticker.a[0]) - parseFloat(ticker.b[0]),

      volume24h: parseFloat(ticker.v[1]),
      liquidity: 0,

      fundingRate: null,
      openInterest: null,
      volatility: 0,

      source: "kraken",
      timestamp: Date.now()
    };
  } catch (e) {
    return null;
  }
}
