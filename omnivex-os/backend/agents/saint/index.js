import { createExecutionOrder } from "../../kernel/executionContract.js";

/**
 * SAINT — EXECUTION GATE
 * Converts capital signals → enforceable orders
 */

export function createSAINT({ bus, chronicle, ledger } = {}) {
  function evaluate(signal) {
    if (!signal || signal.type !== "MEME") return;

    const confidence = signal.strength || 0;

    if (confidence < 0.3) return;

    const order = createExecutionOrder({
      asset: signal.asset || "MEME_BASKET",
      side: confidence > 0.6 ? "BUY" : "HOLD",
      size: confidence,
      confidence,
      source: "SAINT"
    });

    chronicle?.append?.({
      type: "saint.execution.intent",
      data: order
    });

    bus?.emit?.("execution.order", order);

    console.log("[SAINT] EXECUTION ORDER CREATED", order);

    return order;
  }

  if (bus?.onAny) {
    bus.onAny((event) => {
      if (event?.type === "signal.meme") {
        evaluate(event);
      }
    });
  }

  return { evaluate };
}
