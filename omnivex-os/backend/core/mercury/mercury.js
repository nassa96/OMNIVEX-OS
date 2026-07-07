export function getMercuryFeed() {
  // Simulated normalized market stream layer
  const now = Date.now();

  return [
    {
      symbol: "BTC-USD",
      price: 62000,
      source: "coinbase",
      ts: now
    },
    {
      symbol: "ETH-USD",
      price: 3200,
      source: "kraken",
      ts: now
    },
    {
      symbol: "SOL-USD",
      price: 140,
      source: "coingecko",
      ts: now
    }
  ];
}
