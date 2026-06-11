const portfolio = {
  position: null,
  entryPrice: null,
  quantity: 1,
  realizedPnL: 0,
  unrealizedPnL: 0,
  wins: 0,
  losses: 0,
  totalTrades: 0
};

export function getPortfolio() {
  return portfolio;
}

export function openPosition(side, price) {

  if (portfolio.position === side) {
    return {
      executed: false,
      reason: "DUPLICATE_POSITION"
    };
  }

  portfolio.position = side;
  portfolio.entryPrice = price;

  return {
    executed: true,
    side,
    entryPrice: price
  };
}

export function closePosition(price) {

  if (!portfolio.position || portfolio.entryPrice === null) {
    return {
      executed: false,
      reason: "NO_POSITION"
    };
  }

  let pnl = 0;

  if (portfolio.position === "BUY") {
    pnl = price - portfolio.entryPrice;
  } else {
    pnl = portfolio.entryPrice - price;
  }

  portfolio.realizedPnL += pnl;
  portfolio.totalTrades += 1;

  if (pnl >= 0) portfolio.wins += 1;
  else portfolio.losses += 1;

  const closed = {
    side: portfolio.position,
    entry: portfolio.entryPrice,
    exit: price,
    pnl
  };

  portfolio.position = null;
  portfolio.entryPrice = null;

  return {
    executed: true,
    ...closed
  };
}

export function updateUnrealized(price) {

  if (!portfolio.position || portfolio.entryPrice === null) {
    portfolio.unrealizedPnL = 0;
    return;
  }

  if (portfolio.position === "BUY") {
    portfolio.unrealizedPnL = price - portfolio.entryPrice;
  } else {
    portfolio.unrealizedPnL = portfolio.entryPrice - price;
  }
}
