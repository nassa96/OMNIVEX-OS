export async function getCoinbasePrice(asset = "BTC") {
  const res = await fetch(
    `https://api.coinbase.com/v2/prices/${asset}-USD/spot`
  );

  const json = await res.json();

  return {
    price: parseFloat(json?.data?.amount),
    source: "coinbase",
  };
}
