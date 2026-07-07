/**
 * OMNIVEX OS — OMEGA MERGE MODE v1
 * Unified probabilistic decision field (final architecture collapse)
 */

export function createOmegaMergeMode({
  bus,
  ledger,
  chronicle,
  mutation,
  omega
} = {}) {
  if (!bus) throw new Error("Bus required for omega merge mode");

  /**
   * =========================
   * UNIFIED INTELLIGENCE FIELD
   * =========================
   */

  const field = {
    signalPressure: 0,
    riskPressure: 0,
    capitalFlow: 0,
    regimeBias: 0,
    executionBias: 0
  };

  /**
   * =========================
   * FIELD UPDATE
   * =========================
   */

  function updateField(event) {
    if (!event) return;

    /**
     * LEDGER FEEDBACK → REALITY TRUTH
     */
    if (event.type === "ledger.trade.record") {
      field.capitalFlow += event.pnl || 0;
    }

    /**
     * OMEGA FEEDBACK → SYSTEM MEMORY
     */
    if (event.type === "omega.reflection") {
      const r = event.reflection;

      field.riskPressure =
        r.regime === "CONTRACTION" ? 1 : 0;

      field.regimeBias =
        r.regime === "EXPANSION" ? 1 : -1;
    }

    /**
     * MUTATION FEEDBACK → SYSTEM EVOLUTION
     */
    if (event.type === "mutation.update") {
      field.signalPressure =
        (event.pnl || 0) > 0 ? 1 : -1;
    }
  }

  /**
   * =========================
   * PROBABILITY ENGINE
   * =========================
   */

  function decisionScore(input) {
    let score = 0;

    score += field.signalPressure * 0.25;
    score += field.capitalFlow * 0.2;
    score += field.regimeBias * 0.25;
    score += field.riskPressure * -0.3;
    score += (input?.confidence || 0) * 0.2;

    return score;
  }

  /**
   * =========================
   * FINAL ACTION RESOLUTION
   * =========================
   */

  function resolve(input) {
    const score = decisionScore(input);

    const decision = {
      type: "omega.merge.decision",

      ts: Date.now(),

      score,

      action:
        score > 0.6
          ? "EXECUTE"
          : score > 0.3
          ? "WAIT"
          : "HOLD",

      field: { ...field },

      input
    };

    bus.emit(decision.type, decision);
    chronicle?.append?.(decision);

    return decision;
  }

  /**
   * =========================
   * EVENT PIPELINE
   * =========================
   */

  bus.onAny((event) => {
    updateField(event);

    /**
     * ANY SIGNAL CAN TRIGGER RESOLUTION
     */
    if (
      event.type === "signal.sophia" ||
      event.type === "market.tick" ||
      event.type === "omega.cycle"
    ) {
      resolve({
        confidence: event?.confidence || 0.5
      });
    }
  });

  return {
    getField: () => field,
    resolve
  };
}
