import { EventBus } from "../bus/eventBus.js";

export function startAegis() {
  EventBus.on("SOPHIA_SIGNAL", (signal) => {
    const approved = Math.random() > 0.3;

    EventBus.emit("AEGIS_RISK", {
      ...signal,
      approved
    });
  });
}
