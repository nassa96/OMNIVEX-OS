const MercuryBus = require("./core/feeds/bus/mercuryBusV52.cjs");

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
// SIGNAL
// =====================================================
const signalEngine = new Sophia(mercury);

// =====================================================
// RISK STACK → UNIFIED
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
  signalEngine,
  riskGovernor,
  executionEngine,
  positionEngine,
  circuitBreaker: new CircuitBreaker()
});

console.log("[SAINT V56] UNIFIED RISK GOVERNOR ACTIVE");

setInterval(async () => {

  const result = await core.tick();

  console.log("\n====================");
  console.log("STATUS:", result.status);
  console.log("SIGNAL:", result.signal);
  console.log("RISK:", result.risk);
  console.log("SAFETY:", result.safety);
  console.log("POSITIONS:", result.positions);
  console.log("====================\n");

}, 3000);
