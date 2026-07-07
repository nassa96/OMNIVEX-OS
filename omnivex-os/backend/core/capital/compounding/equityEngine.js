/**
 * SIMULATED EQUITY FEEDBACK LOOP
 * (replace with real exchange PnL later)
 */

const portfolio = require("../metrics/portfolioState");

class EquityEngine {

  simulateUpdate() {
    const current = portfolio.getState().equity;

    // pseudo market performance
    const drift = (Math.random() - 0.48) * 0.03;

    const newEquity = current * (1 + drift);

    return portfolio.updateEquity(newEquity);
  }

  startLoop(interval = 15000) {
    setInterval(() => {
      this.simulateUpdate();
    }, interval);
  }
}

module.exports = new EquityEngine();
