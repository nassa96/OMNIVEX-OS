/**
 * STATE MACHINE V1 (HARDENED)
 * Enforces deterministic execution lifecycle
 */

const VALID_TRANSITIONS = {
  CREATED: ["RISK_APPROVED", "REJECTED"],
  RISK_APPROVED: ["SUBMITTED", "REJECTED"],
  SUBMITTED: ["EXECUTED", "FAILED"],
  EXECUTED: [],
  REJECTED: [],
  FAILED: []
};

export class StateMachine {
  constructor() {
    this.states = new Map();
  }

  create(orderId) {
    if (!this.states.has(orderId)) {
      this.states.set(orderId, {
        state: "CREATED",
        history: ["CREATED"]
      });
    }
    return this.states.get(orderId);
  }

  get(orderId) {
    return this.states.get(orderId);
  }

  transition(orderId, nextState, metadata = {}) {
    const current = this.create(orderId);

    const allowed = VALID_TRANSITIONS[current.state];

    if (!allowed.includes(nextState)) {
      return {
        error: "INVALID_TRANSITION",
        from: current.state,
        to: nextState
      };
    }

    current.state = nextState;
    current.history.push(nextState);

    if (!current.meta) current.meta = [];
    current.meta.push({
      state: nextState,
      timestamp: Date.now(),
      metadata
    });

    this.states.set(orderId, current);

    return current;
  }
}
