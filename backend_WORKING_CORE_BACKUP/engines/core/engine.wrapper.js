export class Engine {
  constructor(name, fn) {
    this.name = name;
    this.fn = fn;
  }

  run(input) {
    try {
      const result = this.fn(input);

      return {
        type: this.name.toUpperCase(),
        data: result,
        meta: {
          timestamp: Date.now()
        }
      };
    } catch (err) {
      return {
        type: "ENGINE_ERROR",
        data: null,
        meta: {
          engine: this.name,
          error: err.message
        }
      };
    }
  }
}
