const StabilityEngine = require("./core/runtime/stability/stabilityEngineV66.cjs");
const RecoveryEngine = require("./core/runtime/recovery/recoveryEngineV66.cjs");

const ChronicleBus = require("./core/chronicle/eventBus/chronicleEventBusV64.cjs");

const bus = new ChronicleBus();

const stability = new StabilityEngine();
const recovery = new RecoveryEngine(stability);

console.log("[SAINT V66] STABILITY SYSTEM ONLINE");

setInterval(() => {

  // simulate heartbeat
  if (Math.random() > 0.2) {
    stability.heartbeat();
  }

  const status = stability.check();
  const recoveryResult = recovery.recover();

  bus.emit({
    status,
    recovery: recoveryResult
  });

  console.log("\n====================");
  console.log("STATUS:", status);
  console.log("RECOVERY:", recoveryResult);
  console.log("====================\n");

}, 3000);
