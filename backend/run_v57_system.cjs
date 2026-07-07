const MercuryBus = require("./core/feeds/bus/mercuryBusV52.cjs");

const OrderflowEngine = require("./core/market/orderflow/orderflowEngineV57.cjs");
const Sophia = require("./core/signal/sophiaSignalEngineV55.cjs");

const CircuitBreaker = require("./core/risk/circuitBreakerV55_1.cjs");
const UnifiedRiskGovernor = require("./core/risk/unifiedRiskGovernorV56.cjs");

const BinanceSignedBroker = require("./core/execution/binanceSignedBrokerV53_1.cjs");
const PositionEngine = require("./core/execution/positionEngineV53_2.cjs");

const Aegis = require("./core/risk/aegis.cjs");
const Gate = require("./core/risk/gate.cjs");
const Firewall = require("./core/risk/firewall.js");
const KillSwitch = require("./core/risk/killswitch");
const MultiAssetExposure = require("./core/risk/multiAssetExposure.cjs");

const SaintCore = require("./core/system/saintCoreLoopV54.cjs");

// =====================================================
// MARKET
// =====================================================
const mercury = new MercuryBus();

// =====================================================
// ORDERFLOW (NEW BRAIN LAYER)
// =====================================================
const orderflowEngine = new OrderflowEngine(mercury);

// =====================================================
// SIGNAL
// =====================================================
const signalEngine = new Sophia(mercury);

// =====================================================
// RISK GOVERNOR
// =====================================================
const riskGovernor = new UnifiedRiskGovernor({
  circuitBreaker: new CircuitBreaker(),
  aegis: new Aegis(),
  gate: new Gate(),
  firewall: new Firewall(),
  killswitch: new KillSwitch(),
  multiAssetExposure: new MultiAssetExposure()
});

// =====================================================
// EXECUTION
// =====================================================
const executionEngine = new BinanceSignedBroker();
const positionEngine = new PositionEngine();

// =====================================================
// CORE LOOP
// =====================================================
const core = new SaintCore({
  mercury,
  orderflowEngine,
  signalEngine,
  riskGovernor,
  executionEngine,
  positionEngine,
  circuitBreaker: new CircuitBreaker()
});

console.log("[SAINT V57] ORDERFLOW INTELLIGENCE ACTIVE");

setInterval(async () => {

  const result = await core.tick();

  console.log("\n====================");
  console.log("STATUS:", result.status);
  console.log("FLOW:", result.flow);
  console.log("SIGNAL:", result.signal);
  console.log("RISK:", result.risk);
  console.log("====================\n");

}, 3000);
