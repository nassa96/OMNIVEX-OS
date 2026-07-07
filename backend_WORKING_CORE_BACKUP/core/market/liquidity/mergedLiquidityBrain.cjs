/**
 * SAINT — MERGED LIQUIDITY BRAIN
 * ------------------------------
 * Converts multi-exchange orderbooks into unified market cognition
 *
 * Output:
 * {
 *   price,
 *   spread,
 *   imbalance,
 *   liquidityScore,
 *   depthPressure,
 *   toxicity,
 *   bids,
 *   asks
 * }
 */

class MergedLiquidityBrain {

  constructor() {
    this.sources = {
      binance: null,
      coinbase: null
    };
  }

  update(source, market) {
    this.sources[source] = market;
  }

  // ---------------------------
  // DEPTH WEIGHTING
  // ---------------------------
  weightedPrice() {
    const b = this.sources.binance;
    const c = this.sources.coinbase;

    if (!b || !c) return b?.price || c?.price || 0;

    return (b.price * 0.55) + (c.price * 0.45);
  }

  // ---------------------------
  // LIQUIDITY MERGE
  // ---------------------------
  mergeBook() {
    const b = this.sources.binance;
    const c = this.sources.coinbase;

    const bids = [
      ...(b?.bids || []),
      ...(c?.bids || [])
    ].sort((a, b) => b - a);

    const asks = [
      ...(b?.asks || []),
      ...(c?.asks || [])
    ].sort((a, b) => a - b);

    return { bids, asks };
  }

  // ---------------------------
  // MARKET STRUCTURE METRICS
  // ---------------------------
  computeMetrics() {

    const price = this.weightedPrice();
    const { bids, asks } = this.mergeBook();

    const bestBid = bids[0] || price;
    const bestAsk = asks[0] || price;

    const spread = Math.max(0, bestAsk - bestBid);

    const imbalance =
      Math.abs(bids.length - asks.length) /
      Math.max(1, bids.length + asks.length);

    const liquidityScore =
      Math.min(1, (bids.length + asks.length) / 50);

    const depthPressure =
      bids.length > asks.length ? 1 : -1;

    const toxicity =
      spread > 5 || liquidityScore < 0.3
        ? 1
        : 0;

    return {
      price,
      spread,
      imbalance,
      liquidityScore,
      depthPressure,
      toxicity,
      bids,
      asks
    };
  }
}

module.exports = MergedLiquidityBrain;
