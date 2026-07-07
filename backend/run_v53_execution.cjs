/**
 * SAINT V53 — EXECUTION TEST RUNTIME
 */

const Aegis = require("./core/execution/aegisRiskV53.cjs");
const Broker = require("./core/execution/binanceBrokerV53.cjs");
const Engine = require("./core/execution/executionEngineV53.cjs");

const risk = new Aegis();
const broker = new Broker();

const engine = new Engine({
  riskEngine: risk,
  broker
});

// SWITCH MODE HERE
engine.setMode("PAPER");

console.log("[SAINT V53] EXECUTION ENGINE STARTED");

setInterval(async () => {

  const signal = {
    symbol: "ETH-USD",
    side: Math.random() > 0.5 ? "BUY" : "SELL",
    size: 0.1 + Math.random() * 0.2
  };

  const result = await engine.execute(signal);

  console.log("\n====================");
  console.log("SIGNAL:", signal);
  console.log("RESULT:", result.status);
  console.log("====================\n");

}, 3000);
