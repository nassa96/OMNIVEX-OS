class Mercury {
  async scan() {
    try {
      const res = await fetch(
        "https://api.dexscreener.com/latest/dex/search?q=solana"
      );

      const data = await res.json();

      return (data.pairs || []).slice(0, 8).map(p => ({
        symbol: p.baseToken?.symbol || "UNK",
        price: Number(p.priceUsd || 0),
        liquidity: Number(p.liquidity?.usd || 0),
        volume: Number(p.volume?.h24 || 0),
        priceChange: Number(p.priceChange?.h24 || 0)
      }));
    } catch {
      return [];
    }
  }
}

module.exports = Mercury;
