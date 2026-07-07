const SurvivalRegimeV41 =
  require("../core/survival/regime/survivalRegimeV41.cjs");

/**
 * SAINT V41 — SURVIVAL BRAIN WRAPPER
 */

class SurvivalBrainV41 {

  constructor() {
    this.engine = new SurvivalRegimeV41();
  }

  update(context) {
    return this.engine.update(context);
  }

  canReEnter() {
    return this.engine.canReEnter();
  }

  state() {
    return this.engine.state();
  }
}

module.exports = SurvivalBrainV41;
