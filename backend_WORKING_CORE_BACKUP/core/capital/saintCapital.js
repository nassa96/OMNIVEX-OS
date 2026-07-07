let capitalState = {
  equity: 10000,
  exposure: 0,
  peakEquity: 10000,
  drawdown: 0
};

function updateEquity(delta) {
  capitalState.equity += delta;

  if (capitalState.equity > capitalState.peakEquity) {
    capitalState.peakEquity = capitalState.equity;
  }

  capitalState.drawdown =
    (capitalState.peakEquity - capitalState.equity) /
    capitalState.peakEquity;
}

function calculatePositionSize({ strategyWeight, rewardBias }) {
  const baseRisk = 0.02;

  const drawdownMultiplier = Math.max(
    0.2,
    1 - capitalState.drawdown * 2
  );

  return Math.max(
    1,
    capitalState.equity *
      baseRisk *
      strategyWeight *
      rewardBias *
      drawdownMultiplier
  );
}

function buildOrder({ decision, positionSize, market }) {
  return {
    exchange: "binance",
    symbol: market.symbol,
    side: decision.action,
    size: positionSize,
    price: market.price
  };
}

function applyPnL({ positionSize, outcome }) {
  const pnl = positionSize * (outcome === "WIN" ? 0.01 : -0.01);

  updateEquity(pnl);

  capitalState.exposure = positionSize;

  return {
    pnl,
    equity: capitalState.equity,
    drawdown: capitalState.drawdown
  };
}

function getState() {
  return capitalState;
}

export {
  calculatePositionSize,
  applyPnL,
  buildOrder,
  getState
};
