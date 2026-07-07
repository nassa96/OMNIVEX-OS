import { ExecutionStateMachine } from "../execution/stateMachine/executionStateMachine.js";
import { runExecutionEngine, simulateFill } from "../execution/executionState.js";
import { appendLedger } from "../execution/ledger/executionLedger.js";

/**
 * SAINT — Execution + Ledger System
 */

export function runSaint(signal, risk, price) {
  const sm = new ExecutionStateMachine();

  sm.start(signal, signal.symbol || "UNKNOWN", price);
  sm.validate();

  const riskStep = sm.approveRisk(risk);

  if (riskStep.to === "REJECTED") {
    appendLedger({
      symbol: signal.symbol,
      state: "REJECTED",
      signal,
      risk
    });

    return {
      state: "REJECTED",
      ledger: sm.getLedger()
    };
  }

  const exec = runExecutionEngine(signal, risk);
  sm.execute(exec);

  const fill = simulateFill(exec, price);

  sm.fill(fill);
  sm.settle();
  sm.record();

  const final = {
    symbol: signal.symbol,
    state: sm.state,
    signal,
    risk,
    execution: fill,
    ledger: sm.getLedger()
  };

  appendLedger(final);

  return final;
}
