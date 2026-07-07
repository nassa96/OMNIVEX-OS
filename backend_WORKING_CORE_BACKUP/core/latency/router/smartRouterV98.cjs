/**
 * SAINT V98 — SMART EXECUTION ROUTER
 */

class SmartRouterV98 {

  constructor(predictor) {
    this.predictor = predictor;
  }

  route(order, exchanges) {

    let best = null;

    for (const ex of exchanges) {

      const score = this.predictor.predict(ex.name, order);

      if (!best || score.score > best.score) {
        best = {
          exchange: ex.name,
          score
        };
      }
    }

    return best;
  }
}

module.exports = SmartRouterV98;
