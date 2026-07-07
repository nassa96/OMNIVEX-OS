let marketState = {
  symbol: "BTCUSDT",
  price: 105000,
  volume: 1000000,
  trend: "NEUTRAL",
  change24h: 0,
  timestamp: Date.now()
};

function randomMove(min, max) {
  return Math.random() * (max - min) + min;
}

export function updateMarket() {
  const move = randomMove(-250, 250);

  marketState.price += move;

  if (marketState.price < 1000) {
    marketState.price = 1000;
  }

  marketState.volume =
    Math.floor(randomMove(500000, 5000000));

  marketState.change24h =
    Number(randomMove(-8, 8).toFixed(2));

  if (move > 50) {
    marketState.trend = "BULLISH";
  } else if (move < -50) {
    marketState.trend = "BEARISH";
  } else {
    marketState.trend = "NEUTRAL";
  }

  marketState.timestamp = Date.now();

  return marketState;
}

export function getMarketState() {
  return marketState;
}
