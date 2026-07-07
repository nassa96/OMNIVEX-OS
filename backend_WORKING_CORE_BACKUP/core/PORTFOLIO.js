class PORTFOLIO {
  constructor() {
    this.cash = 10000;
    this.position = 0;
    this.entryPrice = null;
    this.pnl = 0;
    this.trades = 0;
    this.drawdown = 0;
  }

  applyExecution(execution) {
    if (!execution.executed) return this.snapshot();

    const price = execution.price;

    if (execution.action === "BUY") {
      this.position += 1;
      this.entryPrice = price;
      this.cash -= price;
      this.trades++;
    }

    if (execution.action === "SELL" && this.position > 0) {
      this.position -= 1;
      this.cash += price;
      this.trades++;

      this.pnl = this.cash - 10000;
    }

    this.drawdown = Math.min(this.drawdown, this.pnl);

    return this.snapshot();
  }

  snapshot() {
    return {
      cash: this.cash,
      position: this.position,
      pnl: this.pnl,
      trades: this.trades,
      drawdown: this.drawdown
    };
  }
}

module.exports = PORTFOLIO;
