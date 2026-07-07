import monteCarlo from "../chronicle/monteCarlo.js";
import learningLoop from "../chronicle/learningLoop.js";

/**
 * SAINT CORE KERNEL v1
 * Deterministic + learning-enabled loop
 */

export async function bootSystem(registry = {}) {
  registry.status = "ONLINE";
  registry.mode = "SAINT_LEARNING_V1";
  registry.weights = learningLoop.weights;

  console.log("[SAINT] Boot complete");
  return registry;
}

export async function runtimeTick(market = {}) {
  const prediction = monteCarlo?.generate
    ? monteCarlo.generate({ market }).action || "HOLD"
    : "HOLD";

  // simulate outcome (replace later with real market feed)
  const outcome =
    Math.random() > 0.5 ? prediction : "HOLD";

  // feed learning system
  learningLoop.record({
    prediction,
    outcome,
    price: market.price,
    symbol: market.symbol
  });

  learningLoop.learn();

  const action = learningLoop.selectAction();

  const output = {
    symbol: market.symbol,
    price: market.price,
    prediction,
    outcome,
    selectedAction: action,
    weights: learningLoop.weights
  };

  console.log("[SAINT LOOP]", output);

  return output;
}

export function lockKernel() {
  return true;
}

export function unlockKernel() {
  return true;
}

export function getKernelState() {
  return {
    status: "RUNNING",
    weights: learningLoop.weights
  };
}

export default {
  bootSystem,
  runtimeTick,
  lockKernel,
  unlockKernel,
  getKernelState
};
