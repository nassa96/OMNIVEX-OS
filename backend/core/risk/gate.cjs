class RiskGate {
  evaluate(signal, market) {
    if (market.price > 52000) return "BLOCK";
    if (signal.confidence < 0.3) return "BLOCK";
    return "ALLOW";
  }
}

module.exports = RiskGate;
