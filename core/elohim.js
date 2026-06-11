export function runElohim(decision, risk) {
  return risk.allow && decision.signal !== "HOLD";
}
