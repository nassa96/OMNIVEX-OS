const MicrostructureAdapter = require("../core/microstructure/v23_microstructure_adapter.cjs");

// inside constructor:
this.micro = new MicrostructureAdapter();

// inside feed handler:
const micro = this.micro.onOrderbook(market);

const analysis = this.sophia.analyze({
  ...market,
  microstructure: micro
});

const riskDecision = this.risk.evaluate(analysis, market);
const execution = this.exec.execute(riskDecision, market);
