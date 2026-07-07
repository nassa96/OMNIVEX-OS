const V24Adapter = require("../core/execution/v24/v24_adapter.cjs");

// init
this.executionIntelligence = new V24Adapter();

// inside loop AFTER microstructure:
const execIntel = this.executionIntelligence.evaluate({
  market,
  microstructure: micro,
  signal: analysis?.signal
});

// gate execution
if (!execIntel.allowExecution) {
  return console.log("[V24] BLOCKED EXECUTION", execIntel);
}
