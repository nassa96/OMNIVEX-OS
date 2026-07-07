import { aegis } from "../engines/aegis.js";
import { runSaint } from "../engines/saint.js";
import { appendEvent } from "./ledger/chronicle.ledger.js";

export class ExecutionRouter {
  constructor(stateMachine) {
    this.stateMachine = stateMachine;
  }

  async execute(order, context = {}) {
    const state = this.stateMachine.create(order.id);

    /* =========================
       DUPLICATE EXECUTION GUARD
    ========================= */
    if (state.state === "EXECUTED") {
      return {
        status: "BLOCKED_DUPLICATE",
        orderId: order.id
      };
    }

    /* =========================
       RISK CHECK
    ========================= */
    const risk = runAegis({
      symbol: order.symbol,
      price: order.price,
      prev: order.price
    });

    if (risk.kill || risk.risk === "HIGH") {
      this.stateMachine.transition(order.id, "REJECTED", { risk });

      appendEvent({
        type: "ORDER_REJECTED",
        orderId: order.id,
        symbol: order.symbol,
        risk
      });

      return {
        status: "REJECTED",
        risk
      };
    }

    this.stateMachine.transition(order.id, "RISK_APPROVED");

    this.stateMachine.transition(order.id, "SUBMITTED");

    /* =========================
       EXECUTION (PAPER)
    ========================= */
    const risk = aegis.run({
  symbol: order.symbol,
  price: order.price,
  prev: order.price
    });
    this.stateMachine.transition(order.id, "EXECUTED", {
      execution
    });

    appendEvent({
      type: "ORDER_EXECUTED",
      orderId: order.id,
      symbol: order.symbol,
      price: order.price,
      risk,
      execution,
      mode: "PAPER"
    });

    return {
      status: "EXECUTED",
      orderId: order.id,
      execution
    };
  }
}
