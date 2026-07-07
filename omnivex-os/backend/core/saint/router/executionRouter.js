import { getSophiaSignal } from "../../sophia/regimeEngine.js";
import { riskCheck } from "../../aegis/riskGovernor.js";
import { recordEvent } from "../../chronicle/replayEngine.js";

const positions = {};

/**
 * SAINT EXECUTION ENGINE v4
 * Fully deterministic execution layer
 */
export function routeOrder(symbol, price, context = {}) {

  // 1. SOPHIA DECISION LAYER
  const signal = getSophiaSignal(symbol);

  const order = {
    symbol,
    action: signal.action,
    price,
    size: context.size || 0.01,
    regime: signal.regime
  };

  // 2. AEGIS RISK GATE (HARD STOP)
  const risk = riskCheck(order, {
    volatility: context.volatility || 0
  });

  if (!risk.approved) {
    const blocked = {
      type: "SAINT_BLOCK",
      ...order,
      reason: risk.reason,
      ts: Date.now()
    };

    recordEvent(blocked);
    return blocked;
  }

  // 3. POSITION TRACKING
  if (!positions[symbol]) {
    positions[symbol] = { size: 0, avgPrice: 0 };
  }

  const pos = positions[symbol];

  let event;

  // 4. EXECUTION LOGIC
  if (pos.size === 0 && order.action === "BUY") {
    pos.size = order.size;
    pos.avgPrice = price;

    event = {
      type: "SAINT_EXECUTION",
      action: "BUY",
      symbol,
      price,
      size: order.size,
      regime: signal.regime,
      ts: Date.now()
    };
  }

  else {
    const pnl = (price - pos.avgPrice) / (pos.avgPrice || 1);

    if (pnl > 0.05 || pnl < -0.02) {
      event = {
        type: "SAINT_EXECUTION",
        action: "SELL",
        symbol,
        price,
        size: pos.size,
        pnl,
        regime: signal.regime,
        ts: Date.now()
      };

      positions[symbol] = { size: 0, avgPrice: 0 };
    } else {
      event = {
        type: "SAINT_HOLD",
        action: "HOLD",
        symbol,
        price,
        size: pos.size,
        pnl,
        regime: signal.regime,
        ts: Date.now()
      };
    }
  }

  // 5. PERSIST TO CHRONICLE
  recordEvent(event);

  return event;
}

export function getPositions() {
  return positions;
}
