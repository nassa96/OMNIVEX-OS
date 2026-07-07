
class SlippageModel {
  estimate(orderbook, size = 1, side = "BUY") {
    const levels = side === "BUY"
      ? (orderbook.asks || [])
      : (orderbook.bids || []);

    let remaining = size;
    let cost = 0;

    for (const level of levels) {
      const fill = Math.min(level.size || 0, remaining);
      cost += fill * level.price;
      remaining -= fill;
      if (remaining <= 0) break;
    }

    const avgPrice = cost / Math.max(size - remaining, 1);
    const mid = orderbook.price;

    const slippage = (avgPrice - mid) / mid;

    return {
      avgPrice,
      mid,
      slippage
    };
  }
}

module.exports = SlippageModel;

