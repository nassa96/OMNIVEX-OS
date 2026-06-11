export async function getMoralisPrice(asset = "BTC") {
  const key = process.env.MORALIS_API_KEY;

  if (!key) return null;

  const res = await fetch(
    `https://deep-index.moralis.io/api/v2/erc20/${asset}/price`,
    {
      headers: {
        "X-API-Key": key,
      },
    }
  );

  const json = await res.json();

  return {
    price: json?.usdPrice || null,
    source: "moralis",
  };
}
