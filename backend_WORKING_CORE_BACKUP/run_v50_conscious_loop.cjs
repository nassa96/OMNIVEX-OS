const ContextGovernor = require("./core/governor/context/contextGovernorV50.cjs");
const DriftDetector = require("./core/governor/drift/governorDriftV50_1.cjs");
const Learning = require("./core/governor/learning/governorLearningV49.cjs");
const ConsciousLoop = require("./core/system/saintConsciousLoopV50_2.cjs");

// MOCK GOVERNORS
const governors = {
  CONSERVATIVE: { decide: s => s.volatility > 0.6 ? "HOLD" : "SELECTIVE_EXECUTION" },
  AGGRESSIVE: { decide: s => s.trendStrength > 0.6 ? "FULL_EXECUTION" : "REDUCE_EXPOSURE" },
  ADAPTIVE: { decide: s => s.adversarialScore > 6 ? "HOLD" : "SELECTIVE_EXECUTION" },
  CONTRARIAN: { decide: s => s.adversarialScore > 7 ? "FULL_EXECUTION" : "HOLD" },
  RISK_OFF: { decide: s => s.volatility > 0.5 ? "HOLD" : "REDUCE_EXPOSURE" }
};

const system = new ConsciousLoop({
  contextGovernor: new ContextGovernor(governors),
  driftDetector: new DriftDetector(),
  learningSystem: new Learning(governors)
});

console.log("[SAINT V50] Conscious Loop Starting...");

setInterval(() => {

  const state = {
    volatility: Math.random(),
    trendStrength: Math.random(),
    adversarialScore: Math.random() * 10
  };

  const result = system.run(state, {});

  console.log("\n====================");
  console.log("CONTEXT:", result.context);
  console.log("DECISION:", result.decision.finalAction);
  console.log("SCORE:", result.decision.score);
  console.log("EXECUTION:", result.execution);
  console.log("====================\n");

}, 2000);
