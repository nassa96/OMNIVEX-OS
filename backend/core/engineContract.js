/**
 * OMNIVEX ENGINE CONTRACT v1
 * Standard interface wrapper for all engines
 */

export class EngineContract {
  constructor(engine) {
    this.engine = engine;

    if (typeof engine.init !== "function") {
      engine.init = () => {};
    }

    if (typeof engine.tick !== "function") {
      throw new Error("Engine must implement tick()");
    }

    if (typeof engine.score !== "function") {
      engine.score = () => 0;
    }

    if (typeof engine.reset !== "function") {
      engine.reset = () => {};
    }
  }

  init(ctx) {
    return this.engine.init(ctx);
  }

  tick(input) {
    return this.engine.tick(input);
  }

  score(state) {
    return this.engine.score(state);
  }

  reset() {
    return this.engine.reset();
  }
}
