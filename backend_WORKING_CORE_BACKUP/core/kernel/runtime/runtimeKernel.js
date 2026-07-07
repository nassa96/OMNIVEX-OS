"use strict";

/**
 * SAINT_PRIMAL RUNTIME KERNEL v6
 * REGISTRY-INJECTED EXECUTION ENGINE
 */

let PROMETHEUS;
let AURYN;
let RISK;
let CHRONICLE;
let EXECUTION;

const STATE = {
  ticks: 0,
  executed: 0,
  rejected: 0
};

/**
 * Inject registry modules at boot
 */
export function injectRegistry(reg) {
  PROMETHEUS = reg.prometheus;
  AURYN = reg.auryn;
  RISK = reg.risk;
  CHRONICLE = reg.chronicle;
  EXECUTION = reg.execution;
}

/**
 * Main tick loop
 */
export function runTick(signal) {
  STATE.ticks++;

  if (!signal) {
    return { tick: STATE.ticks, status: "NO_SIGNAL" };
  }

  PROMETHEUS?.adaptFromRegime?.();

  const decision = PROMETHEUS?.score
    ? PROMETHEUS.score(signal)
    : { decision: "HOLD", confidence: 0 };

  const vote = AURYN?.vote ? AURYN.vote(decision) : decision;

  const riskCheck = RISK.allowExecution(vote);

  if (!riskCheck.allowed) {
    STATE.rejected++;

    return {
      tick: STATE.ticks,
      decision: vote,
      execution: null,
      risk: riskCheck,
      stats: STATE
    };
  }

  let execution = null;

  if (vote.decision !== "HOLD") {
    execution = EXECUTION.route(vote);

    const success = execution?.status === "ROUTED";

    const entry = {
      ...vote,
      success,
      pnl: execution?.result?.pnl || 0,
      ts: Date.now()
    };

    CHRONICLE.record(entry);
    PROMETHEUS.feedback(entry);
    AURYN.feedback(entry);

    if (success) STATE.executed++;
    else STATE.rejected++;
  } else {
    STATE.rejected++;
  }

  return {
    tick: STATE.ticks,
    decision: vote,
    execution,
    stats: STATE
  };
}

export function getState() {
  return STATE;
}

export default {
  runTick,
  injectRegistry,
  getState
};
