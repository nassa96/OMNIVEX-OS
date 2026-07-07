const AdaptiveController = require("../core/v27/controller/adaptiveController.cjs");

/**
 * Factory for V27 controller
 */
function createV27Controller({ memory, riskGate, executor }) {
  return new AdaptiveController({
    memory,
    riskGate,
    executor
  });
}

module.exports = createV27Controller;
