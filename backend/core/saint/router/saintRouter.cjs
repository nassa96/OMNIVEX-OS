const mercuryBus = require("../../market/bus/mercuryBus.cjs");
const sophia = require("../../sophia/engines/sophiaSignalEngine.cjs");
const aegis = require("../../aegis/aegisRiskEngine.cjs");
const chronicle = require("../../chronicle/chronicle.cjs");

class SaintRouter {
  constructor() {
    this.ws = null;
    this.onExecution = null;
    this.running = false;
  }

  attachWebsocket(ws) {
    this.ws = ws;
  }

  attachExecutionHandler(fn) {
    this.onExecution = fn;
  }

  start() {
    if (this.running) {
      console.log("[SAINT ROUTER] ALREADY ACTIVE");
      return;
    }

    this.running = true;

    console.log("[SAINT ROUTER] ACTIVE");

    mercuryBus.subscribe((event) => {
      if (!event) return;

      // =========================
      // SOPHIA SIGNAL GENERATION
      // =========================
      const signal = sophia.generate({
        symbol: event.symbol,
        price: event.price,
        volume: event.volume,
        change: event.change
      });

      if (!signal || signal.side === "HOLD") {
        return;
      }

      chronicle.write({
        type: "SIGNAL",
        symbol: signal.symbol,
        payload: signal,
        source: "sophia"
      });


      // =========================
      // AEGIS RISK GATE
      // =========================
      const risk = aegis.evaluate(signal, event);

      chronicle.write({
        type: "RISK",
        symbol: signal.symbol,
        payload: risk,
        source: "aegis"
      });


      if (!risk.approved) {

        console.log(
          "[SAINT BLOCKED]",
          signal.symbol,
          risk.reason
        );

        chronicle.write({
          type: "REJECT",
          symbol: signal.symbol,
          payload: {
            signal,
            risk
          },
          source: "saint"
        });

        return;
      }


      // =========================
      // EXECUTION PACKET
      // =========================
      const order = {
        symbol: signal.symbol,
        side: signal.side,
        size: risk.maxPositionSize,
        price: event.price,
        source: event.source || "unknown",
        confidence: signal.confidence || 0
      };


      const executionPacket = {
        approved: true,
        order
      };


      chronicle.write({
        type: "EXECUTION",
        symbol: order.symbol,
        payload: executionPacket,
        source: "saint"
      });


      // =========================
      // STREAM OUTPUT
      // =========================
      this.emit(order);


      // =========================
      // EXECUTION HANDOFF
      // =========================
      if (this.onExecution) {
        this.onExecution(
          executionPacket,
          event
        );
      }

    });
  }


  emit(order) {

    if (!order) return;

    console.log(
      "[SAINT EXEC]",
      order.symbol,
      order.side
    );


    if (
      this.ws &&
      typeof this.ws.broadcast === "function"
    ) {

      this.ws.broadcast({
        type: "EXECUTION",
        data: order,
        timestamp: Date.now()
      });

    }

  }

}


module.exports = new SaintRouter();
