import { ORDER_STATES, isTerminalState } from "./orderStates.js";

/**
 * EXECUTION STATE MACHINE V1
 * Deterministic order lifecycle manager
 */

export class ExecutionStateMachine {
  constructor() {
    this.state = ORDER_STATES.IDLE;

    this.context = {
      order: null,
      symbol: null,
      price: null,
      risk: null,
      signal: null
    };

    this.ledger = [];
  }

  transition(nextState, payload = {}) {
    if (isTerminalState(this.state)) {
      throw new Error(`Cannot transition from terminal state: ${this.state}`);
    }

    const entry = {
      from: this.state,
      to: nextState,
      timestamp: Date.now(),
      payload
    };

    this.ledger.push(entry);

    this.state = nextState;
    this.context = { ...this.context, ...payload };

    return entry;
  }

  start(signal, symbol, price) {
    this.context.signal = signal;
    this.context.symbol = symbol;
    this.context.price = price;

    return this.transition(ORDER_STATES.SIGNAL, {
      signal,
      symbol,
      price
    });
  }

  validate() {
    return this.transition(ORDER_STATES.VALIDATED);
  }

  approveRisk(risk) {
    if (risk.kill) {
      return this.transition(ORDER_STATES.REJECTED, { risk });
    }

    return this.transition(ORDER_STATES.RISK_APPROVED, { risk });
  }

  execute(order) {
    return this.transition(ORDER_STATES.EXECUTING, { order });
  }

  fill(execution) {
    return this.transition(ORDER_STATES.FILLED, { execution });
  }

  settle() {
    return this.transition(ORDER_STATES.SETTLED);
  }

  record() {
    return this.transition(ORDER_STATES.RECORDED);
  }

  getLedger() {
    return this.ledger;
  }
}
