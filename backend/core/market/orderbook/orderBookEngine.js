let orderBooks = {};

function seedBook(symbol) {
  if (!orderBooks[symbol]) {
    orderBooks[symbol] = {
      bids: [],
      asks: []
    };
  }
}

function generateSyntheticBook(price) {
  const bids = [];
  const asks = [];

  for (let i = 0; i < 10; i++) {
    bids.push({
      price: price - i * 2 - Math.random(),
      size: 1 + Math.random() * 5
    });

    asks.push({
      price: price + i * 2 + Math.random(),
      size: 1 + Math.random() * 5
    });
  }

  return { bids, asks };
}

function updateBook(symbol, price) {
  seedBook(symbol);

  orderBooks[symbol] = generateSyntheticBook(price);
  return orderBooks[symbol];
}

function getSpread(symbol) {
  const book = orderBooks[symbol];
  if (!book) return null;

  const bestBid = book.bids[0]?.price || 0;
  const bestAsk = book.asks[0]?.price || 0;

  return bestAsk - bestBid;
}

function getImbalance(symbol) {
  const book = orderBooks[symbol];
  if (!book) return 0;

  const bidVol = book.bids.reduce((a, b) => a + b.size, 0);
  const askVol = book.asks.reduce((a, b) => a + b.size, 0);

  return (bidVol - askVol) / (bidVol + askVol);
}

function getLiquidityPressure(symbol) {
  const imbalance = getImbalance(symbol);

  if (imbalance > 0.2) return "BUY_PRESSURE";
  if (imbalance < -0.2) return "SELL_PRESSURE";
  return "NEUTRAL";
}

function getDepthStrength(symbol) {
  const book = orderBooks[symbol];
  if (!book) return 0;

  const depth = book.bids.length + book.asks.length;
  return depth / 20;
}

function getBook(symbol) {
  return orderBooks[symbol];
}

function clearBook(symbol) {
  delete orderBooks[symbol];
}

export {
  updateBook,
  getSpread,
  getImbalance,
  getLiquidityPressure,
  getDepthStrength,
  getBook,
  clearBook
};
