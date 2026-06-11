export async function runElohim() {
  const coinbase = await fetch("https://api.coinbase.com/v2/prices/BTC-USD/spot")
    .then(r => r.json())
    .catch(() => null);

  const ethcoinbase = await fetch("https://api.coinbase.com/v2/prices/ETH-USD/spot")
    .then(r => r.json())
    .catch(() => null);

  return {
    BTC: parseFloat(coinbase?.data?.amount) || null,
    ETH: parseFloat(ethcoinbase?.data?.amount) || null,
    prevBTC: global.__prevBTC || null,
  };
}
