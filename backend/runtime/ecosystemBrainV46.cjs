const EcosystemOrchestratorV46 =
  require("../core/governor/ecosystemOrchestratorV46.cjs");

/**
 * SAINT V46 — ECOSYSTEM BRAIN WRAPPER
 */

class EcosystemBrainV46 {

  constructor(deps) {
    this.engine = new EcosystemOrchestratorV46(deps);
  }

  run(order, context) {
    return this.engine.run(order, context);
  }
}

module.exports = EcosystemBrainV46;
