export async function getSafePrice(symbol, binanceSymbol, coingeckoId) {
  let binancePrice = null;
  let cgPrice = null;

  // Binance FIRST (more reliable)
  try {
    const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${binanceSymbol}`);
    const data = await res.json();
    binancePrice = parseFloat(data.price);
  } catch (e) {}

  // CoinGecko fallback
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd`);
    const data = await res.json();
    cgPrice = data?.[coingeckoId]?.usd;
  } catch (e) {}

  return {
    symbol,
    price: binancePrice || cgPrice || fallback(symbol),
    binance: binancePrice,
    coinGecko: cgPrice,
    ts: Date.now()
  };
}

function fallback(symbol) {
  const map = {
    "BTC-USD": 65000,
    "ETH-USD": 3200,
    "SOL-USD": 140
  };

  return map[symbol] || 0;
}
