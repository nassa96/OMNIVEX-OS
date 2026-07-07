/**
 * OMNIVEX OS PRIME
 * LEDGER TRUTH LAYER (EVENTBUS COMPATIBLE)
 */

export function createLedger({ bus, chronicle }) {
  const state = {
    entries: [],
    positions: {
      BTC: 0,
      ETH: 0,
      ALT: 0,
      STABLE: 0
    }
  };

  /**
   * FIX: USE onAny INSTEAD OF on
   * (your EventBus is NOT EventEmitter-based)
   */
  if (bus?.onAny) {
    bus.onAny((event) => {
      if (event?.type !== "saint.execution") return;

      const execution = event.payload;

      const entry = buildLedgerEntry(event, execution);

      state.entries.push(entry);

      reconcilePositions(execution);

      chronicle?.append?.({
        id: event.id,
        type: "ledger.entry",
        source: "LEDGER",
        timestamp: Date.now(),
        payload: entry
      });

      bus.emit?.("ledger.update", {
        id: event.id,
        type: "ledger.update",
        source: "LEDGER",
        timestamp: Date.now(),
        payload: {
          entry,
          positions: state.positions
        }
      });
    });
  }

  function buildLedgerEntry(event, execution) {
    return Object.freeze({
      id: event.id,
      type: "TRADE_REBALANCE",
      source: "SAINT → LEDGER",
      timestamp: Date.now(),
      allocations: execution.allocations,
      riskProfile: execution.riskProfile,
      intent: execution.intent
    });
  }

  function reconcilePositions(execution) {
    const a = execution.allocations;

    state.positions.BTC += a.BTC;
    state.positions.ETH += a.ETH;
    state.positions.ALT += a.ALT;
    state.positions.STABLE += a.STABLE;

    normalize();
  }

  function normalize() {
    const total =
      state.positions.BTC +
      state.positions.ETH +
      state.positions.ALT +
      state.positions.STABLE;

    if (!total) return;

    state.positions.BTC /= total;
    state.positions.ETH /= total;
    state.positions.ALT /= total;
    state.positions.STABLE /= total;
  }

  return state;
}
