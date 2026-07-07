/**
 * SAINT V97 — MARKET STATE VALIDATOR
 */

class MarketStateValidatorV97 {

  validate(order, market) {

    const deviation = Math.abs(order.price - market.price);

    return {
      valid: deviation < 10,
      deviation
    };
  }
}

module.exports = MarketStateValidatorV97;
