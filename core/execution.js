import {
  getPortfolio,
  openPosition,
  closePosition,
  updateUnrealized
} from "./portfolio.js";

let lastExecution = 0;
let lastSignal = null;

const COOLDOWN_MS = 15000;

export function executionEngine(signal, confidence, price) {

  const now = Date.now();

  /* ============================================================
     COOLDOWN
  ============================================================ */

  if (now - lastExecution < COOLDOWN_MS) {
    return {
      allowed: false,
      reason: "COOLDOWN_ACTIVE"
    };
  }

  /* ============================================================
     CONFIDENCE GATE
  ============================================================ */

  if (confidence < 0.75) {
    return {
      allowed: false,
      reason: "LOW_CONFIDENCE"
    };
  }

  /* ============================================================
     DUPLICATE SIGNAL BLOCK
  ============================================================ */

  if (signal === lastSignal) {
    return {
      allowed: false,
      reason: "DUPLICATE_SIGNAL"
    };
  }

  const portfolio = getPortfolio();

  /* ============================================================
     POSITION LOGIC
  ============================================================ */

  if (signal === "BUY") {

    if (portfolio.position === "SELL") {
      closePosition(price);
    }

    const result = openPosition("BUY", price);

    if (!result.executed) {
      return {
        allowed: false,
        reason: result.reason
      };
    }
  }

  if (signal === "SELL") {

    if (portfolio.position === "BUY") {
      closePosition(price);
    }

    const result = openPosition("SELL", price);

    if (!result.executed) {
      return {
        allowed: false,
        reason: result.reason
      };
    }
  }

  updateUnrealized(price);

  lastExecution = now;
  lastSignal = signal;

  return {
    allowed: true,
    portfolio: getPortfolio()
  };
}
