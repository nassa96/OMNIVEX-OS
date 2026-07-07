/**
 * OMNIVEX CAPITAL STATE
 * Single source of truth for portfolio equity + allocations
 */

class PortfolioState {
  constructor() {
    this.state = {
      equity: 10000, // starting capital (configurable later)
      peakEquity: 10000,
      drawdown: 0,
      positions: new Map(),
      history: []
    };
  }

  updateEquity(newEquity) {
    this.state.equity = newEquity;

    if (newEquity > this.state.peakEquity) {
      this.state.peakEquity = newEquity;
    }

    this.state.drawdown =
      (this.state.peakEquity - newEquity) / this.state.peakEquity;

    this.state.history.push({
      equity: newEquity,
      ts: Date.now()
    });

    return this.state;
  }

  getState() {
    return this.state;
  }
}

module.exports = new PortfolioState();
