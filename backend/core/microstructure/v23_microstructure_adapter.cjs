const MicrostructureEngine = require("./v23_microstructure_engine.cjs");

class MicrostructureAdapter {
  constructor() {
    this.engine = new MicrostructureEngine();
  }

  onOrderbook(book) {
    const result = this.engine.ingest(book);

    return {
      symbol: result.symbol,
      regime: result.lastSignal,
      imbalance: result.imbalance,
      sweep: result.sweepDetected,
      spoofRisk: result.spoofRisk,
      liquidityPressure: result.liquidityPressure
    };
  }
}

module.exports = MicrostructureAdapter;
