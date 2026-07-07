const history = {};

export function pushPrice(symbol, price) {
  if (!history[symbol]) history[symbol] = [];

  history[symbol].push(price);

  // keep last 20 points
  if (history[symbol].length > 20) {
    history[symbol].shift();
  }
}

export function getHistory(symbol) {
  return history[symbol] || [];
}
