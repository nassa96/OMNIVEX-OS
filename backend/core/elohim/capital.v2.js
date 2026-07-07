/**
 * =========================================================
 * CAPITAL ALLOCATOR V2 — RL RISK SCALING ENGINE
 * =========================================================
 */

let state = {
  equity: 10000,
  peak: 10000,
  drawdown: 0,
  smoothing: 0.85
};

function updatePnL(pnl) {
  state.equity += pnl;

  if (state.equity > state.peak) {
    state.peak = state.equity;
  }

  state.drawdown = (state.peak - state.equity) / state.peak;
}

function sizePosition(signal, regime) {
  let baseRisk = 0.01;

  // regime scaling
  switch (regime?.regime) {
    case "VOLATILE":
      baseRisk = 0.004;
      break;

    case "TREND_UP":
    case "TREND_DOWN":
      baseRisk = 0.015;
      break;

    case "LOW_VOL":
      baseRisk = 0.012;
      break;
  }

  const confidence = signal.strength || 0.5;

  let position =
    state.equity *
    baseRisk *
    confidence *
    (1 - state.drawdown);

  // smoothing (prevents equity spikes from over sizing)
  position = position * state.smoothing;

  // hard cap
  position = Math.min(position, state.equity * 0.05);

  return {
    positionSize: position,
    equity: state.equity,
    drawdown: state.drawdown
  };
}

module.exports = {
  sizePosition,
  updatePnL
};
