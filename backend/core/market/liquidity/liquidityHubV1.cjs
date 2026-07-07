const AltSignals = require("../data/altLiquiditySignals.cjs");

class LiquidityHubV1 {

  constructor() {
    this.sources = {};
    this.alt = new AltSignals();

    this.anchorPrice = null;
  }

  update(source, market) {
    this.sources[source] = market;
  }

  mergeBooks() {
    const allBids = [];
    const allAsks = [];

    for (const k in this.sources) {
      const m = this.sources[k];
      if (!m) continue;

      allBids.push(...(m.bids || []));
      allAsks.push(...(m.asks || []));
    }

    return {
      bids: allBids.sort((a,b)=>b-a),
      asks: allAsks.sort((a,b)=>a-a)
    };
  }

  computeMicrostructure() {

    const { bids, asks } = this.mergeBooks();

    const bestBid = bids[0] || 0;
    const bestAsk = asks[0] || 0;

    const mid = (bestBid + bestAsk) / 2;

    const spread = bestAsk - bestBid;

    const imbalance =
      Math.abs(bids.length - asks.length) /
      Math.max(1, bids.length + asks.length);

    const liquidityScore =
      Math.min(1, (bids.length + asks.length) / 80);

    const toxicity =
      spread > 10 || liquidityScore < 0.25 ? 1 : 0;

    return {
      price: mid,
      spread,
      imbalance,
      liquidityScore,
      toxicity,
      bids,
      asks
    };
  }

  async enrich() {

    const btc = await this.alt.getCoinGeckoPrice("bitcoin");
    const dex = await this.alt.getDexLiquidity("bitcoin");

    this.anchorPrice = btc;

    return {
      anchorPrice: btc,
      dexLiquidity: dex
    };
  }
}

module.exports = LiquidityHubV1;
