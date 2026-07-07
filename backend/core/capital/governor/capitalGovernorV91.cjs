/**
 * SAINT V91 — CAPITAL GOVERNOR
 * HARD CAPITAL PROTECTION LAYER
 */

class CapitalGovernorV91 {

  constructor(config = {}) {

    this.maxDailyLoss = config.maxDailyLoss || 100;
    this.maxPositionSize = config.maxPositionSize || 0.1;

    this.dailyPnL = 0;
    this.locked = false;
  }

  updatePnL(pnl) {
    this.dailyPnL += pnl;

    if (this.dailyPnL <= -this.maxDailyLoss) {
      this.locked = true;
    }
  }

  approve(order) {

    if (this.locked) {
      return { approved: false, reason: "CAPITAL_LOCKED" };
    }

    if (order.size > this.maxPositionSize) {
      return { approved: false, reason: "POSITION_TOO_LARGE" };
    }

    return { approved: true };
  }

  status() {
    return {
      locked: this.locked,
      dailyPnL: this.dailyPnL
    };
  }
}

module.exports = CapitalGovernorV91;
