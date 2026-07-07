export class SystemSync {
  constructor(bus, wsBridge) {
    this.bus = bus;
    this.wsBridge = wsBridge;
    this.metrics = {
      events: 0,
      trades: 0,
      signals: 0,
      ticks: 0
    };

    this.bind();
  }

  bind() {
    this.bus.on("market.tick", () => {
      this.metrics.ticks++;
      this.metrics.events++;
    });

    this.bus.on("signal.generated", () => {
      this.metrics.signals++;
      this.metrics.events++;
    });

    this.bus.on("trade.executed", () => {
      this.metrics.trades++;
      this.metrics.events++;
    });
  }

  snapshot() {
    return {
      ...this.metrics,
      clients: this.wsBridge.clients(),
      ts: Date.now()
    };
  }
}
