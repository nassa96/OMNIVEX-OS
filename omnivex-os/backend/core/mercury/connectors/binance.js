export async function fetchBinance(symbol = "BTCUSDT") {
  try {
    const res = await fetch(
      `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
    );

    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return {
        source: "BINANCE",
        symbol,
        price: null,
        error: "INVALID_JSON",
        raw: text.slice(0, 200),
        ts: Date.now()
      };
    }

    const price = parseFloat(data?.price);

    return {
      source: "BINANCE",
      symbol,
      price: isNaN(price) ? null : price,
      ts: Date.now()
    };

  } catch (err) {
    return {
      source: "BINANCE",
      symbol,
      price: null,
      error: err.message,
      ts: Date.now()
    };
  }
}
