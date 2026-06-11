export async function getCovalentPrice(asset = "BTC") {
  const key = process.env.COVALENT_API_KEY;

  if (!key) return null;

  const res = await fetch(
    `https://api.covalenthq.com/v1/pricing/tickers/?tickers=${asset}&key=${key}`
  );

  const json = await res.json();

  const price =
    json?.data?.items?.[0]?.quote_rate || null;

  return {
    price,
    source: "covalent",
  };
}
