/**
 * OMNIVEX OS — LEDGER v2
 * Causal trade accounting + strategy attribution engine
 */

export function createLedgerEngine({ bus, chronicle, state } = {}) {
  if (!bus) throw new Error("Bus required for ledger engine");

  /**
   * =========================
   * INTERNAL BOOKS
   * =========================
   */

  const ledger = {
    trades: [],
    pnl: 0,
    byAsset: {},
    byStrategy: {},
    byVenue: {},
    byRegime: {}
  };

  /**
   * =========================
   * HELPERS
   * =========================
   */

  function ensure(map, key) {
    if (!map[key]) map[key] = { pnl: 0, count: 0 };
    return map[key];
  }

  function applyPnl(bucket, pnl) {
    bucket.pnl += pnl;
    bucket.count += 1;
  }

  /**
   * =========================
   * TRADE INGESTION
   * =========================
   */

  function recordTrade(event) {
    const trade = {
      ts: Date.now(),

      asset: event.asset || "BTC",

      venue: event.venue || "unknown",

      size: event.size || 0,

      pnl: event.pnl || 0,

      regime: event.regime || "UNKNOWN",

      strategy: event.strategy || "SAINT",

      source: event.source || "execution"
    };

    ledger.trades.push(trade);

    ledger.pnl += trade.pnl;

    /**
     * BY ASSET
     */
    applyPnl(ensure(ledger.byAsset, trade.asset), trade.pnl);

    /**
     * BY VENUE
     */
    applyPnl(ensure(ledger.byVenue, trade.venue), trade.pnl);

    /**
     * BY STRATEGY
     */
    applyPnl(ensure(ledger.byStrategy, trade.strategy), trade.pnl);

    /**
     * BY REGIME
     */
    applyPnl(ensure(ledger.byRegime, trade.regime), trade.pnl);

    chronicle?.append?.({
      type: "ledger.trade.record",
      data: trade
    });

    return trade;
  }

  /**
   * =========================
   * EVENT LISTENER
   * =========================
   */

  bus.onAny((event) => {
    if (!event) return;

    /**
     * EXECUTION FEED → LEDGER
     */
    if (event.type === "execution.order.update") {
      recordTrade({
        asset: event.asset,
        venue: event.venue,
        size: event.size,
        pnl: event.pnl || 0,
        strategy: "SAINT"
      });
    }

    /**
     * CAPITAL FEEDBACK (optional attribution hook)
     */
    if (event.type === "capital.rotation") {
      chronicle?.append?.({
        type: "ledger.capital.snapshot",
        data: event.portfolio
      });
    }
  });

  /**
   * =========================
   * QUERY API
   * =========================
   */

  function getSummary() {
    return {
      pnl: ledger.pnl,
      trades: ledger.trades.length,
      byAsset: ledger.byAsset,
      byVenue: ledger.byVenue,
      byStrategy: ledger.byStrategy,
      byRegime: ledger.byRegime
    };
  }

  return {
    recordTrade,
    getSummary
  };
}
