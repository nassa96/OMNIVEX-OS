const MercuryBus = require("../market/bus/mercuryBusV52.cjs");

const BinanceSignedBroker = require("../execution/binanceSignedBrokerV53_1.cjs");
const PositionEngine = require("../execution/positionEngineV53_2.cjs");

const Aegis = require("../execution/aegisRiskV53.cjs");

const SaintCore = require("../system/saintCoreLoopV54.cjs");

// MOCK SIGNAL ENGINE (SOPHIA)
const signalEngine = {
  generate: (market) => ({
    symbol: "ETH-USD",
    side: Math.random() > 0.5 ? "BUY" : "SELL",
    size: 0.05 + Math.random() * 0.1
  })
};

// INIT SYSTEM
const mercury = new MercuryBus();
const executionEngine = new BinanceSignedBroker();
const positionEngine = new PositionEngine();
const riskEngine = new Aegis();

const core = new SaintCore({
  mercury,
  signalEngine,
  riskEngine,
  executionEngine,
  positionEngine
});

console.log("[SAINT V54] FULL CLOSED LOOP ACTIVE");

setInterval(async () => {

  const result = await core.tick();

  console.log("\n====================");
  console.log("MARKET:", result.market);
  console.log("SIGNAL:", result.signal);
  console.log("EXEC:", result.execution.status);
  console.log("POSITIONS:", result.positions);
  console.log("====================\n");

}, 3000);
