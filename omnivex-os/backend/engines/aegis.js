export function riskFilter(signal) {
  const approved = signal.confidence > 0.3;

  return {
    approved,
    reason: approved ? "PASS" : "LOW_CONFIDENCE"
  };
}
