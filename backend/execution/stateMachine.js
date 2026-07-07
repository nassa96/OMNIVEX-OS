export const ORDER_STATES = {
  CREATED: "CREATED",
  VALIDATED: "VALIDATED",
  RISK_APPROVED: "RISK_APPROVED",
  REJECTED: "REJECTED",
  ROUTED: "ROUTED",
  EXECUTED: "EXECUTED",
  FAILED: "FAILED",
  CLOSED: "CLOSED"
};

export class ExecutionStateMachine {
  constructor() {
    this.orders = new Map();
  }

  createOrder({ symbol, signal, strategy, price }) {
    const id = `${symbol}-${Date.now()}`;

    const order = {
      id,
      symbol,
      signal,
      strategy,
      price,
      state: ORDER_STATES.CREATED,
      createdAt: Date.now()
    };

    this.orders.set(id, order);
    return order;
  }

  transition(id, nextState, meta = {}) {
    const order = this.orders.get(id);
    if (!order) return null;

    order.state = nextState;
    order.meta = meta;
    order.updatedAt = Date.now();

    return order;
  }

  getOrder(id) {
    return this.orders.get(id);
  }

  all() {
    return Array.from(this.orders.values());
  }
}
