/**
 * SAINT V70 — EXCHANGE ROUTER
 * Chooses venue based on liquidity + region + risk
 */

class ExchangeRouterV70 {

  route(signal) {

    const risk = signal.risk || 0;
    const liquidity = signal.liquidity || 0;

    if (risk > 0.7) return "coinbase";
    if (liquidity > 0.6) return "binanceUS";

    return "binanceUS";
  }
}

module.exports = ExchangeRouterV70;
