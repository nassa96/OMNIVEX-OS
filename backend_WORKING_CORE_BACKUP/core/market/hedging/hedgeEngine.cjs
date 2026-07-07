/**
 * SAINT V41 — HEDGE + RISK NEUTRALIZATION ENGINE
 * -----------------------------------------------
 * Reduces directional exposure using simple offsets
 */

class HedgeEngine {

  constructor(positionEngine) {
    this.positions = positionEngine;
  }

  // ---------------------------
  // CALCULATE NET EXPOSURE
  // ---------------------------
  getNetExposure() {

    const history = this.positions.history || [];

    let long = 0;
    let short = 0;

    for (const t of history) {
      const pnl = t.pnl || 0;

      if (pnl >= 0) long += Math.abs(t.size || 1);
      else short += Math.abs(t.size || 1);
    }

    return {
      long,
      short,
      net: long - short
    };
  }

  // ---------------------------
  // HEDGE DECISION LOGIC
  // ---------------------------
  computeHedgeSignal() {

    const exposure = this.getNetExposure();

    const imbalance = Math.abs(exposure.net);

    let action = "NONE";

    if (imbalance > 50) {
      action = exposure.net > 0 ? "SHORT_HEDGE" : "LONG_HEDGE";
    }

    return {
      ...exposure,
      imbalance,
      action
    };
  }

  // ---------------------------
  // APPLY HEDGE ADJUSTMENT
  // ---------------------------
  applyHedge(position) {

    const signal = this.computeHedgeSignal();

    if (signal.action === "SHORT_HEDGE") {
      return {
        ...position,
        hedge: "SHORT_ADDED",
        size: position.size * 0.5
      };
    }

    if (signal.action === "LONG_HEDGE") {
      return {
        ...position,
        hedge: "LONG_ADDED",
        size: position.size * 0.5
      };
    }

    return position;
  }
}

module.exports = HedgeEngine;
