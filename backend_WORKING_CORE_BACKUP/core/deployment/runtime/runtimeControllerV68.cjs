/**
 * SAINT V68 — RUNTIME CONTROLLER
 * Manages execution environments
 */

class RuntimeControllerV68 {

  constructor() {
    this.environments = {
      live: true,
      sandbox: true,
      replay: true
    };
  }

  route(mode) {

    if (mode === "SURVIVAL_LOCK") {
      return "sandbox";
    }

    if (mode === "AGGRESSIVE_EXPANSION") {
      return "live";
    }

    return "live";
  }
}

module.exports = RuntimeControllerV68;
