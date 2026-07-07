class MicrostructureEngine {

  static imbalance(bids, asks) {
    const bidVol = bids.reduce((a, [,q]) => a + q, 0);
    const askVol = asks.reduce((a, [,q]) => a + q, 0);

    return (bidVol - askVol) / (bidVol + askVol || 1);
  }

  static liquidityDepth(book, levels = 10) {
    const bidDepth = book.bids.slice(0, levels)
      .reduce((a, [,q]) => a + q, 0);

    const askDepth = book.asks.slice(0, levels)
      .reduce((a, [,q]) => a + q, 0);

    return { bidDepth, askDepth };
  }

  static slippageEstimate(book, size, side) {
    const levels = side === "BUY" ? book.asks : book.bids;
    let remaining = size;
    let cost = 0;

    for (let [price, qty] of levels) {
      const fill = Math.min(qty, remaining);
      cost += fill * price;
      remaining -= fill;
      if (remaining <= 0) break;
    }

    return remaining > 0
      ? 1 // extreme slippage penalty
      : cost / size;
  }

  static adverseSelectionRisk(mid, futureMid) {
    return (futureMid - mid) / mid;
  }
}

module.exports = MicrostructureEngine;
