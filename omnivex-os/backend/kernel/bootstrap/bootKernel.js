/**
 * OMNIVEX BOOTSTRAP KERNEL
 * SYSTEM INITIALIZATION CONTROLLER
 *
 * PURPOSE:
 * Ensures deterministic startup of all system layers
 * Prevents duplicate execution loops and module chaos
 */

const eventBus = require("../eventBus");
const aurin = require("../aurin/aurinCore");

// Core engines (order matters)
const { init: initMercury } = require("../mercuryFeed");
const sophia = require("../../agents/sophia/sophiaEngine");
const saint = require("../../agents/saint/saintEngine");
const chronicle = require("../../chronicle/core/chronicleEngine");

// Runtime state lock
let BOOTED = false;

class BootKernel {
  constructor() {
    this.state = {
      phase: "IDLE",
      healthy: false,
      startedAt: null
    };
  }

  async start() {
    if (BOOTED) {
      console.log("⚠️ Boot already completed — skipping duplicate startup");
      return;
    }

    BOOTED = true;
    this.state.phase = "BOOTING";
    this.state.startedAt = Date.now();

    console.log("🚀 OMNIVEX BOOT SEQUENCE INITIATED");

    await this.initializeEventBus();
    await this.loadCoreLayers();
    await this.connectAgents();
    await this.finalizeBoot();

    this.state.phase = "RUNNING";
    this.state.healthy = true;

    console.log("✅ OMNIVEX SYSTEM ONLINE → ALL LAYERS ACTIVE");
  }

  async initializeEventBus() {
    console.log("📡 Initializing Event Bus");

    if (!eventBus.publish || !eventBus.subscribe) {
      throw new Error("EventBus contract invalid — missing methods");
    }

    eventBus.publish("system.boot.phase", {
      phase: "event_bus_ready",
      ts: Date.now()
    });
  }

  async loadCoreLayers() {
    console.log("🧠 Loading Core Market Layers");

    initMercury();

    eventBus.publish("system.boot.phase", {
      phase: "core_layers_loaded",
      ts: Date.now()
    });
  }

  async connectAgents() {
    console.log("🤖 Connecting Agents");

    // SOPHIA SIGNAL LOOP
    eventBus.subscribe("market.tick", (tick) => {
      const signal = sophia.generateSignal(tick);
      eventBus.publish("sophia.signal", signal);
    });

    // SAINT EXECUTION LOOP
    eventBus.subscribe("sophia.signal", (signal) => {
      const execution = saint.executeSignal(signal);
      eventBus.publish("saint.execution", execution);
    });

    // CHRONICLE MEMORY LOOP
    eventBus.subscribe("saint.execution", (exec) => {
      chronicle.record({
        type: "saint.execution",
        ...exec,
        ts: Date.now()
      });
    });

    eventBus.publish("system.boot.phase", {
      phase: "agents_connected",
      ts: Date.now()
    });
  }

  async finalizeBoot() {
    console.log("🔒 Finalizing System Boot");

    aurin.init();

    eventBus.publish("system.boot.complete", {
      status: "ONLINE",
      ts: Date.now()
    });
  }

  getStatus() {
    return this.state;
  }
}

module.exports = new BootKernel();
