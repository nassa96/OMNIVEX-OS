function toFloatBook(book) {
  const bids = (book.bids || []).map(b => ({
    price: parseFloat(b[0]),
    size: parseFloat(b[1])
  }));

  const asks = (book.asks || []).map(a => ({
    price: parseFloat(a[0]),
    size: parseFloat(a[1])
  }));

  return { ...book, bids, asks };
}

function getMid(bids, asks) {
  if (!bids.length || !asks.length) return null;

  const bestBid = Math.max(...bids.map(b => b.price));
  const bestAsk = Math.min(...asks.map(a => a.price));

  return (bestBid + bestAsk) / 2;
}

function getImbalance(bids, asks) {
  const bidVol = bids.reduce((a, b) => a + b.size, 0);
  const askVol = asks.reduce((a, b) => a + b.size, 0);

  return (bidVol - askVol) / (bidVol + askVol || 1);
}

module.exports = {
  toFloatBook,
  getMid,
  getImbalance
};
