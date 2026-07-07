function executeSignal(signal, market) {
  return {
    type: "saint.execution",
    action: signal.action,
    confidence: signal.confidence,
    symbol: signal.symbol,
    price: market.price,
    ts: Date.now()
  };
}

module.exports = { executeSignal };
