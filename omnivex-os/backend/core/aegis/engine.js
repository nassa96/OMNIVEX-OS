export function approveSignal(signal) {
  // ❌ NEVER execute HOLD
  if (signal === "HOLD") {
    return {
      approved: false,
      signal
    };
  }

  return {
    approved: Math.random() > 0.3,
    signal
  };
}
