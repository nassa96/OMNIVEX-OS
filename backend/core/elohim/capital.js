/**
 * =========================================================
 * OMNIVEX — CAPITAL ALLOCATION ENGINE V1
 * Position sizing + risk scaling per regime
 * =========================================================
 */

const BASE_CAPITAL = 1000;

let state = {
  equity: BASE_CAPITAL,
  drawdown: 0,
  lastPnL: 0
};

function updatePnL(pnl) {
  state.lastPnL = pnl;
  state.equity += pnl;

  const peak = Math.max(state.equity, BASE_CAPITAL);
  state.drawdown = (peak - state.equity) / peak;
}

/**
 * Position sizing engine
 * - risk decreases in volatility
 * - increases in trend confidence
 */
function sizePosition(signal, regime) {
  let riskMultiplier = 1;

  switch (regime.regime) {
    case "TREND_UP":
    case "TREND_DOWN":
      riskMultiplier = 1.2;
      break;

    case "CHOP":
      riskMultiplier = 0.7;
      break;

    case "VOLATILE":
      riskMultiplier = 0.4;
      break;

    case "LOW_VOL":
      riskMultiplier = 1.0;
      break;

    default:
      riskMultiplier = 0.6;
  }

  const confidence = signal.strength || 0.5;

  // core sizing formula
  let position = state.equity * 0.01 * confidence * riskMultiplier;

  // risk cap (hard safety)
  position = Math.min(position, state.equity * 0.05);

  return {
    positionSize: position,
    riskMultiplier,
    equity: state.equity,
    drawdown: state.drawdown
  };
}

module.exports = {
  sizePosition,
  updatePnL
};
