export class Sophia {
  constructor() {
    this.name = "SOPHIA";
  }

  generateSignal(data) {
    return {
      signal: "HOLD",
      confidence: 0.5,
      source: "sophia"
    };
  }
}
