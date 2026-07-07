class Ledger {
  constructor() {
    this.positions = {};
    this.executions = [];
    this.realizedPnL = 0;
  }

  updateExecution(event) {
    const { symbol, signal, price, approved } = event;

    if (!approved || typeof price !== "number") {
      this.executions.push({
        ...event,
        status: "REJECTED"
      });
      return;
    }

    if (!this.positions[symbol]) {
      this.positions[symbol] = {
        size: 0,
        avgPrice: 0,
        costBasis: 0
      };
    }

    const pos = this.positions[symbol];

    // BUY → weighted average cost basis
    if (signal === "BUY") {
      const newSize = pos.size + 1;

      pos.avgPrice =
        (pos.avgPrice * pos.size + price) / newSize;

      pos.size = newSize;
      pos.costBasis = pos.avgPrice;
    }

    // SELL → realize PnL per unit
    if (signal === "SELL" && pos.size > 0) {
      const pnl = price - pos.avgPrice;

      this.realizedPnL += pnl;

      pos.size -= 1;

      if (pos.size === 0) {
        pos.avgPrice = 0;
        pos.costBasis = 0;
      }
    }

    this.executions.push({
      ...event,
      status: "EXECUTED",
      pnl: this.realizedPnL,
      position: { ...pos }
    });
  }

  snapshot() {
    return {
      positions: this.positions,
      executions: this.executions.slice(-50),
      realizedPnL: this.realizedPnL
    };
  }
}

export const ledger = new Ledger();
