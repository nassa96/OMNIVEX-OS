const mercuryBus = require("../../market/bus/mercuryBus.cjs");
const sophiaEngine = require("../engines/sophiaSignalEngine.cjs");

class SophiaSubscriber {
  start() {
    console.log("[SOPHIA] attached to MERCURY bus");

    mercuryBus.subscribe((event) => {
      if (!event || !event.symbol) return;

      const signal = sophiaEngine.generate({
        symbol: event.symbol,
        price: event.price,
        volume: event.volume,
        high: event.high || event.price,
        low: event.low || event.price,
        bid: event.bid || event.price,
        ask: event.ask || event.price,
        priceChangePercent: event.change || 0
      });

      this.emit(signal);
    });
  }

  emit(signal) {
    if (signal.side !== "HOLD") {
      console.log("[SOPHIA SIGNAL]", signal);
    }
  }
}

module.exports = new SophiaSubscriber();
