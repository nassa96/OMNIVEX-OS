/**
 * SAINT V98 — PREDICTIVE ROUTER
 */

class PredictiveRouterV98 {

  predict(exchange, order) {

    const latency = exchange === "BINANCE_US" ? 20 : 35;

    return {
      exchange,
      predictedLatency: latency,
      expectedSlippage: latency * 0.01,
      score: 1 / latency
    };
  }
}

module.exports = PredictiveRouterV98;
