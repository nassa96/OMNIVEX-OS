const ElohimPrime = require("./core/elohim/prime/elohimPrimeV67.cjs");
const LiveEngine = require("./core/live/capital/liveCapitalEngineV69.cjs");
const SafetyGate = require("./core/live/safety/liveSafetyGateV69.cjs");

console.log("[SAINT V69] LIVE CAPITAL MODE INITIALIZING");

const gate = new SafetyGate(0.6);

const engine = new LiveEngine(
  {
    execute: async (signal) => {
      return { ok: true, executed: signal };
    }
  },
  gate
);

engine.enable();

const elohim = new ElohimPrime();

setInterval(async () => {

  const state = {
    risk: { score: Math.random() * 10 },
    flow: { strength: Math.random() },
    execution: { quality: Math.random() },
    regime: Math.random() > 0.8 ? "MANIPULATION" : "NORMAL",
    stability: { status: Math.random() > 0.1 ? "STABLE" : "DEGRADED" }
  };

  const decision = elohim.command(state);

  const signal = {
    symbol: "BTCUSDT",
    side: Math.random() > 0.5 ? "BUY" : "SELL",
    risk: state.risk.score / 10
  };

  const result = await engine.execute(signal);

  console.log("\n====================");
  console.log("SYSTEM MODE:", decision.systemMode);
  console.log("EXECUTION RESULT:", result);
  console.log("====================\n");

}, 3000);
