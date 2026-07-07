const ExecutionIntelligenceV24 = require("./v24_execution_intelligence.cjs");

class V24Adapter {
  constructor() {
    this.engine = new ExecutionIntelligenceV24();
  }

  evaluate({ market, microstructure, signal }) {
    return this.engine.evaluate({
      market,
      microstructure,
      signal
    });
  }
}

module.exports = V24Adapter;
