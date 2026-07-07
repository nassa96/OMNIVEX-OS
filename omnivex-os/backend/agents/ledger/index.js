/**
 * OMNIVEX OS PRIME — LEDGER AGENT
 * Bridges EventBus → Ledger Core
 */

export function createLedgerAgent({ bus, ledger }) {

  if (!bus || !ledger) {
    throw new Error("LEDGER AGENT: missing dependencies");
  }

  // Convert executed trades into ledger entries
  bus.on("trade.executed", (event) => {
    ledger.recordTrade({
      id: event.id,
      type: "trade.executed",
      source: event.source || "saint",
      timestamp: event.timestamp || Date.now(),
      payload: event.payload || {}
    });
  });

  // Optional settlement updates
  bus.on("trade.settlement", (event) => {
    const { entry_id, pnl } = event.payload || {};
    if (entry_id) {
      ledger.updatePnL(entry_id, pnl);
    }
  });

  return {
    status: "LEDGER_AGENT_ACTIVE"
  };
}
