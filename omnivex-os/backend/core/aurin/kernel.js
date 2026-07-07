import { buildDecision } from "./decisionEngine.js";
import { executionGate } from "../gate/executionGate.js";

export function routeAURIN(signal = {}, context = {}, saint) {
  const decision = buildDecision(signal, context);

  const gated = executionGate(decision, {
    aegis: context.aegis,
    policy: context.policy
  });

  if (!gated.allowed) {
    return {
      status: "BLOCKED",
      reason: gated.reason,
      event: gated.event
    };
  }

  const executionPayload = {
    ...gated.event,
    source: "AURIN_KERNEL"
  };

  if (typeof saint !== "function") {
    return {
      status: "NO_SAINT_ROUTER",
      event: executionPayload
    };
  }

  return saint(executionPayload);
}
