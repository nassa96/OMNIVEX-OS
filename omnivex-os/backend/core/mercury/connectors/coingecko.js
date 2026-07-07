export async function fetchCoinGecko(symbol = "bitcoin") {
  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`;

    const res = await fetch(url);

    const text = await res.text(); // DEBUG LAYER

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return {
        source: "COINGECKO",
        symbol,
        price: null,
        error: "INVALID_JSON",
        raw: text.slice(0, 200),
        ts: Date.now()
      };
    }

    const price = data?.[symbol]?.usd;

    return {
      source: "COINGECKO",
      symbol,
      price: typeof price === "number" ? price : null,
      ts: Date.now()
    };

  } catch (err) {
    return {
      source: "COINGECKO",
      symbol,
      price: null,
      error: err.message,
      ts: Date.now()
    };
  }
}
