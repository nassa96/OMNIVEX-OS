let latest = null;

function attachStream(stream) {
  stream.subscribe((snapshot) => {
    latest = computeMetrics(snapshot);
  });
}

function computeMetrics(book) {
  const bids = book.bids;
  const asks = book.asks;

  const bestBid = bids[0]?.[0] || 0;
  const bestAsk = asks[0]?.[0] || 0;

  const spread = bestAsk - bestBid;

  const bidVol = bids.reduce((sum, [, size]) => sum + size, 0);
  const askVol = asks.reduce((sum, [, size]) => sum + size, 0);

  const imbalance = (bidVol - askVol) / (bidVol + askVol || 1);

  let pressure = "NEUTRAL";
  if (imbalance > 0.25) pressure = "BUY_PRESSURE";
  if (imbalance < -0.25) pressure = "SELL_PRESSURE";

  return {
    spread,
    imbalance,
    pressure,
    depth: bids.length + asks.length,
    timestamp: book.timestamp
  };
}

function getMicrostructure() {
  return latest;
}

export {
  attachStream,
  getMicrostructure
};
