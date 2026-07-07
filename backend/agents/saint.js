import { EventBus } from "../bus/eventBus.js";

export function startSaint() {
  EventBus.on("AEGIS_RISK", (data) => {
    const execution = {
      ...data,
      executed: data.approved,
      timestamp: Date.now()
    };

    EventBus.emit("SAINT_EXECUTION", execution);
  });
}
