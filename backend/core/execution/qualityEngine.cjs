class ExecutionQualityEngine {
  constructor() {
    this.history = [];
  }

  evaluate({ order, market, fill }) {
    const expectedPrice = order.price;
    const actualPrice = fill.price;
    const size = fill.qty;

    // ----------------------------
    // 1. SLIPPAGE
    // ----------------------------
    const slippage = (actualPrice - expectedPrice) / expectedPrice;

    // ----------------------------
    // 2. COST IN IMPACT TERMS
    // ----------------------------
    const impactCost = Math.abs(slippage * size * actualPrice);

    // ----------------------------
    // 3. EXECUTION QUALITY SCORE
    // ----------------------------
    let score = 1.0;

    if (Math.abs(slippage) > 0.002) score -= 0.2;
    if (Math.abs(slippage) > 0.005) score -= 0.4;
    if (impactCost > 5) score -= 0.3;

    score = Math.max(0, Math.min(1, score));

    const result = {
      orderId: order.id,
      symbol: order.symbol,
      slippage,
      impactCost,
      score,
      timestamp: Date.now()
    };

    this.history.push(result);

    if (this.history.length > 500) {
      this.history.shift();
    }

    return result;
  }
}

module.exports = ExecutionQualityEngine;
