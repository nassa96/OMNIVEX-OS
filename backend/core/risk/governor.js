"use strict";

export function evaluate({ portfolio = { equity: 1000 }, decision }) {
  if (!decision || decision.action === "HOLD") {
    return { approved: false, reason: "NO_TRADE" };
  }

  return { approved: true, riskScore: 0.3 };
}

export default { evaluate };
