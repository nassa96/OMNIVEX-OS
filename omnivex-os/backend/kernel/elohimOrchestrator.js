/**
 * OMNIVEX OS — ELOHIM v1
 * Global system governor that arbitrates between all subsystems
 */

export function createElohimOrchestrator({
  bus,
  chronicle,
  state,
  ledger
} = {}) {
  if (!bus) throw new Error("Bus required for Elohim orchestrator");

  /**
   * =========================
   * SYSTEM WEIGHTS
   * =========================
   */

  const weights = {
    SOPHIA: 0.25,
    OVERLORD: 0.25,
    CAPITAL: 0.2,
    SAINT: 0.2,
    LEDGER: 0.1
  };

  /**
   * =========================
   * DECISION BUFFER
   * =========================
   */

  let lastDecision = null;

  /**
   * =========================
   * SCORING FUNCTION
   * =========================
   */

  function score(signal) {
    let s = 0;

    if (!signal) return 0;

    s += (signal.sophiaStrength || 0) * weights.SOPHIA;
    s += (signal.memeScore || 0) * 0.1;
    s += (signal.arbitrageScore || 0) * 0.15;
    s += (signal.capitalConfidence || 0) * weights.CAPITAL;
    s += (signal.executionConfidence || 0) * weights.SAINT;

    const pnl = ledger?.getSummary?.().pnl || 0;

    if (pnl < 0) s -= 0.1;
    if (pnl > 0) s += 0.1;

    return s;
  }

  /**
   * =========================
   * FINAL RESOLUTION
   * =========================
   */

  function resolve(event) {
    const decisionScore = score(event);

    const decision = {
      type: "system.decision",

      ts: Date.now(),

      score: decisionScore,

      action:
        decisionScore > 0.6
          ? "EXECUTE"
          : decisionScore > 0.3
          ? "WAIT"
          : "HOLD",

      source: {
        sophia: event?.regime || "UNKNOWN",
        overlord: event?.venue || "coinbase",
        capital: event?.portfolio || null
      }
    };

    lastDecision = decision;

    bus.emit(decision.type, decision);
    chronicle?.append?.(decision);

    return decision;
  }

  /**
   * =========================
   * EVENT LISTENER
   * =========================
   */

  bus.onAny((event) => {
    if (!event) return;

    /**
     * MAIN DECISION INPUTS
     */
    if (
      event.type === "signal.sophia" ||
      event.type === "market.overlord.route" ||
      event.type === "capital.rotation"
    ) {
      resolve(event);
    }
  });

  return {
    getDecision: () => lastDecision
  };
}
