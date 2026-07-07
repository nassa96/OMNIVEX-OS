/**
 * SAINT EXECUTION GATE
 * - Final decision layer for all trades
 * - Enforces AEGIS risk rules
 * - Validates SOPHIA signals
 * - Emits execution events into EventBus
 */

export function createSaintGate(bus, { riskLimit = 0.85 } = {}) {

  let halted = false;

  function killSwitch(reason = "manual") {
    halted = true;

    bus.emit("system.halt", {
      reason,
      severity: "CRITICAL"
    });
  }

  function resume() {
    halted = false;

    bus.emit("system.resume", {
      status: "ACTIVE"
    });
  }

  function evaluateSignal(signal) {
    if (halted) {
      return { approved: false, reason: "HALTED" };
    }

    if (!signal || typeof signal.strength !== "number") {
      return { approved: false, reason: "INVALID_SIGNAL" };
    }

    const riskScore = Math.abs(signal.strength);

    if (riskScore > riskLimit) {
      bus.emit("risk.block", {
        riskScore,
        limit: riskLimit,
        signal
      });

      return { approved: false, reason: "RISK_LIMIT" };
    }

    const approved = riskScore >= 0.05;

    return {
      approved,
      riskScore
    };
  }

  function execute(signal) {
    const evaluation = evaluateSignal(signal);

    if (!evaluation.approved) {
      bus.emit("trade.rejected", {
        signal,
        reason: evaluation.reason || "UNKNOWN"
      });

      return evaluation;
    }

    const trade = {
      id: crypto.randomUUID?.() || String(Date.now()),
      signal,
      strength: signal.strength,
      ts: Date.now(),
      status: "EXECUTED"
    };

    bus.emit("trade.executed", trade);

    return {
      approved: true,
      trade
    };
  }

  return {
    execute,
    evaluateSignal,
    killSwitch,
    resume
  };
}
