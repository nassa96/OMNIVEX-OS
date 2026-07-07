const Micro = require("../market/microstructure.cjs");

class SAINTV15Router {
  constructor() {
    this.history = [];
  }

  decide(signal, book) {
    const imbalance = Micro.imbalance(book.bids, book.asks);

    const slippage = Micro.slippageEstimate(
      book,
      1,
      signal === "BUY" ? "BUY" : "SELL"
    );

    const adverseRisk = Math.abs(imbalance) < 0.1;

    let action = "HOLD";

    if (signal === "BUY" && imbalance > 0.2 && !adverseRisk) {
      action = "BUY";
    }

    if (signal === "SELL" && imbalance < -0.2 && !adverseRisk) {
      action = "SELL";
    }

    const decision = {
      action,
      imbalance,
      slippage,
      adverseRisk,
      confidence: Math.min(1, Math.abs(imbalance))
    };

    this.history.push(decision);

    return decision;
  }
}

module.exports = SAINTV15Router;
