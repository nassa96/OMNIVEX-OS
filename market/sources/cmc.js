export async function getCMCPrice(apiKey) {
  const res = await fetch("https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC", {
    headers: {
      "X-CMC_PRO_API_KEY": apiKey
    }
  });

  const data = await res.json();
  return data?.data?.BTC?.quote?.USD?.price || 0;
}
