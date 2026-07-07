import { EventBus } from "../bus/eventBus.js";

export class OmnivexKernel {
  constructor(state) {
    this.state = state;
  }

  start() {
    // MERCURY → SOPHIA
    EventBus.on("MERCURY_TICK", (tick) => {
      this.state.lastTick = tick;
      this.state.ticks++;

      EventBus.emit("SOPHIA_SIGNAL", tick);
    });

    // SOPHIA → AEGIS
    EventBus.on("SOPHIA_SIGNAL", (signal) => {
      this.state.lastSignal = signal;

      EventBus.emit("AEGIS_RISK", signal);
    });

    // AEGIS → SAINT
    EventBus.on("AEGIS_RISK", (risk) => {
      this.state.lastRisk = risk;

      EventBus.emit("SAINT_EXECUTION", risk);
    });

    // SAINT → BROADCAST
    EventBus.on("SAINT_EXECUTION", (execution) => {
      this.state.lastExecution = execution;

      EventBus.emit("BROADCAST", this.state);
    });
  }
}
