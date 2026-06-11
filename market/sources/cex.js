export async function getCEXPrice() {
  const res = await fetch("https://api.coinbase.com/v2/exchange-rates?currency=BTC");
  const data = await res.json();
  return Number(data?.data?.rates?.USD || 0);
}
