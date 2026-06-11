export function runAegis(signal) {
  return {
    allow: signal.confidence > 0.7,
    level: "MEDIUM"
  };
}
