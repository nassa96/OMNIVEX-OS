/**
 * SAINT V77 — TRADE LEDGER
 * Persistent execution history
 */

class TradeLedgerV77 {

  constructor(db) {
    this.db = db;
  }

  async recordTrade(trade) {

    return await this.db.insert("trades", {
      symbol: trade.symbol,
      side: trade.side,
      pnl: trade.pnl,
      ts: Date.now()
    });
  }
}

module.exports = TradeLedgerV77;
