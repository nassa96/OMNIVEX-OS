const MicrostructureCognitionEngine =
  require("../core/market/cognition/microstructureCognitionEngine.cjs");

/**
 * SAINT V23+V24 — COGNITION WRAPPER
 */

class MicrostructureBrain {

  constructor() {
    this.engine = new MicrostructureCognitionEngine();
  }

  updateTrade(trade) {
    this.engine.ingestTrade(trade);
  }

  updateCandle(candle) {
    this.engine.ingestCandle(candle);
  }

  analyze(context) {
    return this.engine.classify(context);
  }
}

module.exports = MicrostructureBrain;
