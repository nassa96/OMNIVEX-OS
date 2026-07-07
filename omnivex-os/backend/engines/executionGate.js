/**
 * OMNIVEX OS PRIME
 * EXECUTION GATE (SAFETY + CONSENSUS LAYER)
 *
 * THIS IS THE ONLY PATH TO EXECUTION
 */

export function createExecutionGate({ bus, aegis, saint, chronicle }) {
  /**
   * ALL capital rotation signals MUST pass here
   */
  bus.on("capital.rotation", (event) => {
    const signal = event.payload;

    const risk = aegis.evaluate(signal);

    /**
     * AEGIS HARD BLOCK
     */
    if (!risk.approved) {
      bus.emit("execution.blocked", {
        id: event.id,
        type: "execution.blocked",
        source: "AEGIS",
        timestamp: Date.now(),
        payload: {
          reason: risk.reason || "risk_threshold_exceeded",
          signal
        }
      });

      return;
    }

    /**
     * SAINT EXECUTION
     */
    const execution = saint.execute({
      signal,
      risk
    });

    /**
     * CHRONICLE RECORDING (IMMUTABLE EVENT LOG)
     */
    chronicle.append({
      id: event.id,
      type: "execution.recorded",
      source: "EXECUTION_GATE",
      timestamp: Date.now(),
      payload: {
        signal,
        risk,
        execution
      }
    });

    bus.emit("execution.executed", {
      id: event.id,
      type: "execution.executed",
      source: "SAINT",
      timestamp: Date.now(),
      payload: execution
    });
  });

  return {
    status: "EXECUTION_GATE_LOCKED"
  };
}
