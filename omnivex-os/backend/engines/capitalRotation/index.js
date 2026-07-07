/**
 * OMNIVEX OS PRIME
 * CAPITAL ROTATION ENGINE
 *
 * Purpose:
 * - Reads ledger state
 * - Listens to market ticks
 * - Computes allocation pressure per asset class
 * - Emits capital.rotation events into system bus
 */

export function createCapitalRotationEngine({ bus, ledger }) {
  if (!bus) throw new Error("CapitalEngine: bus is required");
  if (!ledger) throw new Error("CapitalEngine: ledger is required");

  console.log("[CAPITAL ENGINE] INITIALIZED");

  const state = {
    lastTick: null,
    equityCurve: [],
    allocations: {
      BTC: 0.4,
      ETH: 0.3,
      ALT: 0.2,
      STABLE: 0.1
    }
  };

  /**
   * CORE ROTATION LOGIC
   */
  function computeRotation(marketTick) {
    const pnl = ledger.getPnLSummary?.() || 0;

    const volatility = Math.abs(Math.sin(Date.now() / 100000)); // deterministic pseudo-volatility
    const momentum = (marketTick?.price || 1) % 100 / 100;

    const riskBias = pnl < 0 ? 0.6 : 0.3;

    return {
      BTC: clamp(0.2 + momentum * 0.4 - riskBias * 0.2, 0, 1),
      ETH: clamp(0.2 + volatility * 0.3, 0, 1),
      ALT: clamp(0.3 - momentum * 0.2 + volatility * 0.2, 0, 1),
      STABLE: clamp(riskBias + (1 - volatility) * 0.2, 0, 1)
    };
  }

  /**
   * EMIT ROTATION EVENT
   */
  function emitRotation(marketTick) {
    const alloc = computeRotation(marketTick);

    const event = {
      id: cryptoRandomId(),
      type: "capital.rotation",
      source: "CAPITAL_ENGINE",
      timestamp: Date.now(),
      payload: {
        allocations: alloc,
        pnl: ledger.getPnLSummary?.() || 0
      }
    };

    bus.emit("capital.rotation", event);

    console.log("[CAPITAL ENGINE] ROTATION", alloc);
  }

  /**
   * MARKET TICK HANDLER
   */
  bus.on("market.tick", (tick) => {
    state.lastTick = tick;
    emitRotation(tick);
  });

  /**
   * PERIODIC ROTATION (heartbeat)
   */
  setInterval(() => {
    emitRotation(state.lastTick);
  }, 5000);

  return {
    getState: () => state
  };
}

/**
 * UTILITIES
 */
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function cryptoRandomId() {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).substring(2, 10)
  );
}
