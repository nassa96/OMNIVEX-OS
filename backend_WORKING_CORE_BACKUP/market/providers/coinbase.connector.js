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
      timestamp: Date.now()
    };

  } catch (e) {
    return {
      symbol,
      price: null,
      error: e.message
    };
  }
}

/**
 * STANDARDIZED WRAPPER FOR ENGINE LAYER
 */
export function coinbaseAdapter() {
  return async function run({ symbol = "BTC" }) {
    return await getCoinbaseData(symbol);
  };
}
